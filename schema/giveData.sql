\COPY photos(photos_id, review_id, url) FROM 'schema/data/reviews_photos.csv' WITH DELIMITER ',' CSV HEADER;

\COPY reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM 'schema/data/reviews.csv' WITH DELIMITER ',' CSV HEADER;

\COPY chars(id, product_id, chars_name) FROM 'schema/data/characteristics.csv' WITH DELIMITER ',' CSV HEADER;

\COPY chars_review_join(id, chars_id, review_id, value) FROM 'schema/data/characteristic_reviews.csv' WITH DELIMITER ',' CSV HEADER;