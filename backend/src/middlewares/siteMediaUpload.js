const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary'); // Adjust path if needed

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'site_media',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'],
    resource_type: 'auto', // Critical for videos
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } });

const siteMediaUpload = upload.fields([
  { name: 'desktop_media', maxCount: 1 },
  { name: 'mobile_media', maxCount: 1 }
]);

module.exports = siteMediaUpload;
