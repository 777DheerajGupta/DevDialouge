const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { token } = require('morgan');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { error } = require('console');
const { updateSearchIndex } = require('../models/Question');

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
    //   console.log("email is :" , email)
    //   console.log("password is :" , password)
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide email and password' 
        });
      }
  
      // Find user
      const user = await User.findOne({ email });
    //   console.log("user is :" , user)
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'user not found' 
        });
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("password is :" , password)
      console.log("user.password is :" , user.password)
      console.log("isPasswordValid is :" , isPasswordValid)
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'password is incorrect' 
        });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      // Remove password from user object
      const userWithoutPassword = {
        id: user._id,
        name: user.name,
        email: user.email,
        // ... other user fields you want to send
      };
  
      res.status(200).json({
        success: true,
        token,
        user: userWithoutPassword
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }; 

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("req.body is : " , req.body)

        if(!req.body.password){
            return res.status(400).json({
                message:"password is required"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({email:email,name:name,password:hashedPassword});

        res.status(201).json({
            success:true,
            _id: user._id,
            name: user.name,
            email: user.email,
            // token: generateToken(user._id),
            message:"signup successfull"
        });
        // console.log((token));
    } catch (error) {
        console.log("errors is:" , error),
        res.status(500).json({ 
            success:false,
            message: error.message 
        });
    }
};

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }

   const otp = crypto.randomInt(100000, 999999);
   const otpExpires = Date.now() + 5 * 60 * 1000;

   user.resetOtp = otp;
   user.resetOtpExpires = otpExpires;
   await user.save();

   await sendEmail({
    email: user.email,
    subject: 'Password Reset OTP',
    message: `Your OTP is ${otp}. It will expire in 5 minutes.`,
   });

   res.status(200).json({ message: 'OTP sent' });
}

exports.verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if(!user || user.resetOtp !== parseInt(otp) || user.resetOtpExpires < Date.now()){
    return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetOtp = null;
  user.resetOtpExpires = null;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await user.save();

        const resetUrl = `http://${req.headers.host}/api/v1/auth/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message,
        });

        res.json({ message: 'Email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // console.log("token is:" , token)
    // console.log("password is:" , password)

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password and save it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id; // From auth middleware

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


