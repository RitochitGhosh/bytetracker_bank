const express = require("express");
const {
    handleGetAllUsers,
    handleGetUserByAaadhar,
    handleCreateNewUser,
    handleAddMoney,
    handleDeductMoney,
    handleGetTotalMoney,
    handleDeleteUserByAadhar,
    handleFilterTransactions,
} = require("../controllers/user-controller");

const router = express.Router();

router
    .route("/")
    .get(handleGetAllUsers)
    .post(handleCreateNewUser)

router
    .route("/user")
    .get(handleGetUserByAaadhar)
    .delete(handleDeleteUserByAadhar)

router.get("/total", handleGetTotalMoney);
router.post("/add-money", handleAddMoney);
router.post("/deduct-money", handleDeductMoney);
router.get("/filter-transactions", handleFilterTransactions);



module.exports = router;