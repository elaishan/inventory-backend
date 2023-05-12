const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

//INSERT
router.post("/insertagents", (req,res) => {
    const firstname = req.body.a_firstname;
    const middlename = req.body.a_middlename;
    const lastname = req.body.a_lastname;
    const phonenum = req.body.a_phonenum;
    const quota = req.body.a_quota;
    const branchID = req.body.branchid;
    const productID = req.body.productid;
    const returnID = req.body.return_id;
    const backorderID = req.body.backorder_id;

//checks if agent is already existing
const checkQuery = "SELECT * FROM agents WHERE a_firstname =" + "\"" + firstname +  "\"" + "and a_lastname =" + "\"" + lastname +  "\"";

connection.query(checkQuery,function(err, result, fields)
    {
    if (err){
        res.send(err)
    }
    else{
        if(result.length == 0){ //checks if username exists or not, if there's no result (0), insert it if there is, dont.
            //insert query
            const insertQuery = "INSERT INTO agents (a_firstname, a_middlename, a_lastname, a_phonenum, a_quota, branchid, productid, return_id, backorder_id) VALUES ("+"\"" + firstname + "\"," + "\"" + middlename + "\"," + "\"" + lastname + "\"," + phonenum + ","  + quota  + "," + branchID + ","  + productID + "," + returnID + "," + backorderID +  ")"

            connection.query(insertQuery, function(err, result, fields){
                if(err){
                    res.send(err)
                }else{
                    res.send("agent successfully inserted")
                }
            })
            
        }else{
            res.send("agent is already existing")
        }
        
    }
})
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

//EDIT
router.post("/editagents", (req,res) => {
    const id = req.body.agentid;
    const firstname = req.body.a_firstname;
    const middlename = req.body.a_middlename;
    const lastname = req.body.a_lastname;
    const phonenum = req.body.a_phonenum;
    const quota = req.body.a_quota;
    const branchID = req.body.branchid;
    const productID = req.body.productid;
    const returnID = req.body.return_id;
    const backorderID = req.body.backorder_id;

    const sql = "UPDATE agents SET a_firstname = " + "\"" + firstname + "\"" + ", a_middlename = " + "\"" + middlename + "\"" + 
    ", a_lastname = " + "\"" + lastname + "\"" + ", a_phonenum = " + phonenum + ", a_quota = " + quota  + ", branchid = " + branchID + ", productid = " 
    + productID  + ", return_id = " + returnID + ", backorder_id = "  + backorderID + " WHERE agentid = " + id

    connection.query(sql, (err, result) => {
        if(err){
            res.send(err)
        }if(result){
            if(result.affectedRows == 0){
                res.send("agent does not exist")
            }else{
            res.send("successfully edited!");
        }
        } 
    })
});

/*========================================================================================================================*/

//DELETE
router.delete("/deleteagents", (req,res) => {
    const id = req.body.agentid;

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