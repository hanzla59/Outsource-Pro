const Joi = require('joi');
const Job = require("../Models/job");
const User = require("../Models/user");
const Proposal = require("../Models/proposal");
const JWT = require('../Services/jwtService');
const JobDTO = require("../DTO/jobdto");

const jobController = {

    // Create Job by client
    async create(req, res, next) {
        const createSchema = Joi.object({
            title: Joi.string().min(10).required(),
            description: Joi.string().min(50).required(),
            budget: Joi.number().required(),
            deadline: Joi.date().optional()
        });

        const { error } = createSchema.validate(req.body);
        if (error) {
            return next({ status: 400, message: error.details[0].message });
        }

        const { token } = req.cookies;
        if (!token) {
            return next({ status: 401, message: "UnAuthorized Access" });
        }

        try {
            const decodeToken = JWT.verifyToken(token);
            const findclient = await User.findById(decodeToken._id);
            if (!findclient) {
                return next({ status: 401, message: "UnAuthorized Access" });
            }

            if (findclient.role !== "client") {
                return next({ status: 403, message: "You are not a client; you don't have the right to create a job" });
            }

            const { title, description, budget, deadline } = req.body;
            const newjob = new Job({
                title,
                description,
                budget,
                deadline,
                client: findclient._id
            });

            const job = await newjob.save();
            const jobdto = new JobDTO(job);
            res.status(201).json({ message: "Job Created Successfully", Job:jobdto });
        } catch (error) {
            return next(error);
        }
    },


    //Updating the job 
    async update(req, res, next) {
        const updateSchema = Joi.object({
            title:Joi.string().optional(),
            description: Joi.string().optional(),
            budget:Joi.number().optional(),
            deadline:Joi.date().optional(),
            status:Joi.string().valid('open','inprogress','complete','close').optional()
        })
        const {error} = updateSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {token} = req.cookies;
        if(!token){
            const error = {
                status: 401,
                message: "UnAuthorized Access"
            }
            return next(error);
        }
        let decodeToken;
        try {
            decodeToken = JWT.verifyToken(token);
        } catch (error) {
            return next({
                status: 401,
                message: "Invalid Token"
            });
        }
        const {id} = req.params;
        try {
            const checkuser = await User.findById({_id:decodeToken._id});
            if(!checkuser){
                const error = {
                    status: 401,
                    message: "UnAuthorized Access"
                }
                return next(error);
            }
            const checkjob = await Job.findById({_id:id});
            if(!checkjob){
                const error = {
                    status: 401,
                    message: "Job does not exist"
                }
                return next(error);
            }
            if(checkjob.client.toString()!== decodeToken._id){
                const error = {
                    status: 403,
                    message: "You dont have right to update the job"
                }
                return next(error);
            }
            else{
                const {title, description, budget, deadline, status} = req.body;
                const updatefields = {}

                if(title) updatefields.title = title;
                if(description) updatefields.description = description;
                if(budget) updatefields.budget = budget;
                if(deadline) updatefields.deadline = deadline;
                if(status) updatefields.status = status

                const updatejob = await Job.findByIdAndUpdate(id, updatefields, {new:true});
                const jobdto = new JobDTO(updatejob);
                res.status(201).json({message:"Job Update Successfully", job:jobdto});

            }
            
        } catch (error) {
            return next(error);
        }
    },


    //delete Job and all the proposal send to that job
    async delete(req, res, next) {
        const { token } = req.cookies;
        if (!token) {
            const error = {
                status: 401,
                message: "UnAuthorized Access"
            }
            return next(error);
        }
        let decodeToken;
        try {
            decodeToken = JWT.verifyToken(token);
        } catch (error) {
            return next({
                status: 401,
                message: "Invalid Token"
            });
        }
        const { id } = req.params;
        try {
            const checkuser = await User.findById({ _id: decodeToken._id });
            if (!checkuser) {
                const error = {
                    status: 401,
                    message: "UnAuthorized Access"
                }
                return next(error);
            }
            const checkjob = await Job.findById({ _id: id });
            if (!checkjob) {
                const error = {
                    status: 401,
                    message: "Job does not exist"
                }
                return next(error);
            }
            if (checkjob.client.toString() !== decodeToken._id) {
                return next({
                    status: 403,
                    message: "You do not have permission to delete this job"
                });
            }
            //delete all the proposal which is send to that job
            await Proposal.deleteMany({job:id});

            await Job.findByIdAndDelete(id);
            res.status(201).json({message:"Job Delete Successfully"});

        } catch (error) {
            return next(error);
        }
    },
    

    //All jobs which is posted by user 
    async getbyuser(req, res, next) {
        const { token } = req.cookies;
        if (!token) {
            const error = {
                status: 401,
                message: "UnAUthorized Access"
            }
            return next(error);
        }
        let decodeToken;
        let checkuser;
        try {
            decodeToken = JWT.verifyToken(token);
            checkuser = await User.findById({ _id: decodeToken._id });
            if (!checkuser) {
                const error = {
                    status: 401,
                    message: "UnAUthorized Access"
                }
                return next(error);
            }
            const jobs = await Job.find({ client: checkuser._id });
            const jobdto = jobs.map(job => new JobDTO(job));
            res.status(201).json({jobs:jobdto});
        } catch (error) {
            return next(error);
        }
    },


    //selected Job
    async getbyid(req, res, next) {
        const { id } = req.params;
        try {
            const job = await Job.findById({ _id: id });
            if (!job) {
                const error = {
                    status: 401,
                    message: "Job does not exist"
                }
                return next(error);
            }
            const jobdto = new JobDTO(job);
            res.status(201).json(jobdto);
        } catch (error) {
            return next(error);
        }
    },

    //All listed Job
    async getall(req, res, next) {
        try {
            const jobs = await Job.find({});
            const jobdto = jobs.map(job => new JobDTO(job));
            res.status(201).json({jobs:jobdto});
        } catch (error) {
            return next(error);
        }
    }
};

module.exports = jobController;
