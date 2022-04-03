const BookModel = require("../model/BookModel");
const ReviewModel = require("../model/ReviewModel");
const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value == undefined || value == null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isBodyRequestValid = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};



const Createreview = async function (req, res) {
  try {
    let requestBody = req.body
    let bookid = req.params.bookId

    if (!isValid(bookid) && (!isValidObjectId(bookid))) {
        res.status(400).send({ status: false, msg: "bookId is not valid" })
        return
    }

    let checkBookID = await BookModel.findById(bookid)
    console.log(checkBookID)

    if (!checkBookID) {
        res.status(404).send({ status: false, msg: "book not found" })
        return
    }
    if (checkBookID.isDeleted == true) { return res.status(404).send({ status: false, msg: "this book is already delete" }) }

    if (!isBodyRequestValid(requestBody)) {
        res.status(400).send({ status: false, msg: `Invalid request parameter. please fill detail.` })
        return
    }

    const { reviewedBy, rating, reviewedAt, bookId } = requestBody
    if (!isValid(reviewedBy)) {
        res.status(400).send({ status: false, msg: "reviewdBy is required" })
        return
    }
    if (!isValid(reviewedAt)) {
        res.status(400).send({ status: false, msg: "reviewed is required" })
        return
    }
   
    if (!isValid(reviewedAt)) {
        return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
    }

    if (!isValid(bookId)) {
        return res.status(400).send({ status: false, message: 'bookId is required' })
    }

    
if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(reviewedAt))) {
  res.status(400).send({ status: false, message: "Plz provide valid released Date" })
  return
}  


   if(rating){
    if (!([1, 2, 3, 4, 5].includes(Number(rating)))) {
        return res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })

    }}
    if (bookid != requestBody.bookId) { return res.status(400).send({ status: false, msg: "pathparam bookid and body bookid is diffrent" }) }

   console.log(checkBookID)
    const savedData = await ReviewModel.create(requestBody)
    checkBookID.reviews = checkBookID.reviews+1
    await checkBookID.save()
    const data1 = checkBookID.toObject()
    data1[ " reviewsData"] = savedData
    


    res.status(201).send({ status: true, data: data1 })
}

catch (err) {
    res.status(500).send({ status: false, msg: err.message })
}
};




const Updatereview = async function(req,res){
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    let requestBody = req.body;

    let book = await BookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      res.status(400).send({
        status: false,
        msg: "book is not available and book can't update",
      });
      return;
    }
    let review1 = await ReviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!review1) {
      res.status(400).send({
        status: false,
        msg: "review is not available and review can't update",
      });
      return;
    }
    
    if (!(review1._id == reviewId && review1.bookId == bookId)) {
      return res.status(400).send({
        status: false,
        msg: "bookid and reviewid are of diffrent review document",
      });
    }

    if (!isBodyRequestValid(requestBody)) {
      res.status(400).send({ status: false, msg: "please fill vaild detail" });
      return;
    }
    let { reviewedBy, rating, review } = requestBody;

    if (!isValid(reviewedBy)) {
      res.status(400).send({ status: false, msg: "reviewdBy is required" });
      return;
    }
    if (!isValid(review)) {
      res.status(400).send({ status: false, msg: "review is required" });
      return;
    }
    if (rating) {
      if (![1, 2, 3, 4, 5].includes(Number(rating))) {
        res.status(400).send({
          status: false,
          msg: "Rating should be from [1,2,3,4,5] this values",
        });
        return;
      }
    }

    let updatedReview = await ReviewModel.findByIdAndUpdate(
      { _id: reviewId, isDeleted: false },
      req.body,
      { new: true }
    );
    const data1=book.toObject()
    data1['reviewsData']=updatedReview

    res.status(200).send({status:true,msg:"updated",data:data1});
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}





const deletereview = async function(req,res){
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;

    if (!isValidObjectId(bookId)) {
      res.status(400).send({ status: false, msg: "bookId is not valid" });
      return;
    }

    if (!isValidObjectId(reviewId)) {
      res.status(400).send({ status: false, msg: "reviewId is not valid" });
      return;
    }

    let checkbookId = await BookModel.findById(bookId);
    if (!checkbookId) {
      return res
      .status(404)
      .send({ status: false, msg: "Book with this Id not found" });
    }
    let checkreviewId = await ReviewModel.findById(reviewId);
    if (!checkreviewId) {
      return res
      .status(404)
      .send({ status: false, msg: "review with this Id not found" });
    }
    console.log(checkreviewId);
    const review = await ReviewModel.findById(reviewId);
    if (review.isDeleted == true) {
      res.status(400).send({ status: false, msg: "review is already deleted" });
      return;
    }
    console.log(checkreviewId);
    if (!(checkreviewId._id == reviewId && checkreviewId.bookId == bookId)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "bookid and reviewid are of diffrent object",
        });
    }


    const isBookIdPresent=await BookModel.findOneAndUpdate({_id:bookId, isDeleted:false},{ $inc: { reviews: -1 }},{new:true})

    if(!isBookIdPresent){
        return res.status(404).send({status:false, message:"Book not found with this BookId"})
    }



    let deleteReview = await ReviewModel.findByIdAndUpdate(
      { _id: reviewId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (isValid(deleteReview)) {
      res
        .status(200)
        .send({
          status: true,
          msg: " successfully delete content",
          data: deleteReview,
        });
      return;
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: "server error" });
  }
  }

   


module.exports.Createreview = Createreview;
module.exports.Updatereview = Updatereview
module.exports.deletereview = deletereview;

