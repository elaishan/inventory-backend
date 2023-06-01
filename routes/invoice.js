const express = require("express");
const router = express.Router();
const connection = require("../dbconnection");

router.get("/clients/", (req,res) => {
  //fetch data from clients table
  connection.query("SELECT * FROM clients", function(error, result, fields){
      if(error){
        console.error(error)
      }else{
        res.send(result)
      }
  })
});

//========================================================//

router.get("/clients/:clientcode", (req,res) => {
  const clientcode = req.params.clientcode
  //fetch data of selected the client from the clients table
  connection.query("SELECT * FROM clients WHERE clientid = " + "\"" + clientcode + "\"" , function(error, result, fields){
    if(error){
      console.error(error)
    }else{
      res.send(result)
    }
})
});

//========================================================//

router.get("/agents/", (req, res) => {
  //fetch data from the agents table
  connection.query("SELECT * FROM agents", function(error, result, fields){
    if(error){
      console.error(error)
    }else{
      res.send(result)
    }
})
});

//========================================================//

router.get("/agents/:agentcode", (req, res) => {
  const agentcode = req.params.agentcode
  //fetch data of selected agent from the agents table
  connection.query("SELECT * FROM agents WHERE agentid = " + "\"" + agentcode + "\"" , function(error, result, fields){
    if(error){
      console.error(error)
    }else{
      res.send(result)
    }
  })
});

//========================================================//

router.get("/stocks/", (req, res) => {
  //fetch data from stocks table
  connection.query("SELECT * FROM stocks", function(error, result, fields){
    if(error){
      console.error(error)
    }else{
      res.send(result)
    }
})
});

//========================================================//

router.get("/stocks/:branchid", (req, res) => {
  const branchid = req.params.branchid
  //fetch products that has the specific branchid from the stocks table
  connection.query("SELECT * FROM stocks WHERE branchid = " + "\"" + branchid + "\"" , function(error, result, fields){
    if(error){
      console.error(error)
    }else{
      res.send(result)
    }
  })
});

//========================================================//

router.get("/invoicecodes/", (req, res) => {
  //fetch invoicecodes from the invoice_master
  const query = 'SELECT invoicecode FROM invoice_master';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'An internal server error occurred' });
      return;
    }
    const invoiceCodes = results.map((result) => result.invoicecode);
    res.json({ invoiceCodes });
  });
});

//========================================================//

router.post("/insertinvoice", (req, res) => {
  // Inserting invoice
  const {
    invoicecode = parseInt(req.body.invoicecode), invoice_date, invoice_type, salesorder_reason, salesorder_date, clientcode, agentcode,
    netamount, discount, totalamount, modeofpayment
  } = req.body;
  
  // Validate if the client exists in the client table
  const clientQuery = `SELECT name, areaname, agentcode FROM clients WHERE clientcode = ${clientcode}`;
  connection.query(clientQuery, (error, clientResults) => {
    if (error) {
      console.error("Error retrieving client data:", error);
      return res.send("Internal Server Error");
    }

    if (clientResults.length === 0) {
      return res.send("Invalid clientcode");
    }

    const { name, areaname } = clientResults[0];

    // Validate if the agent matches the client's agentcode
    const agentQuery = `SELECT a_name FROM agents WHERE agentcode = '${agentcode}'`;
    connection.query(agentQuery, (error, agentResults) => {
      if (error) {
        console.error("Error retrieving agent data:", error);
        return res.send("Internal Server Error");
      }
  
      if (agentResults.length === 0) {
        return res.send("Invalid agentcode");
      }
  
      const { a_name } = agentResults[0];
  
      // Invoice details
      const { invoicecode: invoicecodeDetails, productcode, description, orderquantity, unitcost, linediscount, lineamount, status} = req.body;

      // Get agent's branchid
      const agentBranchQuery = `SELECT branchid FROM agents WHERE agentcode = ${agentcode}`;
      connection.query(agentBranchQuery, (error, agentBranchResult) => {
        if (error) {
          console.error("Error querying agents table:", error);
          return res.send("Internal Server Error");
        }

        if (agentBranchResult.length === 0) {
          return res.send("Invalid agentid");
        }

        const branchid = agentBranchResult[0].branchid;

        // Get product information for the given branch with the earliest expiration date
        const productQuery = `SELECT quantity, price, description, expiration_date FROM stocks WHERE productcode = ${productcode} AND branchid = ${branchid} ORDER BY expiration_date ASC`;
        connection.query(productQuery, (error, productResult) => {
          if (error) {
            console.error("Error querying stocks table:", error);
            return res.send("Internal Server Error");
          }

          if (productResult.length === 0) {
            return res.send("There's no product available");
          }

          let remainingQuantity = orderquantity;
          const updatePromises = [];

          // Calculate the combined total quantity
          let combinedTotalQuantity = 0;
          for (let i = 0; i < productResult.length; i++) {
            combinedTotalQuantity += productResult[i].quantity;
          }

          // Check if orderquantity is less than or equal to the combined total quantity
          if (orderquantity <= combinedTotalQuantity) {
            //Check if the invoice type is return and it is a good stock
            if (invoice_type === 'return') {
              const rQuery = `SELECT * FROM statement_of_account WHERE clientcode = ${clientcode} AND productcode = ${productcode}`;
                connection.query(rQuery, (error, rResult) => {
                  if (error) {
                    console.error("Error querying statement of account table:", error);
                    return res.send("Internal Server Error");
                  } 
                  else if (rResult.length === 0) {
                    console.log('Client Did Not Order The Product!');
                  }
                  else {
                    if (status === 'good stock') {
                      for (let i = 0; i < productResult.length; i++) {
                        const currentProduct = productResult[i];
                        const currentQuantity = currentProduct.quantity;
                        const quantityToUpdate = Math.min(currentQuantity, remainingQuantity);
          
                        if (quantityToUpdate > 0) {
                          const updatedStocks = `UPDATE stocks SET quantity = quantity + ${quantityToUpdate} WHERE productcode = ${productcode} 
                                      AND branchid = ${branchid}`;
                          updatePromises.push(
                            new Promise((resolve, reject) => {
                              connection.query(updatedStocks, (error, updateResult) => {
                                if (error) {
                                  reject(error);
                                } else {
                                  resolve(updateResult.affectedRows);
                                }
                              });
                            })
                          );
                        }
                        remainingQuantity -= quantityToUpdate;
            
                        if (remainingQuantity <= 0) {
                          responseSent = true;
                          break;
                        }
                      }
                    }
                    else if (status === 'bad stock') {
                      console.log('Product cannot be sold again!');
                    }
                    else {
                      console.log('Choose the status of the product!');
                    }
                    const returnQuery = `SELECT debit, runningbalance FROM statement_of_account WHERE clientcode = ${clientcode} AND productcode = ${productcode} ORDER BY soa_id DESC`;
                    connection.query(returnQuery, (error, soaResult) => {
                      if (error) {
                        console.error("Error querying statement of account table:", error);
                        return res.send("Internal Server Error");
                      } 
                      else {
                        const { clientcode, name, productcode, totalamount, debit } = req.body;
      
                        const credit = totalamount;
                        const parsedDebit = parseFloat(debit);
                        const runningBalanceFromDB = parseFloat(soaResult[0].runningbalance);
      
                        // Check if parsedDebit is a valid number
                        const newDebit = isNaN(parsedDebit) ? 0 : parsedDebit;
      
                        // Calculate the new running balance by subtracting credit from the running balance obtained from the database
                        const newRunningBalance = runningBalanceFromDB - credit;
      
                        const newDebitQuery = `INSERT INTO statement_of_account (clientcode, name, refno, invoice_date, debit, credit, runningbalance, productcode) 
                        VALUES (${clientcode}, '${name}', ${invoicecode}, '${invoice_date}', ${newDebit}, ${credit}, ${newRunningBalance}, ${productcode})`;
      
                        connection.query(newDebitQuery, (error, result) => {
                          if (error) {
                            console.error("Error inserting statement of account:", error);
                            return res.send("Internal Server Error");
                          } else {
                            console.log(result);
                            // Statement of Account successfully inserted
                            // You can send a response here if needed
                          }
                        });
                      }
                    });
                  }
                });
            }
            else if (invoice_type === 'backorder') {
              console.log("backorder")
            } 
            else {
              for (let i = 0; i < productResult.length; i++) {
                const currentProduct = productResult[i];
                const currentQuantity = currentProduct.quantity;
                const quantityToUpdate = Math.min(currentQuantity, remainingQuantity);
  
                if (quantityToUpdate > 0) {
                  const updateQuery = `UPDATE stocks SET quantity = quantity - ${quantityToUpdate} WHERE productcode = ${productcode} AND branchid = ${branchid} AND expiration_date = '${currentProduct.expiration_date}'`;
                  updatePromises.push(
                    new Promise((resolve, reject) => {
                      connection.query(updateQuery, (error, updateResult) => {
                        if (error) {
                          reject(error);
                        } else {
                          resolve(updateResult.affectedRows);
                        }
                      });
                    })
                  );
                }
  
                remainingQuantity -= quantityToUpdate;
  
                if (remainingQuantity <= 0) {
                  responseSent = true;
                  break;
                }
              }
            }
          } else {
            // Handle case when orderquantity is greater than the combined total quantity
            return res.send("Order quantity exceeds available quantity");
          }

          Promise.all(updatePromises)
            .then((affectedRows) => {
              const deletedRows = affectedRows.filter((rows) => rows > 0).length;

              // Delete rows with zero quantity
              const deleteQuery = `DELETE FROM stocks WHERE quantity = 0 AND productcode = ${productcode} AND branchid = ${branchid}`;
              connection.query(deleteQuery, (error, deleteResult) => {
                if (error) {
                  console.error("Error deleting rows from stocks table:", error);
                  return res.send("Internal Server Error");
                }

                if (deleteResult.affectedRows > 0) {
                  console.log("Deleted", deleteResult.affectedRows, "rows with zero quantity");
                }
                
                if (invoice_type === 'backorder') {
                  const boQuery = `SELECT * FROM statement_of_account WHERE clientcode = ${clientcode} AND productcode = ${productcode}`;
                  connection.query(boQuery, (error, boResult) => {
                    if (error) {
                      console.error("Error querying statement of account table:", error);
                      return res.send("Internal Server Error");
                    } 
                    else if (boResult.length === 0) {
                      console.log('No Record Found!');
                    }
                    else {
                      // Insert into invoice_master table
                      const invoiceMasterQuery = `INSERT INTO invoice_master (
                        invoicecode, invoice_date, invoice_type, salesorder_reason, salesorder_date, clientcode, name, 
                        areaname, agentcode, a_name, netamount, discount, totalamount, modeofpayment ) VALUES 
                        (${invoicecode}, '${invoice_date}', '${invoice_type}', '${salesorder_reason}', '${salesorder_date}', ${clientcode}, '${name}', '${areaname}', ${agentcode}, '${a_name}', ${netamount}, ${discount}, ${totalamount}, '${modeofpayment}')`;
                      // Insert into invoice_details table
                      // (assuming the details are provided in the request body)

                      // Execute the queries
                      connection.query(invoiceMasterQuery, (error, masterResults) => {
                        if (error) {
                          console.error("Error inserting into invoice_master table:", error);
                          return res.send("Internal Server Error");
                        }
                        console.log("invoice master successfully inserted!");

                      });
                      // Insert into invoice_details table
                      const invoiceDetailsQuery = `INSERT INTO invoice_details (invoicecode, productcode, description, orderquantity, unitcost, linediscount, lineamount, status) 
                      VALUES (${invoicecodeDetails}, ${productcode}, '${description}', ${orderquantity}, ${unitcost}, ${linediscount}, ${lineamount},'${status}')`;

                      connection.query(invoiceDetailsQuery, (error, detailsResults) => {
                        if (error) {
                          console.error("Error inserting into invoice_details table:", error);
                          return res.send("Internal Server Error");
                        } else {
                          console.log("Invoice details successfully inserted!");
                        }

                        if (detailsResults.affectedRows === 0) {
                          return res.send("Failed to insert data into invoice_details table");
                        }
                        // Return success response
                        return res.send("Invoice details successfully processed");
                      });
                    }
                  });
                } 
                else if (invoice_type === 'return') {
                  const rnQuery = `SELECT * FROM statement_of_account WHERE clientcode = ${clientcode} AND productcode = ${productcode}`;
                  connection.query(rnQuery, (error, rnResult) => {
                    if (error) {
                      console.error("Error querying statement of account table:", error);
                      return res.send("Internal Server Error");
                    } 
                    else if (rnResult.length === 0) {
                      console.log('No Record Found!');
                    }
                    else {
                      // Insert into invoice_master table
                      const invoiceMasterQuery = `INSERT INTO invoice_master (
                        invoicecode, invoice_date, invoice_type, salesorder_reason, salesorder_date, clientcode, name, 
                        areaname, agentcode, a_name, netamount, discount, totalamount, modeofpayment) VALUES 
                        (${invoicecode}, '${invoice_date}', '${invoice_type}', '${salesorder_reason}', '${salesorder_date}', ${clientcode}, '${name}', '${areaname}', ${agentcode}, '${a_name}', ${netamount}, ${discount}, ${totalamount}, "${modeofpayment}")`;
                      // Insert into invoice_details table
                      // (assuming the details are provided in the request body)

                      // Execute the queries
                      connection.query(invoiceMasterQuery, (error, masterResults) => {
                        if (error) {
                          console.error("Error inserting into invoice_master table:", error);
                          return res.send("Internal Server Error");
                        }
                        console.log("invoice master successfully inserted!");

                      });
                      // Insert into invoice_details table
                      const invoiceDetailsQuery = `INSERT INTO invoice_details (invoicecode, productcode, description, orderquantity, unitcost, linediscount, lineamount, status) 
                      VALUES (${invoicecodeDetails}, ${productcode}, '${description}', ${orderquantity}, ${unitcost}, ${linediscount}, ${lineamount}, '${status}')`;

                      connection.query(invoiceDetailsQuery, (error, detailsResults) => {
                        if (error) {
                          console.error("Error inserting into invoice_details table:", error);
                          return res.send("Internal Server Error");
                        } else {
                          console.log("Invoice details successfully inserted!");
                        }

                        if (detailsResults.affectedRows === 0) {
                          return res.send("Failed to insert data into invoice_details table");
                        }
                        // Return success response
                        return res.send("Invoice details successfully processed");
                      });
                    }
                  });
                }
                else {
                  // Insert into invoice_master table
                  const invoiceMasterQuery = `INSERT INTO invoice_master (
                    invoicecode, invoice_date, invoice_type, salesorder_reason, salesorder_date, clientcode, name, 
                    areaname, agentcode, a_name, netamount, discount, totalamount, modeofpayment) VALUES 
                    (${invoicecode}, '${invoice_date}', '${invoice_type}', '${salesorder_reason}', '${salesorder_date}', ${clientcode}, '${name}', '${areaname}', ${agentcode}, '${a_name}', ${netamount}, ${discount}, ${totalamount}, "${modeofpayment}")`;
                  // Insert into invoice_details table
                  // (assuming the details are provided in the request body)

                  // Execute the queries
                  connection.query(invoiceMasterQuery, (error, masterResults) => {
                    if (error) {
                      console.error("Error inserting into invoice_master table:", error);
                      return res.send("Internal Server Error");
                    }
                    console.log("invoice master successfully inserted!");

                  });
                  // Insert into invoice_details table
                  const invoiceDetailsQuery = `INSERT INTO invoice_details (invoicecode, productcode, description, orderquantity, unitcost, linediscount, lineamount, status) 
                  VALUES (${invoicecodeDetails}, ${productcode}, '${description}', ${orderquantity}, ${unitcost}, ${linediscount}, ${lineamount},'${status}')`;

                  connection.query(invoiceDetailsQuery, (error, detailsResults) => {
                    if (error) {
                      console.error("Error inserting into invoice_details table:", error);
                      return res.send("Internal Server Error");
                    } else {
                      console.log("Invoice details successfully inserted!");
                    }

                    if (detailsResults.affectedRows === 0) {
                      return res.send("Failed to insert data into invoice_details table");
                    }
                    // Insert into statement_of_account table for chargesales or sales invoice_type
                    if (invoice_type === 'charge sales' || invoice_type === 'sales') {
                      const returnQuery = `SELECT runningbalance FROM statement_of_account WHERE clientcode = ${clientcode} ORDER BY soa_id DESC`;
                      connection.query(returnQuery, (error, soaResult) => {
                        if (error) {
                          console.error("Error querying statement of account table:", error);
                          return res.send("Internal Server Error");
                        } else {
                          const { clientcode, name, invoicecode, invoice_date, totalamount, runningbalance } = req.body;
                          const debit = totalamount;

                          if (soaResult.length > 0) {
                            const runningbalance = parseFloat(soaResult[0].runningbalance) + debit;

                            const insertSOA = `INSERT INTO statement_of_account (clientcode, name, refno, invoice_date, debit, runningbalance, productcode) 
                            VALUES (${clientcode}, '${name}', ${invoicecode}, '${invoice_date}', ${debit}, ${runningbalance}, ${productcode} )`;

                            connection.query(insertSOA, (error, result) => {
                              if (error) {
                                res.send(error);
                              } else {
                                console.log(result);
                                res.send("Statement of Account inserted successfully.");
                              }
                            });
                          }
                          else if (runningbalance === 0) {
                            console.log("No running balance! Nothing to be credited!");
                          } else {
                            const runningbalance = debit;

                            const insertSOA = `INSERT INTO statement_of_account (clientcode, name, refno, invoice_date, debit, runningbalance, productcode) 
                            VALUES (${clientcode}, '${name}', ${invoicecode}, '${invoice_date}', ${debit}, ${runningbalance}, ${productcode} )`;

                            connection.query(insertSOA, (error, result) => {
                              if (error) {
                                res.send(error);
                              } else {
                                console.log(result);
                                res.send("Statement of Account inserted successfully.");
                              }
                            });
                          }
                          
                        } 
                      });
                    }
                    else {
                      // Return success response
                      return res.send("Invoice details successfully processed");
                    }
                  });
                }
              });
            })
          .catch((error) => {
            console.error("Error updating stocks table:", error);
            return res.send("Internal Server Error");
          });
        });
      });               
    });
  });
});

module.exports = router;