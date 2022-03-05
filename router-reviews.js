const express = require('express');
const router = express.Router();
const pool = require('./pg');


router.get('/', (req, res) => {
  const {
    page = 1,
    count =  5,
    product_id,
    sort = 'recent'
  } = req.query;
  let pageMult = 0;
  let sortBy = 'reviews.date';

  if (sort === 'helpful') {
    sortBy = 'reviews.helpfulness'
  }
  if (!product_id) {
   return res.status(400).end('No Product Id Given');
  }
  if (page > 1) {
    pageMult = (page - 1) * count;
  }


 pool.query(`
  SELECT * FROM photos
  RIGHT OUTER JOIN reviews
  ON photos.review_id=reviews.review_id
  WHERE reviews.product_id=${product_id}
  AND reviews.reported=false
  ORDER BY ${sortBy} DESC
  LIMIT ${count}
  OFFSET ${pageMult}
  `)
    .then((data) => {
      const order = [];
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
          order.push(row.review_id);
        } else {
          built[row.review_id].photos.push({id: row.photos_id, url: row.url});
        }
      });
      res.status(200).send({
        product: product_id,
        page,
        count,
        results: order.map((key) => built[key])
      })
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post('/', (req, res) => {
  const {
    product_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics
  } = req.body

  const date = +new Date
  const queryArgs = [product_id, rating, date, summary, body, recommend, name, email]

  pool.query(`
  INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING product_id, rating, recommend, review_id
  `, queryArgs)
    .then((data) => {
      const rows = data.rows[0];

      if (photos.length !== 0) {
        for (let i = 0; i < photos.length; i++) {
          pool.query(`
          INSERT INTO photos (url, review_id)
          VALUES ('${photos[i]}', ${rows.review_id})
          `)
        }
      }

      pool.query(`
      UPDATE meta
      SET recommend_${rows.recommend}=recommend_${rows.recommend} + 1,
      rating${rows.rating}=rating${rows.rating} + 1
      WHERE product_id=${rows.product_id}
      `)

      const charIds = Object.keys(characteristics);
      for (let k = 0; k < charIds.length; k++) {
        pool.query(`
        UPDATE chars
        SET count=count+1, total=total+${characteristics[charIds[k]]}
        WHERE id=${charIds[k]}
        `)
      }
    })
    .then(() => {
      res.status(201).send('Posted')
    })
    .catch((err) => {
      res.status(400).send(err)
    })
});

router.put('/:review_id/report', (req, res) => {
  const { review_id } = req.params;

  pool.query(`
  UPDATE reviews
  SET reported=true
  WHERE review_id=${review_id}
  `)
  .then(() => {
    res.status(200).send('reported');
  })
  .catch((err) => {
    res.status(400).send(err);
  })
});

router.put('/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;

  pool.query(`
  UPDATE reviews
  SET helpfulness=helpfulness + 1
  WHERE review_id=${review_id}
  `)
  .then(() => {
    res.status(200).send('Marked as helpful')
  })
  .catch((err) => {
    res.status(400).send(err);
  })
})
module.exports = router;
