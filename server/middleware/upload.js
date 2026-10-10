import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists securely within server/uploads
const uploadDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration with filename sanitization
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const safeExt = safeExtensions.includes(ext) ? ext : '.bin';
    cb(null, `nc-doc-${uniqueSuffix}${safeExt}`);
  },
});

// File Filter (Images & Documents strictly whitelisted; SVG rejected to prevent SVG XSS injection)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Unsupported file format. Permitted formats: JPEG, PNG, WEBP, and PDF documents.');
    error.status = 400;
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 3, // Maximum 3 attachments per submission
  },
  fileFilter,
});

export default upload;
