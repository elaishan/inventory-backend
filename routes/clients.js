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

//SELECT
router.get("/viewclients", (req,res) => {

    //query for viewing
    connection.query("SELECT * FROM clients",function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

//EDIT
router.post("/editclients", (req,res) => {
    const id = req.body.client_id;
    const firstName = req.body.c_firstname;
    const middleName = req.body.c_middlename;
    const lastName = req.body.c_lastname;
    const phoneNumber = req.body.c_phonenum;
    const business = req.body.c_business;
    const address = req.body.c_address;


    const sql = "UPDATE clients SET c_firstname = " + "\"" + firstName + "\"" + ", c_middlename = " + "\"" + middleName + "\"" + 
    ", c_lastname = " + "\"" + lastName + "\"" + ", c_phonenum = " + phoneNumber + ", c_business = " + "\"" + business + "\"" + ", c_address = " + "\"" + address + "\"" + " WHERE client_id = " + id 

    connection.query(sql, (err, result) => {
        if(err){
            res.send(err)
        }if(result){
            if(result.affectedRows == 0){
                res.send("product does not exist")
            }else{
            res.send("successfully edited!");
        }
        } 
    })
});

//DELETE
router.delete("/deleteclients", (req,res) => {
    const id = req.body.client_id

    //query for deleting
    connection.query("DELETE FROM clients WHERE client_id =" + id, function(error,result, fields){
        if(error){
            console.log("error:" + error)
        }
        if(result){
            if(result.affectedRows == 0){ //checks if the inputted id is existing in database
                res.send("product does not exist")
            }else{
                res.send("successfully deleted")
            }
        }
    })
});

module.exports = router;