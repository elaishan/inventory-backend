const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();


//INSERT
router.post("/insertuser", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.fname;
    const middleName = req.body.mname;
    const lastName = req.body.lname;
    const position = req.body.position;
    const userPrivilege = req.body.userprivilege;
    const branchID = req.body.branchid;

//checks if username is already existing
const checkQuery = "SELECT * FROM users WHERE username =" + "\"" + username +  "\"";

connection.query(checkQuery,function(err, result, fields)
    {
    if (err){
        res.send(err)
    }
    else{
        if(result.length == 0){ //checks if username exists or not, if there's no result (0), insert it if there is, dont.
            //insert query
            const insertQuery = "INSERT INTO users (username, password, fname, mname, lname, position, userprivilege, branchid) VALUES ("+ "\"" + username + "\"," + "\"" + password + "\"," +"\"" + firstName + "\"," + "\"" + middleName + "\"," + "\"" + lastName + "\"," + "\"" + position + "\","  + "\"" + userPrivilege + "\"," + branchID +  ")"

            connection.query(insertQuery, function(err, result, fields){
            
                if(err){
                    res.send(err)
                }else{
                    res.send("user successfully inserted")
                }
            })
            
        }else{
            res.send("user is already existing")
        }
        
    }
})
});

/*========================================================================================================================*/

//SELECT

//view single user
router.get("/viewusers/:userid", (req,res) => {
    const id = req.params.userid
    //query for viewing
    connection.query("SELECT * FROM users WHERE userid = " + "\"" + id + "\"" , function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

//view all user
router.get("/viewusers/", (req,res) => {
    //query for viewing
    connection.query("SELECT * FROM users", function(error, result, fields){
        if(error){
            console.error(error)
        }else{
            res.send(result)
        }
    })
});

/*========================================================================================================================*/

//EDIT
router.post("/edituser", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.fname;
    const middleName = req.body.mname;
    const lastName = req.body.lname;
    const position = req.body.position;
    const userPrivilege = req.body.userprivilege;
    const branchID = req.body.branchid;
    const id = req.body.userid



    const sql = "UPDATE users SET username = " + "\"" + username + "\"" + ", password = " + "\"" +password + "\"" + 
    ", fname = " + "\"" + firstName + "\"" + ", mname = " + "\"" + middleName + "\"" + ", lname = " + "\"" + lastName + "\"" + 
    ", position = " + "\"" + position + "\"" + ", userprivilege = " + userPrivilege + ", branchid =" + branchID + " WHERE userid = " + id 

    connection.query(sql, (err, result) => {
        if(err){
            res.send(err)
        }if(result){
            if(result.affectedRows == 0){
                res.send("user does not exist")
            }else{
            res.send("successfully edited!");
        }
        } 
    })
});

/*========================================================================================================================*/

//DELETE
router.delete("/deleteuser", (req,res) => {
    const id = req.body.userid

    //query for deleting
    connection.query("DELETE FROM users WHERE userid =" + id, function(error,result, fields){
        if(error){
            console.log("error:" + error)
        }
        if(result){
            if(result.affectedRows == 0){ //checks if the inputted id is existing in database
                res.send("user does not exist")
            }else{
                res.send("successfully deleted")
            }
        }
    })
});

module.exports = router;