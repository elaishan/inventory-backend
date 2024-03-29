const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRound = 10;

//INSERT
router.post("/insertuser", (req, res) => {
    const username = req.body.username;
    const firstName = req.body.fname;
    const middleName = req.body.mname;
    const lastName = req.body.lname;
    const userPrivilege = req.body.userprivilege;
    const branchID = req.body.branchid;
  
    const checkQuery = "SELECT COUNT(*) AS count FROM users WHERE username = ?";
  
    connection.query(checkQuery, [username], function (err, result, fields) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (result[0].count === 0) {
            const password = lastName
            bcrypt.hash(password,saltRound, (err, hash) => {
              if (err) {
                       console.log(err)
                   }
                   connection.query( 
                       "INSERT INTO users (username, password, fname, mname, lname, userprivilege, branchid) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       [username, hash, firstName, middleName, lastName, userPrivilege, branchID], 
                       function (err, result, fields) {
                        if (err) {
                          res.status(500).send(err);
                        } else {
                          res.send({success: "User successfully inserted"});
                        }
                      }
                   );
               })
        } else {
          res.status(409).send({message: "User already exists"});
        }
      }
    });
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
router.put("/edituser/:userid", (req, res) => {
  const { userid } = req.params;
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.fname;
  const middleName = req.body.mname;
  const lastName = req.body.lname;
  const userPrivilege = req.body.userprivilege;
  const branchID = req.body.branchid;

  const checkQuery = "SELECT COUNT(*) AS count FROM users WHERE username = ?";

  connection.query(checkQuery, [username], function (err, result, fields) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (result[0].count === 0) {
        if (password && password !== "") {
          bcrypt.hash(password, saltRound, (err, hash) => {
            if (err) {
              console.log(err);
            }
            console.log(password+" A")
            const sqlUpdate =
              "UPDATE users SET username = ?, password = ?, fname = ?, mname = ?, lname = ?, userprivilege = ?, branchid = ? WHERE userid = ?";
            connection.query(
              sqlUpdate,
              [
                username,
                hash,
                firstName,
                middleName,
                lastName,
                userPrivilege,
                branchID,
                userid,
              ],
              function (err, result, fields) {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.send({ success: "User successfully inserted" });
                }
              }
            );
          });
        } else {
          console.log(password+ " B")
          const sqlUpdate =
            "UPDATE users SET username = ?, fname = ?, mname = ?, lname = ?, userprivilege = ?, branchid = ? WHERE userid = ?";
          connection.query(
            sqlUpdate,
            [
              username,
              firstName,
              middleName,
              lastName,
              userPrivilege,
              branchID,
              userid,
            ],
            function (err, result, fields) {
              if (err) {
                res.status(500).send(err);
              } else {
                res.send({ success: "User successfully inserted" });
              }
            }
          );
        }
      } else {
        res.status(409).send({ message: "User already exists" });
      }
    }
  });
});



/*========================================================================================================================*/

//DELETE
router.delete("/deleteuser/:id", (req, res) => {
    const id = req.params.id;
  
    // query for deleting
    connection.query("DELETE FROM users WHERE userid = " + id, function (error, result, fields) {
      if (error) {
        console.log("error:" + error);
        res.status(500).send({ message: "Error deleting user"});
      } else {
        if (result.affectedRows == 0) {
          res.status(404).send("User not found");
        } else {
          res.send({success: "Successfully deleted"});
        }
      }
    });
  });
  

module.exports = router;