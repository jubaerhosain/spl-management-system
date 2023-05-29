import multer from "multer";
import path from "path";
import createError from "http-errors";
import { getDirname } from "./fileUtilities.js";

// move to a middleware =================================================================


/**
 * @param {*} fileName
 * @param {*} extension
 * @returns
 */
function formatFileName(fileName, extension) {
    const newFileName = fileName.toLowerCase().split(" ").join("-") + "-" + Date.now() + extension;
    return newFileName;
}

/**
 * @param {*} fileName - name of the file to be saved
 * @param {*} subfolder
 * @param {*} allowedTypes
 * @param {*} maxSize
 * @param {*} errorMessage
 * @returns Promise of upload object
 */
function fileUploader(fileName, subfolder, allowedTypes, maxSize, errorMessage) {
    return new Promise((resolve, reject) => {
        try {
            const uploadFolder = path.join(getDirname(import.meta.url), `../public/uploads/${subfolder}/`);

            // define storage
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, uploadFolder);
                },
                filename: (req, file, cb) => {
                    const formattedName = formatFileName(fileName, path.extname(file.originalname));
                    cb(null, formattedName);
                },
            });

            // final upload object
            const upload = multer({
                storage: storage,
                limits: {
                    fileSize: maxSize,
                },
                fileFilter: (req, file, cb) => {
                    if (allowedTypes.includes(file.mimetype)) {
                        cb(null, true);
                    } else {
                        cb(createError(errorMessage));
                    }
                },
            });

            resolve(upload);
        } catch (err) {
            reject(err);
        }
    });
}

export { fileUploader };
