export const validateForm = (schema, data) => {
    try {
        const parsed = schema.parse(data);
        return {
            success: true,
            data: parsed,
            errors: {},
        };
    } catch (error) {
        const parsed = JSON.parse(error.message);

        const errors = parsed.reduce((acc, item) => {
            acc[item.path[0]] = item.message;
            return acc;
        }, {});

        return {
            success: false,
            data: null,
            errors,
        };
    }
};
