import express from "express";
import multer from "multer";
import {
  distributeTasks,
  getTasks,
  previewUpload,
} from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

const allowedExtensions = [".csv", ".xls", ".xlsx"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase();
    const isAllowed = allowedExtensions.some((extension) => fileName.endsWith(extension));

    if (!isAllowed) {
      return cb(new Error("Only CSV, XLS, and XLSX files are allowed"));
    }

    cb(null, true);
  },
});

const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};

router.use(protect);

router.post("/upload/preview", handleUpload, previewUpload);
router.post("/upload/distribute", distributeTasks);
router.get("/tasks", getTasks);

export default router;
