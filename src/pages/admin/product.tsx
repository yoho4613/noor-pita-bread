import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import ProductForm from "~/components/admin/ProductForm";
import Spinner from "~/components/global/Spinner";
import { ProductType } from "~/config/type";
import { initialProductForm } from "~/constant/config";
import { api } from "~/utils/api";

const Product: FC = ({}) => {
  const { data: categories } = api.category.getAllCategories.useQuery();
  const { mutate: deleteProduct } = api.product.deleteProduct.useMutation({
    onSuccess: () => {
      refetch().then(res => res).catch(err => console.log(err))
    },
  });
  const [selectedproducts, setSelectedproducts] = useState<ProductType[]>([]);
  const [openForm, setOpenForm] = useState<ProductType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryId: string | null;
    subcategoryId: string | null;
  }>({ categoryId: null, subcategoryId: null });
  const [productLength, setProductLength] = useState(0);
  const [slicedProducts, setSlicedProducts] = useState<ProductType[]>([]);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const {
    data: products,
    isLoading,
    refetch,
  } = api.product.findByFilter.useQuery({
    category: selectedCategory.categoryId ?? "all",
    subcategory: selectedCategory.subcategoryId ?? "all",
    search: "all",
  });

  useEffect(() => {
    if (products) {
      setSlicedProducts(
        (products as ProductType[]).slice(0, productLength + 20),
      );
      setProductLength((prev) => prev + 20);
    }
  }, [products]);

  useEffect(() => {
    refetch().then(res => res).catch(err => console.log(err))
  }, [selectedCategory]);

  const deleteSelectedProducts = () => {
    if (!selectedproducts.length) {
      return toast.error(
        "Products are not selected. Please select the product.",
      );
    } else {
      for (const product of selectedproducts) {
        deleteProduct({ id: product.id, imageKey: product.imgUrl });
      }
      toast.success("Products successfully deleted.");
    }
  };

  const DeletePopup = () => {
    return (
      <div
        className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center"
        style={{ background: "rgba(0,0,0,0.4)" }}
      >
        <div className=" space-y-4 rounded-md bg-whitePrimary p-2 sm:p-8">
          <p>Are you sure you want to remove this item from watchlist?</p>
          <div className="flex w-full justify-between">
            <button
              className=" rounded-md bg-green-500 px-4 py-2 text-whitePrimary"
              onClick={() => {
                deleteSelectedProducts();
                setOpenPopup(false);
              }}
            >
              Confirm
            </button>
            <button
              className="btn--red px-4 py-2"
              onClick={() => setOpenPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-auto ">
      {openForm && (
        <div className="fixed top-0 max-h-screen w-full overflow-scroll bg-whitePrimary">
          <div className="pr-8 pt-4 text-right">
            <button onClick={() => setOpenForm(null)}>
              <AiFillCloseCircle size={35} color="red" />
            </button>
          </div>
          <ProductForm
            setOpenForm={setOpenForm}
            product={openForm}
            refetch={refetch}
          />
        </div>
      )}
      {openPopup && (
        <div>
          <DeletePopup />
        </div>
      )}
      <div className="flex justify-center py-4">
        <button
          onClick={() => setOpenForm(initialProductForm)}
          className="border-2 px-4 py-2"
        >
          Add New Product
        </button>
      </div>
      <div className="mb-6 flex items-end justify-between px-6">
        <div>
          <h3 className="font-bold">View by Categories</h3>
        </div>
        <div className="flex flex-col items-center">
          <label>Category</label>
          <select
            onChange={(e) =>
              setSelectedCategory((prev) => ({
                categoryId: e.target.value,
                subcategoryId: null,
              }))
            }
            defaultValue=""
            className="h-12 bg-gray-200 p-1"
          >
            <option value="all">All</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          {categories?.find(
            (category) => category.id === selectedCategory.categoryId,
          )?.subcategory.length ? (
            <div className="flex flex-col items-center">
              <label>Subcategory</label>
              <select
                onChange={(e) =>
                  setSelectedCategory((prev) => ({
                    ...prev,
                    subcategoryId: e.target.value,
                  }))
                }
                defaultValue={selectedCategory.subcategoryId ? "" : ""}
                className="h-12 bg-gray-200 p-1"
              >
                <option value="all">All</option>
                {categories
                  ?.find(
                    (category) => category.id === selectedCategory.categoryId,
                  )
                  ?.subcategory?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          <button
            onClick={() => setOpenPopup(true)}
            className="btn--red px-4 py-2"
          >
            Delete
          </button>
        </div>
      </div>
      <table className="mb-6 text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Category Id
            </th>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              RRP
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Delivery
            </th>
            <th scope="col" className="px-6 py-3">
              Attributes
            </th>
            <th scope="col" className="px-6 py-3">
              Stock
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td>
                <Spinner />
              </td>
            </tr>
          )}
          {slicedProducts?.map((product) => (
            <tr
              key={product.id}
              className={`border-b bg-white  decoration-red-600 dark:border-gray-700 dark:bg-gray-800`}
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium dark:text-white"
              >
                <label className=" line-clamp-3" htmlFor={product.id}>
                  <input
                    className="mr-"
                    name={product.id}
                    type="checkbox"
                    id={product.id}
                    value="value"
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedproducts((prev) => [...prev, product])
                        : setSelectedproducts((prev) =>
                            prev.filter((p) => p.id !== product.id),
                          )
                    }
                  />
                  {product.id.slice(0, 10)}...
                </label>
              </th>
              <td className="px-6 py-4 font-bold">{product.title}</td>
              <td className="px-6 py-4 font-bold">
                <p>
                  {
                    categories?.find(
                      (category) => category.id === product.categoryId,
                    )?.name
                  }
                </p>
                {categories
                  ?.find((category) => category.id === product.categoryId)
                  ?.subcategory.map((category, i, arr) => (
                    <span className="font-light" key={category.id}>
                      {category.name}
                      {i + 1 < arr.length && ","}
                    </span>
                  ))}
              </td>
              <td className="px-6 py-4">{product.type}</td>
              <td className="px-6 py-4 ">${product.rrp}</td>
              <td className="px-6 py-4 font-bold text-redPrimary">
                ${product.price}
              </td>
              <td className="px-6 py-4 font-bold">${product.delivery}</td>
              <td className="px-6 py-4 font-bold">
                {product.attributes &&
                  Object.entries(product.attributes as object)?.map(
                    (att, i, arr) => (
                      <span className="mr-1" key={i}>
                        {att[0]}
                        {i + 1 < arr.length && ","}
                      </span>
                    ),
                  )}
              </td>
              <td className="px-6 py-4 font-bold">{product.stock}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => setOpenForm(product)}
                  type="button"
                  className="rounded-lg bg-gray-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        {slicedProducts &&
          products &&
          slicedProducts.length < products.length && (
            <button
              onClick={() => {
                if (products) {
                  setSlicedProducts(
                    (products as ProductType[]).slice(0, productLength + 20),
                  );
                  setProductLength((prev) => prev + 20);
                }
              }}
              type="button"
              className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              More Products...
            </button>
          )}
      </div>
    </div>
  );
};

export default Product;
