import React, { useEffect, useState } from "react";

import defaultAvatar from "../../../public/avatar.png";

import Image from "next/image";
import { useStateContext } from "~/context/userDetailContext";
import Link from "next/link";

const Profile = () => {
  const { userDetail } = useStateContext();
  return (
    <div>
      <section className="flex h-screen items-center justify-center bg-[#071e34] font-medium">
        <section
          className="w-120 mx-auto rounded-2xl bg-[#20354b] px-8 py-6 shadow-lg"
          style={{ fontFamily: "Montserrat" }}
        >
          <div className="flex items-center justify-between">
            {/* <span className="text-gray-400 text-xl">{profile.Nickname}</span> */}
          </div>
          {userDetail && (
            <>
              <div className="mx-auto mt-6 w-fit">
                <Image
                  src={userDetail.image ?? defaultAvatar}
                  width={100}
                  height={100}
                  className="w-28 rounded-full "
                  alt="profile picture"
                />
              </div>
              <div className="mt-8 ">
                <h2 className="text-2xl font-bold tracking-wide text-white">
                  {userDetail.name}
                </h2>
              </div>

              <h2 className="text-2md font-bold tracking-wide text-white">
                Member Since:{" "}
                {userDetail.createdAt &&
                  `${userDetail.createdAt.getDate()} / ${userDetail.createdAt.getMonth()} / ${userDetail.createdAt.getFullYear()}`}
              </h2>
              <h2 className="text-2md font-bold tracking-wide text-white">
                {userDetail.email}
              </h2>
              <div className="mt-3 text-sm text-white">
                {/* <span className="text-gray-400 font-semibold">Balance: </span> */}
                {/* <span>Balance: ${profile.Balance}</span> */}
              </div>
              <div className="mt-3 text-sm text-white">
                {userDetail.emailVerified ? (
                  <p className="mt-2.5 font-semibold text-emerald-400">
                    Email Verified
                  </p>
                ) : (
                  <p>Email is not verified</p>
                )}
              </div>
              <div className="mt-3 text-sm text-white">
                {userDetail.role && (
                  <p className="mt-2.5 font-semibold text-emerald-400">
                    You are currently {userDetail.role} level.
                  </p>
                ) }
              </div>
              <div className="mt-3 text-sm text-white">
                {userDetail && (
                  <p className="mt-2.5 font-semibold ">
                    Purchase: 
                    {/* <span className="text-emerald-400">{userDetail.purchase || 0}</span> */}
                  </p>
                ) }
              </div>
              <div className="text-whitePrimary mt-3">
                <Link href="/" className="border-2 rounded-md px-2 py-1 mr-2 hover:bg-whitePrimary hover:text-buttonBlack">Orders</Link>
                <Link href="/" className="border-2 rounded-md px-2 py-1 mr-2 hover:bg-whitePrimary hover:text-buttonBlack">Cancellations</Link>
                <Link href="/" className="border-2 rounded-md px-2 py-1 hover:bg-whitePrimary hover:text-buttonBlack">Reviews</Link>
              </div>
            </>
          )}
        </section>
      </section>
    </div>
  );
};

export default Profile;
