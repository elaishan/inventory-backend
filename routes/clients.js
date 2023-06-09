const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();


// INSERT
router.post("/insertclients", (req, res) => {
  const { clientcode, fname, mname, lname, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid, client_type } = req.body;

  const selectAgentSql = `SELECT agentcode FROM agents WHERE agentcode = '${agentcode}'`;

  // Query to check if agent code exists in agents table
  connection.query(selectAgentSql, function (err, agentResult, fields) {
    if (err) {
      // Return error message to client
      res.send(err);
    } else {

      const selectClientSql = `SELECT clientcode FROM clients WHERE clientcode = '${clientcode}'`;

      // Query to check if client already exists
      connection.query(selectClientSql, function (err, clientResult, fields) {
        if (err) {
          // Return error message to client
          res.send(err);
        } else if (agentResult.length === 0 && clientResult.length > 0) {
          // Return error message to client if client already exists and Agent Code doesn't exist
            res.send({ message: "Client Code already exists and Agent Code doesn't exist in the Database." });
        } else if (agentResult.length === 0) {
          // Return error message to client if agent code does not exist
            res.send({ message: "Agent code does not exist." });
        } else if (clientResult.length > 0) {
          // Return error message to client if client already exists
          res.send({ message: "Client code already exists for an existing client." });
        } else {
          // Query to insert new client into table "clients"
          const insertSql = `INSERT INTO clients (clientcode, fname, mname, lname, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid, client_type) 
                              VALUES ("${clientcode}", "${fname}", "${mname}", "${lname}", ${phonenumber},"${areacode}", "${areaname}", ${agentcode}, ${creditlimit}, ${terms}, ${branchid}, "${client_type}")`;

          connection.query(insertSql, function (err, result, fields) {
            if (err) {
              // Return error message to client
              res.send({ message: "Bakit ayaw gumana ng add" });
            } else {
              // Return success message to client
              res.send({ success: "Client added successfully." });
            }
          });
        }
      });
    }
  });
});




/*========================================================================================================================*/

//SELECT
//view single client
router.get("/viewclients/:clientid", (req,res) => {
    const id = req.params.clientid
    //query for viewing
    connection.query("SELECT * FROM clients WHERE clientid = " + "\"" + id + "\"" , function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

//view all client
router.get("/viewclients/", (req,res) => {
    //query for viewing
    connection.query("SELECT * FROM clients", function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

/*========================================================================================================================*/

//UPDATE
router.put("/editclients/:clientid", (req, res) => {
  
  const { clientcode, fname, mname, lname, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid, client_type } = req.body;
  const id = req.params.clientid;

  const selectSql = `SELECT * FROM clients WHERE clientcode = ? AND clientid != ?`;
  const selectParams = [clientcode, id]; 

  // Query to check if client already exists
  connection.query(selectSql, selectParams, function (err, result, fields) {
    if (err) {
      // Return error message to client
      res.send(err);
    } else {
        const selectAgentSql = `SELECT agentcode FROM agents WHERE agentcode = '${agentcode}'`;
        // Query to check if agent code exists in agents table
        connection.query(selectAgentSql, function (err, agentResult, fields) {
        if (err) {
        // Return error message to client
        res.send(err);
        } else {
            const selectClientSql = `SELECT clientcode FROM clients WHERE clientcode = '${clientcode}'`;

            // Query to check if client already exists
            connection.query(selectClientSql, function (err, clientResult, fields) {
            if (err) {
            // Return error message to client
            res.send(err);
            } else if (agentResult.length === 0 && clientResult.length > 0) {
            // Return error message to client if client already exists and Agent Code doesn't exist
            res.send({ message: "Client Code already exists and Agent Code doesn't exist in the Database." });
            } else if (agentResult.length === 0) {
            // Return error message to client if agent code does not exist
            res.send({ message: "Agent code does not exist." });
            } else if (result.length > 0 ) {
            // Return error message to client if client already exists
            res.send({ message: "Client code already exists for an existing client." });
            } else {
                // Query to update the client in table "clients"
                const updateSql = `UPDATE clients SET clientcode = ?, fname = ?, mname = ?, lname = ?, phonenumber = ?, areacode = ?, areaname = ?, agentcode = ?, creditlimit = ?, terms = ?, branchid = ?, client_type = ? WHERE clientid = ?`;
                const updateParams = [clientcode, fname, mname, lname, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid, client_type, id];

                connection.query(updateSql, updateParams, function (err, result, fields) {
                if (err) {
                // Return error message to client
                res.send(err);
                } else {
                // Return success message to client
                res.send({ success: "Client updated successfully." });
                }
                });
            }
          });
        }
      });  
    }
  });  
});

// router.put("/editclients/:clientid", (req, res) => {
//   const { clientcode, name, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid } = req.body;
//   const id = req.params.clientid;

//   const selectSql = `SELECT * FROM clients WHERE clientcode = ? AND clientid != ?`;
//   const selectParams = [clientcode, id];

//   // Query to check if client already exists
//   connection.query(selectSql, selectParams, function (err, result, fields) {
//     if (err) {
//       // Return error message to client
//       res.send(err);
//     } else if (result.length > 0) {
//       // Return error message to client if client already exists
//       res.send({ message: "Client code is already existing." });
//     } else {
//       // Query to update the client in table "clients"
//       const updateSql = `UPDATE clients SET clientcode = ?, name = ?, phonenumber = ?, areacode = ?, areaname = ?, agentcode = ?, creditlimit = ?, terms = ?, branchid = ? WHERE clientid = ?`;
//       const updateParams = [clientcode, name, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid, id];

//       connection.query(updateSql, updateParams, function (err, result, fields) {
//         if (err) {
//           // Return error message to client
//           res.send(err);
//         } else {
//           // Return success message to client
//           res.send({ success: "Client updated successfully." });
//         }
//       });
//     }
//   });
// });


/*========================================================================================================================*/

//DELETE
router.delete("/deleteclients/:id", (req, res) => {
  const id = req.params.id;

  // query for deleting
  connection.query("DELETE FROM clients WHERE clientid = " + id, function (error, result, fields) {
    if (error) {
      console.log("error:" + error);
      res.status(500).send("Error deleting client");
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send("Client not found");
      } else {
        res.send("Successfully deleted");
      }
    }
  });
});



module.exports = router;