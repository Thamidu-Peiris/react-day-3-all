export const validate = (shema) => (req, res, next) => {
    try {
        req.body = shema.parse(req.body);
        next();
    } catch (error) {
        const parsed = JSON.parse(error.message);

        const errorMessages = parsed.map((e) => ({
            field: e.path[0],
            message: e.message,
        }));

        console.log(errorMessages);

        return res.status(400).json({
            success: false,
            message: "Validation faild",
            errors: errorMessages,
        });
    }
};

export const validateParams = (shema) => (req, res, next) => {
    try {
        req.params = shema.parse(req.params);
        next();
    } catch (error) {
        const parsed = JSON.parse(error.message);

        const errorMessages = parsed.map((e) => ({
            field: e.path[0],
            message: e.message,
        }));

        console.log(errorMessages);

        return res.status(400).json({
            success: false,
            message: "Validation faild",
            errors: errorMessages,
        });
    }
};
