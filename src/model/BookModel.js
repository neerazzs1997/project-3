const mongoose = require("mongoose");
const match = require("nodemon/lib/monitor/match");

const ObjectId = mongoose.Schema.Types.ObjectId


const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique:true
    },
    excerpt: { type: String, required: true },
    userId: {
      type: ObjectId,
      ref:"User",
      required: true,
      
    },
    ISBN: { type: String, required: true, unique: true 
       
    },

    category: {
      type: String,
      required: true,
     
    },

    subcategory: {
      type: [String],
      required: true,
     
    },
    reviews: {
      type: Number,
      default:0,
      
     
    },
    deletedAt: {
      type: Date,  
     
    },
    isDeleted: {
      type:Boolean,
      default:false 
     
    },
    releasedAt: {
       type:Date,
       default:null,
       required:true,
      //  match:[/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/,"please provide valid date format"]

    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("book", BookSchema);
