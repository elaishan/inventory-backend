const express = require("express");
const router = express.Router();
const connection = require("../dbconnection");

router.get("/clients/", (req,res) => {
  const clientcode = req.params.clientcode
  //fetch data of selected the client from the clients table
  connection.query("SELECT * FROM statement_of_account ORDER BY soa_id DESC", function(error, result, fields){
    if(error){
      console.error(error)
    }else{
      res.send(result)
    }
})
});

router.get("/clients/:clientcode", (req,res) => {
  const clientcode = req.params.clientcode
  //fetch data of selected the client from the clients table
  const selectClient = `SELECT * FROM statement_of_account WHERE clientcode = ${clientcode} ORDER BY soa_id DESC`;
  connection.query(selectClient, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
});

router.get("/soa/:clientcode", (req,res) => {
  const clientcode = req.params.clientcode
  //fetch data of selected the client from the clients table
  const selectClient = `SELECT * FROM statement_of_account WHERE clientcode = ${clientcode} ORDER BY soa_id ASC`;
  connection.query(selectClient, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
});


router.post("/insert-payment", (req, res) => {
  const { clientcode, fname } = req.body;
  const selectClient = `SELECT runningbalance FROM statement_of_account WHERE clientcode = ${clientcode} AND fname = '${fname}' ORDER BY soa_id DESC LIMIT 1`;

  connection.query(selectClient, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const runningbalance = parseFloat(result[0].runningbalance);
      const { orpr, or_date, totalamount } = req.body;
      console.log(runningbalance);

      const parsedTotalAmount = parseFloat(totalamount);
      if (parsedTotalAmount > runningbalance) {
        res.send({ message: "The total amount exceeds the balance amount!"});
      } else if (parsedTotalAmount === 0) {
        res.send({ message: "Cannot be 0"});
      } else if (parsedTotalAmount <= runningbalance) {
        const debit = null;
        const credit = parsedTotalAmount;
        const productcode = null;

        // Calculate the new running balance by subtracting credit from the running balance obtained from the database
        const newRunningBalance = runningbalance - credit;
        const runningbal = runningbalance;

        const insertStatement = `INSERT INTO statement_of_account (clientcode, fname, refno, invoice_date, debit, credit, runningbalance, productcode) 
        VALUES (${clientcode}, '${fname}', ${orpr}, '${or_date}', ${debit}, ${credit}, ${newRunningBalance}, ${productcode})`;

        connection.query(insertStatement, (err, result) => {
          if (err) {
            res.send(err);
          } else {
            // Insert the new running balance into the balanceamount column of the payments table
            const insertPayment = `INSERT INTO payments (orpr, or_date, clientcode, fname, totalamount, balanceamount) 
              VALUES (${orpr}, '${or_date}', ${clientcode}, '${fname}', ${parsedTotalAmount}, ${runningbal})`;
            connection.query(insertPayment, (err, result) => {
              if (err) {
                res.send(err); // Set appropriate status code and send the error message
              } else {
                res.send(result); // Set appropriate status code and send the result
              }
            });
          }
        });
      } else {
        res.send({ message: "Invalid total amount"});
      }
    }
  });
});

module.exports = router;
