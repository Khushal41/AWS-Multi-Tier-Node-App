const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");

router.get("/items", itemController.getItems);
router.post("/items", itemController.addItem);

module.exports = router;
