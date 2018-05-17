const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');

const PORT = process.env.SERVER_PORT || 80;

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(morgan('common'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(PORT, () => {
  console.log(`GoWaiting Server is running on ${PORT} port ✅`);
});