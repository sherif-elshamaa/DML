const express = require('express');
const mysql = require('mysql');
const port = 5000
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'relationalsql'

})

// connect to MYSQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log("MYSQL CONNECTED");
})

//

// Create database
app.get('/createdb', (req, res) => {
    let sql = "CREATE DATABASE relationalsql"
    db.query(sql, err => {
        if (err) {
            throw err;
        }
        res.send("Database Created");
    });
})

// Create Customer table 
app.get('/createCustomer', (req, res) => {
    let sql = 'CREATE TABLE Customer (customer_id varchar(20), customer_name varchar(20) NOT NULL, customer_tel INT, primary key (customer_id))'
    db.query(sql, err => {
        if (err) {
            throw err;
        }
        res.send("Customer table created");
    })
})

// insert to customer table
app.post('/insertCustomer', (req, res) => {
    let post = req.body
    let sql = "INSERT INTO Customer SET ?"
    post.map((customer) => {
        db.query(sql, customer, err => {
            if (err) {
                res.send(err.message)
                throw err;
            }
        })
    })
    res.send("customers added");
})


// Create Product table 
app.get('/createProduct', (req, res) => {
    let sql = 'CREATE TABLE Product (product_id VARCHAR(20), product_name VARCHAR(20) NOT NULL, price INT CHECK (price>0), primary key (product_id))'
    db.query(sql, err => {
        if (err) {
            res.send(err.message);
            throw err;
        }
    })
    res.send("Product table created");
})

// INSERT ProductS
app.post('/insertProduct', (req, res) => {
    let post = req.body
    let sql = "INSERT INTO Product SET ?"
    post.map((product) => {
        db.query(sql, product, err => {
            if (err) {
                res.send(err.message)
                throw err;
            }
        })
    })
    res.send("Products added");
})

// Create orders table 
app.get('/createOrders', (req, res) => {
    let sql = 'CREATE TABLE Orders (customer_id VARCHAR(20), product_id VARCHAR(20), quantity INT, total_amount INT, FOREIGN KEY (customer_id) REFERENCES Customer(customer_id), FOREIGN KEY (product_id) REFERENCES Product(product_id) )'
    db.query(sql, err => {
        if (err) {
            throw err;
        }
    })
    res.send("Orders table has been created");
})

// insert orders
app.post('/insertOrders', (req, res) => {
    let post = req.body
    let sql = "INSERT INTO Orders SET ?"
    post.map((order) => {
        db.query(sql, order, err => {
            if (err) {
                console.log(err.message)
                throw err;
            }
        })
    })
    res.send("orders added");
})

// add category to product table
app.get('/addCategoryColumn', (req, res) => {
    let sql = "ALTER TABLE Product ADD category VARCHAR(20)"
    db.query(sql, err => {
        if (err) {
            throw err;
        }
    })
    res.send("Category column added to Product table");
})

//add  order data to orders table
app.get('/addOrderDateColumn', (req, res) => {
    let sql = "ALTER TABLE Orders ADD orderDate DATETIME DEFAULT CURRENT_TIMESTAMP"
    db.query(sql, err => {
        if (err) {
            throw err;
        }
    })
    res.send("order date column added to orders table");
})

app.listen(port, () => {
    console.log("Server started on port " + port)
});
