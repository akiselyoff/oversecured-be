const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const visitorsRouter = require('./routes/api/visitors');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/visitors', visitorsRouter);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});
app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
