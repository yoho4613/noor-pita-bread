import Link from "next/link";
import React, { FC } from "react";
import { api } from "~/utils/api";

const TopBanner: FC = ({}) => {
  const { data: topbars } = api.banner.getTopbar.useQuery();

  return topbars?.length ? (
    <div className="bg-buttonBlack py-2 text-center text-sm text-whitePrimary sm:text-base">
      <div className="passing-animation flex">
        {topbars?.map((banner, i) => (
          <Link key={i} href={banner.link} className="w-full shrink-0">
            {banner.title}
            <span className="mx-4 font-bold">Shop Now</span>
          </Link>
        ))}
        {topbars?.map((banner, i) => (
          <Link key={i} href={banner.link} className="w-full shrink-0">
            {banner.title}
            <span className="mx-4 font-bold">Shop Now</span>
          </Link>
        ))}
      </div>
    </div>
  ) : null;
};

export default TopBanner;
