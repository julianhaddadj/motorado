const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    engine: {
      type: String,
      trim: true,
    },
    transmission: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    bodyType: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerType: {
      type: String,
      enum: ['individual', 'dealer'],
      default: 'individual',
    },
    images: [
      {
        url: { type: String, required: true },
        key: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Listing', ListingSchema);