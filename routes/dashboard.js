const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

router.get("/graph", (req, res) => {
  let url = "";
  if (req.query.invoiceid) {
    url += "WHERE invoiceid = " + "'" + req.query.invoiceid + "'";
  } else if (req.query.orderBy) {
    url += "ORDER BY " + req.query.orderBy + " " + req.query.criteria;
  }

  const productcode = req.query.productcode;

  const query = `
    SELECT invoice_details.orderquantity
    FROM invoice_details
    INNER JOIN invoice_master ON invoice_details.invoicecode = invoice_master.invoicecode
    WHERE invoice_master.invoice_type IN ('sales', 'charge sales')
      AND invoice_details.productcode = '${productcode}'  -- Add this condition to filter by productcode
    ${url}`;

  connection.query(query, function (error, result, fields) {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
});

router.get("/", (req, res) => {
  let url = "";
  if (req.query.invoiceid) {
    url += "WHERE invoiceid = " + "'" + req.query.invoiceid + "'";
  } else if (req.query.orderBy) {
    url += "ORDER BY " + req.query.orderBy + " " + req.query.criteria;
  }

  const query = `
    SELECT invoice_details.*
    FROM invoice_details
    INNER JOIN invoice_master ON invoice_details.invoicecode = invoice_master.invoicecode
    WHERE invoice_master.invoice_type IN ('sales', 'charge sales')
    ${url}
  `;

  connection.query(query, function (error, result, fields) {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
