/**
 * Scrolls to a section on the page smoothly
 * @param sectionId - The ID of the section to scroll to (without #)
 * @param offset - Offset from top to account for fixed header (default: 80)
 */
export function scrollToSection(sectionId: string, offset: number = 80): void {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
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

