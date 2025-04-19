const express = require("express");
const {
    getAllUsers,
    getUserByAaadhar,
    createNewUser,
    addMoney,
    deductMoney,
    getTotalMoney,
} = require("../controllers/user-controller");

const router = express.Router();

router
    .route("/")
    .get(getAllUsers)
    .post(createNewUser)

router.get("/user", getUserByAaadhar)

router.get("/total", getTotalMoney);

router.post("/add-money", addMoney);

router.post("/deduct-money", deductMoney);


module.exports = router;