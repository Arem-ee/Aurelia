/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets';
  price: number;
  materials: string[];
  image: string;
  gemstone?: string;
  rating: number;
  reviewsCount: number;
  dimensions: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: 'Processing' | 'Shipped' | 'Delivered';
  date: string;
  paymentId: string;
  cardBrand: string;
  last4: string;
}

export interface UserProfile {
  name: string;
  email: string;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface RecommendationRequest {
  birthstone?: string;
  favoriteMetal?: string;
  styleVibe?: string;
  outfitVibe?: string;
}

export interface RecommendationResponse {
  recommendationText: string;
  suggestedProductIds: string[];
}
