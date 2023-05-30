const express = require("express");
const router = express.Router();
const connection = require("../dbconnection");

router.post("/insert-payment", (req, res) => {
  const { paymentcode, orpr, or_date, clientcode, name, modeofpayment, totalamount, balanceamount, invoicecode, applyamount, applyrebate  } = req.body;

  const selectClient = `SELECT * FROM clients WHERE clientcode = ${clientcode} AND name = ${name}`;
  connection.query(selectClient, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });


});

module.exports = router;
