import Image from "next/image";
import React, { FC, FormEventHandler, useState } from "react";
import loginBanner from "../../public/loginBanner.png";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";

const Login: FC = ({}) => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [warning, setWarning] = useState<null | string>(null);
  
  /* eslint-disable */
  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });

    if (res) {
      if (!res.ok) {
        setWarning(res.error);
      } else {
        await router.push("/");
      }
    }
  };

  return (
    <div className="flex flex-col items-center md:flex-row ">
      <div className=" flex w-full flex-col items-center justify-start md:mb-0 md:w-1/2">
        <div className="mb-12 w-3/5">
          <h2 className="mb-2 text-2xl">Welcome to E-Market</h2>
          <p>Enter your Credentials to access your account</p>
        </div>
        <form className="w-3/5" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="name@flowbite.com"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              value={form.email}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              value={form.password}
              required
            />
          </div>
          <div className="mb-6 flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
              />
            </div>
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#3A5B22] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#2e491b] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </button>
          {warning && <p className="text-redPrimary">{warning}</p>}
          <button
            className="mt-4 rounded-md  border-2 px-5  py-2.5"
            onClick={() => void signIn("google")}
          >
            <FcGoogle size={30} className="inline" /> Sign in with Google
          </button>
          <p className="mt-4 text-center text-sm">
            Don&apos;t have account?{" "}
            <Link className="underline" href="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
      <div className="w-full md:w-1/2 ">
        <Image src={loginBanner} alt="banner" objectFit="cover" />
      </div>
    </div>
  );
};

export default Login;
