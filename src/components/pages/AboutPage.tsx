"use client";

import { motion } from "motion/react";
import HeaderText from "@/components/HeaderText";

const AboutPage = () => {
  return (
    <section className="relative -z-20 min-h-screen pt-40 pb-36 bg-[url('/about.webp')] bg-cover bg-top bg-no-repeat md:bg-fixed md:pt-44 md:pb-40 2xl:pt-56 2xl:pb-48">
      <div className="-z-30 absolute inset-0 bg-gradient-to-b from-background/70 from-20% via-background/80 via-30% to-background to-85% md:from-background/75 md:via-40% md:via-background/80 2xl:to-90%" />

      <div className="z-10 flex flex-col gap-y-10 max-w-4xl mx-auto px-5 2xl:gap-y-12">
        <HeaderText
          title="Biography"
          textType="h1"
          className="text-center"
          delay={0.1}
        />

        <div className="text-base leading-7 text-foreground/85 text-center font-light space-y-8 sm:text-lg sm:leading-8 md:text-xl 2xl:leading-9 2xl:space-y-12 2xl:text-[22px]">
          <motion.p
            initial={{
              y: 40,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 18,
              duration: 0.8,
              delay: 0.3,
            }}
            viewport={{ amount: 0.3, once: true }}
          >
            Ekpo Daniel, Also known as DANIELINNIEL — A creative visual
            storyteller driven by the needs to express emotions through art. My
            works spans across digital illustration, concept art, music cover
            design, fashion illustration, motion graphics and branding all
            connected by a single focus: Story telling through visuals that feel
            alive.
          </motion.p>
          <motion.p
            initial={{
              y: 40,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 18,
              duration: 0.8,
              delay: 0.45,
            }}
            viewport={{ amount: 0.3, once: true }}
          >
            I create to make people see and feel differently - to turn
            imagination into something real and relatable. Every piece i design
            carries a message, an emotion, or a world of waiting to be explored.
          </motion.p>
          <motion.p
            initial={{
              y: 40,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 18,
              duration: 0.8,
              delay: 0.6,
            }}
            viewport={{ amount: 0.3, once: true }}
          >
            Through my characters, inn & iel, I explore deeper themes or
            identify, mythic, and human connection, expanding my art beyond
            visuals into story telling universes.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
