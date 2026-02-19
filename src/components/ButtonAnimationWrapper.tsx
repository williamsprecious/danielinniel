"use client";

import { motion } from "framer-motion";

const ButtonAnimationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ amount: 0.5 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{
        scale: 1.1,
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }}
      whileTap={{ scale: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

export default ButtonAnimationWrapper;
