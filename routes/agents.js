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
    const branchID = req.body.branch_id;
    const productID = req.body.product_id;
    const returnID = req.body.return_id;
    const backorderID = req.body.backorder_id;

//query for inserting to table "stocks"
    connection.query(
    "INSERT INTO agents (a_firstname, a_middlename, a_lastname, a_phonenum, a_quota, branch_id, product_id, return_id, backorder_id) VALUES ("+"\"" 
    + firstname + "\"," + "\"" + middlename + "\"," + "\"" + lastname + "\"," + phonenum + ","  + quota  + "," 
    + branchID + ","  + productID + "," + returnID + "," + backorderID + ")",
    function(err, result,fields){  
    if (err){
        res.send(err);
    }
    else{
       res.send("successfully inserted")
    }
})
});

//SELECT
router.get("/viewagents", (req,res) => {

    //query for viewing
    connection.query("SELECT * FROM agents", function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

//EDIT
router.post("/editagents", (req,res) => {
    const id = req.body.agent_id;
    const firstname = req.body.a_firstname;
    const middlename = req.body.a_middlename;
    const lastname = req.body.a_lastname;
    const phonenum = req.body.a_phonenum;
    const quota = req.body.a_quota;
    const branchID = req.body.branch_id;
    const productID = req.body.product_id;
    const returnID = req.body.return_id;
    const backorderID = req.body.backorder_id;

    const sql = "UPDATE agents SET a_firstname = " + "\"" + firstname + "\"" + ", a_middlename = " + "\"" + middlename + "\"" + 
    ", a_lastname = " + "\"" + lastname + "\"" + ", a_phonenum = " + phonenum + ", a_quota = " + quota  + ", branch_id = " + branchID + ", product_id = " 
    + productID  + ", return_id = " + returnID + ", backorder_id = "  + backorderID + " WHERE agent_id = " + id

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

//DELETE
router.delete("/deleteagents", (req,res) => {
    const id = req.body.agent_id;

    //query for deleting
    connection.query("DELETE FROM agents WHERE agent_id ="  + id, function(error, result, fields){
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