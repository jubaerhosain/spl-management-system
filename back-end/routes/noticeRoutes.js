import express from "express";
const router = express.Router();

// Sample data (you might replace this with a database or other data source)
let notices = [];

router.post("/notice", (req, res) => {
    const newNotice = req.body.notice;
    notices.push(newNotice);
    res.status(201).json({ message: "Notice created successfully", notice: newNotice });
});

router.get("/notice", (req, res) => {
    const queryParam = req.query.splName;
    // Perform logic based on query parameters if needed

    // Return the list of notices (in this example, all notices)
    res.status(200).json({ notices });
});

router.get("/notice/:noticeId", (req, res) => {
    const noticeId = req.params.noticeId;
    const notice = notices.find((n) => n.id === noticeId);

    if (notice) {
        res.status(200).json({ notice });
    } else {
        res.status(404).json({ message: "Notice not found" });
    }
});

router.put("/notice/:noticeId", (req, res) => {
    const noticeId = req.params.noticeId;
    const updatedNotice = req.body.notice;

    // Perform logic to update the notice with the provided ID
    // (In this example, we're assuming each notice has a unique ID)

    res.status(200).json({ message: "Notice updated successfully", notice: updatedNotice });
});

module.exports = router;
