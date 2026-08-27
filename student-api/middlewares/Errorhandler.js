import logger from "../utils/logger.js";

export const ErrorHandler = async (err, req, res) => {

    console.log(err)


    // Also log to console for development

    // Log error details with winston logger
    const errorDetails = {
        timestamp: new Date().toISOString(),
        method: req?.method,
        url: req?.originalUrl,
        userAgent: req?.get('User-Agent'),
        ip: req?.ip || req?.connection?.remoteAddress,
        body: req?.body,
        params: req?.params,
        query: req?.query,
        error: {
            name: err?.name,
            message: err?.message,
            stack: err?.stack,
            status: err?.status || err?.statusCode
        }
    };

    // Log to error.log file only if it's a server error (500+)
    if (err.status >= 500 || err.statusCode >= 500 || !err.status) {
        logger.error('Server Error', errorDetails);
    } else {
        logger.info('Client Error', errorDetails);
    }



    // Define client errors (safe to expose to frontend)
    const clientErrors = [
        'ValidationError',
        'JsonWebTokenError',
        'TokenExpiredError',
        'MulterError'
    ];

    // Define server errors (should be hidden from frontend)
    const serverErrors = [
        'PrismaClientValidationError',
        'PrismaClientKnownRequestError',
        'PrismaClientUnknownRequestError',
        'PrismaClientRustPanicError',
        'PrismaClientInitializationError',
        'TypeError',
        'ReferenceError',
        'SyntaxError'
    ];

    // Handle client errors (expose actual error)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            code: 'VALIDATION_ERROR',
            errors: err.details || err.message
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token - please login again',
            code: 'INVALID_TOKEN'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired - please login again',
            code: 'TOKEN_EXPIRED'
        });
    }

    // Handle authentication/authorization errors (client errors)
    if (err.status === 401 || err.statusCode === 401) {
        return res.status(401).json({
            message: err.message || 'Authentication required - please login again',
            code: err.code || 'AUTH_REQUIRED'
        });
    }

    if (err.status === 403 || err.statusCode === 403) {
        return res.status(403).json({
            message: err.message || 'Access denied - insufficient permissions',
            code: err.code || 'ACCESS_DENIED'
        });
    }

    // Handle client 4xx errors (user input errors)
    if ((err.status >= 400 && err.status < 500) || (err.statusCode >= 400 && err.statusCode < 500)) {
        return res.status(err.status || err.statusCode || 400).json({
            message: err.message || 'Bad request',
            code: err.code || 'CLIENT_ERROR'
        });
    }

    // Handle server errors (hide details from frontend)
    if (serverErrors.includes(err.name) || err.status >= 500 || err.statusCode >= 500 || !err.status) {
        return res.status(500).json({
            success:false,
            message: 'An unexpected error occurred. Please try again later.',
            code: 'INTERNAL_SERVER_ERROR'
        });
    }

    // Default fallback (treat as server error)
  return  res.status(500).json({
        success:false,
        message: 'An unexpected error occurred. Please try again later.',
        code: 'UNKNOWN_ERROR'
    });
}