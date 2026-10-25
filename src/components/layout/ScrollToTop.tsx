import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal ScrollToTop component:
 * Guarantees that navigating to any page immediately resets the scroll position
 * to the top of the viewport on a single click, eliminating the illusion
 * of unresponsive or double-click buttons when navigating from the footer or lower sections.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll both window and document element to top immediately
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search]);

  return null;
}
