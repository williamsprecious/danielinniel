"use client";

import Link from "next/link";
import { Image } from "next-sanity/image";
import { motion } from "motion/react";

interface GalleryGridItemProps {
  url: string;
  type: "image" | "video";
  videoType?: "url" | "file";
  videoUrl?: string;
  fullVideoUrl?: string;
  description?: string;
  category?: "concept-and-design" | "cover-art";
}

const GalleryGridItem = ({
  url,
  type,
  videoType,
  videoUrl,
  fullVideoUrl,
  description,
}: GalleryGridItemProps) => {
  if (type === "video" && videoType === "file" && fullVideoUrl) {
    return (
      <motion.div
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          type: "spring",
          stiffness: 67,
          damping: 16,
          duration: 0.6,
        }}
      >
        <a
          href={fullVideoUrl}
          data-fancybox="gallery"
          data-aspect-ratio="16 / 9"
          data-type="html5video"
          className="rounded-xl overflow-hidden inline-block w-full h-full"
        >
          <video
            src={url}
            className="w-full h-full object-cover object-top"
            autoPlay
            loop
            muted
            playsInline
          />
        </a>
      </motion.div>
    );
  }

  if (type === "video" && videoType === "url" && videoUrl) {
    return (
      <motion.div
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          type: "spring",
          stiffness: 67,
          damping: 16,
          duration: 0.6,
        }}
      >
        <Link
          data-fancybox="gallery"
          data-aspect-ratio="16 / 9"
          href={videoUrl}
          className="rounded-xl overflow-hidden inline-block w-full h-full"
        >
          <Image
            src={url}
            width={500}
            height={500}
            className="w-full h-full object-cover object-top"
            alt={description || "Gallery video thumbnail"}
            loading="lazy"
          />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: "spring",
        stiffness: 67,
        damping: 16,
        duration: 0.6,
      }}
    >
      <Link
        data-fancybox="gallery"
        data-caption={description || ""}
        href={url}
        className="rounded-xl overflow-hidden inline-block w-full h-full"
      >
        <Image
          src={url}
          width={500}
          height={500}
          className="w-full h-full object-cover object-top"
          alt={description || "Gallery image"}
          loading="lazy"
        />
      </Link>
    </motion.div>
  );
};

export default GalleryGridItem;
