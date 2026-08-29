/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, MapPin, ClipboardList, CheckCircle2, ChevronRight, Package, Truck, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { Order, UserProfile } from '../types';

interface UserDashboardProps {
  orders: Order[];
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export default function UserDashboard({ orders, profile, onUpdateProfile }: UserDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    fullName: profile.shippingAddress.fullName,
    addressLine: profile.shippingAddress.addressLine,
    city: profile.shippingAddress.city,
    postalCode: profile.shippingAddress.postalCode,
    country: profile.shippingAddress.country
  });

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editForm.name,
      email: editForm.email,
      shippingAddress: {
        fullName: editForm.fullName,
        addressLine: editForm.addressLine,
        city: editForm.city,
        postalCode: editForm.postalCode,
        country: editForm.country
      }
    });
    setIsEditing(false);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 1;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Title */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-stone-400 font-medium block mb-2">
          Private Client Vault
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
          Client Account & Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 font-sans font-light">
          Manage your verified delivery coordinates and track bespoke cohort creation logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200 p-6 sm:p-8">
            <div className="flex items-center space-x-3.5 mb-6 pb-6 border-b border-stone-100">
              <div className="w-10 h-10 bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-normal text-stone-900">{profile.name}</h3>
                <p className="text-xs text-stone-400 font-sans">{profile.email}</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="space-y-5">
                <div className="space-y-1.5 text-xs font-sans">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium block">
                    Default Shipping Coordinates
                  </span>
                  <div className="p-4 bg-stone-50 border border-stone-100 text-stone-700 space-y-1 leading-relaxed">
                    <p className="font-medium text-stone-900">{profile.shippingAddress.fullName}</p>
                    <p className="font-light">{profile.shippingAddress.addressLine}</p>
                    <p className="font-light">{profile.shippingAddress.city}, {profile.shippingAddress.postalCode}</p>
                    <p className="font-light">{profile.shippingAddress.country}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2.5 border border-stone-200 hover:border-stone-400 text-xs font-sans uppercase tracking-[0.2em] text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Edit Coordinates
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs font-sans text-left">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 focus:border-stone-900 focus:outline-hidden text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 focus:border-stone-900 focus:outline-hidden text-stone-900"
                  />
                </div>
                <div className="pt-2 border-t border-stone-100">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 focus:border-stone-900 focus:outline-hidden text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.addressLine}
                    onChange={(e) => setEditForm({ ...editForm, addressLine: e.target.value })}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 focus:border-stone-900 focus:outline-hidden text-stone-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full bg-white border border-stone-200 px-3 py-1.5 focus:border-stone-900 focus:outline-hidden text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.postalCode}
                      onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                      className="w-full bg-white border border-stone-200 px-3 py-1.5 focus:border-stone-900 focus:outline-hidden text-stone-900"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-stone-900 hover:bg-black text-white text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-stone-200 p-6 sm:p-8">
            <h3 className="font-serif text-xl font-normal text-stone-900 mb-6 flex items-center space-x-2.5 pb-4 border-b border-stone-100">
              <ClipboardList className="w-4 h-4 text-stone-900" />
              <span>Acquisition & Order Archives</span>
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-12 h-12 bg-stone-50 border border-stone-200 flex items-center justify-center mb-3">
                  <ClipboardList className="w-5 h-5 text-stone-400" />
                </div>
                <h4 className="font-serif text-base font-normal text-stone-900 mb-1">No orders archived yet</h4>
                <p className="text-xs text-stone-500 max-w-xs font-sans font-light leading-relaxed">
                  Acquisitions completed through our atelier checkout will be logged here with real-time crafting steps.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const currentStep = getStatusStep(order.status);

                  return (
                    <div
                      key={order.id}
                      className="border border-stone-200 bg-white transition-colors"
                    >
                      {/* Order Summary Line */}
                      <div
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-stone-50/70 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2.5">
                            <span className="font-mono text-xs font-medium text-stone-900">
                              {order.id}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 bg-stone-100 text-stone-800 font-sans tracking-widest uppercase border border-stone-200">
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-stone-500 font-sans font-light">
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{order.items.reduce((acc, i) => acc + i.quantity, 0)} Specimens</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-left sm:text-right">
                            <span className="text-[9px] text-stone-400 font-sans uppercase tracking-widest block">Total</span>
                            <span className="font-sans text-sm font-medium text-stone-900">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="p-5 bg-stone-50/50 border-t border-stone-100 space-y-6">
                          
                          {/* Stepper Timeline Tracker */}
                          <div className="space-y-2 pb-6 border-b border-stone-200/80">
                            <span className="text-[9px] font-sans text-stone-400 uppercase tracking-[0.2em] block mb-4">
                              Crafting & Dispatch Status
                            </span>
                            
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans">
                              <div className={`p-3 border ${currentStep >= 1 ? 'bg-white border-stone-900 text-stone-900' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                                <span className="font-medium block uppercase tracking-wider">1. Forging & Hallmarking</span>
                              </div>
                              <div className={`p-3 border ${currentStep >= 2 ? 'bg-white border-stone-900 text-stone-900' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                                <span className="font-medium block uppercase tracking-wider">2. Insured Dispatch</span>
                              </div>
                              <div className={`p-3 border ${currentStep >= 3 ? 'bg-white border-stone-900 text-stone-900' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                                <span className="font-medium block uppercase tracking-wider">3. Delivered</span>
                              </div>
                            </div>
                          </div>

                          {/* Grid with Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                            {/* Left: Products summary */}
                            <div>
                              <span className="text-[9px] text-stone-400 uppercase tracking-[0.2em] block mb-2.5">
                                Included Artifacts
                              </span>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.product.id} className="flex space-x-3 items-center">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 object-cover bg-stone-100"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-stone-900 line-clamp-1">{item.product.name}</p>
                                      <p className="text-stone-400 text-[10px]">
                                        ${item.product.price} × {item.quantity}
                                      </p>
                                    </div>
                                    <span className="font-medium text-stone-900">
                                      ${(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Right: Payment and Delivery */}
                            <div className="space-y-4 text-stone-600 font-light">
                              <div>
                                <span className="text-[9px] text-stone-400 uppercase tracking-[0.2em] block mb-1">
                                  Delivery Address
                                </span>
                                <div className="space-y-0.5">
                                  <p className="font-medium text-stone-900">{order.shippingAddress.fullName}</p>
                                  <p>{order.shippingAddress.addressLine}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                              </div>

                              <div>
                                <span className="text-[9px] text-stone-400 uppercase tracking-[0.2em] block mb-1">
                                  Payment Settlement
                                </span>
                                <p className="text-stone-900 font-medium">
                                  {order.cardBrand} •••• {order.last4}
                                </p>
                                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                                  ID: {order.paymentId}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
