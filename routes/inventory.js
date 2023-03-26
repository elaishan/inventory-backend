const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

//INSERT
router.post("/insertstocks", (req,res) => {
    const name = req.body.name;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const cost = req.body.cost;
    const form = req.body.form;
    const price = req.body.price;
    const expiration = req.body.expiration_date;
    const branchID = req.body.branch_id;

//query for inserting to table "stocks"
    connection.query(
    "INSERT INTO stocks (name, description, quantity, cost, form, price, expiration_date, branch_id) VALUES ("+"\"" 
    + name + "\"," + "\"" + description + "\"," +  quantity + "," + cost + "," + "\"" + form + "\"" + "," 
    + price + "," + "\"" + expiration + "\"," + branchID + ")",
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
router.get("/viewstocks", (req,res) => {

    //query for viewing
    connection.query(` SELECT * FROM stocks`,function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

//EDIT
router.post("/editstocks", (req,res) => {
    const id = req.body.product_id;
    const name = req.body.name;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const cost = req.body.cost;
    const form = req.body.form;
    const price = req.body.price;
    const expiration = req.body.expiration_date;
    const branchID = req.body.branch_id;

    const sql = "UPDATE stocks SET name = " + "\"" + name + "\"" + ", description = " + "\"" + description + "\"" + 
    ", quantity = " + quantity + ", cost = " + cost + ", form = " + "\"" + form + "\"" + ", price = " + price + ", expiration_date = " +
    "\"" + expiration + "\"" + ", branch_id = " + branchID + " WHERE product_id = " + id

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
router.delete("/deletestocks", (req,res) => {
    const id = req.body.product_id

    //query for deleting
    connection.query(`DELETE FROM stocks WHERE product_id =` + id, function(error,result, fields){
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