import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { BsStar, BsStarFill } from "react-icons/bs";
import Spinner from "~/components/global/Spinner";
import { useStateContext } from "~/context/userDetailContext";
import { api } from "~/utils/api";

const Order: FC = ({}) => {
  const { userDetail } = useStateContext();
  const { data: orders, isError } = api.order.getUserOrder.useQuery({
    userId: userDetail.id,
  });
  const { mutate: createReview } = api.review.createReview.useMutation({
    onSuccess: (res) => {
      toast.success("review successfully submitted");
      refetch()
        .then((res) => res)
        .catch((err) => console.log(err));
      setReview("");
    },
  });
  const { data: userReviews, refetch } = api.review.getUserReviews.useQuery({
    userId: userDetail.id,
  });

  const [review, setReview] = useState<string>("");

  if (isError) {
    return (
      <div>
        <h2>You have No Order processing</h2>
      </div>
    );
  }

  const ReviewForm = () => {
    const [form, setForm] = useState({ comment: "", star: 0 });

    return (
      <div className="fixed left-1/2 mx-auto flex max-w-xl -translate-x-1/2 flex-col gap-2 overflow-hidden border-2 bg-gray-300 p-4 dark:bg-buttonBlack">
        <h2 className="text-2xl font-bold">Review Form</h2>

        <div className="flex flex-col items-center gap-2">
          <label>Comment</label>
          <textarea
            name="description"
            rows={8}
            className="h-12 w-full grow rounded-sm border-none bg-gray-200 p-1"
            placeholder="comment..."
            onChange={(e) =>
              setForm((prev) => ({ ...prev, comment: e.target.value }))
            }
            value={form.comment}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <label>Star</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((_, i) =>
              form.star > i ? (
                <BsStarFill
                  key={i}
                  size={20}
                  className="text-[#ffc107] sm:mr-2"
                  onClick={(e) => setForm((prev) => ({ ...prev, star: i + 1 }))}
                />
              ) : (
                <BsStar
                  key={i}
                  size={20}
                  className="text-[#ffc107] sm:mr-2"
                  onClick={(e) => setForm((prev) => ({ ...prev, star: i + 1 }))}
                />
              ),
            )}
          </div>
        </div>

        {/* {error && <p className="text-xs text-red-600">{error}</p>} */}
        <button
          className="h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed"
          disabled={form.star < 1 || !form.comment || !review}
          onClick={() => {
            createReview({
              userId: userDetail.id,
              productId: review,
              star: form.star,
              comment: form.comment,
            });
          }}
        >
          Submit
        </button>
        <button className="btn--red px-4 py-2" onClick={() => setReview("")}>
          Cancel
        </button>
      </div>
    );
  };

  return (
    <div className="my-4 max-w-[1280px] sm:my-12">
      <h1 className="text-center text-xl font-bold sm:text-2xl">My Order</h1>
      {review && <ReviewForm />}
      <div className="space-y-2 px-4">
        {orders ? (
          orders.map((order) => (
            <div key={order.id} className="border-2 p-2">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h3 className="font-bold">Order ID</h3>
                  <p>{order.id}</p>
                </div>
                <div>
                  <h3 className="font-bold">Order Created At</h3>
                  <p>{order.createdAt.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-bold">Estimated Delivery Date</h3>
                  <p>
                    {new Date(
                      order.createdAt.getTime() + 1000 * 60 * 60 * 24 * 3,
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">Order Status</h3>
                  <p>{order.status}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                {order.products.map((product) => (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="border-2 p-1"
                  >
                    <Image
                      className="w-full"
                      src={product.url[0]!}
                      alt={product.title}
                      width={100}
                      height={100}
                    />
                    <p>Quantity: {product.quantity}</p>
                    <p>${Number(product.price) * product.quantity}</p>
                    {userReviews &&
                    userReviews
                      .map((review) => review.productId)
                      .includes(product.id) ? (
                      <p className="text-gray-600">Review Submitted</p>
                    ) : (
                      <button
                        onClick={() => setReview(product.id)}
                        className="rounded-sm border-2 px-0.5 py-2 hover:bg-gray-400"
                      >
                        Review Product
                      </button>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default Order;
