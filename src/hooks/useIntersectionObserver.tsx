"use client";

import { useEffect, useRef, RefObject } from "react";

interface UseIntersectionObserverProps {
  callback: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useIntersectionObserver = ({
  callback,
  threshold = 0.1,
  rootMargin = "100px",
  enabled = true,
}: UseIntersectionObserverProps): RefObject<HTMLDivElement | null> => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, threshold, rootMargin, enabled]);

  return targetRef;
};
