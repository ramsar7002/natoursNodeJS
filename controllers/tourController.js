/* eslint-disable node/no-unsupported-features/es-syntax */
//const fs = require('fs');
const Tour = require('../models/tourModel');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAvarage,price';
  req.query.fields = 'name,price,ratingsAvarages,summary,difficult';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    //1. Filtering
    const queryObj = { ...req.query };
    const excluedFields = ['page', 'sort', 'limit', 'fields'];
    excluedFields.forEach((field) => delete queryObj[field]);

    //1.1 advanced filtering
    // {difficulty: 'easy', duration: {&gte:5}}
    //adding a $ sign to gte,gt,lte,lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const queryStrObj = JSON.parse(queryStr);

    let query = Tour.find(queryStrObj);

    //2. SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else if (!req.query.page) {
      query = query.sort('-createdAt');
    }

    //3. FIELED LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //4. Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page may not exist');
      }
    }

    //EXECUTE QUERY
    const tours = await query;

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) throw new Error('Cannot find this id');

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

////////////////////////////////////////////////////////////////////////
// exports.createTour = (req, res) => {
//   const newId = toursList[toursList.length - 1].id + 1;
//   // eslint-disable-next-line node/no-unsupported-features/es-syntax
//   const newTour = { id: newId, ...req.body };
//   toursList.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(toursList),
//     () => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };
////////////////////////////////////////////////////////////////

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.send(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
