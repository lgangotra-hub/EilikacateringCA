import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { CartItem, StoreSettings, ThemeConfig } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  theme: ThemeConfig;
  storeSettings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  theme,
  storeSettings,
}) => {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tpsGst = subtotal * 0.05; // 5% GST
  const tvqQst = subtotal * 0.09975; // 9.975% Quebec Sales Tax
  const deliveryCost = deliveryType === 'delivery' ? (subtotal >= 35 ? 0 : storeSettings.deliveryFee) : 0;
  const total = subtotal + tpsGst + tvqQst + deliveryCost;

  // Format WhatsApp Order Message
  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;

    let msg = `⚜️ *NOUVELLE COMMANDE / NEW ORDER - DÉPANNEUR EILIKA*\n`;
    msg += `------------------------------------\n`;
    msg += `📍 Type: *${deliveryType.toUpperCase()}*\n`;
    if (customerName) msg += `👤 Client: ${customerName}\n`;
    if (customerPhone) msg += `📞 Tel: ${customerPhone}\n`;
    if (deliveryType === 'delivery' && customerAddress) msg += `🏠 Adresse: ${customerAddress}\n`;
    if (orderNotes) msg += `📝 Note: ${orderNotes}\n`;
    msg += `------------------------------------\n`;
    msg += `🛒 *ARTICLES / ITEMS:*\n`;

    cartItems.forEach((item, index) => {
      msg += `${index + 1}. ${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}\n`;
    });

    msg += `------------------------------------\n`;
    msg += `Sous-total: $${subtotal.toFixed(2)}\n`;
    msg += `TPS (5%): $${tpsGst.toFixed(2)}\n`;
    msg += `TVQ (9.975%): $${tvqQst.toFixed(2)}\n`;
    if (deliveryType === 'delivery') {
      msg += `Livraison / Delivery: ${deliveryCost === 0 ? 'GRATUIT / FREE' : `$${deliveryCost.toFixed(2)}`}\n`;
    }
    msg += `*TOTAL ESTIMÉ: $${total.toFixed(2)} CAD*\n`;
    msg += `------------------------------------\n`;
    msg += `Merci de confirmer la commande et le temps de préparation!`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/[^+\d]/g, '')}?text=${encoded}`;
    window.open(waUrl, '_blank');

    // Trigger celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Direct In-App Fast Checkout
  const handleCheckoutDirect = () => {
    if (cartItems.length === 0) return;
    const orderNum = `EIL-${Math.floor(100000 + Math.random() * 900000)}`;
    setLastOrderId(orderNum);
    setOrderSuccess(true);

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const handleResetAfterSuccess = () => {
    onClearCart();
    setOrderSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className={`w-screen max-w-lg ${theme.cardBg} ${theme.glassBlur} shadow-2xl border-l border-white/20 flex flex-col justify-between overflow-y-auto`}>
          
          {/* Top Bar */}
          <div className="p-5 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-50 leading-tight">
                  Your Montreal Cart
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              id="btn-close-cart"
              onClick={onClose}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all text-stone-700 dark:text-stone-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-5">
            {orderSuccess ? (
              /* Success confirmation state */
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-50">
                  Order Received! • Commande Confirmée
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Order <strong>#{lastOrderId}</strong> has been transmitted to Dépanneur Eilika kitchen & counter.
                </p>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Pickup/Delivery Address:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {deliveryType === 'pickup' ? '1000 Sherbrooke St W Level C' : (customerAddress || 'Montreal Downtown')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Estimated Ready Time:</span>
                    <span className="font-bold text-amber-500">15 - 25 Minutes</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2">
                    <span className="text-stone-400">Total Paid:</span>
                    <span className="font-black text-sm text-stone-900 dark:text-stone-100 font-mono">${total.toFixed(2)} CAD</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Copy to WhatsApp Store Chat</span>
                  </button>

                  <button
                    onClick={handleResetAfterSuccess}
                    className="w-full py-2.5 px-4 rounded-xl bg-black/10 dark:bg-white/10 text-stone-800 dark:text-stone-200 font-semibold text-xs hover:bg-black/20"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 mx-auto flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
                  Your cart is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Browse our Montreal artisanal snacks, imported craft drinks, and fresh catering delicacies.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              /* Populated Cart Item List */
              <>
                {/* Delivery / Store Pickup Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/5 dark:bg-white/10 rounded-2xl border border-white/10">
                  <button
                    id="btn-cart-delivery"
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      deliveryType === 'delivery'
                        ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Montreal Delivery</span>
                  </button>

                  <button
                    id="btn-cart-pickup"
                    onClick={() => setDeliveryType('pickup')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      deliveryType === 'pickup'
                        ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Store Pickup (Free)</span>
                  </button>
                </div>

                {deliveryType === 'delivery' && subtotal < 35 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>Add ${(35 - subtotal).toFixed(2)} more for <strong>FREE Montreal delivery</strong>!</span>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3 divide-y divide-black/5 dark:divide-white/10">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-white/20 flex-shrink-0 bg-stone-100 dark:bg-stone-800"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-bold">
                          ${item.product.price.toFixed(2)} CAD
                        </p>
                        {item.product.unit && (
                          <span className="text-[10px] text-stone-400">{item.product.unit}</span>
                        )}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 rounded-xl p-1 border border-white/10">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs hover:bg-black/10 dark:hover:bg-white/20 transition-all text-stone-700 dark:text-stone-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs hover:bg-black/10 dark:hover:bg-white/20 transition-all text-stone-700 dark:text-stone-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 0)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Customer Checkout Details Form */}
                <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Contact & Delivery Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name / Nom"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/10 border border-white/15 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone / Téléphone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/10 border border-white/15 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  {deliveryType === 'delivery' && (
                    <input
                      type="text"
                      placeholder="Street Address, Apt/Suite, Montreal Postal Code"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/10 border border-white/15 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Special instructions, dietary notes, buzz code..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/10 border border-white/15 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                    <span>Quebec GST / TPS (5%)</span>
                    <span className="font-mono">${tpsGst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                    <span>Quebec QST / TVQ (9.975%)</span>
                    <span className="font-mono">${tvqQst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>Delivery</span>
                    <span className="font-mono">
                      {deliveryCost === 0 ? 'FREE' : `$${deliveryCost.toFixed(2)} CAD`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/10 font-bold text-sm text-stone-900 dark:text-stone-50">
                    <span>Total (Estimated)</span>
                    <span className="text-base text-amber-600 dark:text-amber-400 font-mono font-black">
                      ${total.toFixed(2)} CAD
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Actions */}
          {!orderSuccess && cartItems.length > 0 && (
            <div className="p-5 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/20 space-y-2.5">
              {/* WhatsApp Quick Order Button */}
              <button
                id="btn-cart-whatsapp-order"
                onClick={handleWhatsAppOrder}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Directly via WhatsApp Chat</span>
              </button>

              {/* Direct In-App Instant Order */}
              <button
                id="btn-cart-direct-checkout"
                onClick={handleCheckoutDirect}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>Instant Checkout (${total.toFixed(2)} CAD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
