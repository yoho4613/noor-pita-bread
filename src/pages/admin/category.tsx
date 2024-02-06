import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import Spinner from "~/components/global/Spinner";
import { api } from "~/utils/api";

// interface categoryProps {}

const Category: FC = ({}) => {
  const {
    data: categories,
    isLoading,
    refetch,
  } = api.category.getAllCategories.useQuery();
  const { mutate: addCategory } = api.category.addCategory.useMutation({
    onSuccess: () => {
      refetch()
        .then((res) => res)
        .catch((err) => console.log(err));
      setFormName("");
      toast.success("sucessfully added subcategory");
    },
  });
  const [formName, setFormName] = useState("");
  return (
    <div>
      <div className="p-6">
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <input
            name="name"
            className="h-12 rounded-sm border-none bg-gray-200"
            type="text"
            placeholder="name"
            onChange={(e) => setFormName(e.target.value)}
            value={formName}
          />

          <button
            className="h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed"
            disabled={!formName}
            onClick={() => {
              addCategory({ name: formName });
            }}
          >
            Add Category
          </button>
        </div>
      </div>
      <table className="mb-6 w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Category Id
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              SubCategories
            </th>
            <th scope="col" className="px-6 py-3">
              Cancel
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td>
                <Spinner />
              </td>
            </tr>
          ) : categories?.length ? (
            categories.map((category) => (
              <tr
                key={category.id}
                className={`border-b bg-white  decoration-red-600 dark:border-gray-700 dark:bg-gray-800`}
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium dark:text-white"
                >
                  {category.id}
                </th>
                <td className="px-6 py-4 font-bold">{category.name}</td>
                <td className="line-clamp-4 px-6 py-4">
                  {category.subcategory?.map((category) => `${category.name},`)}
                </td>

                <td className="px-6 py-4">
                  <button
                    // onClick={() => cancelBooking(booking.id)}
                    type="button"
                    className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-4 text-lg font-bold">No Category...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
