let jwt = require("jsonwebtoken");
let mongoose=require('mongoose')
let BookModel = require("./model/BookModel");
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };

let authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(404).send({ status: false, msg: "token not found" });
    }
    let decodetoken = jwt.verify(token, "group-27");
    if (!decodetoken) {
      return res
        .status(401)
        .send({ status: false, msg: "you are not authenticated" });
    }
    next();
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


// ===================================================================================================


let authorise = async function (req, res, next) {
    try {
        let bookId = req.params.bookId;
        
        if (!bookId) {
          return res
            .status(400)
            .send({ status: false, msg: "bookId is required for authorisation" });
        }
        if(!isValidObjectId(bookId)){return res.status(400).send({status:false,msg:"invalid bookid"})}
        let token = req.headers["x-api-key"];
        let decodetoken = jwt.verify(token, "group-27");
        if (!decodetoken) {
          return res
            .status(401)
            .send({ status: false, msg: "you are not authenticated" });
        }
        let bookid = await BookModel.findById(bookId);
        
    if(!bookid){return res.status(404).send({status:false,msg:"no document found with given id"})}
        let BooktobeModified = bookid.userId;
        console.log(BooktobeModified)
        let userloggedin = decodetoken.userId;
        console.log(userloggedin)
        if(!isValidObjectId(BooktobeModified)){return res.status(400).send({status:false,msg:"bad request"})}
        if(!userloggedin){return res.status(400).send({status:false,msg:"bad request"})}
        
        if (BooktobeModified != userloggedin) {
          return res
            .status(403)
            .send({ status: false, msg: "you are not authorised" });
          
        }
        next()
      
      } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
      }
};

module.exports.authenticate = authenticate;
module.exports.authorise = authorise;




// const jwt = require('jsonwebtoken')

// const middleware = async (req, res, next) => {
//     try {
//         const token = req.header('x-api-key')
//         if (!token) {
//             res.status(403).send({ status: false, message: ` token request missing here` })
//             return;
//         }

//         const decodedtoken = jwt.verify(token, 'group-27')

//         if (!decodedtoken) {
//             res.status(403).send({ status: false, message: `invalid authenticated token in request body` })
//             return;
//         }

//         req.Userid = decodedtoken.Userid;

//         next()
//     } catch (err) {
//         console.error(`error ${err.message}`)
//         res.status(500).send({ status: false, message: err.message })
//     }
// }

// module.exports = middleware