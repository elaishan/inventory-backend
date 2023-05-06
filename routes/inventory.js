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
    const branchID = req.body.branchid;

const checkQuery = "SELECT * FROM stocks WHERE name =" + "\"" + name +  "\"";

connection.query(checkQuery,function(err, result, fields)
    {
    if (err){
        res.send(err)
    }
    else{
        if(result.length == 0){ //checks if product exists or not, if there's no result (0), insert it if there is, dont.
            //insert query
            const insertQuery = "INSERT INTO stocks (name, description, quantity, cost, form, price, expiration_date, branchid) VALUES ("+"\""  + name + "\"," + "\"" + description + "\"," +  quantity + "," + cost + "," + "\"" + form + "\"" + "," 
             + price + "," + "\"" + expiration + "\"," + branchID +  ")"

            connection.query(insertQuery, function(err, result, fields){
                if(err){
                    res.send(err)
                }else{
                    res.send("product successfully inserted")
                }
            })
            
        }else{
            res.send("product is already existing")
        }
        
    }
})
});

/*========================================================================================================================*/

//SELECT
//view single agent

router.get("/viewstocks/:productid", (req,res) => {
    const id = req.params.productid
    //query for viewing
    connection.query("SELECT * FROM stocks WHERE productid = " + "\"" + id + "\"" , function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});
/*
//view all product
router.get("/viewstocks/", (req,res) => {
    //query for viewing
    connection.query("SELECT * FROM stocks", function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});
*/

router.get("/viewstocks/", (req,res) => {


    let urlProductId = "WHERE productid = " + "\"" + req.query.productid + "\""
    let urlSortBy = "ORDER BY " + req.query.orderBy + " " + req.query.criteria

    let url = ""

    if(Number.isInteger(parseInt(req.query.productid))){
        url = urlProductId
    }else if(req.query.orderBy){
        url = urlSortBy
    }
    //query for viewing
    console.log(url)
    connection.query("SELECT * FROM stocks " + url  , function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});


/*========================================================================================================================*/

//EDIT
router.post("/editstocks/:productid", (req,res) => {
    const id = req.params.productid;
    const name = req.body.name;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const cost = req.body.cost;
    const form = req.body.form;
    const price = req.body.price;
    const expiration = req.body.expiration_date;
    const branchID = req.body.branchid;

    const sql = "UPDATE stocks SET name = " + "\"" + name + "\"" + ", description = " + "\"" + description + "\"" + 
    ", quantity = " + quantity + ", cost = " + cost + ", form = " + "\"" + form + "\"" + ", price = " + price + ", expiration_date = " +
    "\"" + expiration + "\"" + ", branchid = " + branchID + " WHERE productid = " + id

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

/*========================================================================================================================*/

//DELETE
router.delete("/deletestocks/:id", (req,res) => {
    const id = req.params.id;

    //query for deleting
    connection.query(`DELETE FROM stocks WHERE productid = ` + id, function(error,result, fields){
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