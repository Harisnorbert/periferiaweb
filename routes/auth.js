const express = require("express");
const router = express.Router();

// GET /products - termékek listája
router.get("/", (req, res) => {
  res.json([{ id: 1, name: "Példa termék" }]);
});

module.exports = router;