/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, CheckCircle, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: (order: Order) => void;
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderComplete,
  onClearCart
}: CheckoutModalProps) {
  const [shipping, setShipping] = useState({
    fullName: 'Jane Austen',
    addressLine: '415 Cathedral Spires Road',
    city: 'Sedona',
    postalCode: '86336',
    country: 'United States'
  });

  const [payment, setPayment] = useState({
    cardholderName: 'Jane Austen',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '123'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4));
    }
    setPayment({ ...payment, cardNumber: parts.join(' ') });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setPayment({ ...payment, expiry: `${value.slice(0, 2)}/${value.slice(2)}` });
    } else {
      setPayment({ ...payment, expiry: value });
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPayment({ ...payment, cvc: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          shippingAddress: shipping,
          paymentDetails: payment
        })
      });

      const data = await response.json();

      setTimeout(() => {
        setIsProcessing(false);
        if (!response.ok) {
          setErrorMessage(data.error || 'Payment failed. Please verify credentials.');
        } else {
          setSuccessOrder(data.order);
          onOrderComplete(data.order);
          onClearCart();
        }
      }, 1200);
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage('Connection failed. Our payment gateways are currently undergoing maintenance.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative bg-white w-full max-w-3xl border border-stone-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-stone-900" />
                <h2 className="font-serif text-lg font-normal text-stone-900">
                  {successOrder ? 'Acquisition Receipt' : 'Secure Atelier Checkout'}
                </h2>
              </div>
              {!isProcessing && (
                <button
                  onClick={onClose}
                  className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-8 h-8 border border-stone-300 border-t-stone-900 rounded-full animate-spin mb-4" />
                  <h3 className="font-serif text-lg font-normal text-stone-900 mb-1">
                    Authorizing Atelier Settlement...
                  </h3>
                  <p className="text-xs text-stone-500 font-sans font-light max-w-xs leading-relaxed">
                    Reserving your selected handcrafted artifacts in our private registry.
                  </p>
                </div>
              )}

              {!isProcessing && successOrder && (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-12 h-12 bg-stone-100 border border-stone-200 flex items-center justify-center mb-4 text-stone-900">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] tracking-[0.25em] font-sans text-stone-400 uppercase mb-1 font-medium">
                    Order Confirmed
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-stone-900 mb-2">
                    Acquisition Recorded
                  </h3>
                  <p className="text-xs text-stone-600 font-sans font-light max-w-md leading-relaxed mb-6">
                    Registry specimen reference <strong className="font-mono font-medium text-stone-900">{successOrder.id}</strong> has been created. An artisan is preparing your presentation box.
                  </p>

                  {/* Digital Receipt Card */}
                  <div className="w-full max-w-md border border-stone-200 bg-white text-left p-6 space-y-4 text-xs font-sans">
                    <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 font-medium">Atelier Invoice</span>
                      <span className="text-stone-500 font-mono text-[10px]">
                        {new Date(successOrder.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2 pb-3 border-b border-stone-100">
                      {successOrder.items.map((item) => (
                        <div key={item.product.id} className="flex justify-between">
                          <span className="text-stone-700">
                            {item.product.name} <span className="text-stone-400">×{item.quantity}</span>
                          </span>
                          <span className="font-medium text-stone-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-serif text-base text-stone-900">Total Settled</span>
                      <span className="font-sans text-lg font-medium text-stone-900">
                        ${successOrder.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="mt-6 px-8 py-3 bg-stone-900 hover:bg-black text-white text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors"
                  >
                    View In Account Portal
                  </button>
                </div>
              )}

              {!isProcessing && !successOrder && (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
                  {/* Left Column: Form Details */}
                  <div className="md:col-span-7 space-y-6">
                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Shipping Address */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-400 font-medium pb-1 border-b border-stone-100">
                        Delivery Coordinates
                      </h4>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={shipping.fullName}
                          onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                          className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          required
                          value={shipping.addressLine}
                          onChange={(e) => setShipping({ ...shipping, addressLine: e.target.value })}
                          className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={shipping.city}
                            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                            className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            required
                            value={shipping.postalCode}
                            onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                            className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-400 font-medium pb-1 border-b border-stone-100">
                        Payment Card
                      </h4>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={payment.cardholderName}
                          onChange={(e) => setPayment({ ...payment, cardholderName: e.target.value })}
                          className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          value={payment.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            required
                            value={payment.expiry}
                            onChange={handleExpiryChange}
                            placeholder="12/28"
                            className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            required
                            value={payment.cvc}
                            onChange={handleCvcChange}
                            placeholder="123"
                            className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Order Summary */}
                  <div className="md:col-span-5 bg-stone-50 p-6 border border-stone-200 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-400 font-medium pb-2 border-b border-stone-200">
                        Summary
                      </h4>
                      <div className="space-y-2.5 max-h-48 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-xs font-sans">
                            <span className="text-stone-700 line-clamp-1 pr-2">
                              {item.product.name}
                            </span>
                            <span className="font-medium text-stone-900 flex-shrink-0">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs font-sans">
                        <div className="flex justify-between text-stone-500">
                          <span>Shipping</span>
                          <span className="uppercase text-stone-900 font-medium">Complimentary</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2">
                          <span className="font-serif text-base text-stone-900">Total</span>
                          <span className="font-sans text-xl font-medium text-stone-900">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-stone-200">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-sans text-xs uppercase tracking-[0.25em] font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize Acquisition</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
