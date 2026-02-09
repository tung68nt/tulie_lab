import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tulie Academy API',
            version: '1.0.0',
            description: 'API documentation for the Tulie LMS system',
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server',
            },
            {
                url: 'https://academy-api-863772349164.asia-southeast1.run.app',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        './src/modules/**/*.routes.ts',
        './src/modules/**/*.controller.ts',
        './dist/modules/**/*.routes.js',
        './dist/modules/**/*.controller.js'
    ], // Path to the API docs
};

// Safe swagger spec generation
export const getSwaggerSpec = () => {
    try {
        return swaggerJsdoc(options);
    } catch (err: any) {
        console.error('⚠️  Failed to generate Swagger spec:', err.message);
        return {
            openapi: '3.0.0',
            info: { title: 'Tulie Academy API (Error)', version: '1.0.0' },
            paths: {}
        };
    }
};

export const swaggerSpec = getSwaggerSpec();
