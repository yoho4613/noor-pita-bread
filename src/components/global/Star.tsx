import { FC } from "react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

interface StarProps {
  average: number;
}

const Star: FC<StarProps> = ({ average }) => {
  const starArr = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {starArr.map((star, i) =>
        i < average && i + 1 > average ? (
          <BsStarHalf key={i} size={20} className="text-[#ffc107] sm:mr-2" />
        ) : i + 1 > average ? (
          <BsStar key={i} size={20} className="text-[#ffc107] sm:mr-2" />
        ) : (
          <BsStarFill key={i} size={20} className="text-[#ffc107] sm:mr-2" />
        ),
      )}
    </div>
  );
};

export default Star;
