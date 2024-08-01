const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { createError, successMessage } = require("../utils/ResponseMessage");
const { sendMail } = require("../utils/sendEmailUtil");
const privateKey = process.env.ACCESS_SECRET_KEY;
const otpGenerator = require("otp-generator");
const OTP = require("../Models/OTP");
const Doctor = require("../Models/Doctor");
const Patient = require("../Models/Patient");

function authControllers() {
  return {
    login: async (req, res) => {
      console.log(req.body.role);
      // validate the req
      if (req.body.role === 1) {
        const loginSchema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          role: Joi.number().required(),
        });

        const { error } = loginSchema.validate(req.body);
        if (error) return createError(res, 422, error.message);
        // check useremail
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return createError(res, 422, "No such email registered!");

        // check user password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return createError(res, 403, "email or password doesn't match!");
        const otp = otpGenerator.generate(4, {
          digits: true,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        await sendMail(email, otp);
        const addOtp = new OTP({
          accountId: user._id,
          otp: otp,
        });
        await addOtp.save();
        return successMessage(res, user, "Otp Successfully Send to " + email);
      } else if (req.body.role === 2) {
        const loginSchema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          role: Joi.number().required(),
        });

        const { error } = loginSchema.validate(req.body);
        if (error) return createError(res, 422, error.message);
        // check useremail
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return createError(res, 422, "No such email registered!");

        if (!user.isApproved) {
          return createError(
            res,
            400,
            "Doctor is not approved by Admin please contact Admin!"
          );
        }

        // check user password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return createError(res, 403, "email or password doesn't match!");
        let populatedUser = user;
        if (user.role === 2) {
          populatedUser = await user.populate("doctorId");
        }
        if (user.role === 3) {
          populatedUser = await user.populate("patientId");
        }
        const jwtBody = { ...user };

        var token = await jwt.sign({ ...jwtBody }, privateKey);

        res.cookie("userToken", token, {
          // maxAge: 60000000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        delete user.password;
        return successMessage(
          res,
          { user, token },
          "Doctor Successfully Logged In!"
        );
      } else if (req.body.role === 3) {
        const loginSchema = Joi.object({
          name: Joi.string().required(),
          mobile_no: Joi.string().required(),
          role: Joi.number().required(),
        });

        const { error } = loginSchema.validate(req.body);
        if (error) return createError(res, 422, error.message);
        // check useremail
        const { mobile_no, name } = req.body;
        const user = await User.findOne({ mobile_no, name });
        if (!user) return createError(res, 422, "No such Patient registered!");
        // check user password using bcrypt
        let populatedUser = user;
        if (user.role === 2) {
          populatedUser = await user.populate("doctorId");
        }
        if (user.role === 3) {
          populatedUser = await user.populate("patientId");
        }
        const jwtBody = { ...user };

        var token = await jwt.sign({ ...jwtBody }, privateKey);

        res.cookie("userToken", token, {
          // maxAge: 60000000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        delete user.password;
        return successMessage(
          res,
          { user, token },
          "Patient Successfully Logged In!"
        );
      }
    },
    verifyOtp: async (req, res) => {
      const { otp, accountId } = req.body;
      if (!otp || !accountId) {
        createError(res, 422, "required fields are undefined!");
      }
      try {
        const userAccount = await User.findById(accountId);
        if (!userAccount) createError(res, 404, "Invalid User Id");

        const otpVerified = await OTP.findOne({ accountId, otp });
        if (otpVerified) {
          const jwtBody = {
            _id: userAccount._id,
            role: userAccount.role,
            name: userAccount.name,
            email: userAccount.email,
          };

          var token = await jwt.sign({ ...jwtBody }, privateKey);

          res.cookie("userToken", token, {
            // maxAge: 60000000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });
          delete userAccount.password;
          return successMessage(
            res,
            {
              user: userAccount,
              token: token,
            },
            "Otp Verified - Logged In Successfully!"
          );
        } else {
          return createError(res, 404, "Invalid Otp");
        }
      } catch (err) {
        return createError(res, 404, err.message);
      }
    },
    register: async (req, res) => {
      const { role } = req.body;
      if (role === 1) {
        const adminExists = await User.exists({ role: 1 });
        if (adminExists)
          return createError(res, 400, "Unable to add multiple Admins!");

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          return createError(res, 422, "Required field are undefined!");
        } else {
          try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const createAccount = new User({
              name,
              email,
              password: hashedPassword,
              role: 1,
            });
            await createAccount.save();
            if (createAccount) {
              return successMessage(
                res,
                adminExists,
                "Admin Successfully added!"
              );
            } else return createError(res, 400, "Unable to add Admin!");
          } catch (error) {
            return createError(res, 400, error.message);
          }
        }
      } else if (role === 2) {
        try {
          console.log(req.body);
          const accountExists = await User.exists({ email: req.body.email });
          if (accountExists)
            return createError(res, 400, "Email already registered!");
          const {
            name,
            email,
            password,
            mobile_no,
            imageUrl,
            gender,
            address,
          } = req.body;
          if (
            !name ||
            !email ||
            !password ||
            !mobile_no ||
            !imageUrl ||
            !gender ||
            !address
          ) {
            return createError(res, 422, "Required field are undefined!");
          } else {
            const addDoctor = new Doctor({
              name,
              imageUrl,
              address,
              gender,
              mobile_no,
              email,
              clinic_timing: [
                { day: "Sunday", available: false, from: "10:00", to: "16:00" },
                { day: "Monday", available: false, from: "10:00", to: "16:00" },
                {
                  day: "Tuesday",
                  available: false,
                  from: "10:00",
                  to: "16:00",
                },
                {
                  day: "Wednesday",
                  available: false,
                  from: "10:00",
                  to: "16:00",
                },
                {
                  day: "Thursday",
                  available: false,
                  from: "10:00",
                  to: "16:00",
                },
                { day: "Friday", available: false, from: "10:00", to: "16:00" },
                {
                  day: "Saturday",
                  available: false,
                  from: "10:00",
                  to: "16:00",
                },
              ],
            });
            await addDoctor.save();
            if (!addDoctor)
              return createError(res, 400, "Unable to add new Doctor!");

            const hashedPassword = await bcrypt.hash(password, 10);
            const createAccount = new User({
              name,
              email,
              password: hashedPassword,
              doctorId: addDoctor._id,
              role: 2,
            });
            await createAccount.save();
            if (createAccount) {
              return successMessage(
                res,
                createAccount,
                "Doctor Successfully added! - waiting for approval!"
              );
            } else return createError(res, 400, "Unable to add Doctor!");
          }
        } catch (error) {
          return createError(res, 400, error.message);
        }
      } else if (role === 3) {
        try {
          console.log(req.body);
          const accountExists = await User.exists({
            mobile_no: req.body.mobile_no,
            name: req.body.name,
          });
          if (accountExists)
            return createError(res, 400, "Patient already registered!");
          const { name, email, mobile_no, age, imageUrl, gender, address } =
            req.body;
          if (
            !name ||
            !email ||
            !mobile_no ||
            !imageUrl ||
            !gender ||
            !age ||
            !address
          ) {
            return createError(res, 422, "Required field are undefined!");
          } else {
            const addPatient = new Patient({
              name,
              mobile_no,
              gender,
              age,
              address,
              imageUrl,
            });
            await addPatient.save();
            if (!addPatient)
              return createError(res, 400, "Unable to add new Patient!");

            const createAccount = new User({
              name,
              mobile_no,
              patientId: addPatient._id,
              role: 3,
            });
            await createAccount.save();
            if (createAccount) {
              return successMessage(
                res,
                createAccount,
                "Patient Successfully added!"
              );
            } else return createError(res, 400, "Unable to add Patient!");
          }
        } catch (error) {
          return createError(res, 400, error.message);
        }
      } else {
        createError(res, 422, "Invalid role");
      }
    },
    branches: async (req, res) => {
      try {
        const branches = await User.find({ role: 2 });
        if (!branches) return createError(res, 404, "Branches not found!");
        else return successMessage(res, branches, null);
      } catch (err) {
        return createError(res, 400, err.message);
      }
    },
    deleteBranch: async (req, res) => {
      const id = req.params.id;
      console.log(id);
      if (!id) return createError(res, 422, "Invalid Branch Id!");
      try {
        const branch = await User.findByIdAndDelete(id);
        if (!branch) return createError(res, 404, "Branch not Found!");
        else
          return successMessage(
            res,
            200,
            `${branch.name} successfully deleted!`
          );
      } catch (err) {
        return createError(res, 400, err.message);
      }
    },
    updateBranch: async (req, res) => {
      const { branchId, payload } = req.body;
      console.log(req.body);
      if (!branchId) return createError(res, 422, "Invalid Branch Id!");
      if (!payload) return createError(res, 422, "Invalid Payload!");
      let hashedPassword;

      if (payload.password)
        hashedPassword = await bcrypt.hash(payload.password, 10);

      payload.password = hashedPassword;

      try {
        const branch = await User.findByIdAndUpdate(branchId, payload);
        if (!branch) return createError(res, 404, "Branch not Found!");
        else
          return successMessage(
            res,
            200,
            `${branch.name} successfully updated!`
          );
      } catch (err) {
        return createError(res, 400, err.message);
      }
    },
    logout: async (req, res) => {
      console.log(req.user._id);
      try {
        const token = await RefreshModel.findOneAndRemove({
          userId: req.user._id,
        });
        if (!token) {
          return res.status(422).json({ message: "Token not found" });
        }
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");
      } catch (err) {
        return createError(res, 500, err.message || err);
      }
      return successMessage(res, null, "Logout successfully");
    },
  };
}

module.exports = authControllers;
