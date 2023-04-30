const express = require("express");
const router = express.Router();
const client = require("../connection/connection");
const auth = require("../middleware/auth");

router.use(express.json());

router.get("/getrewards", auth, async (req, res) => {
  const { investor_id } = req.headers;
  try {
    let result = await client.query(
      `select A.campaign_reward_id,C.campaign_title,B.campaign_reward_name,campaign_reward_amount,B.campaign_reward_description,B.campaign_reward_amount from investor_reward A inner join campaign_reward B on A.campaign_reward_id = B.campaign_reward_id inner join campaign C on B.campaign_id=C.campaign_id where A.investor_id=$1`,
      [investor_id]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

module.exports = router;
