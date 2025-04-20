const User = require("../models/user-schema");

// GET "/api/" -> Gives all active user in the bank
const handleGetAllUsers = async (_, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error _ handleGetAllUsers: ", error);
    res.status(500).status({
      message: "Internal Server Error!",
    });
  }
};

// GET "/api/user?aadharId=xxxx..." -> Gives user with given aadhar Id
const handleGetUserByAaadhar = async (req, res) => {
  try {
    const { aadharId } = req.query;

    if (!aadharId) {
      res.status(400).json({
        message: "AadharId is required!",
      });
    }

    const targetedUser = await User.findOne({ aadharId });

    if (!targetedUser) {
      res.status(404).json({
        message: "User not found!",
      });
    }

    res.status(200).json(targetedUser);
  } catch (error) {
    console.error("Error _ handleGetUserByAadhar: ", error);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// POST "/api/" -> Pass fisrtName, lastName, aadharId in req.body to create a new user
const handleCreateNewUser = async (req, res) => {
  try {
    const { firstName, lastName, aadharId } = req.body;

    if (!firstName || !lastName || !aadharId) {
      return res.status(400).json({
        message: "Username & AadharId required!",
      });
    }

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      aadharId: aadharId,
      total: 0,
      credits: [],
      debits: [],
    });

    res.status(201).json({
      message: "Successfully created a new user!"
    });
  } catch (error) {
    console.error("Error _ handleCreateNewUser: ", error);
    res.status(500).json({
      message: "Internal server error!"
    })
  }
};

// POST "/api/add-money" -> Pass aadharId, amount in req.body to add money to the account beholder of that aadhar Id
const handleAddMoney = async (req, res) => {
  try {
    const { aadharId, amount } = req.body;

    if (!aadharId || !amount || amount <= 0) {
      return res.status(400).json({ 
        message: "Invalid input!" 
      });
    }

    const user = await User.findOne({ aadharId });
    if (!user) {
      res.status(404).json({ 
        message: "User not found!" 
      });
    }

    user.total += amount;
    user.credits.push({ amount, timestamps: Date.now() });

    await user.save();

    res.status(200).json({ 
      message: "Money added successfully!"
    });
  } catch (err) {
    console.error("Error _ handleAddMoney:", err);
    res.status(500).json({ 
      message: "Internal Server error!" 
    });
  }
};

// POST "/api/deduct-money" -> Pass aadharId, amount in req.body to deduct money from the account of beholder of that aadhar Id
const handleDeductMoney = async (req, res) => {
  try {
    const { aadharId, amount } = req.body;

    if (!aadharId || !amount || amount <= 0) {
      return res.status(400).json({ 
        message: "Invalid input!" 
      });
    }

    const user = await User.findOne({ aadharId });

    if (!user) return res.status(404).json({ 
      message: "User not found" 
    });

    if (user.total < amount) {
      return res.status(400).json({ message: "Insufficient balance!" });
    }

    user.total -= amount;
    user.debits.push({ amount, timestamps: Date.now() });

    await user.save();

    res.status(200).json({ 
      message: "Money deducted successfully!" 
    });
  } catch (err) {
    console.error("Error _ handleDeductMoney: ", err);
    res.status(500).json({ 
      message: "Internal server error!" 
    });
  }
};

// GET "/api/total?aadharId=xxxx..." -> Pass aadharId in the req.query to get the total money in the aount of beholder of that aadharId
const handleGetTotalMoney = async (req, res) => {
  try {
    const { aadharId } = req.query;

    if (!aadharId) {
      res.status(400).json({
        message: "AadharID is required!"
      })
    }

    const user = await User.findOne({ aadharId });

    if (!user) {
      return res.status(404).json({ 
        message: "User not found!" 
      });
    }

    const total = user.total;

    res.status(200).json({ total });
  } catch (err) {
    console.error("Error _ handleGetTotalMoney: ", err);
    res.status(500).json({ 
      essage: "Internal Server error!" 
    });
  }
};

// DELETE "/api/user?aadharId=xxxx..." -> Pass aadharId in the req.query to delete the account of that aadharId
const handleDeleteUserByAadhar = async (req, res) => {
  try {
    const { aadharId } = req.query;

    if (!aadharId) {
      return res.status(401).json({
        message: "Aaadhar Id is required!",
      });
    }

    const deletedUser = await User.findOneAndDelete({ aadharId });

    if (!deletedUser) {
      return res.status(404).json({
        message: "User with specified aadhar not found!",
      });
    }

    res.status(200).json({
      message: "User Deleted successfully!",
    });
  } catch (error) {
    console.log("Error _ handleDeleteUserByAadhar: ", error);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// GET "/api/filter-transactions?aadharId=xxxx...&after=Date.now()"
const handleFilterTransactions = async (req, res) => {
  try {
    const { aadharId, after } = req.query;

    if (!aadharId || !after) {
      return res.status(400).json({ message: "Missing aadharId or after timestamp" });
    }

    const user = await User.findOne({ aadharId });
    if (!user) {
      return res.status(404).json({ message: "User not found in bank database" });
    }

    const afterTimestamp = Number(after);

    // Fix _
    const filteredCredits = user.credits.filter((credit) => credit.timestamps > afterTimestamp);
    const filteredDebits = user.debits.filter((debit) => debit.timestamps > afterTimestamp);

    return res.status(200).json({
      credits: filteredCredits,
      debits: filteredDebits,
    });

  } catch (error) {
    console.error("Error filtering transactions:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserByAaadhar,
  handleCreateNewUser,
  handleAddMoney,
  handleDeductMoney,
  handleGetTotalMoney,
  handleDeleteUserByAadhar,
  handleFilterTransactions
};
