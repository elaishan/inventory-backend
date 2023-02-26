const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    connection.query(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password],
        (err, result) => {
            if (err) {
                res.send({err: err});
            }
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send({message: "Wrong user/pass"});
            }
        }
    );
})

module.exports=router;
