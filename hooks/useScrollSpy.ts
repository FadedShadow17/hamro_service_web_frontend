'use client';

import { useEffect, useState, useRef } from 'react';

export function useScrollSpy(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserScrollingRef = useRef(false);

  useEffect(() => {
    // Function to find the section closest to the top of the viewport
    // This function ONLY reads scroll position, never modifies it
    const findActiveSection = () => {
      let currentSection = '';
      let minDistance = Infinity;
      const viewportTop = offset + 20; // Header offset + small buffer

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;

          // Section is visible in viewport
          if (sectionTop <= viewportTop && sectionBottom >= viewportTop - 200) {
            const distance = Math.abs(sectionTop - viewportTop);
            if (distance < minDistance) {
              minDistance = distance;
              currentSection = id;
            }
          }
        }
      });

      return currentSection;
    };

    // Completely passive scroll handler - ONLY reads, never writes
    const handleScroll = () => {
      // Don't update during active user scrolling to prevent interference
      if (isUserScrollingRef.current) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const newActiveSection = findActiveSection();
        if (newActiveSection) {
          setActiveSection((prev) => {
            // Only update if different to prevent unnecessary re-renders
            return newActiveSection !== prev ? newActiveSection : prev;
          });
        }
      }, 200); // Longer delay to prevent interference and improve performance
    };

    // Track user scrolling activity
    let scrollEndTimer: NodeJS.Timeout;
    const handleScrollStart = () => {
      isUserScrollingRef.current = true;
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        isUserScrollingRef.current = false;
        // Update active section after scrolling stops
        handleScroll();
      }, 200);
    };

    // Initial check
    const initialSection = findActiveSection();
    if (initialSection) {
      setActiveSection(initialSection);
    }

    // Listen to scroll events - completely passive, no preventDefault
    window.addEventListener('scroll', handleScrollStart, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollStart);
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
      }
    };
  }, [sectionIds, offset]);

  return activeSection;
}

