import { useRouter } from "next/router";
import { FC } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart } from "react-icons/ai";
import { BiHeart } from "react-icons/bi";
import { UserDetail } from "~/config/type";
import { useStateContext } from "~/context/userDetailContext";
import { api } from "~/utils/api";

interface HeartProps {
  productId: string;
}

const Heart: FC<HeartProps> = ({ productId }) => {
  const router = useRouter();
  const { userDetail, updateWatchlistContext } = useStateContext();
  const { mutate: updateWatchlist } = api.watchlist.updateWatchlist.useMutation(
    {
      onError: (err) => {
        toast.error(
          "You must be logged in in order to add or remove watchlist",
        );
        router
          .push("/login")
          .then((res) => res)
          .catch((err) => console.log(err));
        return err;
      },
    },
  );

  const handleUpdateWatchlist = () => {
    updateWatchlistContext(productId);
    updateWatchlist({
      userId: userDetail.id,
      productId: productId,
    });
  };

  return (
    <>
      <button
        className="h-full w-full  p-1 sm:p-2"
        onClick={handleUpdateWatchlist}
      >
        {userDetail?.watchlist.includes(productId) ? (
          <AiFillHeart size={20} className="text-redPrimary" />
        ) : (
          <BiHeart size={20} className="text-redPrimary" />
        )}
      </button>
    </>
  );
};

export default Heart;
