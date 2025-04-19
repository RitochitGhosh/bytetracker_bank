const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        reuired: true,
    },
    aadharId: {
        type: String,
        required: true,
        unique: true,
    },
    total: {
        type: Number,
        required: true,
    },
    credits: [
        {
            amount: {
                type: Number,
                required: true,
            },
            timestamps: {
                type: Number,
                default: Date.now(),
            }
        }
    ],
    debits: [
        {
            amount: {
                type: Number,
                required: true,
            },
            timestamps: {
                type: Number,
                default: Date.now(),
            }            
        }
    ]
}, { timestamps: true })

const User = mongoose.model("user", userSchema);

module.exports = User;