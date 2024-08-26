import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-sm mt-10">
      <div className="py-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <Image src="/logo2.png" width={200} height={200} alt="Logo" style={{marginLeft:"-50px"}}/>
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Logo and Contact Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-800 font-semibold">Contact details</h2>
              <p className="text-gray-600">
                Address: Titagarh Brahmasthan, 26 Park Road Kolkata-700119
              </p>
              <p className="text-gray-600">
                Contact us: <a href="mailto:aryamansingh005@gmail.com" className="text-blue-500">help.favindo@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Collection Links */}
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-800 font-semibold">Collection</h2>
            <ul className="text-gray-600">
              <li><Link href="/list">Premium Oversized Cotton T-shirt</Link></li>
              <li><Link href="/list">Premium Cotton T-shirt</Link></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-800 font-semibold">Connect with us</h2>
            <Link href="https://www.instagram.com/arya005006/?hl=en" className="flex items-center gap-2 text-gray-600">
              <Image src="/instagram.png" width={20} height={20} alt="Instagram" />
              <span>Instagram</span>
            </Link>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 flex flex-wrap gap-4 items-center justify-center">
          <h2 className="text-gray-600 text-center font-semibold w-full">
            100% PAYMENT PROTECTION
          </h2>
          <div className="flex gap-4">
            <Image src="/visa.png" width={50} height={30} alt="Visa" />
            <Image src="/mastercard.png" width={50} height={30} alt="Mastercard" />
            <Image src="/th.jpg" width={50} height={30} alt="Rupay" />
            {/* <Image src="/netbanking.png" width={50} height={30} alt="Net Banking" /> */}
            {/* <Image src="/bhim.png" width={50} height={30} alt="BHIM" /> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
