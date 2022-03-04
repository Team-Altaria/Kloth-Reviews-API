const express = require('express');
const router = express.Router();
const pool = require('./pg');


router.get('/', (req, res) => {
  const {
    page = 1,
    count =  5,
    product_id,
    sort = 'relevant'
  } = req.query;

  if (!product_id) {
   return res.status(400).end('No Product Id Given');
  }

 pool.query(`
  SELECT * FROM photos
  RIGHT OUTER JOIN reviews
  ON photos.review_id=reviews.review_id
  WHERE reviews.product_id=${product_id}
  AND reviews.reported=false
  ORDER BY reviews.date DESC
  LIMIT ${count}`)
    .then((data) => {
      const built = {};
      data.rows.forEach((row) => {
        if (!built[row.review_id]) {
          built[row.review_id] = {
            review_id: row.review_id,
            rating: row.rating,
            summary: row.summary,
            recommend: row.recommend,
            response: row.response,
            body: row.body,
            date: new Date(parseInt(row.date)).toISOString(),
            reviewer_name: row.reviewer_name,
            helpfulness: row.helpfulness,
            photos: row.photos_id ? [{id: row.photos_id, url: row.url}] : [],
          }
        } else {
          built[row.review_id].photos.push({id: row.photos_id, url: row.url});
        }
      });
      const ids = Object.keys(built);
      res.status(200).send({
        product: product_id,
        page,
        count,
        results: ids.map((key) => built[key])
      })
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;