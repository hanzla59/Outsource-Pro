const express = require('express');
const userController = require('../Controllers/userController');
const jobController = require('../Controllers/jobController');
const proposalController = require("../Controllers/proposalController");
const router = express.Router();
const auth = require('../MiddleWare/auth');
const orderController = require('../Controllers/orderController');

//user Routes
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: User registration data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - role
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 15
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [client, freelancer]
 *               password:
 *                 type: string
 *                 pattern: ^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 *                 auth:
 *                   type: boolean
 *       401:
 *         description: Username or email already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [client, freelancer]
 *         createdAt:
 *           type: string
 *           format: date-time
 */

router.post("/register", userController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a JSON Web Token
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: User login credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 15
 *               password:
 *                 type: string
 *                 pattern: ^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$
 *     responses:
 *       201:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 *                 auth:
 *                   type: boolean
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [client, freelancer]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout a user
 *     description: Revoke the user's JSON Web Token and clear the cookie
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 auth:
 *                   type: boolean
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 */
router.get("/logout",auth, userController.logout);

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user information
 *     description: Update user information by providing a JWT token in the cookie.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       description: User information to be updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 15
 *                 description: The user's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 pattern: ^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$
 *                 description: The user's password
 *               name:
 *                 type: string
 *                 maxLength: 30
 *                 description: The user's name
 *               bio:
 *                 type: string
 *                 description: The user's bio
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The user's skills
 *               hourlyrate:
 *                 type: string
 *                 description: The user's hourly rate
 *     responses:
 *       201:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized Access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         hourlyrate:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
router.put("/user/update",auth, userController.update);
/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete user account
 *     description: Delete user account by providing a JWT token in the cookie.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: User account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User Account Delete Successfully"
 *       401:
 *         description: Unauthorized Access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 */
router.delete("/user/delete",auth, userController.delete);
router.get("/user", userController.allUser);

//Job Routes

/**
 * @swagger
 * /job/create:
 *   post:
 *     summary: Create a new job by a client
 *     description: Create a new job by a client, providing a JWT token in the cookie.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       description: Job details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - budget
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 description: The job title
 *               description:
 *                 type: string
 *                 minLength: 50
 *                 description: The job description
 *               budget:
 *                 type: number
 *                 description: The job budget
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: The job deadline
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Job:
 *                   $ref: '#/components/schemas/JobDTO'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized Access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *   schemas:
 *     JobDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         budget:
 *           type: number
 *         deadline:
 *           type: string
 *           format: date
 *         client:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
router.post("/job/create", auth, jobController.create);

/**
 * @swagger
 * /job/update/{id}:
 *   put:
 *     summary: Update a job by a client
 *     description: Update a job by a client, providing a JWT token in the cookie.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to update
 *     requestBody:
 *       description: Job details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the job
 *               description:
 *                 type: string
 *                 description: The new description of the job
 *               budget:
 *                 type: number
 *                 description: The new budget of the job
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: The new deadline of the job
 *               status:
 *                 type: string
 *                 enum: ['open', 'inprogress', 'complete', 'close']
 *                 description: The new status of the job
 *     responses:
 *       201:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/JobDTO'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized Access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 */
router.put("/job/update/:id", auth, jobController.update);
/**
 * @swagger
 * /job/delete/{id}:
 *   delete:
 *     summary: Delete a job by a client
 *     description: Delete a job by a client, providing a JWT token in the cookie. Also, delete all proposals sent to that job.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to delete
 *     responses:
 *       201:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized Access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 */
router.delete("/job/delete/:id", auth, jobController.delete);

/**
 * @swagger
 * /job/myjob:
 *   get:
 *     summary: Get all jobs posted by the current user
 *     description: Get all jobs posted by the current user, providing a JWT token in the cookie.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobDTO'
 *       401:
 *         description: Unauthorized Access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *   schemas:
 *     JobDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         budget:
 *           type: number
 *         deadline:
 *           type: string
 *           format: date
 *         client:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
router.get("/job/myjob", auth, jobController.getbyuser);

/**
 * @swagger
 * /job/{id}:
 *   get:
 *     summary: Get a job by ID
 *     description: Get a job by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to retrieve
 *     responses:
 *       201:
 *         description: Job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobDTO'
 *       401:
 *         description: Job does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     JobDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         budget:
 *           type: number
 *         deadline:
 *           type: string
 *           format: date
 *         client:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
router.get("/job/:id", jobController.getbyid);
/**
 * @swagger
 * /job:
 *   get:
 *     summary: Get all listed jobs
 *     description: Get all listed jobs.
 *     responses:
 *       201:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobDTO'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     JobDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         budget:
 *           type: number
 *         deadline:
 *           type: string
 *           format: date
 *         client:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
router.get("/job", jobController.getall);

//propsal Routes
/**
 * @swagger
 * /proposal/{id}:
 *   post:
 *     summary: Create a proposal for a job
 *     description: Create a proposal for a job.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to create a proposal for
 *     requestBody:
 *       description: Proposal details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coverLetter
 *               - proposeRate
 *             properties:
 *               coverLetter:
 *                 type: string
 *                 description: Cover letter for the proposal
 *               proposeRate:
 *                 type: number
 *                 description: Proposed rate for the job
 *     responses:
 *       201:
 *         description: Proposal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 proposal:
 *                   $ref: '#/components/schemas/Proposal'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden access or job does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Proposal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         job:
 *           type: string
 *         freelancer:
 *           type: string
 *         coverLetter:
 *           type: string
 *         proposeRate:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/proposal/:id", auth, proposalController.create);
/**
 * @swagger
 * /proposal/{id}:
 *   put:
 *     summary: Update a proposal (accept or reject)
 *     description: Update a proposal (accept or reject).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the proposal to update
 *     requestBody:
 *       description: Update proposal status
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['accepted', 'rejected']
 *                 description: New status of the proposal
 *     responses:
 *       201:
 *         description: Proposal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 proposal:
 *                   $ref: '#/components/schemas/Proposal'
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Proposal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         job:
 *           type: string
 *         freelancer:
 *           type: string
 *         coverLetter:
 *           type: string
 *         proposeRate:
 *           type: number
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         job:
 *           type: string
 *         client:
 *           type: string
 *         freelancer:
 *           type: string
 *         proposal:
 *           type: string
 *         rate:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.put("/proposal/:id", auth, proposalController.update);
/**
 * @swagger
 * /proposal/{id}:
 *   get:
 *     summary: Get all proposals for a particular job
 *     description: Get all proposals for a particular job.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job
 *     responses:
 *       201:
 *         description: Proposals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 proposals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Proposal'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Proposal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         job:
 *           type: string
 *         freelancer:
 *           type: string
 *         coverLetter:
 *           type: string
 *         proposeRate:
 *           type: number
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get("/proposal/:id", auth, proposalController.getbyjob);
/**
 * @swagger
 * /proposal:
 *   get:
 *     summary: Get all proposals sent to jobs posted by the current user
 *     description: Get all proposals sent to jobs posted by the current user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Proposals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 proposal:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Proposal'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       404:
 *         description: Jobs not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Proposal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         job:
 *           type: string
 *         freelancer:
 *           type: string
 *         coverLetter:
 *           type: string
 *         proposeRate:
 *           type: number
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get("/proposal", auth, proposalController.getbyuser);


//Order Routes

//complete or cancelled the order
/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: Complete the Order
 *     description: Complete an order and upload digital work.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               work:
 *                 type: string
 *                 format: base64
 *                 description: Digital work file (image or PDF)
 *               status:
 *                 type: string
 *                 enum:
 *                   - completed
 *                   - cancelled
 *                 description: Order status
 *     responses:
 *       201:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         freelancer:
 *           type: string
 *         status:
 *           type: string
 *         work:
 *           type: string
 *           format: url
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.put("/order/:id", auth, orderController.update);



//get all order of user by thier id 
/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get all orders by user
 *     description: Returns a list of orders associated with the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         client:
 *           type: string
 *         freelancer:
 *           type: string
 *         status:
 *           type: string
 *         work:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/order", auth, orderController.orderbyuser);



//Review Routes

//post review by order id
/**
 * @swagger
 * /review/{id}:
 *   post:
 *     summary: Give a review on a completed order
 *     description: Allows a client to give a review on a completed order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 required: true
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 required: true
 *                 description: Review comment
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Review:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         client:
 *           type: string
 *         freelancer:
 *           type: string
 *         order:
 *           type: string
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/review/:id", auth, orderController.review);


//get all review by user/freelancer 
/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get all reviews of a freelancer
 *     description: Returns a list of reviews associated with the authenticated freelancer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         freelancer:
 *           type: string
 *         client:
 *           type: string
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get("/review", auth, orderController.allreviews);

//cancel the order
/**
 * @swagger
 * /ordercancel/{id}:
 *   put:
 *     summary: Cancel an order
 *     description: Cancel an order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to cancel
 *     responses:
 *       201:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized access or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         status:
 *           type: string
 *         job:
 *           $ref: '#/components/schemas/Job'
 *         freelancer:
 *           $ref: '#/components/schemas/User'
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         status:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 */
router.put("/ordercancel/:id", auth, orderController.cancelOrder);


module.exports = router;