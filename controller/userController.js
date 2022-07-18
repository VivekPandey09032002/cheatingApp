import User, { userGf } from "../models/userModel.js";
import bcrypt from "bcrypt";
class userController {
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
            sendMsg: [],
            receiveMsg: [],
          });

          await gf.save();
          const result = await user.save();

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
        req.session.session_email = email
        res.redirect(`/displayMsg?email=${email}`);
      }
    } catch (e) {
      console.log(e)
      return res.status(400).render("login", { msg: "cannot login" });
    }
  };

  static displayMsg = async (req, res) => {
    const { name, isGf } = req.body;
    let result = await userGf.findOne({ name }, { _id: 0 });
    if (result == null) {
      return res.render("selectGf");
    }
    let myobj = {
      name: name,
      email: result.email,
      sendMsg: result.sendMsg,
      receiveMsg: result.receiveMsg,
    };
    let gf;
    if (isGf == "false") gf = false;
    else if (isGf == "true") gf = true;
    myobj.isGf = gf;
    return res.redirect(`/displayMsg?email=${result.email}`)
  };

  static updateGfMsg = async (req, res) => {
    console.log(req.body);
    const { email, msg } = req.body;
    const getName = await User.findOne({ email }, { _id: 0 });
    let getAllDetail = await userGf.findOne({ email }, { _id: 0 });
    const myobj = {
      name: getName.name,
      email: getAllDetail.email,
      sendMsg: getAllDetail.sendMsg,
      receiveMsg: getAllDetail.receiveMsg,
    };
    let array = getAllDetail.receiveMsg;
    array.unshift(msg);
    let result = await userGf.updateOne({ receiveMsg: array });
    return res.redirect(`/displayMsg?email=${email}`);
  };

  static updateBfMsg = async (req, res) => {
    const { email, msg } = req.body;
    const getName = await User.findOne({ email }, { _id: 0 });
    let getAllDetail = await userGf.findOne({ email }, { _id: 0 });
    const myobj = {
      name: getName.name,
      email: getAllDetail.email,
      sendMsg: getAllDetail.sendMsg,
      receiveMsg: getAllDetail.receiveMsg,
    };
    let array = getAllDetail.sendMsg;
    array.unshift(msg);
    let result = await userGf.updateOne({ sendMsg: array });
    return res.render(`/displayMsg?email=${email}`);
  };

  // get methods
  static getDisplayMsg = async (req, res) => {
    if(req.query.email === undefined){
      return res.redirect('/login')
    }
    const result = await User.findOne({ email: req.query.email }, { _id: 0 })
    const gf = await userGf.findOne({ email: req.query.email }, { _id: 0 });
    const myobj = {
      name: result.name,
      email: gf.email,
      sendMsg: gf.sendMsg,
      receiveMsg: gf.receiveMsg,
    };
    return res.status(200).render("displayMsg", { ...myobj, isGf: true, title : 'Chat with Gf' });
  };

}

export default userController;
