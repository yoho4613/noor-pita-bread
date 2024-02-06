import Image from "next/image";
import React, { FC } from "react";
import { api } from "~/utils/api";

// interface IHeroBannerProps {}

const HeroBanner: FC = ({}) => {
  const { data: banner } = api.banner.getHeroBanner.useQuery();

  return (
    <div className=" relative my-12 h-[16rem] sm:h-[32rem]">
      {banner && <Image src={banner.url} alt="banner" fill sizes="cover" />}
      <button className="absolute bottom-6 left-6 rounded-md bg-buttonGreen px-2 py-1 text-xs text-whitePrimary sm:bottom-12 sm:left-12 sm:px-6 sm:py-2.5 sm:text-base">
        Buy Now!
      </button>
    </div>
  );
};

export default HeroBanner;
