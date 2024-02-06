import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";
import { api } from "~/utils/api";

// interface HomeBannerProps {}

const HomeBanner: FC = ({}) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const { data: banners } = api.banner.getTopBanners.useQuery();
  useEffect(() => {
    if (banners) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) =>
          prev === banners.length - 1 ? 0 : prev + 1,
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  return (
    <div className="relative h-full w-full overflow-x-hidden">
      <div
        className="relative flex h-full min-h-[24rem] w-full rounded-lg transition"
        style={{ transform: `translateX(-${currentBanner * 100}%)` }}
      >
        {banners?.map((banner, i) => (
          <div
            key={banner.id}
            className="relative h-full w-full shrink-0 duration-700 ease-in-out"
            style={{ background: "rgba(0, 0, 0, 0.4)" }}
          >
            <div className="flex h-full min-h-[24rem] w-full flex-col justify-center p-12 text-whitePrimary ">
              <h2 className="text-4xl">{banner.title}</h2>
              <p className="my-6">{banner.description}</p>
              <Link href={`${banner.link}`} className="text-lg underline">
                Shop Now
                <MdArrowForward className="inline" />
              </Link>
            </div>
            <div className="absolute left-0 top-0 -z-10 h-full w-full">
              <Image
                className="h-full w-full"
                sizes="cover"
                width={100}
                height={100}
                src={banner.url}
                alt={banner.description}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-5 right-1/2 z-30 flex translate-x-1/2 space-x-3">
        {banners?.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            className={`h-3 w-3 rounded-full ${
              currentBanner === i ? "bg-slate-200" : "bg-slate-400"
            } hover:bg-slate-200`}
            onClick={() => setCurrentBanner(i)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
