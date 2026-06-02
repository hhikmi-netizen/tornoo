"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] max-w-lg mx-auto overflow-hidden"
            style={{ boxShadow: "0 -10px 40px rgba(20,24,33,.15)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-line" />
            </div>

            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-line">
                <h2 className="font-black text-lg text-ink">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center"
                  aria-label="Fermer"
                >
                  <X size={15} className="text-ink-2" />
                </button>
              </div>
            )}

            <div className="pb-safe-bottom">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
