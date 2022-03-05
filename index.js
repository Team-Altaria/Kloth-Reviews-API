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

app.listen(port, () => {
  console.log(`listening on ${port}`)
});