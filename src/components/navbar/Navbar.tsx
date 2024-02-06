import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { RiMenu2Fill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import logo from "../../../public/logo.png";
import Link from "next/link";
import { BsPerson } from "react-icons/bs";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import { BiLogOut } from "react-icons/bi";
import { useSession, signOut } from "next-auth/react";
import Searchbar from "../global/Searchbar";
import { api } from "~/utils/api";
import { useStateContext } from "~/context/userDetailContext";
import { Address } from "~/config/type";

// interface NavbarProps {}

interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

const Navbar: FC = ({}) => {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const [profileOpened, setProfileOpened] = useState(false);
  const popupRef = useRef<HTMLUListElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | { id: string } | null>(null);
  const session = useSession();
  const { userDetail } = useStateContext();

  useEffect(() => {
    if (session.status === "authenticated") {
      setUser(session.data.user);
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (profileRef.current && !profileRef.current.contains(e.target)) {
          setProfileOpened(false);
          document.removeEventListener("mousedown", handleClickOutside);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [profileOpened]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target instanceof HTMLUListElement) {
        if (popupRef.current && popupRef.current.contains(e.target)) {
          setMobileMenuOpened(false);
          document.removeEventListener("mousedown", handleClickOutside);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpened]);

  return (
    <nav className="relative flex w-full items-center justify-between sm:px-4  ">
      <div className="relative order-1 h-16 w-16 md:h-20 md:w-20">
        <Link href="/">
          <Image src={logo} alt="logo" fill />
        </Link>
      </div>
      <div className="order-4 md:order-2 md:w-1/3 ">
        <button
          className="flex items-center md:hidden"
          onClick={() => setMobileMenuOpened((prev) => !prev)}
        >
          <RiMenu2Fill className="text-xl sm:text-3xl" />
        </button>

        <ul
          ref={popupRef}
          className={`absolute left-0 top-16 z-50 flex h-screen w-full flex-col bg-[rgba(0,0,0,0.6)] text-lg transition md:relative md:top-0  md:h-auto md:translate-x-0 md:flex-row md:justify-between md:bg-transparent md:transition-none ${
            mobileMenuOpened ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <li className="hover-underline-animation bg-slate-200 p-2.5 md:bg-transparent md:p-0">
            <Link
              onClick={() => setMobileMenuOpened(false)}
              className="inline-block w-full"
              href="/"
            >
              Home
            </Link>
          </li>
          <li className="hover-underline-animation bg-slate-200 p-2.5 md:bg-transparent md:p-0">
            <Link
              onClick={() => setMobileMenuOpened(false)}
              className="inline-block w-full"
              href="/list?category=all&subcategory=all"
            >
              Shop
            </Link>
          </li>
          <li className="hover-underline-animation bg-slate-200 p-2.5 md:bg-transparent md:p-0">
            <Link
              onClick={() => setMobileMenuOpened(false)}
              className="inline-block w-full"
              href="/contact"
            >
              Contact
            </Link>
          </li>
          <li className="hover-underline-animation bg-slate-200 p-2.5 md:bg-transparent md:p-0">
            <Link
              onClick={() => setMobileMenuOpened(false)}
              className="inline-block w-full"
              href="/about"
            >
              About
            </Link>
          </li>
          {!user && (
            <li className="hover-underline-animation bg-slate-200 p-2.5 md:bg-transparent md:p-0">
              <Link
                onClick={() => setMobileMenuOpened(false)}
                className="inline-block w-full"
                href="/login"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="order-3 flex items-center ">
        <div className="relative mr-2 w-44 text-xs md:mr-6 md:w-64 ">
          <Searchbar />
        </div>
        <div className="relative flex gap-1 items-center">
          <Link href={"/user/watchlist"} className="relative sm:mr-4">
            <AiOutlineHeart className="text-xl sm:text-2xl" />
            {userDetail.watchlist.length ? (
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-redPrimary text-center text-xs text-whitePrimary ">
                {userDetail.watchlist.length}
              </span>
            ) : (
              ""
            )}
          </Link>
          <Link href={"/user/cart"} className="relative sm:mr-4">
            <AiOutlineShoppingCart className="text-xl sm:text-2xl" />
            {userDetail.cart.length ? (
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-redPrimary text-center text-xs text-whitePrimary ">
                {userDetail.cart.length}
              </span>
            ) : (
              <></>
            )}
          </Link>
          {user && (
            <button onClick={() => setProfileOpened((prev) => !prev)}>
              {(user as User).image ? (
                <Image
                  src={(user as User).image!}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="w-6 rounded-full sm:w-6"
                />
              ) : (
                <RxAvatar color="#DB4444" className="text-lg sm:text-2xl" />
              )}
            </button>
          )}
          {profileOpened && (
            <div
              ref={profileRef}
              className="absolute right-0 top-6 z-[999] flex w-44 flex-col rounded-sm px-2.5 text-sm text-whitePrimary sm:w-[20rem] sm:text-lg"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <Link
                href="/user/profile"
                className="flex w-full items-center p-2 text-left"
              >
                <BsPerson color="white" className="mr-2 text-xl" />
                Manage My Profile
              </Link>
              <Link
                href="/user/order"
                className="flex w-full items-center p-2 text-left"
              >
                <PiShoppingBagOpenLight
                  color="white"
                  className="mr-2 text-xl"
                />
                My Order
              </Link>
              <Link href="/" className="flex w-full items-center p-2 text-left">
                <AiOutlineStar color="white" className="mr-2 text-xl" />
                My Reviews
              </Link>
              <button
                onClick={() => void signOut()}
                className="flex w-full items-center p-2 text-left"
              >
                <BiLogOut color="white" className="mr-2 text-xl" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
