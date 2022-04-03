 const jwt = require("jsonwebtoken")
const UserModel = require("../model/UserModel")



const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidrequestbody = function(requestbody){
       return Object.keys(requestbody).length>0
}


const CreateUser = async function (req, res) {

    try {
        const data = req.body;

        if (Object.keys(data).length > 0) {
         

          
            if (!isValid(data.title)) { return res.status(400).send({ status: false, msg: "title is required" }) }
            if (!isValid(data.name)) { return res.status(400).send({ status: false, msg: "name is required" }) }
            if (!isValid(data.phone)) { return res.status(400).send({ status: false, msg: "phone is required" }) }
            if (!isValid(data.password)) { return res.status(400).send({ status: false, msg: "password is required" }) }
            if (!isValid(data.email)) { return res.status(400).send({ status: false, msg: "email is required" }) }
            if (!isValid(data.address)) { return res.status(400).send({ status: false, msg: "address is required" }) }
            
            if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))) {
                return res.status(400).send({ status: false, msg: "Please provide a valid email" })
              }

              if((["Mr","Mrs","Miss"].indexOf(data.title)===-1)){
                return res.status(400).send({status:false,msg:`Title shoule be among${['Mr','Mrs','Miss'].join(',')}`})
              }

           let checkNameUser = await UserModel.findOne({ name: data.name })
            if (checkNameUser) { return res.status(400).send({ msg: "Name Already exist" }) }
            
           let checkemail = await UserModel.findOne({ email: data.email })
            if (checkemail) { return res.status(400).send({ msg: "email Already exist" }) }

           let checkpassword = await UserModel.findOne({ password: data.password })
            if (checkpassword) { return res.status(400).send({ msg: "password Already exist" }) }

           let checkphone = await UserModel.findOne({ phone: data.phone })
            if (checkphone) { return res.status(400).send({ msg: "phone Already exist" }) }

            if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(data.phone))) {
              res.status(400).send({ status: false, message: "Plz enter valid phone number" })
              return
            }

            if(data.password.split("").length<8){
              return res.status(400).send({status:false,msg:"Password should be more than 8 char."})
            }
            
            if(data.password.split("").length>15){
              return res.status(400).send({status:false,msg:"Password should be between 8 to 15"})
            }
            

            // if (!(/^(?=.\d)(?=(.\W){1})(?=.[a-zA-Z])(?!.\s).{8,15}$/.test(data.password))) {
            //   res.status(400).send({ status: false, message: "Plz enter valid password" })
            //   return
            // }
          
            const savedData = await UserModel.create(data)

            return res.status(201).send({ status: "user Created", savedData })



        } else { res.status(400).send({status:false, msg: "please enter some data" }) }

    } catch (err) {
        return res.status(500).send({ ERROR: err.message })
    }
}






    
const loginUser = async function (req, res) {
  try {
    const requestbody = req.body;
    const {email,password}= requestbody

    if (!isValidrequestbody(requestbody)) {
      return res
        .status(400)
        .send({ status: false, msg: "request body is required" });
    }

 
  if(!isValid(password)){
    return res
    .status(400)
    .send({ status: false, msg: "please enter password" });

  }
  if(!isValid(email)){
    return res
    .status(400)
    .send({ status: false, msg: "please enter password" });

  }
   
     

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      res.status(400).send({ status: false, message: `email should be a valid` })
      return
    }
    

    let savelogin = await UserModel.findOne({
      email,
      password
    });
    
    if (!savelogin) {
      return res
        .status(400)
        .send({ status: false, msg: "email or password is incorrect" });
    }
    let token = await jwt.sign(
      {
        userId: email._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 60 * 60,
      },
      "group-27"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true,msg:"sucess",data: token });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
}



module.exports.CreateUser = CreateUser
module.exports.loginUser = loginUser











