import { Category, Subcategory } from "@prisma/client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { CategoryWithSubCategory } from "~/config/type";

interface CategoryNavBarProps {
  categories: CategoryWithSubCategory[];
}

const CategoryNavBar: FC<CategoryNavBarProps> = ({ categories }) => {
  return (
    <div className="border-r-2">
      <ul className="w-44 pt-8 text-sm md:w-56 md:text-base">
        <li className="group/item relative w-full px-4 py-1.5 hover:bg-slate-100">
          <Link
            className="flex w-full justify-between"
            href={`/list?category=all`}
          >
            <span>All</span>
          </Link>
        </li>
        {categories.map((category) => (
          <li
            key={category.id}
            className="group/item relative w-full px-4 py-1.5 hover:bg-slate-100"
          >
            <Link
              className="flex w-full justify-between"
              href={`/list?category=${category.id}`}
            >
              <span>{category.name}</span>
              {category.subcategory.length ? (
                <span>
                  <MdArrowForwardIos className="inline" />
                </span>
              ) : (
                ""
              )}
            </Link>
            {category.subcategory && (
              <ul className="invisible absolute  right-0 top-0 z-10 translate-x-full group-hover/item:visible">
                {category.subcategory.map((sub) => (
                  <li
                    key={sub.id}
                    className=" w-48 bg-slate-100 px-4 py-1.5 hover:bg-slate-200"
                  >
                    <Link
                      className="w-full"
                      href={`?category=${category.id}&subCategory=${sub.id}`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryNavBar;
