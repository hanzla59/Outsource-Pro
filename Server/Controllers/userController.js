const User = require('../Models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const Token = require('../Models/token');
const JWT = require('../Services/jwtService');
const UserDTO = require('../DTO/userDto');

const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const userController = {

    
    //userRegister
    async register(req, res, next) {
        const userSchema = Joi.object({
            username: Joi.string().min(5).max(15).required(),
            email: Joi.string().email().required(),
            role: Joi.string().valid('client', 'freelancer').required(),
            password: Joi.string().pattern(passwordPattern).required()
        });
        const { error } = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { username, email, password, role } = req.body;
        try {
            const checkusername = await User.findOne({ username });
            if (checkusername) {
                return next({ status: 401, message: "Username already taken" });
            }
            const checkemail = await User.findOne({ email });
            if (checkemail) {
                return next({ status: 401, message: "Email already taken" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                role,
                password: hashedPassword
            });
            const newuser = await user.save();
            const userdto = new UserDTO(newuser);
            let token;
            try {
                token = await JWT.signToken({ _id: user._id }, '60m');
            } catch (error) {
                return next(error);
            }
            await JWT.storeToken(token, user._id);

            res.cookie('token', token, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            });
            res.status(201).json({ message: "User Register Successfully", user: userdto, auth: true });
        } catch (error) {
            return next(error);
        }
    },


    //login user
    async login(req, res, next) {
        const loginSchema = Joi.object({
            username: Joi.string().min(5).max(15).required(),
            password: Joi.string().pattern(passwordPattern).required()
        });
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { username, password } = req.body;

        try {
            const checkusername = await User.findOne({ username });
            if (!checkusername) {
                return next({ status: 401, message: "Invalid Username" });
            }
            const checkpassword = await bcrypt.compare(password, checkusername.password);
            if (!checkpassword) {
                return next({ status: 401, message: "Invalid Password" });
            }
            const token = JWT.signToken({ _id: checkusername._id }, '60m');
            const tokenrecord = await Token.updateOne({ userId: checkusername._id }, { token: token }, { upsert: true });
            if (!tokenrecord.nModified) {
                const newToken = new Token({
                    userId: checkusername._id,
                    token: token
                });
                await newToken.save();
            }
            res.cookie('token', token, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            });
            const userdto = new UserDTO(checkusername);
            res.status(201).json({ message: "User LogIn successfully", user:userdto, auth: true });
        } catch (error) {
            return next(error);
        }
    },


    // Logout User
    async logout(req, res, next) {
        const { token } = req.cookies;
        if (!token) {
            return next({
                status: 401,
                message: "Unauthorized Access"
            });
        }
        try {
            await Token.findOneAndDelete({ token: token });
            res.clearCookie('token');
            res.status(200).json({ message: "User LogOut Successfully", auth: false});
        } catch (error) {
            return next(error);
        }
    },

    //update User Account
    async update(req, res, next) {
        const { token } = req.cookies;
        if (!token) {
            const error = {
                status: 401,
                message: "UnAuthorized Access"
            }
            return next(error);
        }
        try {
            let decodeToken = JWT.verifyToken(token);
            if (!decodeToken) {
                const error = {
                    status: 401,
                    message: "UnAuthorized Access"
                }
                return next(error);
            }
            const checkuser = await User.findById({ _id: decodeToken._id });
            if (!checkuser) {
                const error = {
                    status: 401,
                    message: "User Does Not Exist"
                }
                return next(error);
            }
            const updateSchema = Joi.object({
                username: Joi.string().min(5).max(15).optional(),
                email: Joi.string().email().optional(),
                password: Joi.string().pattern(passwordPattern).optional(),
                name: Joi.string().max(30).optional(),
                bio: Joi.string().optional(),
                skills: Joi.array().items(Joi.string()).optional(),
                hourlyrate: Joi.string().optional()
            })
            const { error } = updateSchema.validate(req.body);
            if (error) {
                return next(error);
            }
            const { username, email, password, name, bio, skills, hourlyrate } = req.body;

            const updatefields = {};
                if (username) updatefields.username = username;
                if (email) updatefields.email = email;
                if (password) updatefields.password = await bcrypt.hash(password, 10);
                if (name) updatefields.name = name;
                if (bio) updatefields.bio = bio;
                if (skills) updatefields.skills = skills;
                if (hourlyrate) updatefields.hourlyrate = hourlyrate;

                const updateuser = await User.findByIdAndUpdate(decodeToken._id, updatefields, {new:true});
                const userdto = new UserDTO(updateuser);
                res.status(201).json({message:"User Update Successfully", user:userdto });
        } catch (error) {
            return next(error);
        }
    },

    //delete User Account
    async delete(req, res, next) {
        const { token } = req.cookies;
        try {
            let decodeToken = await JWT.verifyToken(token);
            const checkuser = await User.findById({ _id: decodeToken._id });
            if (!checkuser) {
                const error = {
                    satatus: 401,
                    message: "User Does Not Exist"
                }
                return next(error);
            }
            else {
                await User.findByIdAndDelete({ _id: decodeToken._id });
                res.clearCookie('token');
                res.status(201).json("User Account Delete Successfully");
            }

        } catch (error) {
            return next(error);
        }
    },

    //get all user for admin
    async allUser(req,res,next){
        try {
            const allUser = await User.find({});
            const userdto = allUser.map(user =>new UserDTO(user));
            res.status(201).json({Users:userdto});
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = userController;
