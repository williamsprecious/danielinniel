"use client";

import HeaderText from "@/components/HeaderText";
import Image from "next/image";
import { motion, Variants } from "motion/react";

const AboutPage = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Faster stagger
        delayChildren: 0.2, // Starts right after HeaderText
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: [0.25, 1, 0.5, 1],
        duration: 0.8,
      },
    },
  };

  return (
    <section className="min-h-screen pt-40 pb-36 md:pt-44 md:pb-40 2xl:pt-56 2xl:pb-48 overflow-hidden">
      <div className="row-container flex flex-col-reverse gap-10 md:flex-row 2xl:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            type: "tween",
            ease: [0.25, 1, 0.5, 1],
            duration: 0.8,
            delay: 0.1,
          }}
          viewport={{ once: true, amount: 0.3 }}
          className="md:w-[45%]"
        >
          <Image
            src="/about.webp"
            alt="About Daniel"
            width={500}
            height={600}
            className="rounded-sm w-full object-cover brightness-75"
          />
        </motion.div>

        <div className="md:flex-1 flex flex-col gap-y-6 2xl:gap-y-12">
          <HeaderText title="Biography" textType="h1" delay={0.1} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-base text-foreground/85 font-light space-y-8 md:text-lg 2xl:space-y-12 2xl:text-xl"
          >
            <motion.p variants={itemVariants}>
              Ekpo Daniel, Also known as DANIELINNIEL - A creative visual
              storyteller driven by the needs to express emotions through art.
              My works spans across digital illustration, concept art, music
              cover design, fashion illustration, motion graphics and branding
              all connected by a single focus: Story telling through visuals
              that feel alive.
            </motion.p>

            <motion.p variants={itemVariants}>
              I create to make people see and feel differently - to turn
              imagination into something real and relatable. Every piece i
              design carries a message, an emotion, or a world of waiting to be
              explored.
            </motion.p>

            <motion.p variants={itemVariants}>
              I create to make people see and feel differently - to turn
              imagination into something real and relatable. Every piece i
              design carries a message, an emotion, or a world of waiting to be
              explored.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
