import { useLocation } from 'react-router-dom';

export default function InfoPage() {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Information';
  let content: React.ReactNode = 'Content is being updated. Please check back later.';

  if (path.includes('delivery')) {
    title = 'Delivery Information';
    content = 'We offer fast and reliable delivery services across Nigeria. Standard delivery takes 2-3 business days. Same-day delivery is available for specific locations.';
  } else if (path.includes('faq')) {
    title = 'Frequently Asked Questions';
    content = (
      <div className="space-y-4">
        <details className="group border border-gray-200 rounded-lg bg-gray-50 [&_summary::-webkit-details-marker]:hidden" open>
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-lg">What is Gbotemi Holistic Pharmacy?</h2>
            <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 px-4 pb-4 leading-relaxed text-gray-700 text-base">
            Gbotemi Holistic Pharmacy is a trusted healthcare provider offering genuine medications, holistic health services, professional pharmacist consultations, and convenient online ordering across Nigeria.
          </p>
        </details>

        <details className="group border border-gray-200 rounded-lg bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-lg">How do I order prescription medications?</h2>
            <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 px-4 pb-4 leading-relaxed text-gray-700 text-base">
            To order prescription medications, search for the medication and add it to your cart. During checkout, you will be required to upload a clear picture of your valid prescription. You can also use our dedicated "Upload Prescription" page to send it to our pharmacists for review.
          </p>
        </details>

        <details className="group border border-gray-200 rounded-lg bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-lg">How long does delivery take?</h2>
            <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 px-4 pb-4 leading-relaxed text-gray-700 text-base">
            Standard delivery takes 2-3 business days. We also offer same-day delivery for select local areas depending on the time your order is placed. Delivery times may vary based on your exact location.
          </p>
        </details>

        <details className="group border border-gray-200 rounded-lg bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-lg">Can I speak to a pharmacist online?</h2>
            <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 px-4 pb-4 leading-relaxed text-gray-700 text-base">
            Yes! You can book a virtual consultation with our licensed pharmacists through the "Consultation" section on our website. We offer expert advice on medication management, chronic diseases, and general wellness.
          </p>
        </details>

        <details className="group border border-gray-200 rounded-lg bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-lg">Are your medications genuine?</h2>
            <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 px-4 pb-4 leading-relaxed text-gray-700 text-base">
            Absolutely. We source all our pharmaceutical products, supplements, and medical devices directly from verified manufacturers and licensed distributors to guarantee authenticity and safety.
          </p>
        </details>

        <details className="group border border-gray-200 rounded-lg bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4 text-gray-900 font-medium">
            <h2 className="font-semibold text-lg">How can I track my order?</h2>
            <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 px-4 pb-4 leading-relaxed text-gray-700 text-base">
            Once your order is confirmed, you can track its status by logging into your account and navigating to the "Orders" section in your Dashboard. You will also receive email updates as your order progresses.
          </p>
        </details>
      </div>
    );
  } else if (path.includes('privacy')) {
    title = 'Privacy Policy';
    content = 'Your privacy is important to us. We secure your data and only use your personal information as described in this policy to provide you with the best healthcare experience.';
  } else if (path.includes('terms')) {
    title = 'Terms & Conditions';
    content = (
      <div className="space-y-6 text-gray-700">
        <p>Welcome to Gbotemi Holistic Pharmacy. These terms and conditions outline the rules and regulations for the use of our website and e-commerce platform.</p>
        
        <h3 className="text-xl font-bold text-gray-900 mt-6">1. General Information</h3>
        <p>By accessing this website and placing an order, you agree to be bound by these Terms and Conditions. Our platform allows users to purchase pharmaceutical products, supplements, health devices, and book consultations.</p>
        
        <h3 className="text-xl font-bold text-gray-900 mt-6">2. Prescription Medications</h3>
        <p>Certain products on our platform require a valid prescription from a registered medical practitioner. By ordering these medications, you agree to upload a clear and legitimate prescription. Our pharmacists reserve the right to reject orders if the prescription is deemed invalid, expired, or suspicious.</p>
        
        <h3 className="text-xl font-bold text-gray-900 mt-6">3. Medical Disclaimer</h3>
        <p>The information provided on this website is for educational and informational purposes only. It does not replace professional medical advice, diagnosis, or treatment. Always consult a physician or our licensed pharmacists before starting any new treatment or medication.</p>
        
        <h3 className="text-xl font-bold text-gray-900 mt-6">4. Product Availability and Pricing</h3>
        <p>All products are subject to availability. Prices for our products are subject to change without notice. We reserve the right to modify or discontinue a product at any time. In the event of a pricing error, we reserve the right to cancel orders placed at the incorrect price.</p>
        
        <h3 className="text-xl font-bold text-gray-900 mt-6">5. Delivery and Risk of Loss</h3>
        <p>We aim to deliver products within the stated timeframe. However, delivery dates are estimates. The risk of loss for items purchased passes to you upon delivery to the carrier.</p>
        
        <h3 className="text-xl font-bold text-gray-900 mt-6">6. User Accounts</h3>
        <p>To use certain features, you may be required to register an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
      </div>
    );
  } else if (path.includes('refund')) {
    title = 'Refund Policy';
    content = 'We do not accept returns for products bought in good condition.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">{title}</h1>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="text-lg text-gray-700 leading-relaxed mb-6">{content}</div>
        </div>
      </div>
    </div>
  );
}
