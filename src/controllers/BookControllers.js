// const UserModel = require("../model/UserModel")
const BookModel = require("../model/BookModel");
const mongoose = require("mongoose");
const UserModel = require("../model/UserModel");
const ReviewModel = require("../model/ReviewModel");
const { response } = require("express");



const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};



const isBodyRequestValid = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidString = function (value) {
  if (typeof value === 'string' && value.trim().length === 0) return false;
  return true;
}




const CreateBooks = async function (req, res) {
  try {
    const requestBody = req.body;

    if(!isBodyRequestValid(requestBody)){
      return res.status(400).send({status:false,msg:"Please provide some data in body"})
    }

    const {
      title,
      ISBN,
      userId,
      excerpt,
      category,
      subcategory,
      releasedAt,
     
    } = requestBody;
    // Validation starts-----------------------------------------------------------------
    if (!isValid(title)) {
      res
        .status(400)
        .send({ status: false, message: " Title is required" });
      return;
    }

    const Title = await BookModel.findOne({title:title})
    if(Title){
        return res.status(400).send({status:false,msg:"duplicate title"})
    }

    if (!isValid(excerpt)) {
      res.status(400).send({ status: false, message: "excerpt is required" });
      return;
    }


    if (!isValid(releasedAt)) {
      res.status(400).send({ status: false, message: "releasedAt is required" });
      return;
    }
  
    if (!isValid(ISBN)) {
      res.status(400).send({ status: false, message: "ISBN is required" });
      return;
    }

    const isbn = await BookModel.findOne({ISBN:ISBN})
    if(isbn){
        return res.status(400).send({status:false,msg:"duplicate ISBN"})
    }

    if (!isValid(userId)) {
      res.status(400).send({ status: false, message: "userId is required" });
      return;
    }


    if (!isValid(category)) {
      res.status(400).send({ status: false, message: "category is required" });
      return;
    }

    if (!isValid(subcategory)) {
      res
        .status(400)
        .send({ status: false, message: "subcategory is required" });
      return
      ;
    }

    if(!isValidObjectId(userId)){
      return res.status(400).send({status:false,msg:"unmatch invalid userid"})
    }

    if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(releasedAt))) {
      res.status(400).send({ status: false, message: "Plz provide valid released Date" })
      return
    }

 
    const User = await UserModel.findOne({_id:userId}); 
    if (!User) {
      res.status(400).send({ status: false, message: `User does not exit` });
      return;
    }
 
    // Validation ends----------------------------------------------------------------------------
   
      const newBooks = await BookModel.create(requestBody);
      return res
        .status(201)
        .send({
          status: true,
          message: "New Books sucessfully created",
          data: newBooks,
        });
   
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: error.message });
  }
};






  const getBooks = async function (req, res) {
    try {
      let data = req.query;
  
      if (!isBodyRequestValid(data)) {
        let search1 = await BookModel.find({ isDeleted: false })
          .select({
            _id: 1,
            title: 1,
            excerpt: 1,
            userId: 1,
            category: 1,
            subcategory: 1,
            reviews: 1,
            releasedAt: 1,
          })
          .sort({ title: 1 });
        if (!search1) {
          return res.status(404).send({ status: false, msg: "no data found" });
        }
        
       return res.status(200).send({ status: true, msg: search1 });
      }


      const filterquery = { isDeleted: false };
      const { userId, category, subcategory } = data;
  
      if (!isValid(userId)) {
        return res.status(400).send("invalid userId");
      }
      
  
      if (isValid(userId) && isValidObjectId(userId)) {
        filterquery.userId = userId;
      }
  
   
        if (!isValidObjectId(userId)) {
          return res.status(400).send({ status: false, msg: "invalid id" });
        }
      
  
      if (isValid(category)) {
        filterquery.category = category.trim();
      }
  
      // if (!isValid(category)) {
      //   return res.status(400).send({ staus: false, msg: "category required" });
      // }
  
      
      if (isValid(subcategory)) {
        filterquery.subcategory = subcategory.trim();
      }

      // if (!isValid(subcategory)){
      //   return res
      //     .status(400)
      //     .send({ status: false, msg: "subcategory is required" });
      // }
  
      const searchBooks = await BookModel.find(filterquery)
        .select({
          _id: 1,
          title: 1,
          excerpt: 1,
          userId: 1,
          category: 1,
          subcategory: 1,
          reviews: 1,
          releasedAt: 1,
        })
        .sort({ title: 1 });
  
      if (Array.isArray(searchBooks) && searchBooks.length == 0) {
        return res.status(404).send({ status: false, msg: "No books found" });
      }
  
      res.status(200).send({ status: true,msg:"sucess",data: searchBooks });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  };



  

  const getBookDetails = async function(req,res){
       try {
         let bookId = req.params.bookId

         if(!isValidObjectId(bookId)){
           return res.status(400).send({status:false,msg:"bookID is not a valid bookID"})
         }

         let book = await BookModel.findById({_id:bookId,isDeleted:false})
         if(!isValid(book)){
           return res.status(400).send({false:false, msg:"Book does not exist"})
         }

         let review = await ReviewModel.find({bookId:bookId,isDeleted:false})

         let data = book.toObject()
         data["reviewData"] = review

         return res.status(200).send({status:false,msg:"success", data:data})
       } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
       }
  }


  
  
  
  const updateBook = async function (req, res) {
    try {
      let Id = req.params.bookId;
     
  
      if (!isValidObjectId(Id)) {
        return res.status(400).send({ status: false, msg: "invalid objectid" });
      }
      let checkidinDb=await BookModel.findById(Id)
      if(!checkidinDb){return res.status(404).send({status:false,msg:"this id is not found"})}

      let { title, excerpt, releasedAt, ISBN } = req.body;
  
      if (!isValid(title)) {
        return res.status(400).send({status:false,msg:"please give title"})
      }
      const titleAlreadyUsed = await BookModel.findOne({ title });
      if (titleAlreadyUsed) {
       return res.status(400).send("tittle alerady exist");
        
      }
      if (!isValid(excerpt)) {
  
      return res.status(400).send({ status: false, msg: "exceerpt is required for updation" });
      
      }
  
      if (!isValid(ISBN)) {
        
          
         return res.status .send({ status: false, msg: "ISBN is required for updation" })}
      
      const ISBNAlreadyUsed = await BookModel.findOne({ ISBN });
      if (ISBNAlreadyUsed) {
        return res.status(400).send("ISBN is  alerady exist");
      }
      if (!isValid(releasedAt)) {
        res
          .status(400)
          .send({ status: false, msg: "releasedAt is required for updation" });
        return;
      }
      if (!isValid(releasedAt)) {
        return res
          .status(400)
          .send({ status: false, msg: "Invalid date format" });
      }
      
      let findBook = await BookModel.findById(Id);
      if (!findBook) {
        return res
          .status(400)
          .send({ status: false, msg: "this id is not in db" });
      }
      if (!findBook.isDeleted == false) {
       return res.status(400).send("This Books Already Deleted");
      }
      console.log(findBook)
      let updateBook = await BookModel.findOneAndUpdate(
        { bookId: Id, isDeleted: false },
        req.body,
        { new: true }
      );
      res.status(201).send({status:false,msg:"updated sucessfully",data:updateBook})
    } catch (error) {
      res.status(500).send({ satus: false, msg: error.message });
    }
};

  

    const getreview = async function (req, res) {
      try {
        let result = {};
        let review = [];
        let BookId = req.params.BookId;

        if (!BookId)
          return res
            .status(400)
            .send({ status: false, msg: "Please Provide BookId" });

        

        let BookDetail = await BookModel.findOne({ _id: BookId });
        if (!BookDetail)
          res.status(400).send({ status: false, msg: "BookId not Found" });

          if(BookDetail.isDeleted==true){return res.status(400).send({status:false,msg:"deleted document"})}
          
        let reviewDetails = await ReviewModel.find({ bookId: BookDetail._id });
        if (!reviewDetails) {
          res
            .status(400)
            .send({ status: false, msg: "please provide review details" });
        }
        let bookData = {
          _id: BookDetail._id,
          title: BookDetail.title,
          excerpt: BookDetail.excerpt,
          userId: BookDetail.userId,
          category: BookDetail.category,
          subcategory: BookDetail.subcategory,
          reviews: BookDetail.reviews,
          deletedAt: BookDetail.deletedAt,
          releasedAt: BookDetail.releasedAt,
          createdAt: BookDetail.createdAt,
          updatedAt: BookDetail.updatedAt,
        };

        for (let i = 0; i < reviewDetails.length; i++) {
          result = {
            _id: reviewDetails[i]._id,
            reviewedBy: reviewDetails[i].reviewedBy,
            reviewedAt: reviewDetails[i].reviewedAt,
            rating: reviewDetails[i].rating,
            review: reviewDetails[i].review,
          };
          review.push(result);
        }
        bookData["reviewsData"] = review;
        console.log(bookData);
        res.status(200).send({ status: true, data: bookData });
      } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, msg: error.message });
      }
    };




    const deletebook = async function(req,res){
      try {
        let bookId = req.params.bookId

        if(!isValidString(bookId)){
        res.status(400).send({ status : false, msg : "bookId is not valid"})
        return
       }
   
       const book = await BookModel.findById(bookId);
       if(book.isDeleted == true){
           res.status(400).send({ status : false, msg : "book is already deleted"})
           return
       }
       let deleteBook = await BookModel.findByIdAndUpdate({_id : bookId} ,{ isDeleted : true, deletedAt : new Date()},{ new : true})
       if(isValidString(deleteBook)){
           res.status(200).send({ status : true, msg : " successfully delete content" ,data:deleteBook })
           return
      }
   
         } catch (error) {
          return res.status(500).send({status:false,msg:"server error"})
         }
    }


  
     
module.exports.CreateBooks = CreateBooks;
module.exports.getBooks = getBooks;
module.exports.getreview = getreview;
module.exports.getBookDetails = getBookDetails;
module.exports.updateBook = updateBook;
module.exports.deletebook = deletebook;


