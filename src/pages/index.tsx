import { isSameMonth, isToday } from "date-fns";
import { useEffect, useState } from "react";
import Categories from "~/components/Categories/Categories";
import Featured from "~/components/Deals/Featured";
import MonthDeal from "~/components/Deals/MonthDeal";
import TodayDeal from "~/components/Deals/TodayDeal";
import Spinner from "~/components/global/Spinner";
import HotProducts from "~/components/Products/HotProducts";
import Service from "~/components/Service/Service";
import HeroBanner from "~/components/banners/HeroBanner";
import HomeBanner from "~/components/banners/HomeBanner";
import CategoryNavBar from "~/components/navbar/CategoryNavBar";
import { Sale } from "~/config/type";
import { api } from "~/utils/api";
import { useShopContext } from "~/context/shopContext";

export default function Home() {
  const { categories, fetchCategories } = useShopContext();

  const { data: withSubCategory } = api.category.withSubcategory.useQuery();
  const { data: sales } = api.sale.getAllSales.useQuery();
  const { data: randomProducts } = api.product.getRandomProducts.useQuery(20);
  const [todayDeal, setTodayDeal] = useState<Sale | null>(null);
  const [monthDeal, setMonthDeal] = useState<Sale | null>(null);

  useEffect(() => {
    if (sales?.length) {
      if (todayDeal === null) {
        setTodayDeal(sales[sales.length - 1]!);
      }
      if (monthDeal === null) {
        setMonthDeal(sales[0]!);
      }
      sales.map((sale) => {
        if (isToday(sale.expire)) {
          setTodayDeal(sale);
        }
        if (isSameMonth(new Date(), sale.expire)) {
          setMonthDeal(sale);
        }
      });
    }
  }, [sales]);

  useEffect(() => {
    if(!categories.length) {

      fetchCategories()
    }
  }, [categories])

  return (
    <>
      <div className="m-auto w-screen max-w-[1280px] md:px-6">
        <div className="flex w-full flex-col md:flex-row ">
          {withSubCategory ? (
            <CategoryNavBar categories={withSubCategory} />
          ) : (
            <div>
              <Spinner /> Loading...
            </div>
          )}
          <div className="min-w-[20rem] grow px-4 py-4">
            <HomeBanner />
          </div>
        </div>

        <div className="mt-24 space-y-10">
          <TodayDeal deal={todayDeal} />
          {withSubCategory ? (
            <Categories categories={withSubCategory} />
          ) : (
            <div>Loading...</div>
          )}
          <MonthDeal deal={monthDeal} />
          <HeroBanner />
          {randomProducts && <HotProducts products={randomProducts} />}
          <Featured />
        </div>
        <Service />
      </div>
    </>
  );
}
