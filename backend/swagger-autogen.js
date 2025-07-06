// swagger-autogen.js or .ts
var swaggerAutogen = require('swagger-autogen')();
var doc = {
    info: {
        title: 'Inventory Management API',
        description: 'Auto-generated docs',
    },
    host: 'localhost:3005',
    schemes: ['http'],
};
var outputFile = './swagger-output.json';
var endpointsFiles = ['./routes/index.ts']; // Adjust as needed
swaggerAutogen(outputFile, endpointsFiles, doc);
