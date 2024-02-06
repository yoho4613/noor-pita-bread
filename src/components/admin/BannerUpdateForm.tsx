import { BannerPosition } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BannerPositionType, BannerType } from "~/config/type";
import { MAX_FILE_SIZE } from "~/constant/config";
import { api } from "~/utils/api";

const BannerUpdateForm = ({
  banner,
  setFormOpened,
  refetch,
}: {
  banner: BannerType;
  setFormOpened: React.Dispatch<React.SetStateAction<BannerType | null>>;
  /* eslint-disable-next-line */
  refetch: () => Promise<any>;
}) => {
  const [form, setForm] = useState({ ...banner });
  const [fileInput, setFileInput] = useState<File | undefined>(undefined);
  const [formPreview, setFormPreview] = useState("");
  const [error, setError] = useState("");
  const { mutateAsync: createPresignedUrl } =
    api.product.createPresignedUrl.useMutation();
  const { mutate: updateBannerItem } = api.banner.updateBanner.useMutation({
    onSuccess: () => {
      refetch()
        /* eslint-disable-next-line */
        .then((res) => res)
        .catch((err: Error) => console.log(err));

      toast.success("Successfully updated Banner");
      // Reset input
      setFormOpened(null);
      setFormPreview("");
    },
  });
  const bannerPositions = BannerPosition;

  useEffect(() => {
    if (!fileInput) return;

    // create the preview
    const objectUrl = URL.createObjectURL(fileInput);
    setFormPreview(objectUrl);

    // clean up the preview
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileInput]);

  const handleFormFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return setError("No File Selected");
    if (e.target.files[0].size > MAX_FILE_SIZE)
      return setError("File size is too big");

    setFileInput(e.target.files?.[0]);
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

  const updateBanner = async () => {
    if (!fileInput && !form.url) {
      setError("Missing Information");
    }
    const key = fileInput ? await handleImageUpload(fileInput) : null;

    updateBannerItem({
      id: form.id,
      title: form.title,
      description: form.description,
      link: form.link,
      imgUrl: key ?? form.imgUrl,
      position: form.position,
    });
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2 overflow-hidden border-2 bg-gray-300 p-4 dark:bg-buttonBlack">
      <h2 className="text-2xl font-bold">Update Banner</h2>
      <div className="flex items-center gap-2">
        <label htmlFor="">Title</label>
        <input
          name="title"
          className="h-12 grow rounded-sm border-none bg-gray-200 p-1"
          type="text"
          placeholder="title"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          value={form.title}
        />
      </div>

      <div className="flex items-center gap-2">
        <label>Description</label>
        <textarea
          name="description"
          rows={6}
          className="h-12 grow rounded-sm border-none bg-gray-200 p-1"
          placeholder="description"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          value={form.description}
        />
      </div>
      <div className="flex items-center gap-2">
        <label>Link</label>
        <input
          name="link"
          className="h-12 grow rounded-sm border-none bg-gray-200 p-1"
          type="text"
          placeholder="link https://"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, link: e.target.value }))
          }
          value={form.link}
        />
      </div>
      <label>Banner Position</label>
      <select
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            position: e.target.value as BannerPosition,
          }))
        }
        defaultValue={form.position}
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

      {form.position !== "advertise" && (
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
              onChange={handleFormFileSelect}
              accept="image/jpeg image/png image/jpg"
              type="file"
              className="sr-only"
            />
          </label>
        </div>
      )}
      {formPreview || form.url ? (
        <div className="relative h-60 w-full">
          <Image
            onClick={() => {
              setFormPreview("");
              setFileInput(undefined);
              setForm((prev) => ({ ...prev, url: "", imgUrl: "" }));
            }}
            className="h-full w-full cursor-pointer"
            alt="preview"
            width={100}
            height={100}
            src={formPreview ? formPreview : form.url}
          />
        </div>
      ) : (
        ""
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        className="h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed"
        disabled={
          (!fileInput && !banner.url && !banner.imgUrl) ||
          !form.title ||
          !form.position ||
          !form.description
        }
        onClick={() => {
          updateBanner()
            .then((res) => res)
            .catch((err: Error) => console.log(err));
        }}
      >
        Update Banner
      </button>
      <button
        className="btn--red px-4 py-2"
        onClick={() => setFormOpened(null)}
      >
        Cancel
      </button>
    </div>
  );
};

export default BannerUpdateForm;
