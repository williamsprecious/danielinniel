"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import shop from "@public/shop.webp";
import { buttonVariants } from "@/components/ui/button";
import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";

const ShopPage = () => {
  return (
    <section className="row-container flex items-center justify-center pt-20 pb-36 md:pt-44 md:pb-40 2xl:pt-52 2xl:pb-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 max-w-lg w-full space-y-8 md:p-8 2xl:max-w-2xl 2xl:p-12 2xl:space-y-10"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="relative w-48 h-48 mx-auto border border-solid border-border/50 bg-background 2xl:w-52 2xl:h-52"
        >
          <Image
            src={shop}
            alt="Empty shopping cart"
            layout="fill"
            objectFit="contain"
            className="drop-shadow-lg"
          />

          <motion.div
            animate={{
              x: [0, -10, 10, 0],
              y: [0, -5, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
            }}
            className="absolute -top-4 -right-4 bg-primary rounded-full p-2"
          >
            <ShoppingCart size={24} className="text-white" />
          </motion.div>
        </motion.div>

        <div className="text-center space-y-4">
          <h2 className="text-[26px] md:text-3xl 2xl:text-4xl">Coming Soon</h2>
          <p className="text-foreground/90 2xl:text-lg">
            Exclusive prints, merchandise, and digital art drops are loading…
            Stay sharp — the release is coming soon.
          </p>
        </div>

        <div>
          <ButtonAnimationWrapper>
            <Link
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full hover:bg-[#181818]/30",
              })}
              href="/works"
            >
              View Works
            </Link>
          </ButtonAnimationWrapper>
        </div>
      </motion.div>
    </section>
  );
};

export default ShopPage;
