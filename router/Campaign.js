const express = require("express");
const router = express.Router();
const client = require("../connection/connection");
router.use(express.json());
const auth = require("../middleware/auth");

router.get("/popularprojectdetails", async (req, res) => {
  try {
    let result = await client.query(
      `select A.*,(DATE_PART('day', campaign_end_time - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', campaign_end_time - CURRENT_TIMESTAMP)) as hours ,count(B.investor_id) as backers,C.campaigner_name from campaign A left join invests B on A.campaign_id = B.campaign_id inner join campaigner C on A.campaigner_id=C.campaigner_id where  A.campaign_end_time > CURRENT_TIMESTAMP and A.campaign_status=true group by A.campaign_id,C.campaigner_name having (A.campaign_earning>=A.campaign_goal OR count(B.investor_id)>20 ) order by A.campaign_earning desc`
    );
    if (result.rows.length == 0) {
      result = await client.query(
        `select A.*,(DATE_PART('day', campaign_end_time - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', campaign_end_time - CURRENT_TIMESTAMP)) as hours ,count(B.investor_id) as backers,C.campaigner_name from campaign A left join invests B on A.campaign_id = B.campaign_id inner join campaigner C on A.campaigner_id=C.campaigner_id where  A.campaign_end_time > CURRENT_TIMESTAMP and A.campaign_status=true group by A.campaign_id,C.campaigner_name order by A.campaign_earning desc limit 5`
      );
    }
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

router.get("/newprojectdetails", auth, async (req, res) => {
  try {
    let result = await client.query(
      `select A.*,(DATE_PART('day', campaign_end_time - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', campaign_end_time - CURRENT_TIMESTAMP)) as hours ,count(B.investor_id) as backers,C.campaigner_name from campaign A left join invests B on A.campaign_id = B.campaign_id inner join campaigner C on A.campaigner_id=C.campaigner_id where (DATE_PART('day', campaign_end_time - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', campaign_end_time - CURRENT_TIMESTAMP))>=240 and  A.campaign_end_time > CURRENT_TIMESTAMP and A.campaign_status=true group by A.campaign_id,C.campaigner_name order by A.campaign_end_time desc`
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

router.get("/endingsoonprojectdetails", auth, async (req, res) => {
  try {
    let result = await client.query(
      `select A.*,(DATE_PART('day', campaign_end_time - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', campaign_end_time - CURRENT_TIMESTAMP)) as hours ,count(B.investor_id) as backers,C.campaigner_name from campaign A left join invests B on A.campaign_id = B.campaign_id inner join campaigner C on A.campaigner_id=C.campaigner_id where (DATE_PART('day', campaign_end_time - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', campaign_end_time - CURRENT_TIMESTAMP))<240 and  A.campaign_end_time > CURRENT_TIMESTAMP and A.campaign_status=true group by A.campaign_id,C.campaigner_name order by A.campaign_end_time asc`
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

router.get("/hel", async (req, res) => {
  res.status(200).send("ppp");
  client.end;
});

module.exports = router;
