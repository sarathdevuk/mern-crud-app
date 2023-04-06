import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

var salt = bcrypt.genSaltSync(10);

export async function registerUser(req, res) {
  try {
    const { name, email, password, proffession, about } = req.body;

    hashedPassword = bcrypt.hashSync({ password, salt });
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ error: true, massage: "This user already exist" });
    }


    // user Created
    const newUser = User.create({
      name,
      email,
      password: hashedPassword,
      about,
      proffession,
    });
    console.log(newUser);



    // Creating a token
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      "myjwtsecretkey"
    );

    // setting cookie

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 24 * 7, // setting expiry for a month 
        semSite: "none",
      })
      
      .json({ error: false });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
}

export async function loginUser(req, res) {

  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: true, message: "no user Found" });

    const validUser = bcrypt.compareSync(password, user.password);

    if (!validUser) return res.json({ error: true, message: "Wrong Password" });
    const token = jwt.sign(
      {
        id: user._id,
      },
      "myjwtsecretkey"
    );

    console.log(token);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 30,
        sameSite: "none",
      })
      .json({ error: false, user: user._id });
  } catch (error) {
    console.log(error);
    res.json({ message: "server error", error });
  }
}

export const userLogout = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .json({ message: "logged out", error: false });
};

export const checkUserLoggedIn = async (req, res) => {
  try {
    const token = req.cookie.token;

    if (!token)
      return res.json({ loggedIn: false, error: true, message: "no token" });

    const verifiedJWT = jwt.verify(token, "myjwtsecretkey"); // verifyng jwt token

    const user = await User.findById(verifiedJWT.id, { password: 0 });

    if (!user) {
      return res.json({ loggedIn: false });
    }

    return res.json({ loggedIn: true, user });

  } catch (error) {
    console.log(error);
    res.json({ loggedIn: false, error });
  }
};
export const editProfile = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, {
      $set: {
        profile: req.profile.filename,
      },
    });

    return res.json({ error: false });

  } catch (error) {

    console.log(error);
    res.json({ error, message: "something went wrong" });
  }
};
