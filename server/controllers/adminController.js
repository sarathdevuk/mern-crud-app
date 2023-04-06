import User from '../models/userModel.js';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

var salt = bcrypt.genSaltSync(10);

export async function adminLogin(req, res){

  try
  {
      const {email, password}=req.body;
      const admin=await User.findOne({email, admin:true})
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


export async function getUsersList(req, res){
  try {
    let users = await User.find({admin:{$ne:true}, name:new RegExp(req.query.search, 'i')}, {password:0}).lean();
  res.json(users)
  } catch (error) {
    console.log(error);
  }


}

export async function getUser(req, res){
try {
  let user = await User.findById(req.params.id);
  res.json(user)

} catch (error) {
  console.log(error); 
}
}

export async function createUser(req, res){
  try
  {
      const {name, email, password, about, proffession}=req.body;
      const hashPassword = bcrypt.hashSync(password, salt);
      const user=await User.findOne({email});
      if(user){
          return res.json({error:true, message:"User Already Exist"})
      }
      const newUser = new User({name, email,password:hashPassword, about, proffession})
      await newUser.save();
      console.log(newUser)

      return res.json({error:false})
  }
  catch(err){
      res.json({error:err})
      console.log(err);
  } 
}

export async function editUser(req, res){
  try
  {
      const {name, email, about, proffession, id}=req.body;
      console.log(id)
      await User.findByIdAndUpdate(id, {$set:{
          name, email, proffession, about
      }})

      return res.json({error:false})
  }
  catch(err){
    console.log(err);
      res.json({error:err, message:"Something went wrong"})
  } 
}

export async function deleteUser(req, res){
  try
  {
      const {id}=req.body;
      await User.findByIdAndDelete(id);
      return res.json({error:false})
  }
  catch(err){

      res.json({error:err, message:"Something went wrong"})
      console.log(err);
  } 
}

export const checkAdminLoggedIn=async (req, res) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) 
      return res.json({loggedIn:false, error:true, message:"no token"});
  
    const verifiedJWT = jwt.verify(token, "myjwtsecretkey");
    
    console.log('veri jwt', verifiedJWT);
    return res.json({name:verifiedJWT.name, loggedIn: true});

  } catch (err) {
    console.log(err);
    res.json({loggedIn:false, error:err});

  }
}







