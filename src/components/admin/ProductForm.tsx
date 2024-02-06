import {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import Image from "next/image";
import { MAX_FILE_SIZE } from "~/constant/config";
import { BiStar } from "react-icons/bi";
import { ProductType } from "~/config/type";
import { BsTrash } from "react-icons/bs";
import Spinner from "../global/Spinner";

interface ProductFormProps {
  product: ProductType;
  setOpenForm: Dispatch<SetStateAction<ProductType | null>>;
  /* eslint-disable-next-line */
  refetch: () => Promise<any>;
}

interface Attribute {
  title: string;
  options: string[];
}

const ProductForm: FC<ProductFormProps> = ({
  product,
  setOpenForm,
  refetch,
}) => {
  const { data: categories } = api.category.getAllCategories.useQuery();
  const { data: sales } = api.sale.getAllSales.useQuery();
  const { mutateAsync: createPresignedUrl } =
    api.product.createPresignedUrl.useMutation();
  const { mutate: addProduct } = api.product.addProduct.useMutation({
    onSuccess: () => {
      refetch()
        .then((res) => [])
        .catch((err) => console.log(err));
      setOpenForm(null);
      toast.success("sucessfully added Product");
      setError("");
      setPhotos([]);
      setLoading(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setLoading(false);
    },
  });
  const { mutate: updateProduct } = api.product.updateProduct.useMutation({
    onSuccess: () => {
      refetch()
        .then((res) => [])
        .catch((err) => console.log(err));
      setOpenForm(null);
      toast.success("sucessfully Updated Product");
      setError("");
      setPhotos([]);
      setLoading(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setLoading(false);
    },
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [form, setForm] = useState<ProductType>(product);
  const [existPreviews, setExistPreviews] = useState<string[]>(
    product.url ?? [],
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const [combinedPreviews, setCombinedPreviews] = useState<string[]>(
    existPreviews.concat(previews),
  );
  const [deletedPhotos, setDeletedPhotos] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [openSale, setOpenSale] = useState<boolean>(
    product.saleId ? true : false,
  );
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product.attributes) {
      for (const att in product.attributes) {
        setAttributes((prev) => [
          ...prev,
          {
            title: att,
            options: (product.attributes?.[att]) ?? [],
          },
        ]);
      }
    }
  }, []);

  useEffect(() => {
    if (!photos.length) return;
    // create the preview
    const objectUrl = photos?.map((img) => URL.createObjectURL(img));
    setPreviews(objectUrl);

    // clean up the preview
    () => objectUrl.map((img) => URL.revokeObjectURL(img)) || "";
  }, [photos]);

  useEffect(() => {
    setCombinedPreviews(existPreviews.concat(previews));
  }, [previews, existPreviews]);

  const handleImageUpload = async () => {
    if (!photos.length) {
      return setError("At least one image must be added");
    }
    const imageWithKeys: string[] = [];

    for (const photo of photos) {
      const { fields, key, url } = (await createPresignedUrl({
        fileType: photo.type,
      })) as { fields: string[]; key: string; url: string };

      const data = {
        ...fields,
        "Content-Type": photo.type,
        file: photo,
      };

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });

      await fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      imageWithKeys.push(key);
    }

    return imageWithKeys;
  };

  const addNewProduct = async () => {
    const {
      title,
      description,
      type,
      rrp,
      price,
      delivery,
      stock,
      categoryId,
    } = form;
    if (
      !categoryId ||
      !title ||
      !description ||
      !type ||
      !rrp ||
      !price ||
      !delivery ||
      !stock
    ) {
      return setError("Missing Information");
    }
    const key = await handleImageUpload();
    if (!key) throw new Error("No key");
    setLoading(true);

    addProduct({
      title,
      description,
      type,
      rrp,
      price,
      delivery,
      stock,
      categoryId,
      subcategoryId: form.subcategoryId ?? "",
      imgUrl: key,
      saleId: form.saleId ? form.saleId : "",
      attributes,
    });
  };

  const updateNewProduct = async () => {
    const {
      title,
      description,
      type,
      rrp,
      price,
      delivery,
      stock,
      categoryId,
      id,
    } = form;
    if (
      !categoryId ||
      !title ||
      !description ||
      !type ||
      !rrp ||
      !price ||
      !stock ||
      !delivery ||
      !id
    ) {
      return setError("Missing Information");
    }
    const key = await handleImageUpload();
    if (!key) throw new Error("No key");

    setLoading(true);
    updateProduct({
      id,
      title,
      description,
      type,
      rrp,
      price,
      delivery,
      stock,
      categoryId,
      subcategoryId: form.subcategoryId ?? "",
      saleId: form.saleId ? form.saleId : "",
      attributes,
      deleteImg: product.imgUrl.filter((key) => deletedPhotos.includes(key)),
      imgUrl: [
        ...product.imgUrl.filter((key) => !deletedPhotos.includes(key)),
        ...key,
      ],
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return setError("No File Selected");
    if (e.target.files[0].size > MAX_FILE_SIZE) {
      return setError("File size is too big");
    }

    setPhotos((prev) => [...prev, e.target.files![0]!]);
  };

  const handleRemovePreview = (img: string, e: MouseEvent) => {
    const div = e.currentTarget.parentElement;
    div?.classList.add("opacity-0");
    setTimeout(() => {
      div?.classList.remove("opacity-0");
      const existImg = existPreviews.find((url) => url === img);
      if (existImg) {
        setDeletedPhotos((prev) => [...prev, img]);
      }
      setExistPreviews((prev) => prev.filter((url) => url !== img));
      setPreviews((prev) =>
        prev.filter((url, i) => {
          if (url === img) {
            setPhotos((prev) => prev.filter((photo, index) => i !== index));
            return false;
          } else {
            return true;
          }
        }),
      );
    }, 500);
  };

  const AttributeForm = ({ index, att }: { index: number; att: Attribute }) => {
    const [attribute, setAttribute] = useState<Attribute>(
      att || {
        title: "",
        options: [],
      },
    );
    useEffect(() => {
      if (attributes) {
        setAttribute(attributes[index]!);
      }
    }, [index]);
    const [input, setInput] = useState("");
    return (
      <div className="flex h-24 items-start">
        <div className="flex flex-col items-center">
          <label>Title</label>
          <input
            name="name"
            className="h-12 rounded-sm border-none bg-gray-200 p-1"
            type="text"
            placeholder="name"
            onChange={(e) => {
              setAttribute((prev) => ({ ...prev, title: e.target.value }));
            }}
            value={attribute.title}
          />
        </div>
        <div className="flex h-full flex-col items-center">
          <h4>Options</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAttribute((prev) => ({
                ...prev,
                options: [...prev.options, input],
              }));
              setAttributes((prev) =>
                prev.map((att, i) =>
                  i === index
                    ? {
                        title: attribute.title,
                        options: [...att.options, input],
                      }
                    : att,
                ),
              );
              setInput("");
            }}
          >
            <input
              name="name"
              className="rounded-sm border-2 p-1"
              type="text"
              placeholder="name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button className="h-full w-12 bg-buttonGreen">Add</button>
          </form>
          <p className="h-full w-full border-2">
            {attribute.options.map((option, i) => (
              <button
                className="border-2 p-1"
                onClick={() =>
                  setAttribute((prev) => ({
                    ...prev,
                    options: prev.options.filter((el) => el !== option),
                  }))
                }
                key={i}
              >
                {option}
              </button>
            ))}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="p-6">
        {loading && (
          <div className="fixed left-1/2 top-1/2 z-40 h-screen w-screen">
            <Spinner />
          </div>
        )}
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <label>Title</label>
          <input
            name="name"
            className="h-12 rounded-sm border-none bg-gray-200 p-1"
            type="text"
            placeholder="name"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            value={form.title}
          />
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center rounded-sm">
              <label>Category</label>
              <select
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                }
                defaultValue={product.categoryId ?? ""}
                className="h-12 bg-gray-200 p-1"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {categories?.find((category) => category.id === form.categoryId)
              ?.subcategory.length ? (
              <div className="flex flex-col items-center">
                <label>Subcategory</label>
                <select
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      subcategoryId: e.target.value,
                    }))
                  }
                  defaultValue={product.subcategoryId ?? ""}
                  className="h-12 bg-gray-200 p-1"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories
                    ?.find((category) => category.id === form.categoryId)
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
            <div className="flex flex-col items-center">
              <label>Type</label>
              <input
                name="name"
                className="h-12 rounded-sm border-none bg-gray-200 p-1"
                type="text"
                placeholder="type"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value }))
                }
                value={form.type}
              />
            </div>
          </div>

          <label>Description</label>
          <textarea
            className="rounded-sm border-none bg-gray-200 p-1"
            rows={6}
            placeholder="description..."
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            value={form.description}
          />

          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center rounded-sm">
              <label>RRP</label>
              <input
                className="h-12 rounded-sm border-none bg-gray-200 p-1"
                type="number"
                placeholder="price for original"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, rrp: e.target.value }))
                }
                value={form.rrp}
              />
            </div>
            <div className="flex flex-col items-center rounded-sm">
              <label>Price</label>
              <input
                className="h-12 rounded-sm border-none bg-gray-200 p-1"
                type="number"
                placeholder="Actual Price to Sell"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                value={form.price}
              />
            </div>
            <div className="flex flex-col items-center rounded-sm">
              <label>Stock</label>
              <input
                className="h-12 rounded-sm border-none bg-gray-200 p-1"
                type="number"
                placeholder="Available Stocks"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    stock: Number(e.target.value),
                  }))
                }
                value={form.stock}
              />
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row ${
              !openSale ? "sm:justify-start" : "sm:justify-between"
            }`}
          >
            <div className="flex flex-col items-center rounded-sm">
              <label>Delivery Price</label>
              <input
                className="h-12 rounded-sm border-none bg-gray-200 p-1"
                type="number"
                placeholder="price for original"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    delivery: Number(e.target.value),
                  }))
                }
                value={form.delivery ?? 0}
              />
            </div>

            <div className="flex flex-col items-center justify-center justify-self-start rounded-sm">
              <button
                onClick={() => setOpenSale((prev) => !prev)}
                className={`rounded-md ${
                  !openSale
                    ? "ml-6 mt-4 bg-green-300 hover:bg-buttonGreen"
                    : "bg-red-500 hover:bg-redPrimary"
                } px-4 py-1.5 `}
              >
                {!openSale ? (
                  <span>Make it on Sale </span>
                ) : (
                  <span> Remove Sale</span>
                )}
              </button>
            </div>

            {openSale ? (
              <div className="flex flex-col items-center rounded-sm">
                <label>Available Sales</label>
                <select
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      saleId: e.target.value,
                    }))
                  }
                  defaultValue={product.saleId ?? ""}
                  className="h-12 bg-gray-200 p-1"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {sales?.map((sale) => (
                    <option key={sale.id} value={sale.id}>
                      {sale.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-sm"></div>
            )}
          </div>

          <h4>Optional Attributes</h4>
          <button
            onClick={() =>
              setAttributes((prev) => [...prev, { title: "", options: [] }])
            }
            className="self-end rounded-md bg-buttonGreen px-4 py-2"
          >
            Add Attribute
          </button>
          {attributes.length
            ? attributes.map((att, i) => (
                <div key={i} className="flex items-start justify-between">
                  <AttributeForm att={att} index={i} />
                  <div>
                    <h4 className="text-center">Action</h4>
                    <button
                      onClick={() =>
                        setAttributes((prev) => {
                          const attributes = [...prev];
                          attributes.splice(i, 1);
                          return attributes;
                        })
                      }
                      className="btn--red px-4 py-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            : ""}

          <label
            htmlFor="file"
            className="relative flex h-12 cursor-pointer items-center justify-center rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none"
          >
            <span>Select image</span>
            <input
              name="file"
              id="file"
              onChange={handleFileSelect}
              accept="image/jpeg image/png image/jpg"
              type="file"
              className="sr-only"
            />
          </label>
          {combinedPreviews.length ? (
            <div>
              <span className="sr-only">File input</span>
              <div className="flex h-full items-center justify-center">
                <div className="relative flex h-3/4 w-full flex-wrap justify-evenly gap-4 border-2">
                  {combinedPreviews.map((img, i) => (
                    <div
                      key={i}
                      className="group/bin relative flex items-center bg-slate-500 transition-all duration-300"
                    >
                      <Image
                        onClick={(e) => {
                          handleRemovePreview(img, e);
                        }}
                        className="w-32 hover:cursor-pointer"
                        key={img}
                        alt="preview"
                        // style={{ objectFit: "contain" }}
                        width={100}
                        height={100}
                        src={img}
                      />
                      <button
                        onClick={(e) => handleRemovePreview(img, e)}
                        className="invisible absolute right-1/2 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-whitePrimary p-1.5 group-hover/bin:visible"
                      >
                        <BsTrash color="red" size={20} />
                      </button>
                      {i === 0 && (
                        <span className="group/item absolute right-2 top-2 z-10 p-1">
                          <BiStar color="red" />
                          <span className="invisible absolute left-0 top-0 border-2 bg-slate-400 p-1 text-xs text-whitePrimary group-hover/item:visible">
                            This is Main Photo for This Product
                          </span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {error && <p className="text-redPrimary">{error}</p>}
          {product.id ? (
            <button
              className="h-12 rounded-sm bg-yellow-300 hover:bg-yellow-400 disabled:cursor-not-allowed"
              // disabled={!formName}
              onClick={() => {
                updateNewProduct()
                  .then((res) => res)
                  .catch((err) => console.log(err));
              }}
            >
              Update Product
            </button>
          ) : (
            <button
              className="h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed"
              // disabled={!formName}
              onClick={() => {
                addNewProduct()
                  .then((res) => res)
                  .catch((err) => console.log(err));
              }}
            >
              Add Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
