const express = require("express");
const router = express.Router();
const client = require("../connection/connection");
const auth = require("../middleware/auth");

router.use(express.json());

router.get("/backedprojects", auth, async (req, res) => {
  const { investor_id } = req.headers;
  try {
    let result = await client.query(
      `select A.*,(DATE_PART('day', campaign_end_time - CURRENT_TIMESTAMP) * 24 + DATE_PART('hour', campaign_end_time - CURRENT_TIMESTAMP)) as hours ,count(B.investor_id) as backers,C.campaigner_name,B.invest_amount as backedamount from campaign A left join invests B on A.campaign_id = B.campaign_id inner join campaigner C on A.campaigner_id=C.campaigner_id where B.investor_id=${investor_id} group by A.campaign_id,C.campaigner_name,B.invest_amount order by A.campaign_end_time desc`
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

module.exports = router;
