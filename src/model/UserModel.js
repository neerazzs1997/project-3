const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Mr","Mrs","Miss"],
    },
    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match:[/^(\+\d{1,3}[- ]?)?\d{10}$/,"phone number is invalid"]
    },

    email: { type: String,
       required: true,
        unique: true ,
        match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/,  //+ = valid character for email
        "Please fill a valid email address",
    ]
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 15,
      // match:[/^(?=.\d)(?=(.\W){1})(?=.[a-zA-Z])(?!.\s).{8,15}$/,"please fill a valid password"]
    },
    address: {
      street:   String,
      city:  String ,
      pincode:  String

    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
