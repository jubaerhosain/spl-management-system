async function getCurrentSPL(req, res) {
    try {
        const { studentId } = req.params;
        const spl = await studentService.getCurrentSPL(studentId);
        res.json(GenericResponse.success("Retrieved successfully", spl));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while updating account"));
        }
    }
}

async function getAllSPL(req, res) {}

export { getCurrentSPL, getAllSPL };
