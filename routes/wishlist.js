const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist");
const Book = require("../models/book");
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const wishes = await Wishlist.find({
      userId: ObjectId("5da9fbd86c2ebb1128a8eab0")
    })
      .populate("user")
      .exec((err, books) => {});
    res.render("wishlist", { wishes: wishes });
  } catch (error) {
    console.log("error on list", error);
  }
});

router.get("/:bookId/:userId/:wishlistNum", async (req, res) => {
  // Save the bookId and the login to the wishlist collection
  const wishlist = new Wishlist({
    _id: new mongoose.Types.ObjectId(),
    userId: req.params.userId,
    bookId: req.params.bookId,
    wishlistNum: req.params.wishlistNum
  });
  try {
    const newWishlist = await wishlist.save();
    res.redirect("/wishlist/list");
  } catch (error) {
    console.log("error on list", error);
  }
});

router.get("/list", async (req, res) => {
  const list = await Wishlist.aggregate([
    {
      $lookup: {
        from: "books",
        localField: "bookId",
        foreignField: "_id",
        as: "newWishList"
      }
    }
  ]).exec(function(err, wishes) {
    if (err) {
      console.log("ERROR", err);
    }
    res.render("wishlist/list", { wishes: wishes });
  });
});

router.post("/", async (req, res) => {
  const wishlist = new Wishlist({
    userId: req.body.userId,
    bookId: req.body.bookId
  });
  try {
    const newWishlist = await wishlist.save();
    res.redirect("/wishlist");
  } catch (error) {
    renderNewPage(res, wishlist, true);
  }
});

router.get("/:id", async (req,res) => {
  console.log("id", req.params.id.trim())
  // const list = await Wishlist.remove({
  //   _id : req.params.id
  // },
  //  )
  const res1 = await Wishlist.deleteOne({ bookId: req.params.id.trim()} , function (err) {
    if(err) console.log(err);
    console.log("Successful deletion");

  })
  console.log("RESULT --->", res1.deletedCount)
  
  res.redirect("/wishlist/list");
  

//   const res = await Character.deleteOne({ name: 'Eddard Stark' });
// // `1` if MongoDB deleted a doc, `0` if no docs matched the filter `{ name: ... }`
// res.deletedCount;

  // .exec(function(err, wishes) {
  //   if(err) {
  //     console.log("ERROR", err)
  //   }
  //   res.redirect("/wishlist/list");
  // });
  // .exec(function(err, wishes) {
  //   if (err) {
  //     onsole.log("ERROR", err);
  //   }
  //   res.render("wishlist/list", { wishes: wishes });
  // })
  // const wishlist = new Wishlist({
  //   id: req.params.id,
  // });
  // console.log("/wishlish", list)
})

// if(mongoose.Types.ObjectId.isValid(id)) {
//   User.remove({_id: id})
//     .then((docs)=>{
//       if(docs) {
//         resolve({"success":true,data:docs});
//       } else {
//         reject({"success":false,data:"no such user exist"});
//       }
//   }).catch((err)=>{
//      reject(err);
//   })
// }else {
//   reject({"success":false,data:"please provide correct Id"});
// }

module.exports = router;
