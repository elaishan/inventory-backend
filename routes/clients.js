const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();


//INSERT
router.post("/insertclients", (req,res) => {
    const firstName = req.body.c_firstname;
    const middleName = req.body.c_middlename;
    const lastName = req.body.c_lastname;
    const phoneNumber = req.body.c_phonenum;
    const business = req.body.c_business;
    const address = req.body.c_address;

    const sql = "INSERT INTO clients (c_firstname, c_middlename, c_lastname, c_phonenum, c_business, c_address) VALUES ("+"\"" 
    + firstName + "\"," + "\"" + middleName + "\"," + "\"" + lastName + "\"," + phoneNumber + "," + "\"" + business + "\"," + "\"" + address + "\"" + ")"

//query for inserting to table "stocks"
connection.query(sql,function(err, result,fields)
    {
    if (err){
        res.send(err);
    }if (result){
        res.send("successfully inserted")
    }
})
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

router.put("/editclients/:id", (req, res) => {
  const id = req.params.id;
  const { c_firstname, c_middlename, c_lastname, c_phonenum, c_business, c_address } = req.body;

  // Check if id is valid
  if (!id) {
    res.status(400).send("Invalid Client ID.");
    return;
  }

  // Check for duplicate client
  const sqlCheckDuplicate = "SELECT COUNT(*) AS count FROM clients WHERE clientid != ? AND (c_firstname = ? AND c_lastname = ? AND c_business = ?)";
  connection.query(sqlCheckDuplicate, [id, c_firstname, c_lastname, c_business], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating client.");
      return;
    }

    const count = result[0].count;
    if (count > 0) {
      res.status(409).send("This client already exists.");
      return;
    }

    // Update client
    const sqlUpdate = "UPDATE clients SET c_firstname = ?, c_middlename = ?, c_lastname = ?, c_phonenum = ?, c_business = ?, c_address = ? WHERE clientid = ?";
    connection.query(sqlUpdate, [c_firstname, c_middlename, c_lastname, c_phonenum, c_business, c_address, id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating client.");
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send("Client does not exist.");
      } else {
        res.status(200).send("Client updated successfully.");
      }
    });
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