const express = require('express');
const router = express.Router();
const pool = require('./pg');

router.get('/', (req, res) => {
  const { product_id } = req.query;

  pool.query(`
    SELECT * FROM meta
    LEFT OUTER JOIN (

    )`)
})

module.exports = router;