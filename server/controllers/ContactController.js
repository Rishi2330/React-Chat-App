import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (req, res) => {
  try {
    const {searchTerm} = req.body;
    if(searchTerm === undefined || searchTerm === null){
        return res.status(400).send("searchTerm is Required!");
    }
    const sanitizedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g, "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
        $and: [{ _id: { $ne: req.userid}},
        {
            $or:[{firstName: regex}, {lastName: regex}, {email: regex}],
        },
        ],
    });
    return res.status(200).json({contacts});
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getContactsForDMList = async (req, res) => {
  try {
    let { userid } = req;
    userid = new mongoose.Types.ObjectId(userid);

    const contacts = await Message.aggregate([
      {
        $match:{
          $or:[{sender:userid}, {recipient:userid}],
        },
      },
      {
        $sort: { timeStamp: -1 }, 
      },
      {
        $group:{
          _id:{
            $cond:{
              if:{$eq:["$sender",userid]},
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timeStamp" },
        },
      },
      {
        $lookup:{
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1},
      },
    ]);

    return res.status(200).json({contacts});
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const users = await User.find({_id:{$ne:req.userid}},"firstName lastName _id email");
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));
    return res.status(200).json({contacts});
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};