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
