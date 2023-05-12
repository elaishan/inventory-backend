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
    const productname = req.body.productname;
    const productQuantity = req.body.productquantity;
    const expiration_date = req.body.expiration_date;
    const returnID = req.body.return_id;
    const backorderID = req.body.backorder_id;

    const checkProductQuery = "SELECT * FROM stocks WHERE name =" + "\"" + productname +  "\"";
    connection.query(checkProductQuery, function(err, productResult, fields) {
        if (err){
            res.send(err)
        } else {
            if (productResult.length == 0) {
                res.send("Invalid product name");
            } else {
                const productQuantityInStock = productResult[0].quantity;
                if (productQuantityInStock === 0) {
                    res.send("Not enough product in stock");
                } else {
                    const insertQuery = "INSERT INTO agents (a_firstname, a_middlename, a_lastname, a_phonenum, a_quota, branchid, productname, productquantity, expiration_date, return_id, backorder_id) VALUES ("+"\"" + firstname + "\"," + "\"" + middlename + "\"," + "\"" + lastname + "\"," + phonenum + ","  + quota  + "," + branchID + "," + "\"" + productname + "\"," + productQuantity  + "," + "\"" + expiration_date + "\"," + returnID + "," + backorderID +  ")";

                    connection.query(insertQuery, function(err, insertResult, fields){
                        if(err){
                            res.send(err)
                        } else {
                            const updateQuery = "UPDATE stocks SET quantity = GREATEST(quantity - " + productQuantity + ", 0) WHERE branchid = " + branchID + " AND name = " + "\"" + productname + "\"" + " AND expiration_date <= \"" + expiration_date + "\" ORDER BY expiration_date ASC LIMIT 1";
                            connection.query(updateQuery, function(err, updateResult, fields){
                                if(err){
                                    res.send(err)
                                } else {
                                    if (updateResult.affectedRows == 0) {
                                        res.send("Insufficient stock for the specified branch and product");
                                    } else {
                                        res.send("Agent successfully inserted");
                                    }
                                }
                            });
                        }
                    });
                }
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

//EDIT
router.post("/editagents", (req,res) => {
    const id = req.body.agentid
    const firstname = req.body.a_firstname;
    const middlename = req.body.a_middlename;
    const lastname = req.body.a_lastname;
    const phonenum = req.body.a_phonenum;
    const quota = req.body.a_quota;
    const branchID = req.body.branchid;
    const productname = req.body.productname;
    const productQuantity = req.body.productquantity;
    const expiration_date = req.body.expiration_date;
    const returnID = req.body.return_id;
    const backorderID = req.body.backorder_id;

    const sql = "UPDATE agents SET a_firstname = " + "\"" + firstname + "\"" + ", a_middlename = " + "\"" + middlename + "\"" + 
    ", a_lastname = " + "\"" + lastname + "\"" + ", a_phonenum = " + phonenum + ", a_quota = " + quota  + ", branchid = " + branchID + ", productname = " 
   + "\"" + productname + "\"" + ", productquantity =" + productQuantity + ", expiration_date =" + "\"" + expiration_date + "\""  +", return_id = " + returnID + ", backorder_id = "  + backorderID + " WHERE agentid = " + id

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