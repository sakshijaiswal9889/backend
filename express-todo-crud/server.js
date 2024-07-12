const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Read data from db.json
const readData = () => {
  const data = fs.readFileSync('db.json');
  return JSON.parse(data);
};

// Write data to db.json
const writeData = (data) => {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
};

// Get all todos
app.get('/todos', (req, res) => {
  const data = readData();
  res.json(data.todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
  const data = readData();
  const newTodo = {
    id: data.todos.length + 1,
    title: req.body.title,
    status: false
  };
  data.todos.push(newTodo);
  writeData(data);
  res.status(201).json(newTodo);
});

// Update status of todos with even ID
app.put('/todos/update-even-status', (req, res) => {
  const data = readData();
  data.todos.forEach(todo => {
    if (todo.id % 2 === 0 && !todo.status) {
      todo.status = true;
    }
  });
  writeData(data);
  res.json(data.todos);
});

// Delete todos with status true
app.delete('/todos/delete-true', (req, res) => {
  let data = readData();
  data.todos = data.todos.filter(todo => !todo.status);
  writeData(data);
  res.json(data.todos);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
