"use client";

import { SparklesCore } from "@/components/ui/sparkles";
import { useIsMobile } from "@/hooks/use-mobile";

const SparklesBackground = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 -z-10 h-screen w-full">
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.5}
        maxSize={1.2}
        speed={0.4}
        particleDensity={isMobile ? 4 : 2}
        className="h-full w-full"
        particleColor="rgba(255, 255, 255, 0.8)"
      />
    </div>
  );
};

export default SparklesBackground;
