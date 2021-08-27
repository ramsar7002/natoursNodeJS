const fs = require('fs');

//get the tours as object
const toursList = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//validate id
exports.checkId = (req, res, next, val) => {
  const tour = toursList.find((t) => t.id === Number(val));
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Could not find a tour with this specific id',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failed',
      message: 'Missing name or price',
    });
  }
  next();
};

//handle routs
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: toursList.length,
    data: {
      tours: toursList,
    },
  });
};

exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = toursList.find((t) => t.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.newTour = (req, res) => {
  const newId = toursList[toursList.length - 1].id + 1;

  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newTour = { id: newId, ...req.body };
  toursList.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursList),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.changeTour = (req, res) => {
  const id = +req.params.id;

  //id found
  const index = toursList.findIndex((t) => t.id === id);
  const { name, duration, difficulty } = req.body;
  if (name) toursList[index].name = name;
  if (duration) toursList[index].duration = duration;
  if (difficulty) toursList[index].difficulty = difficulty;
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursList),
    () =>
      res.status(200).json({
        status: 'success',
        data: {
          tour: toursList[index],
        },
      })
  );
};

exports.deleteTour = (req, res) => {
  const id = +req.params.id;
  const index = toursList.findIndex((tour) => tour.id === id);

  toursList.splice(index, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursList),
    () =>
      res.status(204).json({
        status: 'succeed',
        data: null,
      })
  );
};
