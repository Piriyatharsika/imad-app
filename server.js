var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
  user: 'piriya3012',
  host: 'db.imad.hasura-app.io',
  database: 'piriya3012',
  password: process.env.DB_PASSWORD,
  port: '5432'
};
var app = express();
app.use(morgan('combined'));


var articles = {
    'article-one' : {
    title: 'Article One | Piriya',
    heading: 'Article One',
    content: `<p>
                    This is Article one.This is Article one.This is Article one.This is Article one.This is Article one.
                    This is Article one.
                </p>
                <p>
                    This is Article one.This is Article one.This is Article one.This is Article one.This is Article one.
                    This is Article one.
                </p>
                <p>
                    This is Article one.This is Article one.This is Article one.This is Article one.This is Article one.
                    This is Article one.
                </p>`
    },
    'article-two' : {
    title: 'Article Two | Piriya',
    heading: 'Article Two',
    content: `<p>
                    This is Article one.This is Article one.This is Article one.This is Article one.This is Article one.
                    This is Article one.
                </p>
                <p>
                    This is Article one.This is Article one.This is Article one.This is Article one.This is Article one.
                    This is Article one.
                </p>
                <p>
                    This is Article one.This is Article one.This is Article one.This is Article one.This is Article one.
                    This is Article one.
                </p>`

    },
    'article-three' : {
    title: 'Article Three | Piriya',
    heading: 'Article Three',
    content: `  <p>
                    This is Article three.This is Article three.This is Article three.This is Article three.This is Article three.
                    This is Article three.
                </p>`
    }
};

function createTemplate (data) {
    var title = data.title;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate =
        `<html>
            <head>
                <title>
                    ${title}
                </title>
                <meta name="viewport" content="width-device-width, initial-scale=1"/>
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            <body>
                <div class="container">
                    <div>
                        <a href="/">Home</a>
                    </div>
                    <div>
                        <h3>
                            ${heading}
                        </h3>
                    </div>
                    <div>
                       ${content}
                    </div>
                </div>
            </body>
        </html>`
        ;
        return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test', function(err, result){
     if(err){
         res.status(500).send(err.toString());
     }else{
         res.send(JSON.stringify(result));
     }
    });
   //make a select request
   //return a response with the result
});

var counter = 0;
app.get('/counter', function(req, res){
   counter = counter + 1;
   res.send(counter.toString());
});

var names = [];
//Variante1: app.get('/submit-name/:name', function(req,res){ //:name ==> variable Name
app.get('/submit-name/', function(req,res){ //?name=xxxx ==> query string 
    //Get the name from the request
  //Variante1: var name = req.params.name; // get the variable from request
  var name = req.query.name;
  names.push(name);
  //JSON= Javascribt Object Notation : Convert Javascribt Objects to String
  res.send(JSON.stringify(names));
});


app.get('/articles/:articleName', function(req, res){
    //articleName == article-One
    //article[articleName] == {} content for the article one
    //var articleName = req.params.articleName;
    pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'", function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length === 0){
                res.status(404).send("Title not exists!");
            }else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
