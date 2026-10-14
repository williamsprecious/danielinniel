"use client";

import ScrollToSectionButton from "@/components/ScrollToSectionButton";

const HomeIntroVideo = () => {
  return (
    // Reserve the frame before video metadata loads; the video cannot resize it.
    <section
      id="home-intro"
      className="relative isolate aspect-[4/3] min-h-80 w-full overflow-hidden bg-black lg:aspect-video"
    >
      <video
        className="absolute inset-0 block size-full object-cover"
        width={1920}
        height={1080}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://media.willysart.com/assets/xzark78p8rqajdfjebcl.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <ScrollToSectionButton targetId="works" />
    </section>
  );
};

export default HomeIntroVideo;
