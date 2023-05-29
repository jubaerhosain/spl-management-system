function notFoundHandler(req, res, next) {
    res.status(404).json({
        message: "Add response class with error code",
    });
}

function defaultErrorHandler(err, req, res, next) {
    // err = process.env.NODE_ENV == "development" ? err : {errors: err.message};
    console.log(err.status || 500, err.message);
    res.status(err.status || 500).json({
        errors: {
            message: "Add custom error class message",
        },
    });
}

export { notFoundHandler, defaultErrorHandler };
