import { RouteError } from "configs/errors";
import multer from "multer";
import { Request } from "express";

const fileFilter: multer.Options["fileFilter"] = (req: Request, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new RouteError("Only image files are allowed"));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});
export default upload;