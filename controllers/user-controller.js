const User = require("../models/user-schema");


const getAllUsers = async (req, res) => {
    const allUsers = await User.find({});
    res.status(200).json(allUsers)
}


const getUserByAaadhar = async (req, res) => {
    const { aadharId } = req.query;  // GET /user?aadharId=1234
    const user = await User.findOne({ aadharId });
    console.log(user)
    if (!user) {
        return res.status(404).json({
            message: "User with given aadhar not found!"
        })
    }
    console.log("User found: ", user);
    res.status(200).json(user);
}


const createNewUser = async (req, res) => {
    const body = req.body;
    if (!body.username || !body.aadharId) {
        return res.status(400).json({
            message: "Username & AadharId required!"
        })
    }
    console.log("Creating...\n");

    const newUser = await User.create({
        username: body.username,
        aadharId: body.aadharId,
        total: 0,
        credits: [],
        debits: []
    });

    console.log(newUser)

    res.status(201).json({
        message: "Successfully created a new User.",
        _id: newUser._id
    })
}


const addMoney = async (req, res) => {
  try {
    const { aadharId, amount } = req.body;

    if (!aadharId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findOne({ aadharId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.total += amount;
    user.credits.push({ amount, timestamps: Date.now() });

    await user.save();

    res.status(200).json({ message: "Money added successfully", total: user.total });
  } catch (err) {
    console.error("Error adding money:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const deductMoney = async (req, res) => {
  try {
    const { aadharId, amount } = req.body;

    if (!aadharId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findOne({ aadharId });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.total < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.total -= amount;
    user.debits.push({ amount, timestamps: Date.now() });

    await user.save();

    res.status(200).json({ message: "Money deducted successfully", total: user.total });
  } catch (err) {
    console.error("Error deducting money:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getTotalMoney = async (req, res) => {
    try {
      const { aadharId } = req.body;
  
      const user = await User.findOne({ aadharId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ total: user.total });
    } catch (err) {
      console.error("Error getting total money:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = {
    getAllUsers,
    getUserByAaadhar,
    createNewUser,
    addMoney,
    deductMoney,
    getTotalMoney,
}
