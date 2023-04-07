import express from 'express';
import { checkUserLoggedIn, editProfile, loginUser, registerUser, userLogout} from '../controllers/userController.js'
import multer from 'multer'
const router=express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()+".jpg"
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })


router.get("/", (req, res)=>{res.json("hai")})
router.post("/register", registerUser)
router.post("/edit-profile",upload.single('file'), editProfile)
router.post("/login", loginUser)
router.get("/logout", userLogout)
router.get("/check-auth", checkUserLoggedIn)

export default router