// Cloudinary unsigned upload helper for client-side image uploads.
// Uses fetch + FormData and an unsigned upload preset. No API secret is used.

const CLOUD_NAME = 'da6w2v7hu';
const UPLOAD_PRESET = 'glps_staff_upload';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload an image file to Cloudinary using an unsigned preset.
 * @param {File} file - the image file to upload
 * @param {string} folder - optional destination folder name in Cloudinary
 * @returns {Promise<string>} - resolves with the secure_url from Cloudinary
 */
export async function uploadImage(file, folder = 'staff') {
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided. Expected a File object.');
  }

  // basic client-side validation
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    // Cloudinary returns JSON with upload details
    const data = await res.json();

    if (!res.ok) {
      const msg = data && data.error && data.error.message ? data.error.message : 'Upload failed';
      throw new Error(msg);
    }

    if (!data.secure_url) {
      throw new Error('Upload succeeded but no secure_url returned.');
    }

    return data.secure_url;
  } catch (err) {
    console.error('uploadImage error:', err);
    throw new Error('Image upload failed: ' + (err.message || err));
  }
}

/**
 * Placeholder for deleting an image from Cloudinary using its URL.
 * Deleting usually requires a signed request from a backend using the API secret.
 * This is intentionally unimplemented on the client.
 */
export async function deleteImageFromURL(imageURL) {
  console.warn('deleteImageFromURL placeholder called. Server-side deletion required.');
  throw new Error('deleteImageFromURL not implemented: requires server-side signed deletion.');
}
