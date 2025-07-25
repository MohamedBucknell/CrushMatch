const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

 

const users = {};

app.use(bodyParser.urlencoded({ extended: true }));

// Updated color scheme & centered style inspired by ngl.link
const style = `
  <style>



    body {
      background: linear-gradient(135deg,rgb(141, 14, 31) 0%,rgb(56, 30, 77) 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      color: #f0f0f5;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }


    nav {
  background-color: rgba(0, 0, 0, 0.25);
  color: #f0f0f5;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between; /* logo left, links right */
  align-items: center;
  gap: 2rem;
  font-weight: 200;
  font-size: 1.1rem;
  backdrop-filter: blur(6px);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-left {
  flex-shrink: 0;
}

.nav-logo {
  height: 40px;  /* adjust as needed */
  width: auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
  justify-content: flex-end;
  flex-grow: 1;
}

nav a {
  color: #f0f0f5;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #ffd6f0;
  text-decoration: underline;
}

/* Footer styling */
footer {
  background-color: rgba(0, 0, 0, 0.25);
  color: #f0f0f5;
  text-align: center;
  padding: 1rem 0;
  font-weight: 200;
  font-size: 0.9rem;
  backdrop-filter: blur(6px);
  border-top: 1px solid rgba(255 255 255 / 0.1);
  margin-top: auto;
}


    .container {
      flex: 1;
      max-width: 480px;
      margin: 2rem auto 3rem;
      background: rgba(255 255 255 / 0.1);
      border-radius: 15px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      padding: 2rem;
      text-align: center;
      color: #f0f0f5;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255 255 255 / 0.18);
    }
    h1 {
      margin-bottom: 1rem;
      font-size: 2.25rem;
      font-weight: 200;
    }
    h2 {
      margin-top: 1.5rem;
      font-weight: 200;
    }
    form, p {
      margin: 1.25rem 0;
    }
    input, textarea {
  background: linear-gradient(135deg, #ff8ecf, #c28dff);
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  outline: none;
  margin-top: 0.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #555;
  box-sizing: border-box;  /* ✅ FIX: Prevents edge hugging */
}

    textarea {
      resize: vertical;
      min-height: 80px;
    }
    button {
  margin-top: 1rem;

  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ff8ecf, #c28dff);  /* ✅ Gradient */
  color: rgb(46, 23, 102);
  font-weight: 200;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease;  /* ✅ For gradient transitions */
  width: 50%;
}

    button:hover {
  background: linear-gradient(135deg, #fda4d7, #a385ff);
}
    a {
      color: #ffd6f0;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    /* For smaller screens */
    @media (max-width: 520px) {
      nav {
        flex-wrap: wrap;
        gap: 1rem;
      }
      .container {
        margin: 1rem;
        padding: 1.5rem;
      }
    }
  </style>
`;

// Nav bar with new links
const nav = `
  <nav>
    <div class="nav-left" style="display: flex; align-items: center; gap: 8px;">
      <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="Crushmate Logo" class="nav-logo" />
      <span style="font-weight: bold; font-size: 2.6rem;">CrushMatch</span>
    </div>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/create">Create Profile</a>
      <a href="/existing">Login</a>
      <a href="/about">About</a>
      <a href="/contact">Contact Us</a>
    </div>
  </nav>
`;




// Helper for rendering page with nav + style
function renderPage(content) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CrushMatch</title>
      ${style}
    </head>
    <body>
      ${nav}
      <div class="container">${content}</div>
      <footer>CrushMatch &copy; All rights reserved 2025</footer>
    </body>
    </html>
  `;
}


function generateToken(username, password) {
  return crypto.createHash('sha256').update(username + password).digest('hex').slice(0, 10);
}


















// Routes

app.get('/', (req, res) => {
  res.send(renderPage(`
    <div style="max-width: 600px; margin: 60px auto; text-align: center; font-family: Arial, sans-serif; color: white;">

      <!-- Image Banner -->
      <img src="https://thumbs.dreamstime.com/b/two-people-love-sunset-16041145.jpg" 
           alt="CrushMatch Banner" 
           style="width: 100%; border-radius: 12px; margin-bottom: 20px;" />

      <h1 style="font-size: 2.5em;">Welcome to CrushMatch! 💘</h1>
      
      <p style="font-size: 1.1em; line-height: 1.6;">
        CrushMatch is a private and fun matchmaking tool made for friend groups, schools, or communities.
      </p>

      <p style="font-size: 1.1em; line-height: 1.6;">
        Here's how it works:
      </p>

      <ol style="text-align: left; margin: 0 auto; max-width: 500px; font-size: 1.05em;">
        <li>Create your account and list the Instagram handles of all your crushes.</li>
        <li>Get a unique link to share — like in your IG bio or story.</li>
        <li>Your crush visits the link and writes their Instagram handle.</li>
        <li>If there’s a match, both of you get notified! No match? No one knows.</li>
      </ol>

      <p style="font-size: 1.1em; margin-top: 20px;">
        It’s like Tinder — but private, safer, and for real-life connections. 
        No swiping. No public profiles. Just honest, mutual matches.
      </p>
    </div>
  `));
});



app.get('/existing', (req, res) => {
  res.send(renderPage(`
    <h1>Existing User Login</h1>
    <form method="POST" action="/existing">
      <input name="username" placeholder="Enter your username" required />
      <button type="submit">Continue</button>
    </form>
    <p><a href="/">Back to Home</a></p>
  `));
});

app.post('/existing', (req, res) => {
  const username = req.body.username.trim().toLowerCase();
  if (!users[username]) {
    return res.send(renderPage(`
      <h1>User "${username}" not found.</h1>
      <p><a href="/existing">Try again</a></p>
    `));
  }
  res.redirect(`/login/${username}`);
});

app.get('/create', (req, res) => {
  res.send(renderPage(`
    <h1>Create Profile</h1>
    <form method="POST" action="/create">
      <input name="username" placeholder="Choose a username" required />
      <input name="password" type="password" placeholder="Choose a password" required />
<input name="email" type="email" placeholder="Enter your email." required />

      <button type="submit">Create Profile</button>
    </form>
    <p><a href="/">Back to Home</a></p>
  `));
});

app.post('/create', (req, res) => {
  const username = req.body.username.trim().toLowerCase();
  const password = req.body.password;
  const email = req.body.email.trim().toLowerCase();

  if (users[username]) {
    return res.send(renderPage(`
      <h1>Username taken. Try another.</h1>
      <p><a href="/create">Back</a></p>
    `));
  }

  users[username] = { password, email, crushes: [], matches: [], submissions: [] };
  console.log('Users list:', users);


  const token = generateToken(username, password);
  res.redirect(`/dashboard/${username}?token=${token}`);
});


app.get('/login/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.send(renderPage(`
    <h1>User not found.</h1>
    <p><a href="/">Back</a></p>
  `));
  res.send(renderPage(`
    <h1>Login for ${req.params.username}</h1>
    <form method="POST" action="/login/${req.params.username}">
      <input name="password" type="password" placeholder="Enter your password" required />
      <button type="submit">Login</button>
    </form>
    <p><a href="/">Back to Home</a></p>
  `));
});

app.post('/login/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.send(renderPage(`<h1>User not found.</h1><p><a href="/">Back</a></p>`));
  if (req.body.password === user.password) {
    const token = generateToken(req.params.username, user.password);
console.log('Users list:', users);

    res.redirect(`/dashboard/${req.params.username}?token=${token}`);
  } else {
    res.send(renderPage(`
      <h1>Incorrect password.</h1>
      <p><a href="/login/${req.params.username}">Try again</a></p>
    `));
  }
});

app.get('/dashboard/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send(renderPage(`<h1>User not found.</h1>`));

  const token = req.query.token;
  const validToken = generateToken(req.params.username, user.password);
  if (token !== validToken) {
    return res.status(403).send(renderPage(`<h1>Access Denied</h1>`));
  }

  const baseUrl = req.protocol + '://' + req.get('host');
  const crushLink = `${baseUrl}/u/${req.params.username}`;
  const crushes = user.crushes.join(', ') || 'None';
  const matches = user.matches.join(', ') || 'None';

  res.send(renderPage(`
    <h1>Welcome, ${req.params.username}!</h1>
    
    <p>Share your link!: 
      <a href="${crushLink}" id="crushLink">${crushLink}</a>
      <button id="copyBtn" title="Copy Link">📋</button>
    </p>
    <p id="copyMsg" style="color: #ffd6f0; display: none;">Copied!</p>

    <p>Keep checking here for your matches.</p>

    <h2>Your Crushes: ${crushes}</h2>
    <h2>Your Matches: ${matches}</h2>

    <form method="POST" action="/add-crush/${req.params.username}?token=${token}">
      <p>Add new crush's Instagram @ handle.</p>
      <input name="crushName" pattern=".*@.*" placeholder="Start with @" required />
      <button type="submit">Add Crush</button>
    </form>

    <p><a href="/logout">Logout</a></p>

    <style>
      #copyBtn {
        background-color: #ffd6f0;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        padding: 0.2em 0.5em;
        margin-left: 5px;
        cursor: pointer;
width: 40px;
      }
      #copyBtn:hover {
        background-color: #ffb3d9;
      }
    </style>

    <script>
      document.getElementById('copyBtn').addEventListener('click', () => {
        const link = document.getElementById('crushLink').href;
        navigator.clipboard.writeText(link).then(() => {
          const msg = document.getElementById('copyMsg');
          msg.style.display = 'inline';
          setTimeout(() => { msg.style.display = 'none'; }, 2000);
        }).catch(() => {
          alert('Failed to copy. Please copy manually.');
        });
      });
    </script>
  `));
});

app.post('/add-crush/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send(renderPage(`<h1>User not found.</h1>`));
  const token = req.query.token;
  const validToken = generateToken(req.params.username, user.password);
  if (token !== validToken) {
    return res.status(403).send(renderPage(`<h1>Access Denied</h1>`));
  }
  const crushName = req.body.crushName.trim().toLowerCase();
  if (!user.crushes.includes(crushName)) user.crushes.push(crushName);
console.log('Users list:', users);

  res.redirect(`/dashboard/${req.params.username}?token=${token}`);
});

app.get('/u/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send(renderPage(`<h1>User not found.</h1>`));

  res.send(renderPage(`
    <h1>Confess Your Crush to ${req.params.username}</h1>

    <div class="info-box">
      <p><strong>INSTRUCTIONS:</strong> Enter your <span style="color: #ffd6f0;">Instagram handle</span>, starting with <code>@</code>.</p>
      <p><strong> If there’s <span style="color: #ffd6f0;">no match</span>, they won’t know. If there’s a match, you’ll both find out!</strong></p>
    </div>

    <form method="POST" action="/submit/${req.params.username}">
      <input name="yourName" pattern=".*@.*" placeholder="@your_instagram" required />
      <button type="submit">Submit</button>
    </form>
<p>Wanna find your secret admirers? Click 'Create Profile' to make your own link!</p>
  `));
});

app.post('/submit/:username', (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send(renderPage(`<h1>User not found.</h1>`));
  const submitterName = req.body.yourName.trim().toLowerCase();
  if (!user.submissions.includes(submitterName)) user.submissions.push(submitterName);
  if (user.crushes.includes(submitterName)) {
    if (!user.matches.includes(submitterName)) user.matches.push(submitterName);
console.log('Users list:', users);

    return res.send(renderPage(`<h1>It's a MATCH! ${submitterName} and ${req.params.username} like each other!</h1>`));
  }
  res.send(renderPage(`<h1>Thanks for submitting your crush!</h1>`));
});

app.get('/about', (req, res) => {
  res.send(renderPage(`
    <h1>About CrushMatch</h1>
    <p>CrushMatch is a safe and anonymous way to find out who likes you back.</p>
    <p>Simply create a profile, share your unique link, and let the magic happen!</p>
  `));
});

app.get('/contact', (req, res) => {
  res.send(renderPage(`
    <h1>Contact Us</h1>
    <form method="POST" action="/contact">
      <input name="name" placeholder="Your Name" required />
      <input name="email" type="email" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button type="submit">Send Message</button>
    </form>
  `));
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  // For demo, just thank the user (no real email sending)
  res.send(renderPage(`
    <h1>Thank you, ${name}!</h1>
    <p>We received your message and will get back to you soon.</p>
    <p><a href="/">Back to Home</a></p>
  `));
});

app.get('/logout', (req, res) => res.redirect('/'));

app.listen(PORT, () => console.log(`🔥 Server running: http://localhost:${PORT}`));
