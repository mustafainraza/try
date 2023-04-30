const express = require("express");
const router = express.Router();
const client = require("../connection/connection");

router.use(express.json());
const auth = require("../middleware/auth");

router.get("/campaignerdetails", auth, async (req, res) => {
  let { campaigner_id } = req.headers;
  try {
    let result = await client.query(
      `SELECT A.campaigner_id,A.campaigner_name,A.campaigner_email,A.campaigner_cnic,A.campaigner_contact,A.office_address,count(*) as Total_campaigns FROM campaigner A inner join campaign C ON A.campaigner_id = C.campaigner_id group by A.campaigner_id having A.campaigner_id=$1`,
      [campaigner_id]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

module.exports = router;
