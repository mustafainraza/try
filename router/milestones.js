const express = require("express");
const router = express.Router();
const client = require("../connection/connection");

router.use(express.json());
const auth = require("../middleware/auth");

router.get("/getmilestones", auth, async (req, res) => {
  let { campaign_id } = req.headers;
  try {
    let result = await client.query(
      `select milestone_id,milestone_title,milestone_desc,(DATE_PART('year', milestone_date) ) as year,(DATE_PART('month', milestone_date) ) as month,(DATE_PART('day', milestone_date) ) as day,abs((31-(DATE_PART('day', milestone_date - CURRENT_TIMESTAMP)))/31) as progress,(31-(DATE_PART('day', milestone_date - CURRENT_TIMESTAMP)))/31 as awai from milestones where campaign_id =$1 order by milestone_date asc`,
      [campaign_id]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

module.exports = router;
