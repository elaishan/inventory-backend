
const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();


router.post("/", (req, res) => {
  const { productcode, description } = req.body;
  // Fetch orderquantity from the invoice_details
  const productQuery = `SELECT orderquantity FROM invoice_details WHERE productcode = ? AND description = ?`;
  connection.query(productQuery, [productcode, description], (error, productResult) => {
    if (error) {
      console.error("Error querying invoice_details table:", error);
      return res.status(500).send("Internal Server Error");
    }
    // Calculate the combined total quantity
    let combinedTotalQuantity = 0;
    for (let i = 0; i < productResult.length; i++) {
      combinedTotalQuantity += productResult[i].orderquantity;
    }
    // Send the combinedTotalQuantity as the response
    return res.status(200).json({ combinedTotalQuantity });
  });
});



  module.exports = router;