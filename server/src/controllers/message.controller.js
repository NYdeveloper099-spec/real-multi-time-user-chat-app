const Message = require("../models/Message");

const getConversation = async (req, res) => {

  try {

    const senderId = req.user._id;

    const receiverId = req.params.receiverId;

    const messages = await Message.find({

      $or: [

        {
          sender: senderId,
          receiver: receiverId,
        },

        {
          sender: receiverId,
          receiver: senderId,
        },

      ],

    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  getConversation,
};