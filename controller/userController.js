import User, { userGf } from "../models/userModel.js";
import bcrypt from "bcrypt";
import getDate from "./getDate.js";
class userController {
  static uploadImage = async (req, res) => {
    const { email } = req.query;
    let result;
    if (req.file) {
      result = await User.findOneAndUpdate(
        { email },
        { imgLocation: req.file.filename }
      );
    }
    return res.redirect("/selectGf");
  };
  static registerGf = async (req, res) => {
    try {
      const { name, email, section, batch, password, cpassword } = req.body;
      if (!name || !email || !section || !batch || !password || !cpassword) {
        return res.render("register", { msg: "all fields are necessary" });
      }
      const existedUser = await User.findOne({ email });
      if (existedUser) {
        return res.render("register", { msg: "already existed user" });
      } else {
        try {
          if (password !== cpassword) {
            return res.render("register", { msg: "password don't match" });
          }
          const user = new User({
            name,
            email,
            section,
            batch,
            password,
            cpassword,
          });
          const gf = new userGf({
            name,
            email,
          });

          if (req.file && email && name) {
            user.imgLocation = req.file.filename;
          }
          await gf.save();
          await user.save();
          return res.status(200).redirect("/login");
        } catch (e) {
          return res.render("register", { msg: "cannot store in database" });
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send("register")({ msg: e });
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      //empty fileds
      if (!email || !password) {
        return res.status(400).render("login", { msg: "fill the data" });
      }

      const result = await User.findOne({ email });

      //existed user
      if (result === null) {
        return res.status(400).render("login", { msg: "user not exists" });
      }

      //validating password
      const isMatch = await bcrypt.compare(password, result?.password);

      if (!isMatch || email !== result?.email) {
        return res.status(400).render("login", { msg: "cannot validate" });
      }

      // logged in
      else {
        req.session.session_email = email;
        res.redirect(`/displayMsg?email=${email}&isGf=true`);
      }
    } catch (e) {
      console.log(e);
      return res.status(400).render("login", { msg: "cannot login" });
    }
  };

  static displayMsg = async (req, res) => {
    const { name } = req.body;
    let result = await userGf.findOne({ name }, { _id: 0 });
    if (result == null) {
      return res.render("selectGf", { msg: "cannot find the Gf" });
    }
    // tell that session is male type so no need to login
    req.session.session_male = true;

    return res.redirect(`/displayMsg?email=${result.email}&isGf=false`);
  };

  static updateMsg = async (req, res) => {
    console.log("hello");
    const { email, msg, isGf } = req.body;
    console.log(email, msg, isGf);
    let getAllDetail = await userGf.findOne({ email }, { _id: 0 });
    let isMale = false;
    if (req.body.isGf === "false") {
      isMale = true;
    }
    let myobj = {
      isMale,
      message: msg,
      createdDate: getDate(),
    };
    let array = getAllDetail.messages;
    array.unshift(myobj);

    await userGf.findOneAndUpdate({ email }, { messages: array });
    return res.redirect(`/displayMsg?email=${email}&isGf=${!isMale}`);
  };

  // get methods
  static getLogOut = (req, res) => {
    req.session.destroy((err) => {
      console.log(err);
    });
    return res.redirect("/");
  };

  static getDisplayMsg = async (req, res) => {
    if (typeof req.query.email === "undefined") {
      return res.redirect("/login");
    }
    let isGf = true;
    if (req.query.isGf == "false") {
      isGf = false;
    }

    const result = await User.findOne({ email: req.query.email }, { _id: 0 });

    const gf = await userGf.findOne({ email: req.query.email }, { _id: 0 });

    const myobj = {
      name: result.name,
      gf,
    };

    let title = "";
    if (isGf) {
      title = "Chat As Gf";
    } else {
      title = "Chat As Bf";
    }

    return res.status(200).render("displayMsg.ejs", { ...myobj, isGf, title });
  };

  static deleteMessage = async (req, res) => {
    const { email, isGf, msg } = req.query;
    const result = await userGf.findOne({ email });
    for (let i = 0; i < result.messages.length; i++) {
      if (result.messages[i]?.message.trim() == msg) {
        result.messages.splice(i, 1);
      }
    }
    await userGf.findOneAndUpdate({ email }, { messages: result.messages });
    // await result.save()
    return res.redirect(`/displayMsg?email=${email}&isGf=${isGf}`);
  };

  static displayProfile = async (req, res) => {
    const { name } = req.query;

    const result = await User.findOne({ name });
    if (result == null) {
      return res.redirect(`/selectGf`);
    } else {
      return res.render("displayProfile.ejs", { result });
    }
  };
  static getSelectGf =async (req,res) => {
      const result = await User.find()
      let arr = [];
      result.forEach( (element)=>{
        arr.push(element.name)
      })
      res.render('selectGf.ejs', {title : 'Gf Selection' , names : arr})
  }

  static getUpdateDesc = async (req,res) => {
    const {email,desc} = req.query
    console.log(email,desc)
    const result = await User.findOneAndUpdate({email},{description : desc})
    return res.redirect("/selectGf");
  }
}

export default userController;
