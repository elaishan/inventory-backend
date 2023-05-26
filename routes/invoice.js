const express = require("express");
const router = express.Router();
const connection = require("../dbconnection");

router.get("/clients/", (req,res) => {
  //query for viewing
  connection.query("SELECT * FROM clients", function(error, result, fields){
      if(error){
          console.error(error)
      }else{
          res.send(result)
      }
  })
});

router.get("/clients/:clientcode", (req,res) => {
  const clientcode = req.params.clientcode
  //query for viewing
  connection.query("SELECT * FROM clients WHERE clientid = " + "\"" + clientcode + "\"" , function(error, result, fields){
    if(error){
        console.error(error)
    }else{
        res.send(result)
    }
})
});

router.get("/agents/", (req, res) => {
  //query for viewing
  connection.query("SELECT * FROM agents", function(error, result, fields){
    if(error){
        console.error(error)
    }else{
        res.send(result)
    }
})
});

router.get("/agents/:agentcode", (req, res) => {
  const agentcode = req.params.agentcode
  //query for viewing
  connection.query("SELECT * FROM agents WHERE agentid = " + "\"" + agentcode + "\"" , function(error, result, fields){
    if(error){
        console.error(error)
    }else{
        res.send(result)
    }
  })
});

router.get("/stocks/", (req, res) => {
  //query for viewing
  connection.query("SELECT * FROM stocks", function(error, result, fields){
    if(error){
        console.error(error)
    }else{
        res.send(result)
    }
})
});

router.get("/stocks/:branchid", (req, res) => {
  const branchid = req.params.branchid
  //query for viewing
  connection.query("SELECT * FROM stocks WHERE branchid = " + "\"" + branchid + "\"" , function(error, result, fields){
    if(error){
        console.error(error)
    }else{
        res.send(result)
    }
  })
});

router.post("/insertinvoice", (req, res) => {
  // Invoice master
  const {
    invoicecode = parseInt(req.body.invoicecode), invoice_date, invoice_type, salesorder_reason, salesorder_date, clientcode, agentcode,
    netamount, discount, totalamount, rebate, rebateamount
  } = req.body;
  
  // Validate if the client exists in the client table
  const clientQuery = `SELECT name, areaname, agentcode FROM clients WHERE clientcode = ${clientcode}`;
  connection.query(clientQuery, (error, clientResults) => {
    if (error) {
      console.error("Error retrieving client data:", error);
      return res.status(500).send("Internal Server Error");
    }

    if (clientResults.length === 0) {
      return res.status(400).send("Invalid clientcode");
    }

    const { name, areaname } = clientResults[0];

    // Validate if the agent matches the client's agentcode
    const agentQuery = `SELECT a_name FROM agents WHERE agentcode = '${agentcode}'`;
    connection.query(agentQuery, (error, agentResults) => {
      if (error) {
        console.error("Error retrieving agent data:", error);
        return res.status(500).send("Internal Server Error");
      }
  
      if (agentResults.length === 0) {
        return res.status(400).send("Invalid agentcode");
      }
  
      const { a_name } = agentResults[0];
  
      // Insert into invoice_master table
      const invoiceMasterQuery = `INSERT INTO invoice_master (
        invoicecode, invoice_date, invoice_type, salesorder_reason, salesorder_date, clientcode, name, 
        areaname, agentcode, a_name, netamount, discount, totalamount, rebate, rebateamount ) VALUES 
        (${invoicecode}, '${invoice_date}', '${invoice_type}', '${salesorder_reason}', '${salesorder_date}', ${clientcode}, '${name}', '${areaname}', ${agentcode}, '${a_name}', ${netamount}, ${discount}, ${totalamount}, ${rebate}, ${rebateamount})`;
      // Insert into invoice_details table
      // (assuming the details are provided in the request body)

      // Execute the queries
      connection.query(invoiceMasterQuery, (error, masterResults) => {
        if (error) {
          console.error("Error inserting into invoice_master table:", error);
          return res.status(500).send("Internal Server Error");
        }
        console.log("invoice master successfully inserted!");

       // Invoice details
const { invoicecode: invoicecodeDetails, productcode, orderquantity, unitcost, linediscount, lineamount, rebate: rebateDetails } = req.body;

// Get agent's branchid
const agentBranchQuery = `SELECT branchid FROM agents WHERE agentcode = ${agentcode}`;
connection.query(agentBranchQuery, (error, agentBranchResult) => {
  if (error) {
    console.error("Error querying agents table:", error);
    return res.status(500).send("Internal Server Error");
  }

  if (agentBranchResult.length === 0) {
    return res.status(400).send("Invalid agentid");
  }

  const branchid = agentBranchResult[0].branchid;

  // Get product information for the given branch with the earliest expiration date
  const productQuery = `SELECT quantity, price, description FROM stocks WHERE productcode = ${productcode} AND branchid = ${branchid}`;
  connection.query(productQuery, (error, productResult) => {
    if (error) {
      console.error("Error querying stocks table:", error);
      return res.status(500).send("Internal Server Error");
    }

    if (productResult.length === 0) {
      return res.status(400).send("There's no product available");
    }

    const product = productResult[0];
    const availableQuantity = product.quantity;

    if (availableQuantity < orderquantity) {
      return res.status(400).send("Insufficient quantity in stock");
    }

    // Update product quantity
    const updateQuery = `UPDATE stocks SET quantity = quantity - ${orderquantity} WHERE productcode = ${productcode} AND branchid = ${branchid} ORDER BY expiration_date ASC LIMIT 1`;
    connection.query(updateQuery, (error, updateResult) => {
      if (error) {
        console.error("Error updating stocks table:", error);
        return res.status(500).send("Internal Server Error");
      }

      if (updateResult.affectedRows === 0) {
        return res.status(500).send("Failed to update product quantity");
      }

      // Delete rows with zero quantity
      const deleteQuery = `DELETE FROM stocks WHERE quantity = 0 AND productcode = ${productcode} AND branchid = ${branchid}`;
      connection.query(deleteQuery, (error, deleteResult) => {
        if (error) {
          console.error("Error deleting rows from stocks table:", error);
          return res.status(500).send("Internal Server Error");
        }

        // Insert into invoice_details table
        const invoiceDetailsQuery = `INSERT INTO invoice_details (
          invoicecode, productcode, orderquantity, unitcost, linediscount, lineamount, rebate, rebateamount ) 
          VALUES (${invoicecodeDetails}, ${productcode}, ${orderquantity}, ${unitcost}, ${linediscount}, ${lineamount}, ${rebateDetails}, ${rebateamount})`;

        connection.query(invoiceDetailsQuery, (error, detailsResults) => {
          if (error) {
            console.error("Error inserting into invoice_details table:", error);
            return res.status(500).send("Internal Server Error");
          } else {
            console.log("Invoice details successfully inserted!");
          }
          if (detailsResults.affectedRows === 0) {
            return res.status(500).send("Failed to insert data into invoice_details table");
          }

          // Return success response
          return res.status(200).send("Invoice details successfully processed");
        });
      });
    });
  });
});
                       
      });
    });
  });
});

module.exports = router;