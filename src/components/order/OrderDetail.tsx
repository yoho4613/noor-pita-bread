import { User } from "@prisma/client";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect } from "react";
import { CartItem, OrderType } from "~/config/type";
import { useStateContext } from "~/context/userDetailContext";
import { api } from "~/utils/api";

interface OrderDetailProps {
  clientSecret: string;
}

const OrderDetail: FC<OrderDetailProps> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: order } = api.order.findOrder.useQuery({
    paymentId: clientSecret,
  });
  const { mutateAsync: updateStatus } = api.order.updateStatus.useMutation();
  const { data: banner } = api.banner.getHeroBanner.useQuery();
  const { userDetail, setUserDetail } = useStateContext();

  console.log(order);
  useEffect(() => {
    if (!stripe) return;
    // console.log(stripe.confirmPayment());

    const customerSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!customerSecret) return;

    stripe
      .retrievePaymentIntent(customerSecret)
      .then(async ({ paymentIntent }) => {
        if (
          paymentIntent?.status === "succeeded" &&
          order?.status === "received"
        ) {
          const updatedUser = (await updateStatus({
            id: order.id,
            status: "processing",
          })) as User;

          if (updatedUser.cart) {
            setUserDetail((prev) => ({ ...prev, cart: updatedUser.cart }));
          }
        }
      })
      .catch((err) => console.log(err));
  }, [stripe, order]);

  return (
    <div className="flex w-full max-w-[1280px] items-center justify-center gap-4">
      <div className="w-1/2 pl-6">
        <h1 className="text-2xl font-bold">Your Order Successfully Received</h1>
        <div>
          <h2 className="mb-4">Order Details:</h2>
          <div className="flex flex-col justify-between">
            {order &&
              (order.products as CartItem[]).map((item) => (
                <div key={item.id} className="flex">
                  <h2 className="w-2/3">{item.title}</h2>
                  <p className="mr-4">{item.quantity}</p>
                  <p>${Number(item.price) * item.quantity}</p>
                </div>
              ))}
          </div>
          <div className="mt-4">
            <Link href="/" className="rounded-md border-2 px-4 py-2">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <div className="h-full grow">
        {banner && (
          <Image
            className="w-full"
            src={banner.url}
            alt={banner.title}
            width={100}
            height={100}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
