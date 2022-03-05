import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 500,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.03'], // http errors should be less than 1%
    http_req_duration: ['p(95)<150'], // 95% of requests should be below 200ms
  },
};

export default function script() {
  const id = Math.ceil(Math.random() * 1000011);

  http.get(`http://localhost:3000/reviews?product_id=${id}&count=50&sort=newest`);
  sleep(1);

  http.get(`http://localhost:3000/reviews?product_id=${id}&count=50&sort=helpful`);
  sleep(1);

  http.get(`http://localhost:3000/reviews/meta?product_id=${id}`);
  sleep(1);
};