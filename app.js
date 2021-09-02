const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routs/tourRoutes');
const userRouter = require('./routs/userRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

//using middleware for handle the request data
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

//Create a custom middleware example
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//CREATE PATH FOR THE STATIC FILES
app.use(express.static(`${__dirname}/public`));

//DEFAULT FOR NOT FOUND PAGES
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
