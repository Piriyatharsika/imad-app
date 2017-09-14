var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
  user: 'piriya3012',
  host: 'db.imad.hasura-app.io',
  database: 'piriya3012',
  password: process.env.DB_PASSWORD,
  port: '5432'
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: {maxAge: 3000 * 60 * 60 * 24 * 30} //maxAge set in ms ==> here its one month
}));


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

//Function which creates the hashed value
function hash(input, salt){
    //How do we create a hash??
    //explanation of pbkdf2Sync: 
        //1. input will be hashed to input+salt ==> 'password-this-is-some-random-string'
        //2. This String will be hashed 10000times ==> hashvalue is unique
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512'); // crypto Object has to be create as object on the top
    return ['pbkdf2', '100000', salt, hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function(req, res){
   var hashedString = hash(req.params.input,'this-is-some-random-string'); 
   res.send(hashedString);
});


app.post('/create-user', function(req, res){
    //JSON
    //{username: 'Piriya', password: 'password'} This is a json object
    // We will test the post request with curl: curl -v -XPOST -H 'Content-Type: application/json' --data '{"username": "Piriya", "password": "password"}' http://piriya3012.imad.hasura-app.io/create-user
    var username = req.body.username;
    var password = req.body.password;
    
    var salt = crypto.randomBytes(128).toString('hex');
    var doString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, doString], function(err, result){
     if(err){
         res.status(500).send(err.toString());
     }else{
         var message = 'User successfully created: ' + username;
            res.send(JSON.stringify({"message":message}));
     }
    });
    
});

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result){
     if(err){
         res.status(500).send(err.toString());
     }else{
         if(result.rows.length === 0){
             res.setHeader('Content-Type', 'application/json')
             res.status(403).send(JSON.stringify({"error":"username/password is invalid"}));
         }else{
             //Have to match the password
             var dbString = result.rows[0].password;
             var salt = dbString.split('$')[2]; // 2. Dollerzeichen
             var hashedPassword = hash(password, salt);
             if(hashedPassword === doString){
                 
                 //set the session
                 req.session.auth = {userId: result.rows[0].id};
                 //set cookie wth the session id
                 //internally, on the server side, it maps the session id to an object
                 // sesion contains an auth variable in which the userid is included ==> {auth: {userid: }}
                 res.send(JSON.stringify({"user is exit": username}));
                
             }else{
                  res.status(403).send(JSON.stringify({"error":"username/password is invalid"}));
             }
            
         }
        
     }
    });
});

app.get('/check-login', function(req, res){
    if (req.session && req.session.auth && req.session.auth.userId){
        res.send('you are logged in: '+ req.session.auth.userId.toString());
    }else{
      res.send(JSON.stringify({"message":"credentials correct"}));
    }
});

//Connection to database
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
    //param $1 is as a placeholder and is used to make a safe input 
    pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function(err,result){
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
