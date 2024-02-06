import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { Address, UserDetail } from "~/config/type";
import { defaultUserDetail } from "~/constant/config";
import { api } from "~/utils/api";

interface ContextProp {
  userDetail: UserDetail;
  setUserDetail: Dispatch<SetStateAction<UserDetail>>;
  updateWatchlistContext: (productId: string) => void;
  updateCartContext: (productId: string) => void;
  addNewAddressContext: (address: Address) => void;
}

const UserContext = createContext<ContextProp>({
  userDetail: defaultUserDetail,
  setUserDetail: (str) => {
    return str;
  },
  updateWatchlistContext: (str) => {
    return str;
  },
  updateCartContext: (str) => {
    return str;
  },
  addNewAddressContext: (str) => {
    return str;
  },
});

export const StateContext = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { mutate: updateCart } = api.cart.updateCart.useMutation({
    onError: async (err) => {
      toast.error("You must be logged in in order to add or remove cart");
      await router.push("/login");
      return err;
    },
  });
  const { mutate: addNewAddress } = api.user.addressRegister.useMutation({
    onSuccess: (res) =>
      setUserDetail((prev) => ({
        ...prev,
        address: res.address as Address | null,
      })),
    onError: (err) => toast.error(err.message),
  });
  const { mutate: getUserDetail } = api.user.findUser.useMutation({
    onSuccess: (res) => {
      if (res) {
        setUserDetail({ ...res, address: res.address as Address });
      }
    },
  });
  const session = useSession();

  const [userDetail, setUserDetail] = useState<UserDetail>(defaultUserDetail);

  useEffect(() => {
    if (session.status === "authenticated") {
      getUserDetail({ email: session.data.user.email! });
    }
  }, [session]);

  const updateWatchlistContext = (productId: string) => {
    if (userDetail.watchlist.includes(productId)) {
      setUserDetail((prev) => ({
        ...prev,
        watchlist: prev.watchlist.filter((id) => id !== productId),
      }));
    } else {
      setUserDetail((prev) => ({
        ...prev,
        watchlist: [...prev.watchlist, productId],
      }));
    }
  };

  const updateCartContext = (productId: string) => {
    if (userDetail.cart.includes(productId)) {
      setUserDetail((prev) => ({
        ...prev,
        cart: prev.cart.filter((id) => id !== productId),
      }));
      updateCart({ userId: userDetail.id, productId: productId });
    } else {
      setUserDetail((prev) => ({
        ...prev,
        cart: [...prev.cart, productId],
      }));
      updateCart({ userId: userDetail.id, productId: productId });
    }
  };

  const addNewAddressContext = (address: Address) => {
    addNewAddress({ id: userDetail.id, ...address });
  };

  return (
    <UserContext.Provider
      value={{
        userDetail,
        setUserDetail,
        updateWatchlistContext,
        updateCartContext,
        addNewAddressContext,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useStateContext = () => useContext(UserContext);
