const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

// Configure AWS credentials
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// File filter to accept only image types (jpeg, jpg, png)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed'), false);
  }
};

/**
 * Multer upload middleware using S3 for storage. Images are uploaded directly
 * to the configured S3 bucket under the `listings/` prefix. Uploaded files
 * will receive unique keys based on the current timestamp and original file
 * name to avoid collisions.
 */
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      cb(null, `listings/${filename}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // limit 5MB per file
});

module.exports = upload;