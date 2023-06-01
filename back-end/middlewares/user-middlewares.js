import { fileUploader } from "../utilities/file-utilities.js";

/**
 * Uploads avatar using multer
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function uploadAvatar(req, res, next) {
    const upload = await fileUploader(
        new String(req.user.userId),
        "avatars",
        ["image/jpeg", "image/jpg", "image/png", "image/gif"],
        20000000,
        "Only jpeg, jpg, png, and gif are supported."
    );

    // call the middleware function
    upload.single("avatar")(req, res, (err) => {
        if (err) {
            res.status(500).json({
                errors: {
                    avatar: {
                        msg: err.message,
                    },
                },
            });
        } else {
            next();
        }
    });
}
