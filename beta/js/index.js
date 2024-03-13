'use strict';

import Searcher from './search.js';

document.addEventListener('DOMContentLoaded', () => {
  const results = document.getElementById('results');
  results.style.display = 'none';

  const analyzeBtn = document.getElementById('analyze');
  const input = document.getElementById('input');
  const mode = document.getElementById('mode');

  let priceAdjustment = 0.1;

  mode.addEventListener('change', (e) => {
    if (e.target.value == 'most-profit') {
      priceAdjustment = 0.05;
    } else {
      priceAdjustment = 0.1;
    }
  });

  analyzeBtn.addEventListener('click', () => {
    let inputStr = '';

    if (input.value.trim().length == 0) {
      alert(`Error: There's nothing in the "analyze" box!`);
    } else {
      inputStr = input.value;
      const lines = inputStr.split('\n');

      ///////////////////////
      let searcher = new Searcher(lines);
      searcher.search();

      // Calculate shipping average
      let shippingAverage = 0.0;

      searcher.shippingCosts.forEach((v) => {
        shippingAverage += v;
      });

      shippingAverage /= searcher.shippingCosts.length;

      // Calculate avearge price
      let priceAverage = 0.0;

      searcher.prices.forEach((v) => {
        priceAverage += v;
      });

      priceAverage /= searcher.prices.length;

      // Calculate the recommended price
      let recommendedPrice = priceAverage - priceAverage * priceAdjustment;

      shippingAverage = shippingAverage.toPrecision(
        shippingAverage.toString().indexOf('.') + 2
      );

      priceAverage = priceAverage.toPrecision(
        priceAverage.toString().indexOf('.') + 2
      );
      recommendedPrice = recommendedPrice.toPrecision(
        recommendedPrice.toString().indexOf('.') + 2
      );

      document.getElementById('average-shipping').innerHTML =
        'Average Shipping Cost: $' + shippingAverage.toString();

      document.getElementById('average-price').innerHTML =
        'Average Price: $' + priceAverage.toString();

      document.getElementById('recommended-price').innerHTML =
        'Recommended Price: $' + recommendedPrice.toString();

      if (results.style.display == 'none') {
        results.style.display = 'block';
      }

      window.scrollTo(0, 400);
    }
  });
});
