const mongoose = require('mongoose');

const toureSchema = new mongoose.Schema({
  name: {
    type: 'String',
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: 'Number',
    required: [1, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: 'Number',
    required: [true, 'A tour must have a maxGroupSize'],
  },
  difficulty: {
    type: 'String',
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAvarage: {
    type: 'Number',
    default: 4.5,
  },
  ratingsQuantity: {
    type: 'Number',
    default: 0,
  },
  price: {
    type: 'Number',
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: 'Number',
  },
  summary: {
    type: 'String',
    trim: true,
  },

  description: {
    type: 'String',
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: {
    type: [Date],
  },
});
const Tour = mongoose.model('Tour', toureSchema);

module.exports = Tour;
