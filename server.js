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
   // Render index.liquid uit de Views map
   // Geef hier eventueel data aan mee
     const params = {
    // Sorteer op naam
    // 'sort': 'name',
 
    // Geef aan welke data je per persoon wil terugkrijgen
    'fields': 'name,image',
 
    // Combineer meerdere filters
 
  }
 
 const productResponse = await fetch('https://fdnd-agency.directus.app/items/milledoni_products/?' + new URLSearchParams(params))
 
const productResponseJSON = await productResponse.json()
  console.log(productResponseJSON.data)
   response.render('index.liquid',{products: productResponseJSON.data})
})
 

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