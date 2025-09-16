const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// INDEX Route - show all listings
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// NEW Route - form to create new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// CREATE Route - add new listing to DB
router.post("/", isLoggedIn, async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
});

// SHOW Route
// router.get("/:id", async (req, res) => {
//   const listing = await Listing.findById(req.params.id)
//     .populate("owner")
//     .populate("reviews");
//   if (!listing) {
//     req.flash("error", "Listing not found!");
//     return res.redirect("/listings");
//   }
//   res.render("listings/show.ejs", { listing });
// });
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate("reviews");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
});


module.exports = router;
