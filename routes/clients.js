const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

router.post("/insertclients", (req, res) => {
  const { clientcode, name, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid } = req.body;

  const selectAgentSql = `SELECT agentcode FROM agents WHERE agentcode = ${agentcode}`;

  // Query to check if agent code exists in agents table
  connection.query(selectAgentSql, function (err, agentResult, fields) {
    if (err) {
      // Return error message to client
      res.send(err);
    } else if (agentResult.length === 0) {
      // Return error message to client if agent code does not exist
      res.send(`Agent code does not exist.`);
    } else {

      const selectClientSql = `SELECT clientcode FROM clients WHERE clientcode = '${clientcode}'`;

      // Query to check if client already exists
      connection.query(selectClientSql, function (err, clientResult, fields) {
        if (err) {
          // Return error message to client
          res.send(err);
        } else if (clientResult.length > 0) {
          // Return error message to client if client already exists
          res.send(`Client code already exist for an existing client.`);
        } else {
          // Query to insert new client into table "clients"
          const insertSql = `INSERT INTO clients (clientcode, name, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid) 
                              VALUES ("${clientcode}", "${name}", ${phonenumber},"${areacode}", "${areaname}", ${agentcode}, ${creditlimit}, ${terms}, ${branchid})`;

          connection.query(insertSql, function (err, result, fields) {
            if (err) {
              // Return error message to client
              res.send(err);
            } else {
              // Return success message to client
              res.send("Successfully inserted.");
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
  const { clientcode, name, phonenumber, areacode, areaname, agentcode, creditlimit, terms, branchid } = req.body;
  const id = req.params.clientid;
  const selectSql = `SELECT * FROM clients WHERE clientcode = '${clientcode}' AND clientid != '${id}'`;

  // Query to check if client already exists
  connection.query(selectSql, function (err, result, fields) {
    if (err) {
      // Return error message to client
      res.send(err);
    } else if (result.length > 0) {
      // Return error message to client if client already exists
      res.send("Client code is already existing.");
    } else {
      // Query to update the client in table "clients"
      const updateSql = `UPDATE clients SET clientcode = ${clientcode}, name = "${name}", phonenumber = "${phonenumber}", areacode = "${areacode}", areaname = "${areaname}",
      agentcode = ${agentcode}, creditlimit = ${creditlimit},  terms = ${terms} branchid = ${branchid} WHERE clientid = ${id}`;

      connection.query(updateSql, function (err, result, fields) {
        if (err) {
          // Return error message to client
          res.send(err);
        } else {
          // Return success message to client
          res.send("Client updated successfully.");
        }
      });
    }
  });
});



/*========================================================================================================================*/

//DELETE
router.delete("/deleteclients/:id", (req,res) => {
    const id = req.params.id

    //query for deleting
    connection.query("DELETE FROM clients WHERE clientid = " + id, function(error,result, fields){
        if (error) {
            console.log("error:" + error);
            res.status(500).send("Error deleting user");
          } else {
            if (result.affectedRows == 0) {
              res.status(404).send("User not found");
            } else {
              res.send("Successfully deleted");
            }
          }
        });
      });

module.exports = router;