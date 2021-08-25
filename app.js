const fs = require("fs");
const express = require("express");

const app = express();

//using middleware for hand the request data
app.use(express.json());

const toursList = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: toursList.length,
    data: {
      tours: toursList,
    },
  });
};

const getTour = (req, res) => {
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

const newTour = (req, res) => {
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

const changeTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

//handling tours get request
//handling post new tour request

app.route("/api/v1/tours").get(getAllTours).post(newTour);

//handling get specific tour
//handling patch request
//handling delete request
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(changeTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
