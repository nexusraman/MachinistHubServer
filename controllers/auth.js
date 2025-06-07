import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'


export const register = async (req, res, next) => {
  const { email, password, role, date_created, name, username } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      username,
      password,
      role,
    
      date_created,
     
    });

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};


export const fetchLogin = async (req, res, next) => {
  const token = User.getSignedToken();
  if (token) {
    sendToken(User, 200, res);
  } else {
    res.send({ loggedIn: false });
  }
};



export const updateUser = async (req, res, next) => {
  const { email, site } = req.body;
  try {
    const user = await User.findOne({ email }); //
    const users = await User.find();

    // if (user.sites.includes(site) || user.sites.includes(site) ) {
    //     console.log("first if")
    //     return next(new ErrorResponse("Site already assigned", 404))
    // }
    users.map(user => {
      if (
        (user.sites.includes(site) && user.role === "owner") ||
        user.sites.includes(site)
      ) {
        return next(
          new ErrorResponse("Site already assigned to other owner", 404)
        );
      }
    });

    const updatedSites = user.sites;
    updatedSites.push(site);
    await User.findOneAndUpdate({ email }, { sites: updatedSites });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorResponse("Please provide an username and password", 400));
  }

  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return next(new ErrorResponse("User not found", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid password", 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Email does not exist", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/passwordReset/${resetToken}`;

    const message = `
        <h1>Transchem<h1>
        <h2> You have requested a password reset </h2>
        <h6>Please go to this link to reset your password</h6>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpite = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      date: "Password Reset Success"
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token, user });
};
