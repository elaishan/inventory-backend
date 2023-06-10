const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

router.get("/viewgraph/:productcode", (req,res) => {
  const code = req.params.productcode
  //query for viewing
  connection.query("SELECT * FROM invoice_details WHERE productcode = " + "\"" + code + "\"" , function(error, result, fields){
      if(error){
          console.error(error)
      }else{
          res.send(result)
      }
  })
});

router.get("/graph", (req, res) => {
  let url = "";
  if (req.query.invoiceid) {
    url += "WHERE invoiceid = " + "'" + req.query.invoiceid + "'";
  } else if (req.query.orderBy) {
    url += "ORDER BY " + req.query.orderBy + " " + req.query.criteria;
  }

  const productcode = req.query.productcode;

  const query = `
  SELECT invoice_details.orderquantity, invoice_master.salesorder_date
  FROM invoice_details
  INNER JOIN invoice_master ON invoice_details.invoicecode = invoice_master.invoicecode
  WHERE invoice_master.invoice_type IN ('sales', 'charge sales')
  AND invoice_details.productcode = '${productcode}' 
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

router.get('/product-info/:productcode', (req, res) => {
  const productcode = req.params.productcode;

  if (!productcode) {
    res.status(400).json({ error: 'Product code is missing' });
    return;
  }

  const query = `
  SELECT i.productcode, p.description, p.category, p.reorderlevel, p.manufacturer, p.cost, p.form, p.price
  FROM invoice_details AS i
  INNER JOIN stocks AS p ON i.productcode = p.productcode
  WHERE i.productcode = ?
  GROUP BY i.productcode, p.description, p.category, p.reorderlevel, p.manufacturer, p.cost, p.form, p.price 
  LIMIT 1
`;



  connection.query(query, [productcode], (err, results) => {
    if (err) {
      res.send({ error: 'Error executing the query' });
      throw err;
    }

    if (results.length === 0) {
      res.send({ error: 'Product not found' });
      return;
    }

    // Process the query results
    const product = results[0];
    res.send(product);
  });
});




module.exports = router;
