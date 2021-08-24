const fs = require("fs");
const express = require("express");

const app = express();

//using middleware for hand the request data
app.use(express.json());

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "Hello from the server side!", app: "Natours" });
// });

// app.post("/", (req, res) => {
//   res.send("You can post to this endpoint...");
// });

const toursList = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//handling tours get request
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: toursList.length,
    data: {
      tours: toursList,
    },
  });
});

//handling post new tour request
app.post("/api/v1/tours", (req, res) => {
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
});

//handling get specific tour
app.get("/api/v1/tours/:id", (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
