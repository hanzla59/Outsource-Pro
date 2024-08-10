const express = require('express');
const mongoose = require('mongoose');
const router = require('./Routes/userRoutes');
const errorHandler = require('./MiddleWare/errorHandler');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
dotenv.config({path: './.env'});
const PORT = 4000;

// Swagger
const swaggerJSDocs = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

mongoose.connect(process.env.database_url)
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });


// Swagger Options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Outsource Pro Api documentation",
            version: "1.0.0",
            description: "API documentation for Outsource Work"
        },
        servers: [
            {
                url: "http://localhost:4000",
                description: "API documentation for Outsource Work"
            }
        ],

    },
    apis: ["./Routes/*.js"]
}

const specs = swaggerJSDocs(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
    res.status(201).json("Welcome to the clone of Upwork");
});

app.use(cookieParser());
app.use(express.json()); 
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});