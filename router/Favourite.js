const express = require("express");
const router = express.Router();
const client = require("../connection/connection");

router.use(express.json());

const auth = require("../middleware/auth");

router.post("/likes", auth, async (req, res) => {
  try {
    const { campaign_id, investor_id } = req.body;
    const result = await client.query(
      "SELECT * FROM favourites WHERE campaign_id = $1 AND investor_id = $2",
      [campaign_id, investor_id]
    );

    if (result.rows.length > 0) {
      await client.query(
        "DELETE FROM favourites WHERE campaign_id = $1 AND investor_id = $2",
        [campaign_id, investor_id]
      );
      res.send("Unliked");
    } else {
      // const max = await client.query("select * from favourites");
      // console.log(max.rows);
      await client.query(
        "INSERT INTO favourites (campaign_id, investor_id) VALUES ($1, $2)",
        [campaign_id, investor_id]
      );
      res.send("Liked");
    }
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

router.get("/showlikes", auth, async (req, res) => {
  try {
    const { investor_id } = req.headers;
    let result = await client.query(
      `Select campaign_id,count(favourite_id) as All_likes from favourites where investor_id=$1 group by campaign_id`,
      [investor_id]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

router.get("/countlikes", auth, async (req, res) => {
  try {
    let result = await client.query(
      `Select campaign_id,count(favourite_id) as All_likes from favourites group by campaign_id`
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error retrieving data from PostgreSQL database", err);
    res.status(500).send("Error retrieving data from PostgreSQL database");
  }
});

module.exports = router;
