import express from 'express';
import { initializePassport } from './db.js';
import { body } from 'express-validator';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import flash from 'express-flash';
import {
  logIn,
  logOut,
  signUp,
  checkAuthenticated,
  checkNotAuthenticated,
} from './controllers/authController.js';
import { showHome } from './controllers/homeController.js';
import { showChatInterface } from './controllers/chatInterfaceController.js';
import { initializeSocketIo } from './controllers/socketController.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const PORT = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

app.get('/', showHome);

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup');
});

app.post(
  '/signup',
  [
    body('username').notEmpty().trim().escape(),
    body('password').isLength({ min: 8 }),
  ],
  checkNotAuthenticated,
  signUp
);

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('signin');
});

app.post('/login', checkNotAuthenticated, logIn);

// Use socket io controller
initializeSocketIo(io);

app.get('/chatInterface', checkAuthenticated, showChatInterface);

app.get('/logout', logOut);

server.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}/`);
});
