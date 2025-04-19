const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        reuired: true,
    },
    lastName: {
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
}, { timestamps: true });

// userSchema.pre("save", async function () {
//     if (!this.isModified("aadharId")) return;
//     this.aadharId = await bcrypt.hash(this.aadharId, 10);
// })

// Hashing comes with its own problem, now user with same aadhar can be created multiple times

// userSchema.methods.matchPasswords = function (aadhar) {
//     return bcrypt.compare(aadhar, this.aadharId)
// }

const User = mongoose.model("user", userSchema);

module.exports = User;