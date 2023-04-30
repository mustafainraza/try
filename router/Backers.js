const express = require("express");
const router = express.Router();
const client = require("../connection/connection");

router.use(express.json());
const auth = require("../middleware/auth");

router.get("/backersprofit", auth, async (req, res) => {
  const { campaign_id } = req.headers;
  try {
    let result = await client.query(
      `Select A.investor_id,A.investor_name,B.investor_amount from Investor A inner join Investor_profit B on A.investor_id = B.investor_id inner join campaign_profit C on B.campaign_profit_id=C.campaign_profit_id where C.campaign_id=${campaign_id} `
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

router.get("/backersreward", auth, async (req, res) => {
  let { campaign_id } = req.headers;
  try {
    let result = await client.query(
      `select A.investor_id,A.investor_name,C.campaign_reward_amount from Investor A inner join investor_reward B on A.investor_id = B.investor_id inner join campaign_reward C on B.campaign_reward_id=C.campaign_reward_id where C.campaign_id=$1`,
      [campaign_id]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

router.get("/backerequity", auth, async (req, res) => {
  let { campaign_id } = req.headers;
  try {
    let result = await client.query(
      `select A.investor_id,A.investor_name,C.campaign_equity_amount from Investor A inner join investor_equity B on A.investor_id = B.investor_id inner join campaign_equity C on B.campaign_equity_id=C.campaign_equity_id where C.campaign_id=$1`,
      [campaign_id]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

router.get("/backerdonation", auth, async (req, res) => {
  let { campaign_id } = req.headers;
  try {
    let result = await client.query(
      `select A.investor_id,A.investor_name,B.investor_donation_amount from Investor A inner join investor_donation B on A.investor_id = B.investor_id where B.campaign_id=$1`,
      [campaign_id]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

module.exports = router;
