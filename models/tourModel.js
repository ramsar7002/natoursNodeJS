const mongoose = require('mongoose');
const slugify = require('slugify');

const toureSchema = new mongoose.Schema(
  {
    name: {
      type: 'String',
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: 'String',
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
      select: false,
    },
    startDates: {
      type: [Date],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

toureSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: run before .save() and .create()
toureSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

toureSchema.pre('save', (next) => {
  console.log('Will save document');
  next();
});

//DOCUMENT MIDDLEWARE: run after .save() and .create()
toureSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});

const Tour = mongoose.model('Tour', toureSchema);

module.exports = Tour;
