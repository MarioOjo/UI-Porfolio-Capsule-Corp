const http = require('http');
const slug = 'potara-earrings';
const host = 'localhost';
const port = 5000;

function getProduct(cb) {
  http.get({hostname: host, port, path: '/api/products/slug/' + slug}, res => {
    let d = '';
    res.setEncoding('utf8');
    res.on('data', c => d += c);
    res.on('end', () => {
      try {
        const obj = JSON.parse(d);
        const prod = obj.product || obj;
        cb(null, prod);
      } catch (err) {
        cb(err);
      }
    });
  }).on('error', cb);
}

function putProduct(prod, cb) {
  const data = JSON.stringify(prod);
  const options = {
    hostname: host,
    port,
    path: '/api/products/' + prod.id,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  const req = http.request(options, res => {
    let d = '';
    res.setEncoding('utf8');
    res.on('data', c => d += c);
    res.on('end', () => cb(null, res.statusCode, d));
  });
  req.on('error', cb);
  req.write(data);
  req.end();
}

getProduct((err, prod) => {
  if (err) return console.error('GET error', err.message || err);
  console.log('Got product id', prod.id, 'current image:', prod.image);
  prod.image = 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/potara_earrings_glowing.jpg';
  prod.gallery = [
    prod.image,
    'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759163370/earrings_uz8yak.jpg',
    'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096628/potara_earrings_macro.jpg'
  ];
  putProduct(prod, (err, status, body) => {
    if (err) return console.error('PUT error', err.message || err);
    console.log('PUT status', status);
    try { console.log('PUT body', JSON.parse(body)); } catch (e) { console.log('PUT body raw', body); }
  });
});
