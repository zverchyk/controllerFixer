"use client";

import { motion } from "motion/react";

export function ShopIntro() {
  return (
    <section className="flex flex-1 items-center justify-center px-5 py-24">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="eyebrow justify-center">Shop</span>
        <h1 className="font-display mt-5 text-6xl font-semibold tracking-[-0.06em] sm:text-8xl">
          Coming Soon
        </h1>
      </motion.div>
    </section>
  );
}
