import crypto from 'crypto';
import bcrypt from 'bcrypt';

const users = [];

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  static async createUser(username, password) {
    const id = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(id, username, hashedPassword);
    users.push(user);
    return user;
  }

  static findByUsername(username) {
    return users.find((user) => user.username === username);
  }

  static findById(id) {
    return users.find((user) => user.id === id);
  }
}

export default User;
