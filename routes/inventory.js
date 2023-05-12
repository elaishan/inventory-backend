const connection = require("../dbconnection");
const express = require("express");
const router = express.Router();

//INSERT - ayos
router.post("/insertstocks", (req,res) => {
    const productCode =  req.body.productcode;
    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category
    const packquantity = req.body.packquantity;
    const packsize =  req.body.packsize;
    const reOrderLevel =  req.body.reorderlevel;
    const manufacturer =  req.body.manufacturer;
    const cost = req.body.cost;
    const form = req.body.form;
    const price = req.body.price;
    const expiration = req.body.expiration_date;
    const lotNumber = req.body.lotnumber;
    const branchID = req.body.branchid;

    // Check if the product code already exists with a different name
    const whereClause = `productcode != '${productCode}' AND name = '${name}'`;
    const selectSql = `SELECT * FROM stocks WHERE ${whereClause}`;
    connection.query(selectSql, function(err, result, fields) {
        if (err) {
            res.send(err);
        } 
        else if (result.length > 0) {
            // A matching name exists, so send an error message
            res.send("A different product code already exists for the same name");
        } 
        else {
            const selectSql2 = `SELECT name FROM stocks WHERE productcode = '${productCode}'`;
            connection.query(selectSql2, function(err, result, fields) {
                if (err) {
                    res.send(err);
                } 
                else if (result.length > 0 && result[0].name !== name) {
                    res.send("A different name already exists for the same product code");
                }
                else {
                    const selectSql3 = `SELECT form FROM stocks WHERE productcode = '${productCode}'`;
                    connection.query(selectSql3, function(err, result, fields) {
                        if (err) {
                            res.send(err);
                        }
                        else if (result.length > 0 && result[0].form !== form) {
                            res.send("A different form already exists for the same product code");
                        }
                        else {
                            const selectSql4 = `SELECT category FROM stocks WHERE productcode = '${productCode}'`;
                            connection.query(selectSql4, function(err, result, fields) {
                                if (err) {
                                    res.send(err);
                                }
                                else if (result.length > 0 && result[0].category !== category) {
                                    res.send("A different category already exists for the same product code");
                                }
                                else {
                                    const selectSql5 = `SELECT manufacturer FROM stocks WHERE productcode = '${productCode}'`;
                                    connection.query(selectSql5, function(err, result, fields) {
                                        if (err) {
                                            res.send(err);
                                        }
                                        else if (result.length > 0 && result[0].manufacturer !== manufacturer) {
                                            res.send("A different manufacturer already exists for the same product code");
                                        }
                                        else {
                                            // Check if a matching row already exists
                                            const whereClause = `productcode = '${productCode}' AND name = '${name}' AND category = '${category}' AND manufacturer = '${manufacturer}' AND form = '${form}' AND expiration_date = '${expiration}' AND lotnumber = '${lotNumber}' AND branchid = '${branchID}'`;
                                            const selectSql6 = `SELECT * FROM stocks WHERE ${whereClause}`;
                                            connection.query(selectSql6, function(err, result, fields) {
                                                if (err) {
                                                    res.send(err);
                                                } 
                                                else if (result.length > 0) {
                                                    // A matching row exists, so update it
                                                    const updateSql = `UPDATE stocks SET packquantity = packquantity + ${packquantity}, description =  "${description}", reorderlevel = ${reOrderLevel}, cost = ${cost}, price = ${price} WHERE ${whereClause}`;
                                                    connection.query(updateSql, function(err, result, fields) {
                                                        if (err) {
                                                            res.send(err);
                                                        } 
                                                        else {
                                                            res.send("successfully updated");
                                                        }
                                                    });
                                                } 
                                                else {
                                                    // No matching row exists, so insert a new row
                                                    const insertSql = `INSERT INTO stocks (productcode, name, description, category, packquantity, packsize, reorderlevel, manufacturer, cost, form, price, expiration_date, lotnumber, branchid) 
                                                                    VALUES ('${productCode}', '${name}', '${description}', '${category}', ${packquantity}, ${packsize}, ${reOrderLevel}, '${manufacturer}', ${cost}, '${form}', ${price}, '${expiration}', '${lotNumber}', ${branchID})`;
                                                    connection.query(insertSql, function(err, result, fields) {
                                                        if (err) {
                                                            res.send(err);
                                                        } 
                                                        else {
                                                            res.send("successfully inserted");
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }); 
                        }
                    });
                }
            });
        }
    });
});


/*========================================================================================================================*/

//SELECT
//view more
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

router.get("/viewstocks/", (req,res) => {
    const id = req.body.productid;
    const sortBy = req.query.sortBy;
    const allowedSortBy = ["productcode", "name", "category", "manufacturer", "cost", "form", "price", "expiration_date", "lotnumber", "branchid", "packquantity"];
    const querySortBy = allowedSortBy.includes(sortBy) ? sortBy : "productcode"; // default to sorting by productcode
    
    const query = `
        SELECT s.productcode, s.name, s.category, s.manufacturer, 
            (SELECT SUM(packquantity) FROM stocks WHERE productid = s.productid) AS total_packquantity
        FROM stocks s
        WHERE s.productid = "${id}"
        GROUP BY s.productcode, s.name, s.category, s.manufacturer
        ORDER BY ${querySortBy}
    `;
    
    connection.query(query, function(error, result, fields){
        if(error){
            console.error(error);
            res.status(500).send("Internal server error");
        }else{
            res.send(result);
        }
    });
});


// router.get("/viewstocks/", (req,res) => {
//     let urlProductId = "WHERE productid = " + "\"" + req.query.productid + "\""
//     let urlSortBy = "ORDER BY " + req.query.orderBy + " " + req.query.criteria

//     let url = ""

//     if(Number.isInteger(parseInt(req.query.productid))){
//         url = urlProductId
//     }else if(req.query.orderBy){
//         url = urlSortBy
//     }
//     //query for viewing
//     //console.log(url)
//     connection.query("SELECT * FROM stocks " + url  , function(error, result, fields){
//         if(error){
//             console.error(error)
//         }else{
//             res.send(result)
//         }
//     })
// });




/*========================================================================================================================*/

//EDIT
router.post("/editstocks", (req, res) => {
    const id = req.body.productid;
    const productCode = req.body.productcode;
    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    const packquantity = req.body.packquantity;
    const packsize = req.body.packsize;
    const reOrderLevel = req.body.reorderlevel;
    const manufacturer = req.body.manufacturer;
    const cost = req.body.cost;
    const form = req.body.form;
    const price = req.body.price;
    const expiration = req.body.expiration_date;
    const lotNumber = req.body.lotnumber;
    const branchID = req.body.branchid;

    // Check if the new product code or name already exists for a different product
    const checkQuery = "SELECT COUNT(*) AS count FROM stocks WHERE (productcode = ? OR name = ?) AND (productcode <> ? OR name <> ?)";
    const checkParams = [productCode, name, productCode, name];

    connection.query(checkQuery, checkParams, function (err, result, fields) {
        if (err) {
            res.send(err);
        } else if (result[0].count > 0) {
            res.send("Product code or name already exists for another product");
        } else {
            const selectSql = `SELECT form FROM stocks WHERE productcode = '${productCode}'`;
            connection.query(selectSql, function(err, result, fields) {
                if (err) {
                    res.send(err);
                }
                else if (result.length > 0 && result[0].form !== form) {
                    res.send("A different form already exists for the same product code"); 
                } else {
                    const selectSql2 = `SELECT category FROM stocks WHERE productcode = '${productCode}'`;
                    connection.query(selectSql2, function(err, result, fields) {
                        if (err) {
                            res.send(err);
                        }
                        else if (result.length > 0 && result[0].category !== category) {
                            res.send("A different category already exists for the same product code");
                        } else {
                            const selectSql3 = `SELECT manufacturer FROM stocks WHERE productcode = '${productCode}'`;
                            connection.query(selectSql3, function(err, result, fields) {
                                if (err) {
                                    res.send(err);
                                }
                                else if (result.length > 0 && result[0].manufacturer !== manufacturer) {
                                    res.send("A different manufacturer already exists for the same product code");
                                } else {
                                    // Check if a matching row already exists
                                    const whereClause = `productcode = '${productCode}' AND name = '${name}' AND category = '${category}' AND manufacturer = '${manufacturer}' AND form = '${form}' AND expiration_date = '${expiration}' AND lotnumber = '${lotNumber}' AND branchid = '${branchID}'`;
                                    const selectSql6 = `SELECT * FROM stocks WHERE ${whereClause}`;
                                    connection.query(selectSql6, function(err, result, fields) {
                                        if (err) {
                                            res.send(err);
                                        } else if (result.length > 0) {
                                            // A matching row exists, so update it
                                            const updateSql = `UPDATE stocks SET packquantity = packquantity + ${packquantity}, description =  "${description}", reorderlevel = ${reOrderLevel}, cost = ${cost}, price = ${price} WHERE ${whereClause}`;
                                            connection.query(updateSql, function(err, result, fields) {
                                                if (err) {
                                                    res.send(err);
                                                } else {
                                                    //delete the row if the required columns are equal to an existing row and add the packquantity to that existing row
                                                    const deleteQuery = `DELETE FROM stocks WHERE productid = ${id}`;
                                                    connection.query(deleteQuery, function (err, result, fields) {
                                                        if (err) {
                                                            res.send(err);
                                                        } else {
                                                            res.send("Product successfully merged.");
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            const updateQuery = "UPDATE stocks SET productcode = ?, name = ?, description = ?, category = ?, packquantity = ?, packsize = ?, reorderlevel = ?, manufacturer = ?, cost = ?, form = ?, price = ?, expiration_date = ?, lotnumber = ?, branchid = ? WHERE productid = ?";
                                            const updateParams = [productCode, name, description, category, packquantity, packsize, reOrderLevel, manufacturer, cost, form, price, expiration, lotNumber, branchID, id];

                                            // Check for empty values
                                            if (!productCode || !name || !category || !manufacturer || !form) {
                                                res.send("Required fields cannot be empty");
                                            } else {
                                                connection.query(updateQuery, updateParams, function (err, result, fields) {
                                                    if (err) {
                                                        res.send(err);
                                                    } else {
                                                        res.send("Product successfully updated");
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });      
                }
            });
        }
    });
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