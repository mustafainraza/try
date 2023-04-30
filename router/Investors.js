const express = require("express");
const router = express.Router();
const query = require("../model/Investor.js");
const client = require("../connection/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
router.use(express.json());

router.get("/helloo", (req, res) => {
  client.query(query);
  res.status(200).send("ggg");
  client.end;
});

// Register
router.post("/register", (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { name, email, password, CNIC, contactno } = req.body;
    console.log(name, email, password, CNIC, contactno);
    // console.log(email + " " + password);
    // const first_name = "Zain";
    // const last_name = "Shakir";

    // Validate user input
    if (!(name && email && password && CNIC && contactno)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database

    client.query(
      `select * from investor where investor_email='${email}'`,
      async (err, result) => {
        if (result.rows.length >= 1) {
          console.log("Email already exist");
          res.status(400);
          res.send("Email already exist");
        } else {
          //Encrypt user password
          encryptedPassword = await bcrypt.hash(password, 10);

          //     // Create user in our database
          //     const user = await User.create({
          //       first_name,
          //       last_name,
          //       email: email.toLowerCase(), // sanitize: convert email to lowercase
          //       password: encryptedPassword,
          //     });
          client.query(
            `INSERT INTO investor(
              investor_name,investor_email,investor_password,investor_cnic,investor_contact)
                  VALUES ( '${name}', '${email.toLowerCase()}', '${encryptedPassword}', '${CNIC}','${contactno}')`,
            (error, result) => {
              // console.log(result.rows);
              // Create token
              const token = jwt.sign(
                { email: email, name: name },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
              res.status(201).send(token);
            }
          );
        }
      }
    );

    //     // save user token
    //     user.token = token;

    //     // return new user
    //     res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  //   // Our register logic ends here
});

// Login

router.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    // const user = await User.findOne({ email });
    client.query(
      `select * from investor  where investor_email='${email}'`,
      async (err, result) => {
        if (result.rows.length > 0) {
          if (
            result &&
            (await bcrypt.compare(password, result.rows[0].investor_password))
          ) {
            // Create token
            const token = jwt.sign(
              { email: email, name: result.rows[0].investor_name },
              process.env.TOKEN_KEY,
              {
                expiresIn: "365d",
              }
            );
            res.status(200).send(token);
          } else {
            res.status(400).send("Invalid Credentials");
          }
        } else {
          res.status(400).send("Invalid Email");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
router.post("/forgot-pass", async (req, res) => {
  const { email } = req.body;
  try {
    client.query(
      `select * from investor  where investor_email='${email.toLowerCase()}'`,
      async (err, result) => {
        if (result.rows.length > 0) {
          const token = jwt.sign(
            {
              email: email,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "15m",
            }
          );
          const link = `http://192.168.100.78:3080/Investors/reset-pass/${email}/${token}`;

          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "elevatefyp2023@gmail.com",
              pass: "bpjvcroodhybexmp",
            },
          });

          var mailOptions = {
            from: "youremail@gmail.com",
            to: email,
            subject: "Password Reset",
            text: "Click on the link to Reset Password \n" + link,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          console.log(link);
          res.send("Reset your password via the link sent on your email.");
        } else {
          res.status(400).send("Email Doesn't Exist");
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: `Unable to Login user, due to error ${err.message}` });
  }
});

router.get("/reset-pass/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  client.query(
    `select * from investor  where investor_email='${id.toLowerCase()}'`,
    async (err, result) => {
      if (result.rows.length > 0) {
        try {
          const verify = jwt.verify(token, process.env.TOKEN_KEY);
          res.render("index", { email: verify.email });
        } catch (error) {
          res.send("Link Expired");
        }
      } else {
        res.status(400).send("Email Doesn't Exist");
      }
    }
  );
});

router.post("/reset-pass/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  client.query(
    `select * from investor  where investor_email='${id.toLowerCase()}'`,
    async (err, result) => {
      if (result.rows.length > 0) {
        try {
          const verify = jwt.verify(token, process.env.TOKEN_KEY);
          const encryptedPassword = await bcrypt.hash(password, 10);
          client.query(
            `UPDATE investor set investor_password='${encryptedPassword}' where investor_email='${id}'`,
            async (err, result) => {
              res.send("Password Updated Successfully");
            }
          );
        } catch (error) {
          res.send("Something Went Wrong");
        }
      } else {
        res.status(400).send("Email Doesn't Exist");
      }
    }
  );
});

const auth = require("../middleware/auth");

router.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 " + req.investor.name);
});

module.exports = router;
