const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let messages = [];

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// API to get messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// API to post messages
app.post('/messages', (req, res) => {
  const { uuid, message } = req.body;
  if (!messages.find(msg => msg.uuid === uuid)) {
    messages.push({ uuid, message });
    res.status(201).json({ status: 'Message posted' });
  } else {
    res.status(200).json({ status: 'Message already exists' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
