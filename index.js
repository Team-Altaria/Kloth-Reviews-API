const express = require('express');
const morgan = require('morgan');
const app = express();
const pool = require('./pg');
const port = 3000;

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  pool.query('SELECT * FROM PHOTOS WHERE review_id=5')
  .then(data => res.status(200).send(data.rows));
})

app.listen(port, () => {
  console.log(`listening on ${port}`)
});