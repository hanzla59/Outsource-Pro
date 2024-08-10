const Joi = require('joi');
const JWT = require("../Services/jwtService");
const User = require("../Models/user");
const Job = require("../Models/job");
const Proposal = require("../Models/proposal");
const Order = require("../Models/order");

const proposalController = {


    //create Proposal and send to particular job
    async create(req, res, next) {    
        const proposalSchema = Joi.object({
            coverLetter: Joi.string().required(),
            proposeRate: Joi.number().required()
        });
        const { error } = proposalSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { token } = req.cookies;
        if (!token) {
            const error = {
                status: 401,
                message: "UnAuthorized Access"
            };
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
        try {
            const checkuser = await User.findById(decodeToken._id);
            if (!checkuser) {
                const error = {
                    status: 401,
                    message: "UnAuthorized Access"
                };
                return next(error);
            }
            if (checkuser.role !== "freelancer") {
                const error = {
                    status: 403,
                    message: "You don't have permission to send proposal"
                };
                return next(error);
            }
            const { id } = req.params;
            const checkjob = await Job.findById(id);
            if (!checkjob) {
                const error = {
                    status: 403,
                    message: "Job Does Not Exist"
                };
                return next(error);
            }

            const checkproposal = await Proposal.findOne({freelancer:decodeToken._id, job:id})
            if(checkproposal){
                const error = {
                    status:401,
                    message:"You Already Submited Your Proposal"
                }
                return next(error);
            }
            

            const { coverLetter, proposeRate } = req.body;

            const newproposal = new Proposal({
                job: checkjob._id,
                freelancer: checkuser._id,
                coverLetter,
                proposeRate
            });
            const proposal = await newproposal.save();
            res.status(201).json({ message: "Proposal submitted successfully", proposal });
        } catch (error) {
            return next(error);
        }
    },

    //accept or reject propsal if accepted than create the order
    //send the proposal id in params
    async update(req,res,next){
        const updateSchema = Joi.object({
            status:Joi.string().valid('accepted','rejected').required()
        })
        const {error} = updateSchema.validate(req.body);
        if(error){
            return next(error);
        }
        //check authorized access
        const {token} = req.cookies;
        if(!token){
            const error = {
                status:401,
                message:"UnAUthorized Access"
            }
            return next(error);
        }
        let decodeToken;
        try {
            decodeToken = JWT.verifyToken(token);
        } catch (error) {
            return next(error);
        }
        const {id} = req.params
        try {
            
            const checkclient = await User.findById({_id:decodeToken._id});
            //check user
            if(!checkclient){
                const error = {
                    status:401,
                    message:"User Does Exist"
                }
                return next(error);
            }
            //check he is client or not
            if(checkclient.role !== "client"){
                const error = {
                    status:401,
                    message:"You dont have permission to update this proposal"
                }
                return next(error);
            }
            //the id in params is proposal get the job id from proposal
            const checkproposal = await Proposal.findById(id).populate('job').populate('freelancer');
            if(!checkproposal){
                const error = {
                    status:401,
                    message:"Propsal Does Not Exist"
                }
                return next(error);
            }
            if(checkproposal.status === "accepted"){
                return next({
                    status:401,
                    message:"Already accepted the proposal"
                })
            };
            if(checkproposal.status === 'rejected'){
                return next({
                    status:401,
                    message:"Already rejectedted the proposal"
                })
            }
            const checkjob = checkproposal.job
            if(!checkjob){
                const error = {
                    status:401,
                    message:"Job does not exist"
                }
                return next(error);
            }
            const checkfreelancer = checkproposal.freelancer
            if(!checkfreelancer){
                const error = {
                    status:401,
                    message:"freelancer does not exist"
                }
                return next(error);
            }
            //check this job is posted by same client who want to access this
            if(decodeToken._id.toString() !== checkjob.client.toString()){
                const error = {
                    status:401,
                    message:"you don't have access to accept this"
                }
                return next(error);
            }
            
            const checkrate = checkproposal.proposeRate;
            const {status} = req.body;

            
            checkproposal.status = status;
            const updateproposal =  await checkproposal.save();

            if(status === 'accepted'){
                const newOrder = new Order({
                    job:checkjob._id,
                    client:checkclient._id,
                    freelancer:checkfreelancer._id,
                    proposal:checkproposal._id,
                    rate:checkrate
                });
                const order =await newOrder.save();await Job.findByIdAndUpdate(checkjob._id, {status:"inprogress"}, {new:true})
                
                res.status(201).json({message:"Proposal Accespted", proposal:updateproposal, order:order});
            }
            else{
                res.status(201).json({message:"Proposal Rejected", updateproposal})
            }
        } catch (error) {
            return next(error);
        }
    },



    //get all propsal of particular job
    async getbyjob(req,res,next){
        const {token} = req.cookies;
        if(!token){
            const error = {
                status:401,
                message:"UnAuthorized Access"
            }
            return next(error);
        }
        let decodeToken;
        try {
            decodeToken = JWT.verifyToken(token);
        } catch (error) {
            return next({
                status:401,
                message:"InValid Token"
            })
        }
        const {id} = req.params;
        try {
            const checkuser = await User.findById({_id:decodeToken._id});
            if(!checkuser){
                const error = {
                    status:401,
                    message:"User Does not exist"
                }
                return next(error);
            }
            if(checkuser.role !== "client"){
                const error = {
                    status:403,
                    message:"You don't have permision to access this"
                }
                return next(error);
            }
            const checkjob = await Job.findById({_id:id});
            if(!checkjob){
                const error = {
                    status:401,
                    message:"Job Does not exist"
                }
                return next(error);
            }
            if(checkjob.client.toString() !== decodeToken._id.toString()){
                const error = { 
                    status:403,
                    message:"You dont have permision to access this"
                }
                return next(error);
            }
            const proposal = await Proposal.find({job:id});
            return res.status(201).json({proposals:proposal});
        } catch (error) {
            return next(error);
        }
        

    },

    //get all proposal send to the all job which is posted by single user
    async getbyuser(req,res,next){
        //first check user authentication by token and he is only client
        //check all jobs which is posted by that user
        //check all propsal which is send to all that jobs

        const {token} = req.cookies;
        if(!token){
            const error = {
                status:401,
                message:"UnAuthorized Access"
            }
            return next(error);
        }
        let decodeToken;
        try {
            decodeToken = JWT.verifyToken(token);
        } catch (error) {
            return next({
                status:401,
                message:"Invalid Token"
            })
        }
        try {
            const checkuser = await User.findById({_id:decodeToken._id});
            if(!checkuser){
                const error = {
                    status:401,
                    message:"User Does Not exist"
                }
                return next(error);
            }
            const checkjobs = await Job.find({client:checkuser._id});
            if(checkjobs.length === 0){
                const error = {
                    status:404,
                    message:"Jobs not found"
                }
                return next(error);
            }
            const allpropsalpromise = checkjobs.map(job => Proposal.find({job:job._id}));
            const allproposals = await Promise.all(allpropsalpromise);
            const flattenedProposals = allproposals.flat();

            return res.status(201).json({message:"All Recieved Proposal", proposal:flattenedProposals});
        } catch (error) {
            return next(error);
        }
    }
};

module.exports = proposalController;
