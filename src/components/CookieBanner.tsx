import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_KEY = 'ep_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      // Slight delay so the page loads first
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999]"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="bg-veltrix-dark-2 border border-veltrix-dark-4 shadow-[0_8px_40px_rgba(0,0,0,.45)] p-6">
            {/* Gold accent bar */}
            <div className="h-[2px] w-12 bg-veltrix-gold-1 mb-4" />

            <p className="text-[10px] uppercase tracking-[.18em] text-veltrix-gold-4 font-semibold mb-2">
              Cookie Policy
            </p>

            <p className="text-sm text-veltrix-text-muted leading-relaxed">
              We use cookies to improve your experience, analyze site traffic, and personalize
              content. By accepting, you consent to our use of cookies in accordance with our{' '}
              <a
                href="#"
                className="text-veltrix-gold-1 underline underline-offset-2 hover:text-veltrix-gold-3"
              >
                Privacy Policy
              </a>
              .
            </p>

            <div className="flex gap-3 mt-5">
              <button
                id="cookie-accept-btn"
                onClick={accept}
                className="flex-1 bg-veltrix-gold-1 text-veltrix-dark-3 text-[10px] uppercase tracking-[.18em] font-bold py-3 hover:bg-veltrix-gold-3 transition-colors"
              >
                Accept
              </button>
              <button
                id="cookie-decline-btn"
                onClick={decline}
                className="flex-1 border border-veltrix-dark-4 text-veltrix-text-muted text-[10px] uppercase tracking-[.18em] font-bold py-3 hover:border-veltrix-gold-1 hover:text-veltrix-gold-1 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
