// swagger-autogen.js or .ts
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Inventory Management API',
        description: 'Auto-generated docs',
    },
    host: 'localhost:3005',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.ts']; // Adjust as needed

swaggerAutogen(outputFile, endpointsFiles, doc);
