import React from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from "../context/cartContext";
import { ProductProvider } from "../context/productContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ORRIKA",
  description: "A fashion e-comm",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" /> {/* Replace with your favicon's path if different */}
      </Head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CartProvider>
          <ProductProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ToastContainer />
          </ProductProvider>
        </CartProvider>
      </body>
    </html>
  );
}
