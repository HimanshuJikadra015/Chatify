const messageModel = require("../model/messageModel");

module.exports.addMessage = async(req,res,next)=>{
    try{
        const {from, to, message} = req.body;
        const data = await messageModel.create({
            message:{text: message},
            users: [from, to],
            sender: from,
        });
        if(data) return res.json({msg: "Message added successfully in th DB!"});
        return res.json({msg: "Failed to add mesaage to the DB!"});
    }catch(error){
        next(error);
    }
};

module.exports.getAllMessage = async(req,res,next)=>{
    try{
        const {from, to} = req.body;
        const messages = await messageModel.find({
            users:{
                $all: [from,to],
            },
        }).sort({updatedAt: 1});
        const projectedMessages = messages.map((msg)=>{
            return{
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.json(projectedMessages);
    }catch(error){
        next(error);
    }
};