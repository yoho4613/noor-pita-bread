import { useRouter } from "next/router";
import { FC, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchbarProps {
  category?: string;
  subCategory?: string;
}

const Searchbar: FC<SearchbarProps> = ({ category, subCategory }) => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false)
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router
            .push(
              `/list?category=${category ?? "all"}&subCategory=${
                subCategory ?? "all"
              }&search=${input}`,
            )
            .then((res) => res)
            .catch((err) => console.log(err));
        }}
      >
        <input
          className="w-full text-xs bg-secondary px-2 py-1 md:px-4 md:py-2"
          placeholder="What are you looking for?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="absolute right-1 top-1 text-lg md:text-xl md:right-2 md:top-1.5 ">
          <FiSearch />
        </button>
        {isSearching && (
          <div className="w-full">
            
          </div>
        )}
      </form>
    </>
  );
};

export default Searchbar;
