const validateEnv = () => {
    const requiredEnvVars = [
        'PORT',
        'MONGO_URI',
        'JWT_SECRET',
        'JWT_EXPIRE',
        'CORS_ORIGIN'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
};

const config = {
    server: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development'
    },
    db: {
        uri: process.env.MONGO_URI
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expire: process.env.JWT_EXPIRE
    },
    cors: {
        origin: process.env.CORS_ORIGIN
    },
    upload: {
        path: process.env.UPLOAD_PATH || 'uploads',
        maxSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5000000
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: process.env.ADMIN_NAME
    }
};

// Validate environment variables
validateEnv();

module.exports = config;