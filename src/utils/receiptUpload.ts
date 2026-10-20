/**
 * WhatsApp message formatting & redirection utilities for Gbotemi Holistic Pharmacy.
 * Handles universal wa.me navigation, popup-blocker mitigation, and order messaging.
 */

/**
 * Clean phone number to international WhatsApp format (e.g. 08029660153 -> 2348029660153)
 */
export function formatWhatsAppNumber(phone: string): string {
  let cleanNumber = (phone || '').replace(/[\s+-]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '234' + cleanNumber.substring(1);
  }
  return cleanNumber;
}

/**
 * Formats message text for WhatsApp transmission
 */
export function cleanWhatsAppMessage(text: string): string {
  return (text || '').trim();
}

/**
 * Generates direct wa.me link with URL-encoded message
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanNumber = formatWhatsAppNumber(phone);
  const cleanText = cleanWhatsAppMessage(message);
  const encodedText = encodeURIComponent(cleanText);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Open WhatsApp directly with the pre-filled message text.
 * Completely immune to popup blockers by supporting pre-opened windows, native anchor clicks,
 * and location redirection fallbacks.
 */
export function openWhatsAppDirect(phone: string, message: string, existingWindow?: Window | null): void {
  const whatsappUrl = getWhatsAppUrl(phone, message);

  // If a window reference was already created synchronously during user gesture, navigate it
  if (existingWindow && !existingWindow.closed) {
    try {
      existingWindow.location.href = whatsappUrl;
      return;
    } catch (e) {
      console.warn('Could not navigate existing window:', e);
    }
  }

  const isMobile = typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  // Always attempt anchor click first (safest and bypasses popup blocker in modern browsers)
  try {
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.warn('Anchor click error:', err);
  }

  // Fallback for strict popup blocker or mobile webview/browser
  if (isMobile) {
    setTimeout(() => {
      try {
        window.location.href = whatsappUrl;
      } catch {}
    }, 50);
  } else {
    try {
      const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = whatsappUrl;
          }
        } catch {}
      }
    } catch {
      try {
        window.location.href = whatsappUrl;
      } catch {}
    }
  }
}

// Deprecated legacy stubs for compatibility (receipt upload removed per requirements)
export function setActiveReceiptFile(_file: File | null): void {}
export function getActiveReceiptFile(): File | null { return null; }
export function downloadReceiptFile(_file: File): void {}
export async function uploadReceiptFile(_file: File): Promise<string> { return ''; }
export async function copyImageFileToClipboard(_file: File): Promise<boolean> { return false; }
export async function shareReceiptViaNative(_file: File, _message: string): Promise<boolean> { return false; }
export async function sharePaymentToWhatsApp({
  messageText,
  whatsappNumber,
}: {
  receiptFile?: File | null;
  messageText: string;
  whatsappNumber: string;
}) {
  openWhatsAppDirect(whatsappNumber, messageText);
  return { sharedViaNative: false, copiedToClipboard: false, downloaded: false };
}
