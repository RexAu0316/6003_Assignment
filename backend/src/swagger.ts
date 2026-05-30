import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CinemaVault API',
            version: '1.0.0',
            description: 'RESTful API for CinemaVault film platform',
            contact: {
                name: 'API Support',
                email: 'support@cinemavault.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5001/api',
                description: 'Development server',
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
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'admin'] },
                        profile_photo: { type: 'string', nullable: true },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Film: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        genre: { type: 'string', nullable: true },
                        year: { type: 'integer', nullable: true },
                        rating: { type: 'number', format: 'float', nullable: true },
                        description: { type: 'string', nullable: true },
                        poster_url: { type: 'string', nullable: true },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'], // 扫描路由文件中的注释
};

const specs = swaggerJsdoc(options);
export default specs;