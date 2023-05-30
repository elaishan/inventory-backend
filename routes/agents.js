const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

router.post("/insertagents", (req, res) => {
  const agentcode = req.body.agentcode;
  const a_Name = req.body.a_name;
  const a_phoneNum = req.body.a_phonenum;
  const a_Quota = req.body.a_quota;
  const areaCode = req.body.areacode;
  const areaName = req.body.areaname;
  const branchID = req.body.branchid;

  const checkQuery = "SELECT COUNT(*) AS count FROM agents WHERE agentcode = ?";

  connection.query(checkQuery, [agentcode], function (err, result, fields) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (result[0].count === 0) {
        const insertQuery =
          "INSERT INTO agents (agentcode, a_name, a_phonenum, a_quota, areacode, areaname, branchid) VALUES (?, ?, ?, ?, ?, ?, ?)";

        connection.query(
          insertQuery,
          [
            agentcode,
            a_Name,
            a_phoneNum,
            a_Quota,
            areaCode,
            areaName,
            branchID,
          ],
          function (err, result, fields) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.send({success: "Agent successfully added"});
            }
          }
        );
      } else {
        res.status(409).send({message: "Agent code for another agent already exists"});
      }
    }
  });
});

/*========================================================================================================================*/

//SELECT

//view single agent
router.get("/viewagents/:agentid", (req,res) => {
    const id = req.params.agentid
    //query for viewing
    connection.query("SELECT * FROM agents WHERE agentid = " + "\"" + id + "\"" , function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

//view all agent
router.get("/viewagents/", (req,res) => {
    //query for viewing
    connection.query("SELECT * FROM agents", function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

/*========================================================================================================================*/

router.post("/editagents/:agentid", (req, res) => {
  const {
    agentcode: agentCode,
    a_name: agentName,
    a_phonenum: phoneNum,
    a_quota: quota,
    areacode: areaCode,
    areaname: areaName,
    branchid: branchID
  } = req.body;
  const id = req.params.agentid;

  // Query to check if agent code already exists for another agent
  const checkQuery = `SELECT * FROM agents WHERE agentcode = ${agentCode} AND agentid != ${id}`;

  connection.query(checkQuery, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length > 0) {
      res.status(400).send({msg:"Agent code already exists for another agent!"});
    } else {
      const updateQuery = `UPDATE agents SET
        agentcode = ${agentCode}, a_name = "${agentName}", a_phonenum = "${phoneNum}", a_quota = "${quota}", areacode = "${areaCode}", areaname = "${areaName}", branchid = "${branchID}" WHERE agentid = ${id}`;

      connection.query(updateQuery, (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({success:"Agent successfully updated."});
        }
      });
    }
  });
});

/*========================================================================================================================*/

//DELETE
router.delete("/deleteagents/:agentid", (req,res) => {
    const id = req.params.agentid;

    //query for deleting
    connection.query("DELETE FROM agents WHERE agentid ="  + id, function(error, result, fields){
        if(error){
            console.log("error:" + error)
        }
        if(result){
            if(result.affectedRows == 0){ //checks if the inputted id is existing in database
                res.send("Agent does not exist!")
            }else{
                res.send("Successfully Deleted!")
            }
        }
    })
});

module.exports = router;