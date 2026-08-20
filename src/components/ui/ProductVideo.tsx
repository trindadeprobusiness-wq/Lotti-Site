"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ProductVideoProps = {
  src: string;
  alt: string;
};

export function ProductVideo({ src, alt }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!showFeedback) return;

    const timeout = window.setTimeout(() => setShowFeedback(false), 700);
    return () => window.clearTimeout(timeout);
  }, [showFeedback]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    setShowFeedback(true);

    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        aria-label={alt}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover object-top"
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
      />
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPaused ? "Reproduzir demonstração" : "Pausar demonstração"}
        className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-inset"
      >
        <span
          data-video-control=""
          aria-hidden="true"
          className={[
            "absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/45 text-paper backdrop-blur-sm transition-all duration-200",
            showFeedback ? "scale-100 opacity-100" : "scale-90 opacity-0",
          ].join(" ")}
        >
          {isPaused ? <Play size={27} fill="currentColor" aria-hidden="true" /> : <Pause size={27} aria-hidden="true" />}
        </span>
      </button>
    </>
  );
}
