"use client";

import { type RefObject, useEffect, useState } from "react";

type RevealCallback = () => void;

const callbacks = new Map<Element, RevealCallback>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          sharedObserver?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
  }

  return sharedObserver;
}

/** Um único IntersectionObserver compartilhado por todos os reveals. */
export function useRevealOnce<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      let active = true;
      queueMicrotask(() => {
        if (active) setVisible(true);
      });
      return () => {
        active = false;
      };
    }

    callbacks.set(node, () => setVisible(true));
    getSharedObserver().observe(node);

    return () => {
      callbacks.delete(node);
      sharedObserver?.unobserve(node);
    };
  }, [ref]);

  return visible;
}
