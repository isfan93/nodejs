const express = require('express');
const mysql = require('mysql');
const app = express();
// const myconnection = require('express-myconnection');

//spesifikasikan dimana file css dan gambar di letakan
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
// app.use(myconnection(mysql, dbOption, 'pool'));


// var dbOption = {
//     host : 'localhost',
//     user : 'root',
//     password: '',
//     port : '3306',
//     database : 'nodejs' 
// }

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '',
    database : 'nodejs'
});



  app.get('/', (req,res) => {
      res.render('top.ejs');
  });

  app.get('/index', (req,res) => {
      connection.query(
          'SELECT * FROM belanjaan',
          (error, results) => {
              res.render('index.ejs', {items: results});
          }
      );
  });

  app.get('/new', (req,res)=>{
    res.render('new.ejs');
  });


  app.post('/create', (req,res)=>{
    connection.query(
        'INSERT INTO belanjaan (name) VALUES (?)',
        [req.body.itemName],
        (error, results) => {
            res.redirect('/index');
        });
  });


app.post('/delete/:id', (req,res)=>{
    connection.query(
        'DELETE FROM belanjaan WHERE id = ?',
        [req.params.id],
        (error,results) => {
            res.redirect('/index');
        }
    );
});

app.get('/edit/:id',(req,res) => {
    connection.query(
        'SELECT * FROM belanjaan WHERE id = ?',
        [req.params.id],
        (error,results) => {
            res.render('edit.ejs', {item: results[0]});
        }
    );
});

app.post('/update/:id', (req,res) => {
    connection.query(
        'UPDATE belanjaan SET name = ? WHERE id = ?',
        [req.body.itemName, req.params.id],
        (error,results) => {
            res.redirect('/index');
        }
    );
});





app.listen(5000, ()=> console.log("server Run..."));
connection.connect(function(err) {
    if(err) throw err;
    console.log("database connected!");
});