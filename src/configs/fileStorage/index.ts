import fs from "fs";
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
  const streamUpload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: resourceType,
          ...(publicId && { public_id: publicId }),
          overwrite: publicId ? true : false,
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        },
      );

      fs.createReadStream(file.buffer).pipe(stream);
    });

  const result: any = await streamUpload();
  return result;
}
