const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

//using middleware for handle the request data
app.use(morgan("dev"));
app.use(express.json());

//Create a custom middleware example
/*
app.use((req, res, next) => {
  console.log("Hello from my middlewaere");
  next();
});
*/

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//get the tours as object
const toursList = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

//handle routs
const getAllTours = (req, res) => {
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

//USERS HANDLERS
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      users,
    },
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

//ROUTS
const tourRouter = express.Router();
const userRouter = express.Router();

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

tourRouter.route("/").get(getAllTours).post(newTour);
tourRouter.route("/:id").get(getTour).patch(changeTour).delete(deleteTour);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

//Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
