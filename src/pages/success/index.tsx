import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import OrderDetail from "~/components/order/OrderDetail";

const Success: FC = () => {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string>("");
  useEffect(() => {
    setClientSecret(router.query.payment_intent_client_secret as string);
  }, [router]);

  useEffect(() => {
    if (clientSecret) {
    }
  }, [clientSecret]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  } as {
    clientSecret: string;
    appearance: {
      theme: "stripe";
    };
  };
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
  console.log(router.query);

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <OrderDetail clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   return {
//     props: {
//      id: query.id
//     },
//   };
// };

export default Success;
