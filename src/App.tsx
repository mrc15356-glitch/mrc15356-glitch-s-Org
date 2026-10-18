/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider, useCart } from './context/CartContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloating } from './components/layout/WhatsAppFloating';
import { HeroSection } from './components/home/HeroSection';
import { CategoryShowcase } from './components/home/CategoryShowcase';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { SpecialOffers } from './components/home/SpecialOffers';
import { PaintCalculator } from './components/home/PaintCalculator';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { CustomerTestimonials } from './components/home/CustomerTestimonials';
import { LocationAndContact } from './components/home/LocationAndContact';
import { ProductList } from './components/shop/ProductList';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderConfirmation } from './components/orders/OrderConfirmation';
import { OrderTracking } from './components/orders/OrderTracking';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PolicyModal } from './components/legal/PolicyModal';

const AppContent: React.FC = () => {
  const { activePage, setActivePage, selectedProductForModal, setSelectedProductForModal, currentConfirmedOrder } = useShop();
  const { isCartOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackedOrderRef, setTrackedOrderRef] = useState<string>('');

  const handleOrderSuccess = () => {
    setActivePage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackSpecificOrder = (ref: string) => {
    setTrackedOrderRef(ref);
    setActivePage('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Main Global Header */}
      <Header />

      {/* Main Page View Switcher */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <HeroSection />
            <CategoryShowcase />
            <FeaturedProducts />
            <SpecialOffers />
            <PaintCalculator />
            <WhyChooseUs />
            <CustomerTestimonials />
            <LocationAndContact />
          </>
        )}

        {activePage === 'shop' && <ProductList />}

        {activePage === 'calculator' && (
          <div className="py-6">
            <PaintCalculator />
            <FeaturedProducts />
          </div>
        )}

        {activePage === 'track' && <OrderTracking initialRef={trackedOrderRef} />}

        {activePage === 'admin' && <AdminDashboard />}

        {activePage === 'confirmation' && (
          <OrderConfirmation
            order={currentConfirmedOrder}
            onGoHome={() => setActivePage('home')}
            onTrackOrder={handleTrackSpecificOrder}
          />
        )}
      </main>

      {/* Global Modals & Slide-overs */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      <PolicyModal />

      {/* Floating WhatsApp Action */}
      <WhatsAppFloating />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <ShopProvider>
          <AppContent />
        </ShopProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
