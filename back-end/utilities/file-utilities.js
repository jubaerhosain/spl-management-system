import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function getFileName(metaUrl) {
    const __filename = fileURLToPath(metaUrl);

    return __filename;
}

export function getDirectoryName(metaUrl) {
    const __dirname = path.dirname(getFileName(metaUrl));

    return __dirname;
}

/**
 * Custom function to write credentials to a file
 * @param {*} data
 */
export function writeCredentials(data) {
    fs.appendFileSync("credentials.txt", data + "\n\n", "utf8");
}
