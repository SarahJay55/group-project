require('dotenv').config();
const express = require('express')
    , session = require('express-session')
    , bodyParser = require('body-parser')
    , massive = require('massive')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , cors = require('cors')
    , controller = require("./controllers/controller.js");

const app = express();

// app.use( express.static( `${__dirname}/../build`));

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) => { console.log(req.method, req.url); next(); })

app.use(passport.initialize());
app.use(passport.session());

massive(process.env.CONNECTION_STRING).then(db => {
    app.set('db', db);
})

//----------------MIDDLEWARES--------------------------------//
passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, function (accessToken, refreshToken, extraParams, profile, done) {
   
    const db = app.get('db');
    
        db.find_user([profile.identities[0].user_id]).then(user => {
            if (user[0]) {
                return done(null, user[0].id)
            } else {
                const user = profile._json;
                db.create_user([user.name, user.email, user.picture, user.identities[0].user_id])
                    .then(user => {
                        return done(null, user[0].id)
                    })
            }
        })

    
}))
//------------------------ENDPOINTS------------------------------//
//-----auth0-----------------//
app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/empmain',
    failureRedirect: '/auth'
}));
app.get('/auth/me', (req, res) => {
    if (!req.user) {
        return res.status(404).send('User not found')
    }
    return res.status(200).send(req.user);
})

app.get('/auth/logout', (req, res) => {
    req.logOut();
    res.redirect(302, '/#/')
})



passport.serializeUser(function (id, done) {
    done(null, id);
})
passport.deserializeUser(function (id, done) {
    app.get('db').find_current_user([id])
        .then(user => {
            done(null, user[0])
        })
})
//------employee--------//
app.get('/api/employee/get_timecard/:id', controller.get_timecard);
app.get('/api/admin/get_emp_timecard/:username', controller.get_emp_timecard);
app.get('/api/admin/get_requests/:id', controller.get_requests);
app.get('/api/admin/get_admin_requests', controller.get_admin_requests);
app.post('/api/employee/submit_clockin', controller.submit_clockin);
app.post('/api/employee/submit_requests', controller.submit_requests);
app.put('/api/employee/add_clockout', controller.add_clockout);
app.put('/api/admin/approval', controller.update_approval);

const PORT = process.env.PORT
app.listen(PORT, console.log(`Listening on port ${PORT}`))