import UserModel from '../models/userModel.js';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

var salt = bcrypt.genSaltSync(10);

export async function adminLogin(req, res){

  try
  {
      const {email, password}=req.body;
      const admin=await UserModel.findOne({email, admin:true})
      if(!admin) 
          return res.json({error:true,message:"You have no admin access"})
      const adminValid=bcrypt.compareSync(password, admin.password);

      if(!adminValid) 
          return res.json({error:true, message:"wrong Password"})
      const token=jwt.sign(
          {
              admin:true,
              id:admin._id
          }, 
          "myjwtsecretkey"
      )
      return res.cookie("adminToken", token, {
              httpOnly: true,
              secure: true,
              maxAge: 1000 * 60 * 60 * 24 * 7,
              sameSite: "none",
          }).json({error:false})
  }

  catch(err){
      res.json({message:"server error", error:err})
      console.log(err);
  }
}

export const adminLogout=async (req, res) => {
  res.cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    }).json({message:"logged out", error:false});
}

