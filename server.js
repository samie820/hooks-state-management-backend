const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config/index.js');
let middleware = require('./middlewares/authMiddleware');
const songs = require('./models/Song');

class HandlerGenerator {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body);
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.secret,
          { expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        return res.json({
          success: true,
          message: 'Authentication successful!',
          token: token,
          user: {
            firstName: "Admin",
            lastName: "User"
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }

  getSongs (req, res) {
    res.json(songs);
  }

  welcome (req, res) {
    res.json({
      success: true,
      message: 'Hooks tutorial backend API'
    });
  }
}

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  app.use(cors());
  let handlers = new HandlerGenerator();
  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
  // Routes & Handlers
  app.post('/api/login', handlers.login);
  app.get('/api/songs', middleware.checkToken, handlers.getSongs);
  app.get('/api/', middleware.checkToken, handlers.index);
  app.get('/', handlers.welcome);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();
