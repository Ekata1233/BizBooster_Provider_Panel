export const uploadToImageKit = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
  formData.append("folder", "/ads");

  const auth = btoa(`${process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_API_KEY!}:`);

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.url;
};
