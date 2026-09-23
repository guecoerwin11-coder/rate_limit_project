const validate = (schema) => (req, res, next) => {
    try {
        const results = schema.safeParse(req.body);

        if (!results.success) {
            // .flatten() groups errors automatically by field name
            const fieldErrors = results.error.flatten().fieldErrors;

            return res.status(409).json({
                success: false,
                errors: fieldErrors
            });
        }

        // Keep your data clean by updating req.body with the sanitized fields
        req.body = results.data;
        
        next();
    } catch (err) {
        // Pass unexpected code runtime errors down to your custom errorHandler
        next(err);
    }
};

module.exports = validate;
