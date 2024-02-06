import React, { FC } from "react";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";

const Service: FC = ({}) => {
  return (
    <div className="m-auto my-32 flex w-4/5 justify-between">
      <div className="text-center">
        <div className="bg-graySecondary m-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ">
          <div className=" bg-buttonBlack flex h-16 w-16 items-center justify-center rounded-full ">
            <TbTruckDelivery color="white" size={50} />
          </div>
        </div>
        <h3 className="text-sm sm:text-xl font-bold">FREE AND FAST DELIVERY</h3>
        <h4 className="text-xs sm:text-base mt-2">Free delivery for all orders over $140</h4>
      </div>
      <div className="text-center">
        <div className="bg-graySecondary m-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ">
          <div className=" bg-buttonBlack flex h-16 w-16 items-center justify-center rounded-full ">
            <RiCustomerService2Line color="white" size={50} />
          </div>
        </div>
        <h3 className="text-sm sm:text-xl font-bold">24/7 CUSTOMER SERVICE</h3>
        <h4 className="text-xs sm:text-base mt-2">Friendly 24/7 customer support</h4>
      </div>
      <div className="text-center">
        <div className="bg-graySecondary m-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ">
          <div className=" bg-buttonBlack flex h-16 w-16 items-center justify-center rounded-full ">
            <LuShieldCheck color="white" size={50} />
          </div>
        </div>
        <h3 className="text-sm sm:text-xl font-bold">MONEY BACK GUARANTEE</h3>
        <h4 className="text-xs sm:text-base mt-2">We reurn money within 30 days</h4>
      </div>
    </div>
  );
};

export default Service;
