const express = require('express');
const router = express.Router();
const pool = require('./pg');

router.get('/', (req, res) => {
  const { product_id } = req.query;

  pool.query(`
    SELECT * FROM meta
    LEFT OUTER JOIN
      (SELECT chars.id, chars.product_id, chars.count, chars.total, chars_names.chars_name FROM chars, chars_names
      WHERE chars.chars_id=chars_names.chars_name_id) AS grouped
    ON meta.product_id=grouped.product_id
    WHERE meta.product_id=${product_id}
    ORDER BY grouped.id ASC
    `)
    .then((data) => {

      if (data.rows.length === 0) {
        return res.status(404).send('Product Id Not Found');
      }
      const rows = data.rows
      const charsObj = {}
      for (i = 0; i < rows.length; i++) {
        charsObj[rows[i].chars_name] = {
          id: rows[i].id,
           value: rows[i].total / rows[i].count
          }
      }
      const builtObj = {
        product_id,
        ratings: {
          1: rows[0].rating1 || undefined,
          2: rows[0].rating2 || undefined,
          3: rows[0].rating3 || undefined,
          4: rows[0].rating4 || undefined,
          5: rows[0].rating5 || undefined,
        },
        recommended: {
          true: rows[0].recommend_true || undefined,
          false: rows[0].recommend_false || undefined,
        },
        characteristics: charsObj
      };
      res.status(200).send(builtObj)
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
