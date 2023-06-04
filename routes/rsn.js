const express = require("express");
const router = express.Router();
const connection = require("../dbconnection");

router.get("/view-invoices/:invoicecode", (req, res) => {
    const invoicecode = req.params.invoicecode
    //fetch invoicecodes from the invoice_master
    const query = `SELECT * FROM invoice_master WHERE invoicecode = ${invoicecode}`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
      }
      else{
        res.send(results)
      }
  })
});

router.get("/view-invoices/", (req, res) => {
    //fetch invoicecodes from the invoice_master
    const query = `SELECT * FROM invoice_master WHERE invoice_type IN ("return")`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
      }
      else{
        res.send(results)
      }
  })
});

router.post("/confirm-pullout/:invoicecode", (req, res) => {
  const invoicecode = parseInt(req.params.invoicecode);
  const { pullout_status, pullout_date } = req.body;
  //fetch invoicecodes from the invoice_master
  const selectInvoice = `SELECT pullout_status, pullout_date FROM invoice_master WHERE invoicecode = ${invoicecode}`;
  connection.query(selectInvoice, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
    } else {
      const updateInvoice = `UPDATE invoice_master SET pullout_status = '${pullout_status}', pullout_date = '${pullout_date}' WHERE invoicecode = ${invoicecode}`;
      connection.query(updateInvoice, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
        } else {
          res.send(results);
        }
      });
    }
  });
});



module.exports = router