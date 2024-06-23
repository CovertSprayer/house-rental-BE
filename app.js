const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();


app.use(cors({
  origin: ['http://localhost:3000','https://house-rental-fe.onrender.com'],
  credentials: true,            
  optionSuccessStatus: 200
}));

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
// const clientUrl = process.env.CLIENT_URL;
const localUrl = process.env.LOCAL_URL;

// app.use(cors({
//   origin: localUrl,
//   credentials: true,
// }));

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// Routes setup
const auth = require('./routes/auth.route');
const user = require('./routes/user.route');
const post = require('./routes/post.route');

app.use('/user', user);
app.use('/auth', auth);
app.use('/post', post);

// Start the server
const port = process.env.PORT || 4500;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
