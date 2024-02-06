import { BannerPosition } from "@prisma/client";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import BannerUpdateForm from "~/components/admin/BannerUpdateForm";
import { BannerPositionType, BannerType } from "~/config/type";
import { MAX_FILE_SIZE } from "~/constant/config";
// import { selectOptions } from "~/utils/helpers";
import { api } from "~/utils/api";

type Input = {
  title: string;
  description: string;
  position: string;
  link: string;
  file: undefined | File;
};

const initialInput = {
  title: "",
  description: "",
  position: "",
  link: "",
  file: undefined,
};

const Menu: FC = ({}) => {
  const [input, setInput] = useState<Input>(initialInput);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [filteredBanners, setFilteredBanners] = useState<BannerType[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [formOpened, setFormOpened] = useState<BannerType | null>(null);
  const bannerPositions = BannerPosition;
  // tRPC
  const { mutateAsync: createPresignedUrl } =
    api.product.createPresignedUrl.useMutation();
  const { data: banners, refetch } = api.banner.getAllBanners.useQuery();
  const { mutateAsync: addBanner } = api.banner.addBanner.useMutation();
  const { mutateAsync: deleteBanner } = api.banner.deleteBanner.useMutation();

  useEffect(() => {
    if (banners) {
      if (selectedBanner) {
        setFilteredBanners(
          banners.filter((banner) => banner.position === selectedBanner),
        );
      } else {
        setFilteredBanners(banners);
      }
    }
  }, [selectedBanner, banners]);

  useEffect(() => {
    if (!input.file) return;

    // create the preview
    const objectUrl = URL.createObjectURL(input.file);
    setPreview(objectUrl);

    // clean up the preview
    return () => URL.revokeObjectURL(objectUrl);
  }, [input.file]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return setError("No File Selected");
    if (e.target.files[0].size > MAX_FILE_SIZE)
      return setError("File size is too big");

    setInput((prev) => ({ ...prev, file: e.target.files?.[0] }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const { fields, key, url } = (await createPresignedUrl({
      fileType: file.type,
    })) as { fields: string[]; key: string; url: string };

    const data = {
      ...fields,
      "Content-Type": file.type,
      file,
    };

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });

    await fetch(url, {
      method: "POST",
      body: formData,
    });

    return key;
  };

  const addMenuItem = async () => {
    const { file } = input;
    if (!file) return;
    const key = await handleImageUpload(input.file!);
    if (!key) throw new Error("No key");

    await addBanner({
      title: input.title,
      description: input.description,
      link: input.link,
      imgUrl: key,
      position: input.position as BannerPositionType,
    });

    refetch()
      .then((res) => res)
      .catch((err: Error) => console.log(err));

    // Reset input
    setInput(initialInput);
    setPreview("");
  };

  const handleDelete = async (imageKey: string, id: string) => {
    await deleteBanner({ id, imageKey });
    refetch()
      .then((res) => res)
      .catch((err: Error) => console.log(err));
  };

  return (
    <>
      <div className="p-6">
        {formOpened && (
          <div className="fixed left-0 top-10 z-10 h-screen w-screen">
            <BannerUpdateForm
              banner={formOpened}
              setFormOpened={setFormOpened}
              refetch={refetch}
            />
          </div>
        )}
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <input
            name="title"
            className="h-12 rounded-sm border-none bg-gray-200 p-1"
            type="text"
            placeholder="title"
            onChange={(e) =>
              setInput((prev) => ({ ...prev, title: e.target.value }))
            }
            value={input.title}
          />

          <textarea
            name="description"
            className="h-12 rounded-sm border-none bg-gray-200 p-1"
            placeholder="description"
            onChange={(e) =>
              setInput((prev) => ({ ...prev, description: e.target.value }))
            }
            value={input.description}
          />

          <input
            name="link"
            className="h-12 rounded-sm border-none bg-gray-200 p-1"
            type="text"
            placeholder="link https://"
            onChange={(e) =>
              setInput((prev) => ({ ...prev, link: e.target.value }))
            }
            value={input.link}
          />

          <label>Banner Position</label>
          <select
            onChange={(e) =>
              setInput((prev) => ({ ...prev, position: e.target.value }))
            }
            defaultValue=""
            className="border-2 p-1"
          >
            <option value="" disabled>
              Select Category
            </option>
            {Object.values(bannerPositions)?.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>

          {input.position !== "advertise" && (
            <div>
              <label
                htmlFor="file"
                className="relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none"
              >
                <span className="sr-only">File input</span>
                <div className="flex h-full items-center justify-center border-2 py-2">
                  <span>Select Image</span>
                </div>
                <input
                  name="file"
                  id="file"
                  onChange={handleFileSelect}
                  accept="image/jpeg image/png image/jpg"
                  type="file"
                  className="sr-only"
                />
              </label>
            </div>
          )}
          {preview && (
            <div className="relative h-60 w-full">
              <Image
                onClick={() => {
                  setPreview("");
                  setInput((prev) => ({ ...prev, file: undefined }));
                }}
                className="h-full w-full cursor-pointer"
                alt="preview"
                width={100}
                height={100}
                src={preview}
              />
            </div>
          )}
          <button
            className="h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed"
            disabled={
              !input.file ||
              !input.title ||
              !input.position ||
              !input.description
            }
            onClick={() => {
              addMenuItem()
                .then((res) => res)
                .catch((err: Error) => console.log(err));
            }}
          >
            Add Banner item
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="mx-auto mt-12 max-w-7xl">
          <div className="flex items-center gap-4">
            <p className="text-lg font-medium">Your Banners:</p>
            <div>
              <label>Find by Position</label>
              <select
                onChange={(e) => setSelectedBanner(e.target.value)}
                defaultValue=""
                className="border-2 p-1"
              >
                <option value="">All</option>
                {Object.values(bannerPositions)?.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {filteredBanners?.map((banner) => (
              <div
                key={banner.id}
                className="flex flex-col items-center justify-between border-2 sm:flex-row"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative h-40 w-40">
                    {banner.position !== "advertise" && (
                      <Image
                        priority
                        fill
                        alt={banner.title}
                        src={banner.url}
                      />
                    )}
                  </div>
                  <div className="flex h-40 flex-col justify-between">
                    <h3 className="font-bold">
                      Title: <span className="font-normal">{banner.title}</span>
                    </h3>
                    <p className="font-bold">
                      Description:
                      <span className="font-normal">{banner.description}</span>
                    </p>
                    <p className="font-bold">
                      Position:
                      <span className="font-normal">{banner.position}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFormOpened(banner)}
                    className="rounded-md bg-gray-400 px-4 py-2 text-sm text-whitePrimary"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(banner.imgUrl, banner.id)
                        .then((res) => res)
                        .catch((err: Error) => console.log(err));
                    }}
                    className="btn--red px-4 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
