const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();
//const bcrypt = require('bcrypt');
/*require('dotenv').config();*/

 router.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user_privileges = req.body.user_privileges;

    connection.query(
        `SELECT * FROM users WHERE username = ? AND password = ?` ,
        [username, password, user_privileges],
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
//someone is logged in or not
router.get("/", (req, res) => {

    if(username == null && password == null){ //checks if someone is logged in
        res.send("someone is not logged in!")
    }
    else{
        res.send("someone is logged in")
    }
})
            
        /*  
            //checking password
            const match = await bcrypt.compare(password, password)
            if(match){
                //creating jwts
                const accessToken = jwt.sign (
                    {username: username},
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "30s" }
                );
                const refreshToken = jwt.sign (
                    {username: username},
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: "1d" }
                );
                res.json({'success': `User ${username} is logged in! `  })
            }else{
                res.sendStatus(401);
            }
        */
        }
        
    );
})

module.exports = router;
