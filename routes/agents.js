const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

router.post("/insertagents", (req, res) => {
  const {
    agentcode: agentcode,
    a_name: a_name,
    a_phonenum: phoneNum,
    a_quota: quota,
    areacode: areacode,
    areaname: areaname,
    branchid: branchID
  } = req.body;

  const checkQuery = `SELECT * FROM agents WHERE agentcode= ${agentcode}`;

  connection.query(checkQuery, (err, result, fields) => {
    if (err) {
      res.send(err);
    } else if (result.length > 0) {
      res.send("Agent code already exist for an existing agent");
    } else {
      const insertQuery = `INSERT INTO agents 
        (agentcode, a_name, a_phonenum, a_quota,areacode, areaname, branchid)
        VALUES (${agentcode}, "${a_name}", "${phoneNum}", ${quota}, "${areacode}", "${areaname}", ${branchID})`;

      connection.query(insertQuery, (err, result, fields) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Agent successfully inserted.");
        }
      });
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
      agentcode: agentcode,
      a_name: agentName,
      a_phonenum: phoneNum,
      a_quota: quota,
      branchid: branchID
    } = req.body;
    const id = req.params.agentid
    
    // Query to check if client already exists
    const checkQuery = `SELECT * FROM agents WHERE agentcode= ${agentcode}`;
  
    connection.query(checkQuery, (err, result, fields) => {
      if (err) {
        res.send(err);
      } else if (result.length > 0 && result[0].clientid !== id) {
        res.send("Agent code already exist for an existing agent");
      } else {
        const updateQuery = `UPDATE agents SET
        agentcode = ${agentcode}, a_name = "${agentName}", a_phonenum = "${phoneNum}", a_quota = ${quota}, branchid = ${branchID} WHERE agentid = ${id}`;

        connection.query(updateQuery, (err, result, fields) => {
          if (err) {
            res.send(err);
          } else {
            res.send("Agent successfully updated.");
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
                res.send("agent does not exist")
            }else{
                res.send("successfully deleted")
            }
        }
    })
});

module.exports = router;