const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;
const reviews = require('./router-reviews.js');
const meta = require('./router-meta.js');

app.use(morgan('tiny'));
app.use(express.json());

app.use('/reviews/meta', meta);
app.use('/reviews', reviews);

// app.get('/reviews', (req, res) => {
//   pool.query('SELECT * FROM PHOTOS WHERE review_id=5')
//   .then(data => res.status(200).send(data.rows));
// })





app.listen(port, () => {
  console.log(`listening on ${port}`)
});