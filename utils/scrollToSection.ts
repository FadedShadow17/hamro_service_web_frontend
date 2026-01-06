// Prevent multiple simultaneous scrolls
let isScrolling = false;

/**
 * Scrolls to a section on the page smoothly
 * @param sectionId - The ID of the section to scroll to (without #)
 * @param offset - Offset from top to account for fixed header (default: 80)
 */
export function scrollToSection(sectionId: string, offset: number = 80): void {
  // Prevent multiple simultaneous scrolls
  if (isScrolling) {
    return;
  }

  const element = document.getElementById(sectionId);
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = scrollTop + rect.top - offset;

    // Only scroll if we're not already at the target position
    if (Math.abs(window.pageYOffset - targetPosition) > 5) {
      isScrolling = true;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Reset flag after scroll completes (smooth scroll takes ~500ms)
      setTimeout(() => {
        isScrolling = false;
      }, 600);
    }
  }
}

/**
 * Handles navigation to a section, including cross-page navigation
 * @param href - The href (either route like "/services" or section like "#services")
 * @param router - Next.js router instance
 */
export function handleSectionNavigation(
  href: string,
  router: { push: (path: string) => void },
  pathname: string
): void {
  if (href.startsWith('#')) {
    const sectionId = href.substring(1);
    
    if (pathname === '/') {
      // Already on home page, just scroll
      setTimeout(() => scrollToSection(sectionId), 100);
    } else {
      // Navigate to home with hash
      router.push(`/#${sectionId}`);
      // Scroll after navigation completes (handled by useEffect in Header)
    }
  } else {
    // Regular route navigation
    router.push(href);
  }
}

