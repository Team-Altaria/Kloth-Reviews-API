const reviewsSchema = new Schema({

  review: {
    review_id: Number,
    product_id:  Number,
    rating: Number,
    body: String,
    summary: String,
    recommend: Boolean,
    response: { type: String, default: null }
    helpful: Number,
    reviewer_name: String,
    date: { type: Date, default: Date.now },
    photos: [{ url: String, id: Number }],
  },

  meta: {
    product_id: Number,
    recommended: {
      true: Number,
      false: Number
    },
    ratings: {
      1: {type: Number, default: 0},
      2: {type: Number, default: 0},
      3: {type: Number, default: 0},
      4: {type: Number, default: 0},
      5: {type: Number, default: 0},
    },
    characteristics: {chars_name: String}
  },
});

const charsSchema = new Schema({
  id: Number,
  value: String,
})
