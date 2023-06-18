import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function getFileName(metaUrl) {
    const __filename = fileURLToPath(metaUrl);

    return __filename;
}

/**
 *
 * @param {String} metaUrl import.meta.url
 * @returns dirname
 */
function getDirectoryName(metaUrl) {
    const __dirname = path.dirname(getFileName(metaUrl));

    return __dirname;
}

/**
 * Custom function to write credentials to a file
 * @param {*} data
 */
function writeCredentials(data) {
    fs.appendFileSync("credentials.txt", data + "\n\n", "utf8");
}

/**
 * Replace all spaces with hyphens and add current time
 * @param {*} fileName
 * @param {*} extension
 * @returns Formatted File Name
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
            const uploadFolder = path.join(
                getDirname(import.meta.url),
                `../public/uploads/${subfolder}/`
            );

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


export default {
    getDirectoryName,
    writeCredentials,
    fileUploader,
}