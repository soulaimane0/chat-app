import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user.js';

dotenv.config();

export const initializePassport = (passport) => {
  const authUser = async (username, password, done) => {
    const user = User.findByUsername(username);

    if (user == null)
      return done(null, false, { message: 'No user with that username!' });

    try {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) return done(null, user);
      else return done(null, false, { message: 'Password incorrect!' });
    } catch (err) {
      done(err);
    }
  };

  passport.use(new LocalStrategy(authUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, User.findById(id)));
};
