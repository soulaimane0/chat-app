import { validationResult } from 'express-validator';
import passport from 'passport';
import User from '../models/user.js';

export const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { username, password } = req.body;
    await User.createUser(username, password);
    res.redirect('/login');
  } catch (err) {
    res.redirect('/signup');
  }
};

export const logIn = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/chatInterface',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

export const logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
};

export function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

export function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/chatInterface');
  }

  next();
}
