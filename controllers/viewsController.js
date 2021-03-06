const Tour = require('../model/tourModel')
const User = require('../model/userModel')
const Booking = require('../model/bookingModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.alerts = (req, res, next) => {
  const { alert } = req.query
  if (alert === 'booking') {
    res.locals.alert = `Your booking was successful! 
    Please check your email for a confirmation.
    If your booking doesn't show up here immediately, try back again in a few minutes.`
  }
  next()
}

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find()
  // 2) Build template

  // 3) Render template with tour data

  res
    .status(200)
    .render('overview', {
      title: 'All Tours',
      tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
  //  1) Get data for requested tour (include reviews and tour guides)
  const tour = await Tour
    .findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user'
    })
  // 2) Build template
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404))
  }
  // 3) Render template using data from step 1
  res
    .status(200)
    .render('tour', {
      title: `${tour.name} Tour`,
      tour
    })
})

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .render('login', {
      title: 'Log into your account'
    })
}

exports.getAccount = (req, res) => {
  res
    .status(200)
    .render('account', {
      title: 'Your account'
    })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id })

  // 2) Find tours with the returned IDs
  const tourIds = bookings.map(el => el.tour)
  const tours = await Tour.find({ _id: { $in: tourIds } })

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  })
})

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  },
  {
    new: true,
    runValidators: true
  })
  res
    .status(200)
    .render('account', {
      title: 'Your account',
      user: updatedUser
    })
})
