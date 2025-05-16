const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const QUALITY = 0.6;
const MAX_BASE64_SIZE = 1 * 1024 * 1024;

export const optimizeImage = async (file: File): Promise<File> => {
  try {
    if (file.size <= MAX_BASE64_SIZE) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas context not available');
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          
          ctx.drawImage(img, 0, 0, width, height);

          const tryCompress = (quality: number): Promise<Blob> => {
            return new Promise((resolve, reject) => {
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    reject(new Error('Failed to compress image'));
                    return;
                  }
                  resolve(blob);
                },
                'image/jpeg',
                quality
              );
            });
          };

          const compressWithQuality = async (quality: number): Promise<File> => {
            const blob = await tryCompress(quality);
            if (blob.size <= MAX_BASE64_SIZE) {
              return new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
            }
            if (quality <= 0.3) {
              throw new Error('Unable to compress image to required size');
            }
            return compressWithQuality(quality - 0.1);
          };

          compressWithQuality(QUALITY)
            .then((optimizedFile) => {
              resolve(optimizedFile);
            })
            .catch((error) => {
              reject(error);
            })
            .finally(() => {
              URL.revokeObjectURL(objectUrl);
            });
        } catch (error) {
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };

      img.onerror = (error) => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image: ' + error));
      };

      img.src = objectUrl;
    });
  } catch (error) {
    throw error;
  }
};

export const validateImageSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const getFileSizeInMB = (bytes: number): string => {
  return (bytes / (1024 * 1024)).toFixed(2);
}; 