import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Welcome to <span className="font-semibold text-primary-700">Gbotemi Holistic Pharmacy</span>. 
            We are dedicated to providing the best holistic healthcare services, ensuring that you have access 
            to high-quality medicines, professional consultations, and holistic wellness tools.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our mission is to bridge the gap between traditional healthcare and modern wellness solutions, 
            empowering you to take charge of your health effectively and affordably.
          </p>
          
          <div className="flex justify-center mt-10">
            <Link to="/contact" className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
