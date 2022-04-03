const express = require('express');
const router = express.Router();

const UserController = require("../controllers/UserControllers")
const BooksControllers = require("../controllers/BookControllers")
const ReviewControllers= require("../controllers/ReviewControllers")
const middleware = require("../auth")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


// router.post("/register", UserController.CreateUser)

// router.post("/login", UserController.loginUser)

// router.post("/books",middleware,BooksControllers.CreateBooks)

// router.get("/books",middleware,BooksControllers.getBooks)

// router.get("/books/:bookId",middleware,BooksControllers.getBookDetails)

// router.put("/update/:bookId",middleware,BooksControllers.updateBook)

// router.get("/books/:BookId",middleware,BooksControllers.getreview)

// router.delete("/books/:bookId",middleware,BooksControllers.deletebook)

// router.post("/books/:bookId/review",ReviewControllers.Createreview)

// router.put("/books/:bookId/review/:reviewId",ReviewControllers.Updatereview)

// router.delete("/books/:bookId/review/:reviewId",ReviewControllers.deletereview)

router.post("/register", UserController.CreateUser)

router.post("/login", UserController.loginUser)

router.post("/books",middleware.authenticate,BooksControllers.CreateBooks)

router.get("/books",middleware.authenticate,BooksControllers.getBooks)

router.get("/books/:bookId",middleware.authenticate,BooksControllers.getBookDetails)

router.put("/update/:bookId",middleware.authenticate,middleware.authorise,BooksControllers.updateBook)

router.get("/books/:bookId",middleware.authenticate,BooksControllers.getreview)

router.delete("/books/:bookId",middleware.authenticate,middleware.authorise,BooksControllers.deletebook)

router.post("/books/:bookId/review",ReviewControllers.Createreview)

router.put("/books/:bookId/review/:reviewId",ReviewControllers.Updatereview)

router.delete("/books/:bookId/review/:reviewId",ReviewControllers.deletereview)








module.exports = router;