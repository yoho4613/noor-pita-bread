import Image from "next/image";
import React, { FC, FormEventHandler, useState } from "react";
import loginBanner from "../../public/loginBanner.png";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const Signup: FC = ({}) => {
  const router = useRouter();
  const [warning, setWarning] = useState<null | string>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { mutate: signUp } = api.user.signupUser.useMutation({
    onSuccess: () => router.push("/login"),
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setWarning("Miss Information");
    } else {
      if (form.password !== form.confirmPassword) {
        setWarning("Password and Confirm Password are not matched");
      } else {
        signUp({
          email: form.email,
          password: form.password,
          name: form.name,
        });
      }
    }
    return;
  };

  return (
    <div className="flex flex-col md:flex-row ">
      <div className="mb-12 mt-12 flex w-full flex-col items-center justify-start md:mb-0 md:w-1/2">
        <div className="mb-12 w-3/5">
          <h2 className="mb-2 text-2xl">Welcome to E-Market</h2>
          <p>Enter your Credentials to create your account</p>
        </div>
        <form className="w-3/5" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Jiho Park"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              value={form.name}
              required
            />
          </div>
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
              placeholder="name@e-market.com"
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
              placeholder="password"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              value={form.password}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password-confirm"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password-confirm"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="confirm password"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              value={form.confirmPassword}
              required
            />
          </div>
          {warning && <p className="text-red-500">{warning}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#3A5B22] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#2e491b] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign Up
          </button>

          <p className="mt-4 text-center text-sm">
            Already have have account?{" "}
            <Link className="underline" href="/login">
              Login
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

export default Signup;
