const fs = require("fs");

//get the tours as object
const toursList = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//handle routs
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: toursList.length,
    data: {
      tours: toursList,
    },
  });
};

exports.getTour = (req, res) => {
  const tour = toursList.find((tour) => tour.id === Number(req.params.id));
  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: "Could not find a tour with this specific id",
    });
  }
  const id = Number(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.newTour = (req, res) => {
  const newId = toursList[toursList.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  toursList.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursList),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.changeTour = (req, res) => {
  const id = +req.params.id;
  const tour = toursList.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: "Tour not found",
    });
  }
  //id found
  const index = toursList.findIndex((tour) => tour.id === id);
  const { name, duration, difficulty } = req.body;
  if (name) toursList[index].name = name;
  if (duration) toursList[index].duration = duration;
  if (difficulty) toursList[index].difficulty = difficulty;
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursList),
    (err) =>
      res.status(200).json({
        status: "success",
        data: {
          tour: toursList[index],
        },
      })
  );
};

exports.deleteTour = (req, res) => {
  const id = +req.params.id;
  const index = toursList.findIndex((tour) => tour.id === id);
  if (!index) {
    return res.status(404).json({
      status: "failed",
      message: "Tour no found",
    });
  }

  toursList.splice(index, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursList),
    (err) =>
      res.status(204).json({
        status: "succeed",
        data: null,
      })
  );
};
