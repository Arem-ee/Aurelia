/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS } from './src/data';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory orders array to track orders created on the server side
  const serverOrders: any[] = [];

  // API Route: Get available handmade jewelry products
  app.get('/api/products', (req, res) => {
    res.json(INITIAL_PRODUCTS);
  });

  // API Route: Get current server orders
  app.get('/api/orders', (req, res) => {
    res.json(serverOrders);
  });

  // API Route: Process mock payment and generate order receipt
  app.post('/api/payment/checkout', (req, res) => {
    const { cartItems, shippingAddress, paymentDetails } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Your shopping bag is empty.' });
    }

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.addressLine ||
      !shippingAddress?.city ||
      !shippingAddress?.postalCode ||
      !shippingAddress?.country
    ) {
      return res.status(400).json({ error: 'Please complete all shipping address fields.' });
    }

    if (!paymentDetails?.cardNumber || !paymentDetails?.expiry || !paymentDetails?.cvc) {
      return res.status(400).json({ error: 'Please enter valid credit card details.' });
    }

    const cleanCard = paymentDetails.cardNumber.replace(/\s+/g, '');

    // Interactive Payment Decline Demonstrations
    if (cleanCard.endsWith('9999')) {
      return res.status(402).json({
        error: 'Payment processing failed: Insufficient Funds. (Simulation trigger: Cards ending in 9999 are declined).'
      });
    }

    if (cleanCard.endsWith('0000')) {
      return res.status(402).json({
        error: 'Payment processing failed: Suspected Fraud / Lost Card. (Simulation trigger: Cards ending in 0000 are blocked).'
      });
    }

    // Calculate invoice totals
    const totalAmount = cartItems.reduce((acc: number, item: any) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    // Parse card brands
    let cardBrand = 'Visa';
    if (cleanCard.startsWith('5')) {
      cardBrand = 'Mastercard';
    } else if (cleanCard.startsWith('3')) {
      cardBrand = 'American Express';
    }

    const last4 = cleanCard.slice(-4) || '4242';
    const orderId = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentId = `ch_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    const newOrder = {
      id: orderId,
      items: cartItems,
      totalAmount,
      shippingAddress,
      status: 'Processing',
      date: new Date().toISOString(),
      paymentId,
      cardBrand,
      last4
    };

    serverOrders.push(newOrder);

    res.status(200).json({
      success: true,
      message: 'Integrated payment processing completed successfully.',
      order: newOrder
    });
  });

  // API Route: Server-side Gemini AI Jewelry Style Advisor
  app.post('/api/gemini/advisor', async (req, res) => {
    const { birthstone, favoriteMetal, styleVibe, outfitVibe } = req.body;

    // Check if real Gemini key is configured; if not, return high-quality poetic fallbacks gracefully
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      const mockRecommendations = [
        {
          recommendationText: `Your style profile is a dazzling convergence of celestial light and organic structure. We sense your aura aligns flawlessly with the **Celestial Dawn Opal Ring** (p1); its fiery, sea-swept yellow gold setting speaks to your warmth. To harmonize this radiant solar energy, we pair it with the earthy **Terrene Hand-Woven Jasper Bracelet** (p7). The opal opens creative vistas, while picture jasper grounds your wild heart in natural canyon elegance.`,
          suggestedProductIds: ['p1', 'p7']
        },
        {
          recommendationText: `Your aesthetic holds a striking, cosmic clarity. Your affinity for clean metals and minimalist mystery calls for the **Aether Raw Herkimer Diamond Pendant** (p2). Suspended like frozen starlight, it captures the highest spectrum of illumination. We recommend pairing this luminous crystal with the powerful, hand-stamped **Artemis Obsidian Signet Ring** (p8), a protective black shielding band that provides an exquisite, high-contrast visual and energetic balance.`,
          suggestedProductIds: ['p2', 'p8']
        },
        {
          recommendationText: `You radiate a classic, slow-crafted artisan grace that resonates with the rhythms of the earth. Your ideal match is the **Lunar Eclipse Baroque Pearl Necklace** (p6), where a wild, irregularly grown pearl is guarded by a crescent silver moon. Pair this luminous necklace with the hand-stamped **Solstice Sunburst Hoop Earrings** (p3) to invite solar vitality. Together, they form an heirloom-worthy celebration of lunar and solar majesty.`,
          suggestedProductIds: ['p3', 'p6']
        }
      ];

      const selected = mockRecommendations[Math.floor(Math.random() * mockRecommendations.length)];
      return res.json(selected);
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `A user is looking for a personalized jewelry recommendation.
Profile details:
- Birthstone / Month: ${birthstone || 'Not specified'}
- Preferred Metal: ${favoriteMetal || 'Not specified'}
- Style Aesthetic: ${styleVibe || 'Not specified'}
- Active energy / Outfit description: ${outfitVibe || 'Not specified'}

Aurelia Handmade Jewelry Catalog is as follows:
${INITIAL_PRODUCTS.map(
  (p) =>
    `ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Price: $${p.price} | Materials: ${p.materials.join(', ')} | Gemstone: ${p.gemstone || 'None'} | Description: ${p.description}`
).join('\n\n')}

Analyze their preferences and recommend exactly 1 or 2 products from the catalog. Write a short, poetic, luxury recommendation (approx 150 words) about how these items complement their style energy, spiritual vibes, or physical aesthetic. Speak directly to the user as their personal designer. Also output the exact IDs of the recommended products in the suggestedProductIds array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are the chief astrologer and lead jewelry artisan of Aurelia Handmade Jewelry. You write gorgeous, high-end, poetic jewelry advisory reports. Speak with extreme prestige and quiet luxury, using words related to craftsmanship, cosmic alignment, natural minerals, and heirloom design. Do not use em dashes in your response; use commas, periods, or colons instead.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendationText: {
                type: Type.STRING,
                description:
                  'A poetic, elegant jewelry consultation outlining which jewelry items match their aura and why, written in first-person plural ("We recommend...").'
              },
              suggestedProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'An array of 1 or 2 recommended product IDs that exist in the catalog.'
              }
            },
            required: ['recommendationText', 'suggestedProductIds']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: 'Failed to generate recommendation' });
    }
  });

  // Serve static assets in production, use Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
