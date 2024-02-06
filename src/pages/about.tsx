import { FC } from "react";
import mainImage from "../../public/about-us-image.webp";
import Image from "next/image";
import { BiStoreAlt } from "react-icons/bi";
import { AiOutlineDollar } from "react-icons/ai";
import {
  FiInstagram,
  FiLinkedin,
  FiShoppingBag,
  FiTwitter,
} from "react-icons/fi";
import { TbFlagDollar } from "react-icons/tb";
import { STAFF } from "~/constant/config";
import Link from "next/link";
import Service from "~/components/Service/Service";

const about: FC = ({}) => {
  return (
    <div className="py-4 sm:p-6 md:p-12">
      <div className="flex w-full flex-col gap-6 md:flex-row ">
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:gap-0">
          <div className="flex w-1/2 flex-col justify-center  space-y-4 px-4">
            <h1 className="w-full text-2xl font-bold">Our Story</h1>
            <p className="text-sm font-light">
              Launced in 2015, Exclusive is South Asia’s premier online shopping
              makterplace with an active presense in Bangladesh. Supported by
              wide range of tailored marketing, data and service solutions,
              Exclusive has 10,500 sallers and 300 brands and serves 3 millioons
              customers across the region.
            </p>
            <p className="text-sm font-light">
              Exclusive has more than 1 Million products to offer, growing at a
              very fast. Exclusive offers a diverse assotment in categories
              ranging from consumer.
            </p>
          </div>
          <div className="w-full grow sm:w-1/2">
            <Image
              src={mainImage}
              alt="about-us"
              width={100}
              height={100}
              sizes="cover"
              className="w-full"
            />
          </div>
        </div>
      </div>
      <div className="m-auto my-32 flex flex-wrap justify-around gap-4">
        <div className="w-60 border-2 p-4 text-center hover:bg-redPrimary hover:text-white">
          <div className="m-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-graySecondary ">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-buttonBlack ">
              <BiStoreAlt color="white" size={50} />
            </div>
          </div>
          <h3 className="text-sm font-bold sm:text-xl">10.5k</h3>
          <h4 className="mt-2 text-xs sm:text-base">Seller active our site</h4>
        </div>
        <div className="w-60 border-2 p-4 text-center hover:bg-redPrimary hover:text-white">
          <div className="m-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-graySecondary ">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-buttonBlack ">
              <AiOutlineDollar color="white" size={50} />
            </div>
          </div>
          <h3 className="text-sm font-bold sm:text-xl">33k</h3>
          <h4 className="mt-2 text-xs sm:text-base">Monthly Product Sale</h4>
        </div>

        <div className="w-60 border-2 p-4 text-center hover:bg-redPrimary hover:text-white">
          <div className="m-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-graySecondary ">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-buttonBlack ">
              <FiShoppingBag color="white" size={50} />
            </div>
          </div>
          <h3 className="text-sm font-bold sm:text-xl">45.5k</h3>
          <h4 className="mt-2 text-xs sm:text-base">
            Customer active in our site
          </h4>
        </div>
        <div className="w-60 border-2 p-4 text-center hover:bg-redPrimary hover:text-white">
          <div className="m-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-graySecondary ">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-buttonBlack ">
              <TbFlagDollar color="white" size={50} />
            </div>
          </div>
          <h3 className="text-sm font-bold sm:text-xl">25k</h3>
          <h4 className="mt-2 text-xs sm:text-base">
            Annual gross sale in our site
          </h4>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-around ">
        {STAFF.map((staff, i) => (
          <div key={i} className="space-y-4">
            <Image
              className=" h-56 w-auto"
              src={staff.image}
              alt={staff.name}
              width={100}
              height={100}
            />
            <h3 className="text-2xl font-bold">{staff.name}</h3>
            <span>{staff.role}</span>
            <div className="flex gap-4">
              <Link href={staff.twitter}>
                <FiTwitter />
              </Link>
              <Link href={staff.instagram}>
                <FiInstagram />
              </Link>
              <Link href={staff.linkedIn}>
                <FiLinkedin />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Service />
    </div>
  );
};

export default about;
