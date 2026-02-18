import cloudinary from "./cloudinary";

export async function uploadImage({
  publicId,
  file,
  folderName,
  resourceType = "image",
}: {
  publicId?: string;
  file: Express.Multer.File;
  folderName: string;
  resourceType?: "image" | "video" | "raw";
}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: resourceType,
        ...(publicId && { public_id: publicId }),
        overwrite: !!publicId,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(file.buffer); 
  });
}
