import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dzccxy3qd',
  api_key: '694755121692284',
  api_secret: 'yF4VmJkaJpUdsNkWB7avgacn97I',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

export const clearFile = (public_id) => cloudinary.uploader.destroy(public_id);

export default upload;
