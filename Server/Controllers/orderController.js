const Order = require("../Models/order");
const User = require('../Models/user');
const Job = require("../Models/job");
const Review = require("../Models/review");
const JWT = require("../Services/jwtService");
const Joi = require('joi');
const dotenv = require('dotenv');
dotenv.config();

const Cloudinary = require('cloudinary').v2;

Cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

const uploadFile = async (filePath, folder) => {
    try {
        const result = await Cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto' // Automatically detect file type
        });
        return result;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

const orderController = {

    //Complete the Order 
    //there should be option to add image or pdf file to submit digital work
    async update(req, res, next) {
        const orderSchema = Joi.object({
            work: Joi.string().required(),
            status: Joi.string().valid('cancelled', 'completed')
        })
        const { error } = orderSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { token } = req.cookies;
        if (!token) {
            return next({
                status: 401,
                message: "UnAuthorized Access"
            });
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

            const checkfreelancer = await User.findById(decodeToken._id);
            if (!checkfreelancer) {
                return next({
                    status: 401,
                    message: "user does not exist"
                })
            }
            if (checkfreelancer.role !== 'freelancer') {
                return next({
                    status: 401,
                    message: "Your are not a freelancer"
                });
            }
            const { id } = req.params;
            const checkorder = await Order.findById(id).populate('job');
            if (!checkorder) {
                return next({
                    status: 401,
                    message: "Order Does Not Exist"
                });
            }
            if (checkfreelancer._id.toString() !== checkorder.freelancer.toString()) {
                return next({
                    status: 401,
                    message: "You dont have access to update this order"
                });
            }
            const checkjob = checkorder.job;
            if(!checkjob){
                return next({
                    status:401,
                    message:"Job does not exist"
                });
            }
            const { work, status } = req.body;
            if (checkorder.status === 'cancelled') {
                return next({
                    status: 401,
                    message: "Order is already cancelled"
                });
            }
            if (checkorder.status === 'completed') {
                return next({
                    status: 401,
                    message: "Order is already completed"
                });
            }

            let result;
            try {
                result = await uploadFile(`data:image/png;base64,${work}`, 'work')
            } catch (error) {
                return next(error);
            }

            const { secure_url } = result;
            const updatefiels = {}
            if (work) updatefiels.work = secure_url;
            if (status) updatefiels.status = status;

            await Job.findByIdAndUpdate(checkjob._id, {status:"completed"},{new:true});

            const updateorder = await Order.findByIdAndUpdate(id, updatefiels, { new: true });
            res.status(201).json({ message: "Order Update Successfully", order: updateorder.toObject() });

        } catch (error) {
            return next(error);
        }
    },

    // create api for cancel the order
    async cancelOrder(req,res,next){
        const {token} = req.cookies;
        if(!token){
            return next({
                status:401,
                message:"UnAuthorized Access"
            });
        }
        let decodeToken;
        try {
            decodeToken = await JWT.verifyToken(token);
        } catch (error) {
            return next({
                status:401,
                message:"InValid Token"
            });
        }
        try {
            const checkfreelancer = await User.findById(decodeToken._id);
            if(!checkfreelancer){
                return next({
                    status:401,
                    message:"User Does Not Exist"
                });
            }
            if(checkfreelancer.role !== "freelancer"){
                return next({
                    status:401,
                    message:"You are not a freelancer"
                });
            }
            const {id} = req.params
            const checkorder = await Order.findById(id).populate('job').populate('freelancer');
            if(!checkorder){
                return next({
                    status:401,
                    message:"Order Does Not Exist"
                });
            }
            if(checkfreelancer._id.toString() !== checkorder.freelancer._id.toString()){
                return next({
                    status:401,
                    message:"You dont have the Right to manipulate this order"
                });
            }
            const checkjob = checkorder.job;
            await Job.findByIdAndUpdate(checkjob._id, {status:"close"},{new:true});
            const cancelOrder = await Order.findByIdAndUpdate(id, {status:"cancelled"},{new:true});
            res.status(201).json({message:"Order Cancel Successfully", order:cancelOrder});
        } catch (error) {
            return next(error);
        }
    },



    //Give Review on Completed Order
    async review(req, res, next) {
        const reviewSchema = Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            comment: Joi.string().required()
        })
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { token } = req.cookies;
        if (!token) {
            return next({
                status: 401,
                message: "UnAuthorized Access"
            });
        }
        let decodeToken;
        try {
            decodeToken = await JWT.verifyToken(token);
        } catch (error) {
            return next({
                status: 401,
                message: "Invalid Token"
            })
        }
        const { id } = req.params;
        try {
            const checkOrder = await Order.findById(id).populate('client').populate('freelancer');
            if (!checkOrder) {
                return next({
                    status: 401,
                    message: "Order Does Not Exist"
                })
            }
            if (checkOrder.status === 'completed') {
                const checkClient = checkOrder.client;
                if (!checkClient) {
                    return next({
                        status: 401,
                        message: "Client Does Not Exist"
                    })
                }
                const checkFreelancer = checkOrder.freelancer;
                if (!checkFreelancer) {
                    return next({
                        status: 401,
                        message: "Freelancer Does Not Exist"
                    })
                }
                if (decodeToken._id.toString() !== checkClient._id.toString()) {
                    return next({
                        status: 401,
                        message: "You Don't have access to give review on this order"
                    })
                }
                const { rating, comment } = req.body;
                const newReview = new Review({
                    client: checkClient._id,
                    freelancer: checkFreelancer._id,
                    order: checkOrder._id,
                    rating,
                    comment
                })
                const review = await newReview.save();
                res.status(201).json({ message: "Order recieve a review", Review: review });
            }
            if (checkOrder.status === 'cancelled') {
                return next({
                    status: 401,
                    message: "you can give review on cancell order"
                })
            }

        } catch (error) {
            return next();
        }
    },

    //all order by user 
    async orderbyuser(req, res, next) {
        const { token } = req.cookies;
        if (!token) {
            return next({
                status: 401,
                message: "UnAUthorized Aceess"
            });
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
            const checkUser = await User.findById({ _id: decodeToken._id });
            if (!checkUser) {
                return next({
                    status: 401,
                    message: "User Does Not Exist"
                });
            }
            let order;
            if (checkUser.role === 'client') {
                order = await Order.find({ client: decodeToken._id });
            }
            else if (checkUser.role === 'freelancer') {
                order = await Order.find({ freelancer: decodeToken._id });
            }
            res.status(200).json({ orders: order || [] });


        } catch (error) {
            return next(error);
        }
    },


    //all reviews  of freelancer
    async allreviews(req, res, next) {
        const { token } = req.cookies;
        if (!token) {
            return next({
                status: 401,
                message: "UnAuthorized Access"
            })
        }
        let decodeToken;
        try {
            decodeToken = JWT.verifyToken(token);
        } catch (error) {
            return next({
                status: 401,
                message: "Invalid Token"
            })
        }
        try {
            const checkfreelancer = await User.findById({ _id: decodeToken._id });
            if (!checkfreelancer) {
                return next({
                    status: 401,
                    message: "User Does Not Exist"
                })
            }
            const userReview = await Review.find({ freelancer: decodeToken._id })
            res.status(200).json({ Reviews: userReview });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = orderController;