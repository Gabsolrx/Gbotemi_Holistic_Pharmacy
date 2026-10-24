import { useLocation, Link } from 'react-router-dom';
import { DELIVERY_OPTIONS } from '../data/deliveryOptions';

export default function InfoPage() {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Information';
  let content: React.ReactNode = 'Content is being updated. Please check back later.';

  if (path.includes('delivery')) {
    title = 'Delivery Information & Policies';
    const osunOptions = DELIVERY_OPTIONS.filter((opt) => opt.category === 'osun');
    const interstateOptions = DELIVERY_OPTIONS.filter((opt) => opt.category === 'interstate');

    content = (
      <div className="space-y-10 text-gray-700">
        {/* Top Summary Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-primary-800 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold mb-3">
              Fast & Safe Transit
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Delivery Information: Reliable Drug & Medication Distribution
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              At Gbotemi Holistic Pharmacy, we ensure your essential medications, health supplements, and medical supplies reach you safely across Osun State and nationwide.
            </p>
          </div>
        </div>

        {/* Delivery Payment Policy Notice */}
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">
              Delivery Payment Policy: Pay Driver or Rider Directly Upon Delivery
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 font-semibold">
              Important notice for all website orders
            </p>
          </div>

          <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
            <p>
              To maintain absolute transparency, zero hidden charges, and total peace of mind:
            </p>
            <ul className="space-y-2.5 pl-2 list-disc list-inside">
              <li>
                <span>
                  <strong>Medication Order Payment:</strong> You pay strictly the cost of your drugs/medications to our official pharmacy bank account (<strong>Moniepoint MFB - 4005436023, GBOTEMI HOLISTIC PHARMACY</strong>) during checkout.
                </span>
              </li>
              <li>
                <span>
                  <strong>Delivery Payment:</strong> Always <strong className="text-slate-950 font-bold bg-amber-200/70 px-1.5 py-0.5 rounded">pay driver or rider directly upon delivery</strong>. Delivery fees are never added to your online order or bank transfer.
                </span>
              </li>
              <li>
                <span>
                  <strong>In-Store Counter Pickup:</strong> You can also choose to pick up your drugs directly at our pharmacy store counter in Osun State with 100% free pickup (₦0).
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 1: Osun State Deliveries (Intra-State) - Matches Checkout Step 3 */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                1. Deliveries in Osun State (Intra-State)
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Available delivery methods at the point of checkout for customers in Osun State.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 w-fit">
              Intra-State
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {osunOptions.map((option) => (
              <div 
                key={option.id}
                className="bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-800 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100">
                      {option.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                    {option.name}
                  </h4>

                  <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Coverage:</span>
                      <span className="font-semibold text-slate-900 text-right">{option.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Timeframe:</span>
                      <span className="font-semibold text-emerald-800 text-right">{option.timeframe}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Interstate Deliveries (Nationwide) - Matches Checkout Step 3 */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                2. Interstate Delivery (Nationwide Transit)
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Available delivery methods at the point of checkout for destinations outside Osun State.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 w-fit">
              Nationwide
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interstateOptions.map((option) => (
              <div 
                key={option.id}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {option.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-lg sm:text-xl mb-2">
                    {option.name}
                  </h4>

                  <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Destination Coverage:</span>
                      <span className="font-semibold text-slate-900 text-right">{option.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Transit Duration:</span>
                      <span className="font-semibold text-emerald-800 text-right">{option.timeframe}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cold-Chain & Packaging Guarantee */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Pharmaceutical Safety & Cold-Chain Guarantee in Transit
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              How we protect your medications during delivery
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700 pt-1">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">
                Tamper-Evident Medical Security Bags
              </strong>
              All medication orders are packaged in discreet, opaque, tamper-evident security bags to safeguard privacy and ensure zero tampering.
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">
                Cold-Chain Temperature Preservation
              </strong>
              Temperature-sensitive medications (like insulin, vaccines, and eye drops) are packed in insulated cooling containers with ice packs.
            </div>
          </div>
        </div>

        {/* CTA to Checkout or WhatsApp */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <div>
            <h4 className="font-bold text-emerald-950 text-base">
              Need assistance selecting a delivery method for your medications?
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
              Our pharmacy team is available 24/7 on WhatsApp to assist you.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/shop">
              <button
                type="button"
                className="bg-primary-700 hover:bg-primary-800 text-white font-bold py-3 px-5 rounded-xl shadow-md text-xs sm:text-sm cursor-pointer transition-transform hover:scale-105"
              >
                Order Drugs Now
              </button>
            </Link>
            <a
              href="https://wa.me/2348029660153?text=Hello%20Gbotemi%20Holistic%20Pharmacy,%20I%20have%20an%20inquiry%20regarding%20drug%20delivery"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="button"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-5 rounded-xl shadow-md text-xs sm:text-sm cursor-pointer transition-transform hover:scale-105"
              >
                WhatsApp Help
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  } else if (path.includes('payment')) {
    title = 'Payment Information';
    content = (
      <div className="space-y-8 text-gray-700">
        <div className="bg-gradient-to-r from-emerald-900 via-primary-800 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Official Pharmacy Payment Information
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              All medication orders at Gbotemi Holistic Pharmacy are processed safely and transparently via Direct Bank Transfer to our official Moniepoint MFB account.
            </p>
          </div>
        </div>

        {/* Bank Account Details Card */}
        <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Official Pharmacy Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Bank Name</span>
              <span className="font-bold text-slate-900 text-base">Moniepoint MFB</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Account Number</span>
              <span className="font-mono text-xl font-extrabold text-slate-900">4005436023</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Account Name</span>
              <span className="font-bold text-slate-900 text-base">GBOTEMI HOLISTIC PHARMACY</span>
            </div>
          </div>
        </div>

        {/* How to Pay Instructions */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Payment Guidelines
          </h3>
          <ol className="list-decimal pl-5 space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li>
              <strong>Direct Bank Transfer:</strong> Transfer the exact cost of your drugs/medications to our Moniepoint MFB account using your bank mobile app, internet banking, or USSD.
            </li>
            <li>
              <strong>Transfer Narration:</strong> Please use your Full Name or Order Reference as your transaction remark/description.
            </li>
            <li>
              <strong>WhatsApp Instant Confirmation:</strong> Click "PAYMENT MADE (Open WhatsApp Confirmation)" at checkout or on your order confirmation page to confirm your payment directly with our pharmacist.
            </li>
            <li>
              <strong>Delivery Settlement:</strong> Delivery fees are never added to your online order or bank transfer. Always pay driver or rider directly upon delivery.
            </li>
          </ol>
        </div>
      </div>
    );
  } else if (path.includes('faq')) {
    title = 'Frequently Asked Questions';
    content = (
      <div className="space-y-4">
        {/* DELIVERY PAYMENT METHOD FAQ */}
        <details className="group border-2 border-emerald-600/30 rounded-xl bg-emerald-50/40 [&_summary::-webkit-details-marker]:hidden" open>
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl p-4 text-gray-900 font-bold">
            <h2 className="font-bold text-base sm:text-lg text-emerald-950">
              How do I pay for delivery?
            </h2>
          </summary>
          <div className="mt-2 px-4 pb-4 leading-relaxed text-gray-700 text-sm sm:text-base space-y-2 border-t border-emerald-200/60 pt-3">
            <p className="font-bold text-slate-900">
              Always pay driver or rider directly upon delivery.
            </p>
            <p>
              When placing an order on our website, your bank transfer total to Moniepoint MFB (<strong>4005436023, GBOTEMI HOLISTIC PHARMACY</strong>) covers only the cost of your drugs/medications.
            </p>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs sm:text-sm space-y-2">
              <p>• <strong>Doorstep / Rider Delivery:</strong> Pay driver or rider directly upon delivery when your medications arrive at your address.</p>
              <p>• <strong>Interstate Park Waybill:</strong> Pay driver or rider directly upon delivery/collection at your destination motor park.</p>
              <p>• <strong>Store Pickup:</strong> 100% Free counter pickup (₦0) at Gbotemi Holistic Pharmacy in Osun State.</p>
            </div>
          </div>
        </details>

        {/* OSUN STATE DELIVERY OPTIONS FAQ */}
        <details className="group border border-gray-200 rounded-xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-base sm:text-lg">What delivery options are available in Osun State?</h2>
          </summary>
          <div className="mt-3 px-4 pb-4 leading-relaxed text-gray-700 text-sm sm:text-base space-y-2.5">
            <p>We provide the three options shown at the point of checkout. Pay driver or rider directly upon delivery:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Intra-City Express Rider (Osogbo, Ede & Environs):</strong> Doorstep delivery in 1 – 4 hours. Pay driver or rider directly upon delivery.
              </li>
              <li>
                <strong>Inter-Town Osun State Dispatch (Ife, Ilesa, Ikirun, etc.):</strong> Covers all other Osun towns. Same-day or next-day arrival. Pay driver or rider directly upon delivery.
              </li>
              <li>
                <strong>In-Store Counter Pickup:</strong> Ready in 1 – 2 hours. Free pickup (₦0) at Gbotemi Holistic Pharmacy counter in Osun State.
              </li>
            </ol>
          </div>
        </details>

        {/* INTERSTATE DELIVERY OPTIONS FAQ */}
        <details className="group border border-gray-200 rounded-xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-base sm:text-lg">What delivery options are available for Interstate Delivery?</h2>
          </summary>
          <div className="mt-3 px-4 pb-4 leading-relaxed text-gray-700 text-sm sm:text-base space-y-2">
            <p>
              For interstate orders outside Osun State, we offer the two methods available at checkout. Pay driver or rider directly upon delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>
                <strong>Commercial Motor Park Waybill (Fast Transit 24 – 48 Hours):</strong> Express dispatch to major parks in Lagos, Ibadan (Oyo), Ogun, Ondo, Ekiti, Kwara, Abuja (FCT), Edo, Port Harcourt, and nationwide. Pay driver or rider directly upon delivery / collection.
              </li>
              <li>
                <strong>Interstate Doorstep Courier Service (3 – 5 Days):</strong> Direct to home or office address nationwide. Pay driver or rider directly upon delivery.
              </li>
            </ul>
          </div>
        </details>

        <details className="group border border-gray-200 rounded-xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-base sm:text-lg">What is Gbotemi Holistic Pharmacy?</h2>
          </summary>
          <p className="mt-3 px-4 pb-4 leading-relaxed text-gray-700 text-sm sm:text-base">
            Gbotemi Holistic Pharmacy is a licensed, trusted healthcare provider offering genuine medications, holistic wellness products, professional pharmacist consultations, and convenient online ordering across Nigeria.
          </p>
        </details>

        <details className="group border border-gray-200 rounded-xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-base sm:text-lg">What payment methods do you accept?</h2>
          </summary>
          <div className="mt-3 px-4 pb-4 leading-relaxed text-gray-700 text-sm sm:text-base space-y-2">
            <p>We accept Direct Bank Transfer for medications to our official Moniepoint MFB account:</p>
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-sm font-medium space-y-1">
              <p><strong>Bank Name:</strong> Moniepoint MFB</p>
              <p><strong>Account Number:</strong> 4005436023</p>
              <p><strong>Account Name:</strong> GBOTEMI HOLISTIC PHARMACY</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              After making your transfer, click "PAYMENT MADE (Open WhatsApp Confirmation)" at checkout to connect with our pharmacist on WhatsApp for instant order confirmation. For delivery, pay driver or rider directly upon delivery.
            </p>
          </div>
        </details>

        <details className="group border border-gray-200 rounded-xl bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-base sm:text-lg">How do I order prescription medications?</h2>
          </summary>
          <p className="mt-3 px-4 pb-4 leading-relaxed text-gray-700 text-sm sm:text-base">
            You can upload a photo of your prescription using our <Link to="/prescription" className="text-primary-700 underline font-semibold">Upload Prescription</Link> page. Our licensed pharmacists will verify the prescription and prepare your order for dispatch. Pay driver or rider directly upon delivery.
          </p>
        </details>
      </div>
    );
  } else if (path.includes('privacy')) {
    title = 'Privacy Policy';
    content = (
      <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
        <p>Last updated: October 2026</p>
        <p>At Gbotemi Holistic Pharmacy, we take your privacy and the confidentiality of your medical information very seriously. This Privacy Policy describes how your personal and health information is collected, used, and shared when you visit or make a purchase from us.</p>
        <h3 className="text-xl font-bold text-gray-900 mt-6">1. Information We Collect</h3>
        <p>When you place an order, we collect certain information including your name, delivery address, phone number, and prescription details. We do not store sensitive payment card details as transactions are executed via direct bank transfer to our Moniepoint MFB account.</p>
        <h3 className="text-xl font-bold text-gray-900 mt-6">2. Prescription & Health Data</h3>
        <p>All prescription records uploaded to our platform are accessible exclusively to our registered superintendent pharmacists for clinical validation and fulfillment in compliance with regulatory healthcare guidelines.</p>
        <h3 className="text-xl font-bold text-gray-900 mt-6">3. Delivery Logistics Data</h3>
        <p>Your address and phone number are shared solely with verified dispatch personnel to execute package arrival. Pay driver or rider directly upon delivery.</p>
      </div>
    );
  } else if (path.includes('terms')) {
    title = 'Terms of Service';
    content = (
      <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
        <p>Last updated: October 2026</p>
        <p>Welcome to Gbotemi Holistic Pharmacy. By accessing our website, purchasing products, or utilizing our health consultation services, you agree to be bound by these Terms of Service.</p>
        <h3 className="text-xl font-bold text-gray-900 mt-6">1. Medical Disclaimer</h3>
        <p>Content available on this platform is for informational and pharmaceutical fulfillment purposes. It does not replace clinical diagnosis by a medical practitioner.</p>
        <h3 className="text-xl font-bold text-gray-900 mt-6">2. Prescription Medications</h3>
        <p>Prescription-only medicines (POM) will only be dispensed upon validation of a genuine prescription issued by a licensed healthcare professional.</p>
        <h3 className="text-xl font-bold text-gray-900 mt-6">3. Payment Terms</h3>
        <p>All medication orders are paid via Direct Bank Transfer to our official Moniepoint MFB account (4005436023, GBOTEMI HOLISTIC PHARMACY) and verified via WhatsApp.</p>
        <h3 className="text-xl font-bold text-gray-900 mt-6">4. Delivery Terms</h3>
        <p>Always pay driver or rider directly upon delivery. Delivery fees are separate from the medication cost and are settled directly with the courier, rider, or transport driver upon receipt of your parcel.</p>
      </div>
    );
  } else if (path.includes('refund') || path.includes('return')) {
    title = 'Refund & Return Policy';
    content = (
      <div className="space-y-8 text-gray-700 font-sans">
        {/* Policy Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-primary-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold mb-3">
              Pharmaceutical Health & Safety Regulations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
              Gbotemi Holistic Pharmacy Refund & Return Policy
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm md:text-base leading-relaxed">
              Committed to genuine medications, cold-chain safety, and the highest standards of the Pharmacy Council of Nigeria (PCN).
            </p>
          </div>
        </div>

        {/* Primary Policy Declaration Card */}
        <div className="bg-red-50/80 border-2 border-red-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-100 px-3 py-1 rounded-full">
              Standard Pharmacy Rule
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            Strict Policy: We Do Not Accept Returns or Refunds for Products Purchased in Good Condition
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            In compliance with the <strong>Pharmacy Council of Nigeria (PCN)</strong>, <strong>NAFDAC Good Pharmacy Practice (GPP)</strong> guidelines, and international healthcare safety standards:
          </p>
          <div className="p-4 bg-white rounded-2xl border border-red-200 text-sm text-slate-800 leading-relaxed font-medium">
            Medicines, prescription pharmaceuticals, health supplements, infant nutrition formulas, injectables, and medical consumables purchased in good condition <strong>CANNOT be returned, exchanged, or refunded once they have left the custody of Gbotemi Holistic Pharmacy</strong>.
          </div>
        </div>

        {/* Clinical Rationale: Why This Protects You */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Why We Maintain a Strict No-Return Policy on Good Condition Items
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Unlike general commercial retail goods, pharmaceuticals directly impact human life. Our strict policy protects you and the entire community:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs sm:text-sm text-slate-700">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <strong className="block text-slate-900 font-bold mb-1.5 text-sm">
                  1. Cold-Chain & Storage Integrity
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Medications lose therapeutic potency if exposed to heat above 25°C, direct sunlight, or humidity. Once an item leaves our pharmacy, storage conditions cannot be independently verified.
                </p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <strong className="block text-slate-900 font-bold mb-1.5 text-sm">
                  2. Anti-Counterfeiting & Tampering
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  To eliminate the risk of counterfeit substitution, contamination, or product tampering, no returned product is ever re-stocked or re-dispensed to another patient.
                </p>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <strong className="block text-slate-900 font-bold mb-1.5 text-sm">
                  3. Legal & PCN Compliance
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Nigerian pharmaceutical regulations strictly prohibit registered pharmacies from accepting returned medications for restocking once patient possession has occurred.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Valid Exceptions Where Claims ARE Honored */}
        <div className="bg-white border-2 border-emerald-600/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
              Valid Claims
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Limited Exceptions Where Returns or Replacements Are Accepted
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              We stand 100% behind the quality and accuracy of our pharmacy service. We will gladly resolve any of the following verified issues:
            </p>
          </div>

          <div className="space-y-3 text-sm sm:text-base text-slate-700">
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
              <strong className="text-emerald-950 font-bold block mb-1">
                A. Dispensing or Packaging Error by the Pharmacy
              </strong>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                If our pharmacy staff accidentally dispensed a medication that differs from your verified doctor's prescription or your order confirmation (e.g. wrong drug, wrong dosage strength like 200mg instead of 400mg, or wrong quantity).
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
              <strong className="text-emerald-950 font-bold block mb-1">
                B. Manufacturer Defect or Compromised Factory Seal
              </strong>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                If the product has an intact manufacturing defect, broken factory seal prior to unboxing, or is the subject of an official NAFDAC safety recall.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
              <strong className="text-emerald-950 font-bold block mb-1">
                C. Proven Damage in Transit Prior to Receipt
              </strong>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                If transit packaging arrived visibly crushed, leaking, or broken before delivery acceptance. (Please inspect your package upon delivery before signing or paying the rider/driver).
              </p>
            </div>
          </div>
        </div>

        {/* Claim Procedure & Timeframe */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            How to File an Eligible Claim (Within 24 Hours)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            To ensure swift clinical investigation and resolution, please follow these steps:
          </p>

          <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>
              <strong>Report Promptly:</strong> Notify our Superintendent Pharmacist within <strong>24 hours</strong> of receiving your delivery. Claims reported after 24 hours cannot be validated due to storage custody regulations.
            </li>
            <li>
              <strong>Contact Channels:</strong> Send a WhatsApp message to <strong>+234 802 966 0153</strong> or email <strong>gbotemihpharmacy@gmail.com</strong>.
            </li>
            <li>
              <strong>Provide Evidence:</strong> Include your Order ID, a brief explanation of the discrepancy, and clear photos or a short video showing the product, batch number, expiry date, and manufacturer seal.
            </li>
            <li>
              <strong>Keep Product Unused:</strong> Do not open, tamper with, or consume the medication while the claim is being reviewed.
            </li>
          </ol>
        </div>

        {/* Resolution Process */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Resolution & Refund Timeline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">
                Priority Replacement (Recommended)
              </strong>
              Where an error has occurred, we will immediately dispatch the correct medication to your address on priority at zero additional expense.
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">
                Direct Bank Refund
              </strong>
              If an identical product is out of stock, a full refund of the medication cost will be refunded directly to your original bank account within <strong>3 to 5 business days</strong>.
            </div>
          </div>
        </div>

        {/* Pre-Purchase Advisory CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-emerald-50/80 border border-emerald-200 rounded-3xl">
          <div>
            <h4 className="font-bold text-emerald-950 text-base">
              Need assistance before placing an order?
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
              Chat directly with our licensed pharmacists to verify medication brand, dosage, and suitability before purchase.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="https://wa.me/2348029660153?text=Hello%20Gbotemi%20Holistic%20Pharmacy,%20I%20need%20assistance%20verifying%20a%20medication%20before%20placing%20my%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center"
            >
              <button
                type="button"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-xl shadow-md text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer"
              >
                Chat with Pharmacist
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 md:p-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 border-b border-gray-100 pb-5">
            {title}
          </h1>
          {content}
        </div>
      </div>
    </div>
  );
}
