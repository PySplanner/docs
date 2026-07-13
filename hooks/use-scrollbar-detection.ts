"use client"

import { useState, useLayoutEffect, useRef } from 'react';

// Yes this is AI generated, but it works and my monkey brain couldn't figure it out.
export function useScrollbarDetection() {
  const containerRef = useRef(null);
  const [hasHorizontalScrollbar, setHasHorizontalScrollbar] = useState(false);
  const [scrollbarThickness, setScrollbarThickness] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Calculate the OS/Browser's actual scrollbar size dynamically
    const measureScrollbar = () => {
      const div = document.createElement('div');
      div.style.width = '100px';
      div.style.height = '100px';
      div.style.overflow = 'scroll';
      div.style.position = 'absolute';
      div.style.top = '-9999px';
      document.body.appendChild(div);
      // Width and height of standard scrollbars are the same
      const thickness = div.offsetWidth - div.clientWidth; 
      document.body.removeChild(div);
      return thickness;
    };

    setScrollbarThickness(measureScrollbar());

    // Check if the scrollbar is currently active
    const checkScroll = () => {
      // @ts-expect-error
      setHasHorizontalScrollbar(el.scrollWidth > el.clientWidth);
    };

    // Observe resizing of the container
    const resizeObserver = new ResizeObserver(() => checkScroll());
    resizeObserver.observe(el);

    // Observe if child elements change the layout constraints
    const mutationObserver = new MutationObserver(() => checkScroll());
    mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

    checkScroll();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return { containerRef, hasHorizontalScrollbar, scrollbarThickness };
}