import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { renameSync, unlinkSync} from 'fs';
const maxAge = 3 * 24 * 60 * 60 * 1000; 

const createToken = (email, userid) => {
    return jwt.sign({email, userid}, process.env.JWT_KEY, {
        expiresIn: maxAge
    });
};

export const signup = async (req, res, next)  => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send({message: "Email and password are required"});
        }
        const user = await User.create({email, password});
        res.cookie("jwt", createToken(user.email, user._id), {
            maxAge,
            secure: true,
            sameSite: "none",
        });
        return res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Internal server error"});       
    }
}

export const login = async (req, res, next)  => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send({message: "Email and password are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send({message: "User not found"});
        }
        const auth = await compare(password, user.password);
        if(!auth){
            return res.status(400).send({message: "Password is incorrect"});
        }
        res.cookie("jwt", createToken(user.email, user._id), {
            maxAge,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Internal server error"});       
    }
}

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userid);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {userid} = req;
    const {firstName, lastName, color} = req.body;
    if (!firstName || !lastName ) {
      return res.status(400).send("First Name, Last Name and Color are required!");
    }

    const userData = await User.findByIdAndUpdate(userid,{
        firstName,lastName,color,profileSetup:true
    },{ new: true, runValidators: true });

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if(!req.file){
        return res.status(400).send("File is Required");
    }
    const date = Date.now();
    let fileName = "uploads/profiles/"+date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(req.userid,{image:fileName},{new : true, runValidators: true},);

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const {userid} = req;
    const user = await User.findById(userid);

    if(!user){
        return res.status(404).send("User not found");
    }

    if(user.image){
        unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).send("Profile image Deleted Successfully!");
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:1, secure:true, sameSite: "None" })
    return res.status(200).send("Log Out Successful");
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};