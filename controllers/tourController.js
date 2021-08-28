/* eslint-disable node/no-unsupported-features/es-syntax */
//const fs = require('fs');
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    const queryObj = { ...req.query };
    const excluedFields = ['page', 'sort', 'limit', 'fields'];
    excluedFields.forEach((field) => delete queryObj[field]);
    console.log(req.query);
    //filtering - option number 1
    const query = Tour.find(req.query);

    // eslint-disable-next-line prettier/prettier
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

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
      message: err,
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
