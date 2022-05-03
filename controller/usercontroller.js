const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Otp = require("../model/otp");
const jwt = require("jsonwebtoken");
const User = require("../model/userschema");
const Terms = require("../model/terms");
const Privacy = require("../model/privacy");
const { ObjectId } = require("bson");
const service = require("../services/userservices");
const otp = require("../model/otp");
const Social = require("../model/sociallogin");
const NewsFeed = require("../model/newsFeed");
const FB = require("fb");

const signUp = async (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const data = service.insertQuery(User, {
        userName: req.body.userName,
        phoneNumber: req.body.phoneNumber,
        countryCode: req.body.countryCode,
        email: req.body.email,
        password: hash,

        Gender: req.body.Gender,
      });

      if (data) {
        var OTP = otpGenerator.generate(6, {
          digits: true,
          alphabets: false,
          upperCase: false,
          specialChars: false,
        });

        const phoneNumber = req.body.phoneNumber;
        const email = req.body.email;
        const otp = service
          .insertQuery(Otp, {
            phoneNumber: phoneNumber,
            email: email,
            otp: OTP,
          })
          .then(() => {
            res.json({
              status: "true",
              response: "otp sent successfully",
              otp: OTP,
            });
          })
          .catch((error) => {
            res.json(error);
          });
      }
    }
  });
};

const verifyOtp = async (req, res) => {
  const data = { phoneNumber: req.body.phoneNumber, otp: req.body.otp };
  const value = await service.userOtpVerification(data);
  if (value != null && value != 0) {
    res.json({
      status: "true",
      error: {},
      message: "otp verified",
      data: value,
    });
  } else if (value == null && value != 0) {
    res.json({
      status: "false",
      message: "wrong otp",
    });
  }

  if (value == 0) {
    res.json({
      status: "false",
      message: "phoneNumber not exist",
    });
  }
};

const loginUser = async (req, res) => {
  if (req.body.loginType == "emailorphone") {
    await User.find({
      $or: [{ email: req.body.userId }, { phoneNumber: req.body.userId }],
    })
      .exec()
      .then((data) => {
        // console.log(data);
        if (data.length < 1) {
          return res.status(401).json({
            response: "null",
            message: "user not found",
          });
        } else {
          var privateKey = "sfsdtrykloipittrtedscdcvxgtyjmbnvcvsds";
          bcrypt.compare(req.body.password, data[0].password, (err, result) => {
            if (!result) {
              res.status(401).json({
                // message: "password matching fail"
                status: "true",
                response: "null",
                code: "200",

                error: {
                  errCode: "Authorize_Failed",
                  errMsg: "Failed to Authorized",
                },
              });
            }
            if (result) {
              const token = jwt.sign(
                {
                  email: data[0].email,
                  id: data[0]._id,
                },
                privateKey,

                {
                  expiresIn: "48h",
                }
              );
              res.status(200).json({
                code: "200",
                error: {},
                message: "successfully authorized",
                token: token,
              });
            }
          });
        }
      });
  }
  // // else {
  // //     res.json({
  // //         status:"false",
  // //         message:"enter valid data for login"
  // //     })
  // // }
  else if (req.body.loginType == "facebook" || req.body.loginType == "google") {
    var data = req.body.userId;

    await service.findEmail(User, data).then((data) => {
      if (data) {
        const id = data._id;
        console.log(id);
        const data1 = req.body.loginType;
        service.findUser(Social, id, data1).then((result) => {
          var privateKey = "sfsdtrykloipittrtedscdcvxgtyjmbnvcvsds";

          if (!result) {
            const value = {
              userId: id,
              loginType: req.body.loginType,
              socialId: req.body.socialId,
            };
            service.add(Social, value).then(() => {
              const token = jwt.sign(
                {
                  id: id,
                },
                privateKey,

                {
                  expiresIn: "48h",
                }
              );
              console.log(data);
              res.status(200).json({
                status: "true",
                code: "200",
                error: {},
                message: "successfully authorized",
                token: token,
                //  response: data
              });
            });
          } else {
            if (result.socialId == req.body.socialId) {
              const token = jwt.sign(
                {
                  id: data._id,
                },
                privateKey,
                {
                  expiresIn: "24h",
                }
              );
              res.status(200).send({
                status: "true",
                msg: "successfully authorized",
                //  "response": data,
                code: 200,
                error: {},
                token: token,
              });
            } else {
              res.json("Please enter correct socialId");
            }
          }
        });
      }
    });
  } else {
    res.json({
      status: "false",
      message: "enter valid userId",
      response: "null",
    });
  }

  // .catch(error => {
  //     res.status(500).json({

  //         error: error.message
  //     })

  // })
};

const loginByPhoneNumber = async (req, res) => {
  try {
    Otp.findOne({ phoneNumber: req.body.phoneNumber }).then(async (result) => {
      if (!result) {
        await User.findOne({ phoneNumber: req.body.phoneNumber }).then(
          async (data) => {
            if (data) {
              var OTP = otpGenerator.generate(6, {
                digits: true,
                alphabets: false,
                upperCase: false,
                specialChars: false,
              });
              res.json({
                response: "otp sent successfully",
                otp: OTP,
              });
              const phoneNumber = req.body.phoneNumber;
              const otp = new Otp({ phoneNumber: phoneNumber, otp: OTP });
              // const salt = await bcrypt.genSalt(10)
              // otp.otp = await bcrypt.hash(otp.otp, salt);
              await otp
                .save()
                //console.log(otp)
                .then(() => {
                  return res.status(200).send("otp send successfully");
                })
                .catch((err) => {
                  res.status(404).json({
                    error: err.message,
                  });
                });
            } else {
              res.json("phone number not exist");
            }
          }
        );
      } else {
        res.json("try after sometimes otp is not expired");
      }
    });
  } catch (error) {
    res.status(404).json("error");
  }
};

const verifyPhoneNo = async (req, res) => {
  const data = { phoneNumber: req.body.phoneNumber, otp: req.body.otp };
  const value = await service.userOtpVerification(data);
  if (value != null && value != 0) {
    res.json({
      status: "true",
      error: {},
      message: "otp verified",
      data: value,
    });
  } else if (value == null && value != 0) {
    res.json({
      status: "false",
      message: "wrong otp",
    });
  }

  if (value == 0) {
    res.json({
      status: "false",
      message: "phoneNumber not exist",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    let data = req.user;
    let val = await service.get(User, data);
    //console.log(val);
    if (!val == 0) {
      res.json({
        status: "true",
        code: 200,
        data: val,
      });
    } else {
      res.json({
        status: "false",
        message: "no data",
      });
    }
  } catch (error) {
    res.send({
      error: {
        message: "null",
        error: error.message,
      },
    });
  }
};

const getTermsAndCondition = async (req, res) => {
  try {
    let data = req.params.id;
    //console.log(data);
    let value = await service.get(Terms, data);
    //console.log(value);
    if (value != 0) {
      res.json({
        status: "true",
        code: 200,
        data: value,
      });
    } else {
      res.json({
        status: "true",
        response: "null",
      });
    }
  } catch (error) {
    res.send({
      error: {
        message: "null",
        error: error.message,
      },
    });
  }
};

const getPrivacyandPolicy = async (req, res) => {
  try {
    let data = req.params.id;
    console.log(data);
    let value = await service.get(Privacy, data);
    console.log(value);
    if (!value == 0) {
      res.json({
        status: "true",
        code: 200,
        data: value,
      });
    } else {
      res.json({
        status: "true",
        response: "null",
      });
    }
  } catch (error) {
    res.send({
      error: {
        message: "null",
        error: error.message,
      },
    });
  }
};

const updateUser = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user },
      {
        $set: {
          userName: req.body.userName,
          Gender: req.body.Gender,
          email: req.body.email,
          countryCode: req.body.countryCode,
        },
      },
      { new: true, runValidators: true }
    )
      .then((result) => {
        res.json({
          status: "true",
          code: 200,
          message: "updated successfully",
          response: result,
        });
      })
      .catch((err) => {
        res.send({
          error_code: 500,
          message: "null",
          response: err.message,
        });
      });
  } catch (error) {
    res.json(error.message);
  }
};

const changePassword = async (req, res) => {
  const data = await service.changepass(req.body.email);
  if (!data) {
    return res.status(401).json({
      response: "null",
      message: "user not found",
    });
  } else {
    bcrypt.compare(req.body.oldPassword, data.password, (err, result) => {
      if (err) {
        res.status(401).json({
          status: "false",
          response: "null",
          code: "200",

          error: {
            errCode: "password not found",
          },
        });
      } else if (result) {
        if (req.body.newPassword == req.body.confirmPassword) {
          var Password;
          bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            Password = hash;
            var value = req.user;

            service
              .updateQuery(value, { password: Password })
              .then((data2) => {
                res.json({
                  status: "true",
                  response: data2,
                  code: 200,
                  message: "password changed successfully",
                });
              })
              .catch((error) => {
                res.json({
                  status: "false",
                  response: "null",
                  code: 400,
                  error: error,
                });
              });
          });
        } else {
          res.json({
            status: "false",
            message: "Password must be same",
          });
        }
      } else {
        res.json({
          status: "false",
          message: "invalid password",
        });
      }
    });
  }
};

const changePhoneNumber = async (req, res) => {
  const data = await service.changePhone(req.body.phoneNumber);

  if (!data) {
    return res.status(401).json({
      response: "null",
      message: "user not found",
    });
  } else {
    var value = req.user;
    var newPhoneNumber = req.body.newPhoneNumber;
    service
      .updateQuery(value, { phoneNumber: newPhoneNumber })
      .then((data2) => {
        res.json({
          status: "true",
          response: data2,
          code: 200,
          message: "phoneNumber changed successfully",
        });
      });
  }
};

const reqResetPassword = async (req, res) => {
  data = {
    $or: [{ email: req.body.userId }, { phoneNumber: req.body.userId }],
  };
  service.userId(User, data).then((result) => {
    if (result.length > 0) {
      var OTP = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });

      const phoneNumber = req.body.phoneNumber;
      const email = req.body.email;
      const otp = service
        .insertQuery(Otp, { phoneNumber: phoneNumber, email: email, otp: OTP })
        .then(() => {
          res.json({
            status: "true",
            response: "otp sent successfully",
            otp: OTP,
          });
        })
        .catch((error) => {
          res.json(error);
        });
    } else {
      res.json({
        status: "false",
        message: "invalid email or phoneNumber",
      });
    }
  });
};

const createPassword = async (req, res) => {
  data = {
    $or: [{ email: req.body.userId }, { phoneNumber: req.body.userId }],
  };
  service.userId(User, data).then((result) => {
    if (result) {
      if (req.body.newPassword == req.body.confirmPassword) {
        var Password;
        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          Password = hash;
          var value = req.body.userId;

          service.update(data, { password: Password }).then((data2) => {
            res.json({
              status: "true",
              response: data2,
              code: 200,
              message: "password changed successfully",
            });
          });
        });
      } else {
        res.json({
          message: "password must me same",
        });
      }
    } else {
      res.json({
        status: "false",
        message: "user not found",
        response: "null",
      });
    }
  });
};

const addNewsFeed = async (req, res) => {
  const data = service
    .insertQuery(NewsFeed, {
      userId: req.user,
      title: req.body.title,
      description: req.body.description,
      hyperlink: req.body.hyperlink,
    })
    .then((result1) => {
      if (result1 != 0) {
        res.json({
          status: "true",
          code: "200",
          error: {},
          message: "news feeds added",
          response: result1,
        });
      } else {
        res.json({
          status: "false",
          response: "null",
          error: {
            err: "failed",
          },
        });
      }
    });
};

const facebookPost = async (req, res) => {
  try {
    FB.api(
      "https://graph.facebook.com/v13.0/103306935712414?access_token=EAAEepviWg0ABAAMUCvhT1qtmG8gdqb15SmZCgRwzZAvw0LJ7E5KvnNXwYZC85MKeBWcFm7TYLL9lgOWKzuQYgI3dj8dnj57YZBgo0uj42IdyZBFOEDZCJGZALpAbA1dMvmUicHaFlKYDYq28M2njNIMPXzS0nBOv0PuI0bxrtUZC5kBPNPX7ZBmwyiJc9ZCGP3pG33K98jWcKSLAZDZD",
      "GET",
      { fields:"posts"},
      function (response) {
        return res.json(response);
      }
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: usercontroller.js ~ line 614 ~ facebookPost ~ error",
      error.message
    );
    return res.json(error);
  }
};

module.exports = {
  signUp,
  loginUser,
  loginByPhoneNumber,
  verifyOtp,
  getProfile,
  getTermsAndCondition,
  getPrivacyandPolicy,
  updateUser,
  verifyPhoneNo,
  changePassword,
  changePhoneNumber,
  reqResetPassword,
  createPassword,
  facebookPost,
  addNewsFeed,
};
