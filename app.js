const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

const users = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const style = `<style>body{background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;color:#fff;text-align:center}h1{font-size:3rem;margin-bottom:1rem}form,p{margin:1rem 0}input{padding:0.7rem;border-radius:10px;border:none;margin:0.5rem 0;width:250px;font-size:1rem}button{padding:0.7rem 1.5rem;border-radius:10px;border:none;background-color:#fff;color:#f5576c;font-weight:bold;font-size:1rem;cursor:pointer;transition:background-color 0.3s ease}button:hover{background-color:#ffd6e0}a{color:#fff;text-decoration:underline}</style>`;

function generateToken(username, password) {
  return crypto.createHash('sha256').update(username + password).digest('hex').slice(0, 10);
}

app.get('/', (req, res) => {
  res.send(`${style}<h1>Welcome to CrushMatch!</h1>
    <p><button onclick="window.location.href='/create'">New User: Create Profile</button></p>
    <p><button onclick="window.location.href='/existing'">Existing User: Login</button></p>
    <p>Visitors: Use the unique link shared by your crush (e.g., /u/username)</p>`);
});

app.get('/existing', (req, res) => {
  res.send(`${style}<h1>Existing User Login</h1>
    <form method="POST" action="/existing">
      <input name="username" placeholder="Enter your username" required /><br>
      <button type="submit">Continue</button>
    </form>
    <p><a href="/">Back to Home</a></p>`);
});

app.post('/existing', (req, res) => {
  const username = req.body.username.trim().toLowerCase();
  if (!users[username]) {
    return res.send(`${style}<h1>User "${username}" not found.</h1><p><a href="/existing">Try again</a></p>`);
  }
  res.redirect(`/login/${username}`);
});

app.get('/create', (req, res) => {
  res.send(`${style}<h1>Create Profile</h1>
    <form method="POST" action="/create">
      <input name="username" placeholder="Choose a username" required /><br>
      <input name="password" type="password" placeholder="Choose a password" required /><br>
      <button type="submit">Create Profile</button>
    </form>
    <p><a href="/">Back to Home</a></p>`);
});

app.post('/create', (req, res) => {
  const username = req.body.username.trim().toLowerCase();
  const password = req.body.password;
  if (users[username]) {
    return res.send(`${style}<h1>Username taken. Try another.</h1><p><a href="/create">Back</a></p>`);
  }
  users[username] = { password, crushes: [], matches: [], submissions: [] };
  const token = generateToken(username, password);
  res.redirect(`/dashboard/${username}?token=${token}`);
});

app.get('/login/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.send(`${style}<h1>User not found.</h1><p><a href="/">Back</a></p>`);
  res.send(`${style}<h1>Login for ${req.params.username}</h1>
    <form method="POST" action="/login/${req.params.username}">
      <input name="password" type="password" placeholder="Enter your password" required /><br>
      <button type="submit">Login</button>
    </form>
    <p><a href="/">Back to Home</a></p>`);
});

app.post('/login/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.send(`${style}<h1>User not found.</h1><p><a href="/">Back</a></p>`);
  if (req.body.password === user.password) {
    const token = generateToken(req.params.username, user.password);
    res.redirect(`/dashboard/${req.params.username}?token=${token}`);
  } else {
    res.send(`${style}<h1>Incorrect password.</h1><p><a href="/login/${req.params.username}">Try again</a></p>`);
  }
});

app.get('/dashboard/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send(`${style}<h1>User not found.</h1>`);
  const token = req.query.token;
  const validToken = generateToken(req.params.username, user.password);
  if (token !== validToken) {
    return res.status(403).send(`${style}<h1>Access Denied</h1>`);
  }
  const baseUrl = req.protocol + '://' + req.get('host');
  const crushLink = `${baseUrl}/u/${req.params.username}`;
  const crushes = user.crushes.join(', ') || 'None';
  const matches = user.matches.join(', ') || 'None';
  res.send(`${style}<h1>Welcome, ${req.params.username}!</h1>
    <p>Your unique link: <a href="${crushLink}">${crushLink}</a></p>
    <h2>Your Crushes: ${crushes}</h2>
    <h2>Your Matches: ${matches}</h2>
    <form method="POST" action="/add-crush/${req.params.username}?token=${token}">
      <input name="crushName" placeholder="Add a new crush" required /><br>
      <button type="submit">Add Crush</button>
    </form>
    <p><a href="/logout">Logout</a></p>`);
});

app.post('/add-crush/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send(`${style}<h1>User not found.</h1>`);
  const token = req.query.token;
  const validToken = generateToken(req.params.username, user.password);
  if (token !== validToken) {
    return res.status(403).send(`${style}<h1>Access Denied</h1>`);
  }
  const crushName = req.body.crushName.trim().toLowerCase();
  if (!user.crushes.includes(crushName)) user.crushes.push(crushName);
  res.redirect(`/dashboard/${req.params.username}?token=${token}`);
});

app.get('/u/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send(`${style}<h1>User not found.</h1>`);
  res.send(`${style}<h1>Submit Your Crush to ${req.params.username}</h1>
    <form method="POST" action="/submit/${req.params.username}">
      <input name="yourName" placeholder="Your name" required /><br>
      <button type="submit">Submit</button>
    </form>`);
});

app.post('/submit/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send(`${style}<h1>User not found.</h1>`);
  const submitterName = req.body.yourName.trim().toLowerCase();
  if (!user.submissions.includes(submitterName)) user.submissions.push(submitterName);
  if (user.crushes.includes(submitterName)) {
    if (!user.matches.includes(submitterName)) user.matches.push(submitterName);
    return res.send(`${style}<h1>It's a MATCH! ${submitterName} and ${req.params.username} like each other!</h1>`);
  }
  res.send(`${style}<h1>Thanks for submitting your crush!</h1>`);
});

app.get('/logout', (req, res) => res.redirect('/'));

app.listen(PORT, () => console.log(`🔥 Server running: http://localhost:${PORT}`));
