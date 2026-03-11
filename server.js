// server.js
import express from 'express';
import { Liquid } from 'liquidjs';
import path from 'path';

const app = express();
const port = process.env.PORT || 8000;

// Body parser
app.use(express.urlencoded({ extended: true }));

// Statische bestanden
app.use(express.static('public'));

// Liquid engine
const engine = new Liquid({
  root: path.resolve('./views'), // hier kijkt Liquid voor index + partials
  extname: '.liquid'
});

app.engine('liquid', engine.express());
app.set('view engine', 'liquid'); // NIET app.set('views', ...) want dat veroorzaakt dubbele root

// ====================
// ROUTES
// ====================
app.get('/', async function (request, response) {

 console.log(request.query)

  const params = {
    fields: "name,image,amount"
  };

  // PRICE FILTER
  if (request.query.price) {
    params["filter[amount][_between]"] = "0," + request.query.price;
  }

  // AGE FILTER
  if (request.query.age) {
    params["filter[age][_lte]"] = request.query.age;
  }

  // WHO (boyfriend / mother etc)
  if (request.query.for) {
    params["filter[for][_eq]"] = request.query.for;
  }

  // SEARCH TEXT
  if (request.query.message) {
    params["search"] = request.query.message;
  }

  // DEFAULT SORT
  params["sort"] = "id";

  const productResponse = await fetch(
    "https://fdnd-agency.directus.app/items/milledoni_products/?" +
    new URLSearchParams(params)
  );

  const productResponseJSON = await productResponse.json();

  console.log(productResponseJSON.data);

  response.render("index.liquid", {
    products: productResponseJSON.data
  });

});

const buttons = document.querySelectorAll('#giftFinderForm button[type="button"]');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const value = btn.dataset.value;

    // Alle buttons van dezelfde groep deselecteren
    document.querySelectorAll(`#giftFinderForm button[data-name="${name}"]`).forEach(b => {
      b.classList.remove('active');
    });

    // Actief maken
    btn.classList.add('active');

    // Value in hidden input zetten
    document.getElementById('input' + name.charAt(0).toUpperCase() + name.slice(1)).value = value;
  });
});


// POST route
app.post('/', (req, res) => {
  res.redirect(303, '/');
});

// ====================
// SERVER STARTEN
// ====================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});