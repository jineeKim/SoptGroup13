var express = require("express");
var router = express.Router();

router.use("/comics", require("./comics"));
router.use("/comments", require("./comments"));
router.use("/main", require("./main"));
router.use("/user", require("./user/index"));

module.exports = router;
