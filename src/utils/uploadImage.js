/**
 * Uploads a raw file binary to ImgBB and returns the public CDN URL string.
 * @param {File} file - The file blob object captured from the input event.
 * @returns {Promise<string>} The hosted CDN target string location.
 */
export const uploadImageToImgBB = async (file) => {
  if (!file) return "";

  // Phase 1: Package the Binary
  const payload = new FormData();
  payload.append("image", file);

  // Phase 2: Dispatch to Cloud Gateway
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_BB_PUBLIC_API}`,
    { method: "POST", body: payload },
  );
  const result = await response.json();

  return result.success ? result.data.url : "";
};
