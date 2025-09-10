import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userid = req.userid;

    const admin = await User.findById(userid);

    if(!admin) {
        return res.status(400).send("Admin user not found!");
    }

    const validMembers = await User.find({ _id: { $in: members }});

    if(validMembers.length !== members.length) {
        return res.status(400).send("Some members are not valid users!");
    }

    const newChannel = new Channel({
        name,
        members,
        admin: userid,
    });

    await newChannel.save();
    return res.status(201).json({channel: newChannel });
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const userid = new mongoose.Types.ObjectId(req.userid);
    const channels = await Channel.find({
      $or: [{admin: userid}, {members: userid}],
    }).sort({updatedAt: -1});
    
    return res.status(201).json({channels });
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate({path:"messages",populate:{
      path:'sender', select:"firstName lastName email _id image color"
    }});
    if(!channel){
      return res.status(404).send("Channel not found!");
    }
    const messages = channel.messages;
    return res.status(201).json({messages });
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};