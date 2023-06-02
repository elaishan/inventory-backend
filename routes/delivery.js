const express = require("express");
const router = express.Router();
const connection = require("../dbconnection");

// router.get("/view-invoices/:invoicecode", (req, res) => {
//     const {invoicecode} = req.body
//     //fetch invoicecodes from the invoice_master
//     const query = `SELECT * FROM invoice_master WHERE invoicecode = ${invoicecode}`;
//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error('Error executing MySQL query:', err);
//       }
//       else{
//         res.send(results)
//       }
//   })
// });

router.get("/view-invoices/", (req, res) => {
    //fetch invoicecodes from the invoice_master
    const query = `SELECT * FROM invoice_master WHERE invoice_type IN ("charge sales", "sales", "backorder")`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
      }
      else{
        res.send(results)
      }
  })
});

router.post("/confirm-delivery/", (req, res) => {
    const { delivery_status, delivery_date, invoicecode } = req.body
    //fetch invoicecodes from the invoice_master
    const selectInvoice = `SELECT delivery_status, delivery_date FROM invoice_master WHERE invoicecode = ${invoicecode}`;
    connection.query(selectInvoice, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
      }
      else{
        const updateInvoice = `UPDATE invoice_master SET delivery_status = '${delivery_status}' AND delivery_date = '${delivery_date}' WHERE invoicecode = ${invoicecode}`
            connection.query(updateInvoice, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
            }
            else{
                res.send("Delivery Status and Delivery Date is successfully updated!")
            }
         })
    }
  })
});


module.exports = router