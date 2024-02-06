import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { api } from "~/utils/api";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const AdminNavBar: FC = () => {
  const router = useRouter();
  // const [user, setUser] = useState<User | { id: string } | null>(null)
  const {mutate: logout} = api.admin.logout.useMutation({
    onSuccess: () => router.push('/login-admin')
  })
  const [navigation, setNavigation] = useState([
    { name: "Dashboard", href: "/admin", current: true },
    { name: "Category", href: "/admin/category", current: false },
    { name: "Subcategory", href: "/admin/subcategory", current: false },
    { name: "Product", href: "/admin/product", current: false },
    { name: "Banner", href: "/admin/banner", current: false },
    { name: "Order", href: "/admin/order", current: false },
  ]);

  const handleActivePage = (url: string) => {
    setNavigation((prev) => prev.map((nav) => ({ ...nav, current: false })));
    setNavigation((prev) =>
      prev.map((nav) => (nav.href === url ? { ...nav, current: true } : nav)),
    );
  };

  useEffect(() => {
    handleActivePage(router.pathname);
  }, [router]);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/admin">
                    <Image
                      src={logo}
                      alt="logo"
                      width={100}
                      height={100}
                      className="block h-8 w-auto lg:hidden"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium",
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3 flex">
                  <Link
                    href="/admin/setting"
                    className="flex rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
                  >
                    Setting
                  </Link>
                  <Menu.Button
                    onClick={() => logout()}
                    className="flex rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
                  >
                    Logout
                  </Menu.Button>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium",
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AdminNavBar;
