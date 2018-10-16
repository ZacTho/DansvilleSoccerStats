const express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const SQL = require('sql-template-strings');
var bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
var path = require("path");
const { Pool, Client } = require('pg');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
var alert = require('alert-node');
var User = require('./models/user');

app.use(express.static(__dirname + '/public'));

//init session
app.use(session({
    key: 'user_sid',
    secret: 'somerandomstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

//check for cookies
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

//check for users that are logged in
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/index');
    } else {
        next();
    }    
};

var pageChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
    	res.redirect('/login');
    }    
};

//Create a pool for DB Connection
const pool = new Pool({
	user: 'zach',
	host: 'soccerstats.ccnkvcm9gvph.us-east-1.rds.amazonaws.com',
	database: 'SoccerStats',
	password: 'cuseorange11',
	port: 5432, 
});

app.get('/', sessionChecker, function(req,res){
	res.redirect('/team');
});

app.get('/index', async function(req,res){
	try{
		const client = await pool.connect();
		const result = await client.query(SQL`SELECT SUM(goals) AS goals, SUM(assists) AS assists, SUM(saves) AS saves FROM players`.setName('index_query'));
		const results = { 'results': (result) ? result.rows : null};
	    if (req.session.user && req.cookies.user_sid) 
	    {
	    	res.render('index', results);
		} 
		else 
		{
	    	res.redirect('/login');
		} 
			client.release();
	}
	catch(error){
		res.render('error');
	}

});
// route for user signup
app.route('/signup')
    .get(pageChecker, (req, res) => {
        res.render('signup');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/index');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });

app.get('/team', async function(req,res){
	try{
		const client = await pool.connect();
		app.locals.log = "Log Out";
		if (req.session.user && req.cookies.user_sid) 
		{
    	}
    	else {
    		app.locals.log = "Log In";
    	} 
		const result = await client.query(SQL`SELECT SUM(goals) AS goals, SUM(assists) AS assists, SUM(saves) AS saves FROM players`.setName('team_query'));
		const results = { 'results': (result) ? result.rows : null};
		res.render('team', results);
		client.release();
	}
	catch(error){
		res.render('error');
	}

});


//The following controllers use thebody-parser npm module to request info from post
//It also uses sql-template-strings npm module to make sql prepared statements and paramterize inputs :)
// ------------------------------------------------------------------------------------------------------------------------

//server side for remove player form
app.get('/removeplayerform', pageChecker, async function (req, res) {
	const client = await pool.connect();
	try{
		const result = await client.query(SQL`SELECT playerId, FName, LName FROM players ORDER BY LName`.setName('removeplayerform_query'));
		const results = { 'results': (result) ? result.rows : null};	
  		res.render('removeplayerform', results);
  		client.release();
	}
	catch(error){
		res.render('error');
	}
});

//server side post for removing a player
app.post('/removeplayer', pageChecker, async function (req, res) {
	const client = await pool.connect();
	var player = req.body.player;
	try{
		client.query(SQL`DELETE FROM players WHERE playerId = ${player}`.setName('remove_player_query'));
		res.render('removeplayer');
    	client.release();
	}
	catch(error){
		res.render('error');
	}
});


app.route('/login')
    .get(sessionChecker, (req, res) => {
    	app.locals.log = "Log Out";
         if (req.session.user && req.cookies.user_sid) 
		{
    	}
    	else {
    		app.locals.log = "Log In";
    	} 
        res.render('login');
    })
    .post((req, res) => {
        var username = req.body.username;
        var	password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
            	alert('Invalid Username or Password');
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                alert('Invalid Username or Password');
                res.redirect('/login');

            } else {
                req.session.user = user.dataValues;
                res.redirect('/index');
            }
        });
    });

app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});



//Server side for viewing a players statistics
app.post('/viewplayer', async function (req, res) {
	var player = req.body.player;
	const client = await pool.connect();
	app.locals.log = "Log Out";
		if (req.session.user && req.cookies.user_sid) 
		{
    	}
    	else {
    		app.locals.log = "Log In";
    	} 
	try{
		const result = await client.query(SQL`SELECT goals, assists, saves, TO_CHAR(dob, 'MM/DD/YYYY') dob, position, FName, LName FROM players WHERE playerId = ${player}`.setName('viewplayer_query'));
		const results = { 'results': (result) ? result.rows : null};	
		res.render('viewplayer', results);
		client.release();
	}
	catch(error){
		res.render('error');
	}
});

//Server Side Post for editing info from a current player's stats
app.post('/editplayerform', pageChecker, async function (req, res) {
	const client = await pool.connect();
	var player = req.body.player;
	try{
		const result = await client.query(SQL`SELECT playerId, goals, assists, saves, TO_CHAR(dob, 'MM/DD/YYYY') dob, position, FName, LName FROM players WHERE playerId = ${player}`.setName('editplayerform_query'));
		const results = { 'results': (result) ? result.rows : null};	
		res.render('editplayerform', results);
		client.release();
	}
	catch(error){
		res.render('error');
	}
});

//Server side post for editing a players statistics / commit to db
app.post('/editplayer', pageChecker, async function (req, res) {
	const client = await pool.connect();
	var player = req.body.player;
	var fname = req.body.fname;
	var lname = req.body.lname;
	var dob = req.body.dob;
	var pos = req.body.pos;
	var goals = req.body.goals;
	var assists = req.body.assists;
	var saves = req.body.saves;
	try{
		client.query(SQL`UPDATE players SET FName = ${fname}, LName = ${lname}, dob = ${dob}, position = ${pos}, goals = ${goals}, assists = ${assists}, saves = ${saves} WHERE playerId = ${player}`.setName('editplayer_query'));
		res.render('editplayer');
		client.release();
	}
	catch(error){
		res.render('error');
	}
});

app.get('/error', function (req, res){
	res.render('error');
});

//Sever side for adding stats to a player
app.get('/addstatsform', pageChecker, async function (req, res) {	
	const client = await pool.connect();
	try{
		const result = await client.query(SQL`SELECT playerId, FName, LName FROM players ORDER BY LName`.setName('addstatsform_query'));
		const results = { 'results': (result) ? result.rows : null};
		res.render('addstatsform', results);
		client.release();
	}
	catch(error){
		res.render('error');
	}
});



//Server side for adding stats
app.post('/addstats', pageChecker, async function (req, res) {	
	const client = await pool.connect();
	var player = req.body.player;
	var goals = req.body.goals;
	var assists = req.body.assists;
	var saves = req.body.saves;
	try{
		client.query(SQL`UPDATE players SET goals = goals + ${goals}, assists = assists + ${assists}, saves = saves + ${saves} WHERE playerId = ${player}`.setName('addstats_query'));
		res.render('addstats');
		client.release();
	}
	catch(error){
		res.render('error');
	}
});

//Sever side for selecting a player to view their stats/info
app.get('/selectplayer', async function (req, res) {
	const client = await pool.connect();
	app.locals.log = "Log Out";
	if (req.session.user && req.cookies.user_sid) 
		{
    	}
    	else {
    		app.locals.log = "Log In";
    	} 
	try{
		const result = await client.query(SQL`SELECT playerId, FName, LName FROM players ORDER BY LName`.setName('selectplayer_query'));
		const results = { 'results': (result) ? result.rows : null};	 
    	res.render('selectplayer', results);
		client.release();
	}
	catch(error){
		res.render('error');
	}
});

//Server side for choosing a player to edit their info
app.get('/editplayerselect', pageChecker, async function (req, res) {
	const client = await pool.connect();
	try{
		const result = await client.query(SQL`SELECT playerId, FName, LName FROM players ORDER BY LName`.setName('editplayerselect_query'));
		const results = { 'results': (result) ? result.rows : null};	
	  	res.render('editplayerselect', results);
	  	client.release();
	}
	catch(error){
		res.render('error');
	}
});

//server side for inputs to add a new player
app.get('/addplayerform', pageChecker, async function (req, res) {

    res.render('addplayerform');
});

//Server side post for adding a player to the team
app.post('/addplayer', pageChecker, async function (req, res) {
	const client = await pool.connect();
	var fname = req.body.fname;
	var lname = req.body.lname;
	var dob = req.body.dob;
	var pos = req.body.pos;
	var goals = req.body.goals;
	var assists = req.body.assists;
	var saves = req.body.saves;
	try{
		client.query(SQL`INSERT INTO players (FName, LName, dob, position, goals, assists, saves) VALUES (${fname}, ${lname}, ${dob}, ${pos}, ${goals}, ${assists}, ${saves})`.setName('addplayer_query'));
		res.render('addplayer');
		client.release();
	}
	catch(error){
		res.render('error');
	}
});
 
var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Example app listening on port!');
});
