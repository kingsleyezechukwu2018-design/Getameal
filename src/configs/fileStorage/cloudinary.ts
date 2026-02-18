import { v2 as cloudinary } from "cloudinary";
import appConfig from "configs";

const { cloudinaryApiKey, cloudinaryApiSecret, cloudinaryCloudName } =
  appConfig;

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

export default cloudinary;
