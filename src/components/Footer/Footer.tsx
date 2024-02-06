import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineSend } from "react-icons/ai";

const Footer: FC = ({}) => {
  return (
    <footer className="bg-buttonBlack text-whitePrimary flex flex-col gap-6 md:flex-row justify-between px-4 py-6 sm:px-16 sm:py-12">
      <div className="flex flex-col gap-1 md:gap-4">
        <h2 className="text-3xl font-light">E-Market</h2>
        <h3>Subscribe</h3>
        <p>Get 10% off your first order</p>
        <div className="relative w-56 ">
          <input
            type="email"
            className="border-whitePrimary w-full rounded-sm border-2 bg-transparent p-1.5"
            placeholder="Enter your email"
          />
          <button>
            <AiOutlineSend className="absolute right-4 top-2 " size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 md:gap-4">
        <h2 className="text-xl font-light">Support</h2>
        <p>yoho4613@gmail.com</p>
        <p>+64 21 087 35461</p>
      </div>

      <div className="flex flex-col gap-1 md:gap-4">
        <h2 className="text-xl font-light">Account</h2>
        <Link href="/user/profile">My Account</Link>
        <Link href="/login">Login / Register</Link>
        <Link href="/user/cart">Cart</Link>
        <Link href="/user/watchlist">Wishlist</Link>
        <Link href="/list">Shop</Link>
      </div>

      <div className="flex flex-col gap-1 md:gap-4">
        <h2 className="text-xl font-light">Quick Link</h2>
        <Link href="/about">About Us</Link>
        <Link href="/">Privacy Policy</Link>
        <Link href="/">Terms Of Use</Link>
        <Link href="/">FAQ</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </footer>
  );
};

export default Footer;
