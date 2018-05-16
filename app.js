const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');

const PORT = process.env.HTTP_PORT || 8080;

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('common'));
// app.use((err, req, res, next) => next());

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(PORT, () => {
  console.log(`Waiting Server is running on ${PORT} port ✅`);
});
