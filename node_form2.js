const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'study'
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.get('/user', (req,res) => {
    res.json("hello world")
})

con.connect((error) => {
    if (error) throw error;
    console.log("Connected to the database!");

    app.post('/submit_form', (req, res) => {
        var response_object = req.body;
        var sql = "INSERT INTO user (firstname, lastname, country) VALUES (?, ?, ?)";
        var values = [
            response_object['fname'],
            response_object['lname'],
            response_object['country']
        ];

        con.query(sql, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error inserting data into the database');
            }

            console.log('Number of records inserted: ' + result.affectedRows);
            res.send('Form submitted successfully');
        });
    });

    app.get('/last_record', (req, res) => {
        var sql = "SELECT * FROM user ORDER BY Id DESC LIMIT 1";
        con.query(sql, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error retrieving data from the database');
            }
                
            if (result.length === 0) {
                return res.status(404).send('No records found');
            }
            // Send the last record as JSON response
            console.log(result[0]);
            res.json(Object.values(result[0]));
        });
    });

    app.put('/update_data',(req,res)=>{
        var values = Object.values(req.body);
        var data = [
            values[1],
            values[2],
            values[3],
            values[0]
        ];
        var sql = "UPDATE user SET firstname=?, lastname=?, country=? WHERE Id=?";
        con.query(sql, data, (error,result)=>{
            if(error){
                console.error(error);
                return res.status(500).send('Error with updating data into tha database.');
            }
            console.log('Number of records affected: '+result.affectedRows);
            res.send('Update on the backend is OK');
        });
    });

    app.delete('/delete_data',(req,res)=>{
        var id = Object.values(req.body);
        var sql = "DELETE FROM user WHERE Id=?";
        con.query(sql,id[0], (error,result)=>{
            if(error){
                console.error(error);
                return res.status(500).send('Error with deleting the record on the backend.');
            }            
            console.log('Record deleted on the backend succefully');
            console.log('Number of rows affectred: '+result.affectedRows);
            res.send('DELETE on the backend OK');
        })
    })
    

    // Start the server after connecting to the database
    const PORT = 4020;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


