const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { MongoClient } = require('mongodb');

const app = express();

// MongoDB URI and Database Name
const url = 'mongodb+srv://memaybeo:m2D3rLHrDbJ770BC@ako.lgufv.mongodb.net/?retryWrites=true&w=majority&appName=ako';
const dbName = 'ako';

// Connect to MongoDB
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serving static files from 'js' directory
app.use('/js', express.static(path.join(__dirname, 'js')));

// Sample Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/hdhsvptvnu19vnu', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/createorder', async (req, res) => {
    let data = req.body;
    let date = new Date;
    res.setHeader("Content-type", "application/json");

    if (!req.body.phone_number || !req.body.fullname || !req.body.address || !req.body.item_amount || !req.body.product) {
        res.send(JSON.stringify({
            status: 0,
            msg: "Vui lòng điền đầy đủ thông tin!"
        }))
    }
    
    data.date = date.getDate() 
    + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

    await db.collection('orders').insertOne(data).then(result => {
        res.send(JSON.stringify({
            status: 1,
            msg: "Đã đặt hàng thành công, đơn hàng sẽ được giao trong vài ngày tới!"
        }))
    }).catch(error => {
        console.error(error)

        res.send(JSON.stringify({
            status: 0,
            msg: "Hệ thống đang lỗi!"
        }))
    });
})

app.get('/orderlist', async (req, res) => {
    let orders = await db.collection('orders').find().toArray();

    res.setHeader("Content-type", "application/json");
    res.send(JSON.stringify(orders))
})

// 404 Handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, page not found!');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
