import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-veltrix-light-1 min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="container-v text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* 404 display */}
          <p className="font-mono text-[clamp(6rem,20vw,12rem)] font-bold leading-none text-veltrix-dark-3/10 select-none">
            404
          </p>

          <div className="-mt-6 relative z-10">
            <p className="eyebrow gold-text mb-4">Page Not Found</p>
            <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-veltrix-dark-3 max-w-xl mx-auto">
              This route doesn't exist.
            </h1>
            <p className="mt-6 text-veltrix-text-dark max-w-sm mx-auto leading-7">
              The page you're looking for may have been moved or removed. Return home to continue
              exploring Essence Pharma.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Link to="/" id="not-found-home-btn" className="btn-primary">
              <Home size={14} />
              Back to Home
            </Link>
            <button
              id="not-found-back-btn"
              onClick={() => window.history.back()}
              className="btn-outline bg-transparent"
            >
              <ArrowLeft size={14} />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
