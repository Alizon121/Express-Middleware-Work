const express = require('express');
const app = express();
const dogs = require('./routes/dogs')
app.use(express.json())
const errorHandler = require('express-async-errors')


// Middleware function for logging method and URL path of the request
const logRequest = (req, res, next) => {
  console.log(`Method: ${req.method}, URL: ${req.url}`)
  res.on("finish", () => {
    console.log(res.statusCode)
  })
  next()
}

app.use(logRequest)

// Add the dog router
app.use("/dogs", dogs)

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

// Middlware for throwing error 
app.use((req, res, next) => {
  const error = new Error("The requested resource couldn't be found.")
  error.statusCode = 404
  next(error)
})

// Middleware for error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    Error: err.message
  })
})

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
