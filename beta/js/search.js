'use strict';

class Searcher {
  shippingCosts = [];
  prices = [];
  lines = [];
  startSearching = false;

  constructor(lines) {
    this.lines = lines;
  }

  search() {
    this.lines.forEach((v) => {
      // Start the search when the "apply" and "filter" key words are in the line
      if (!this.startSearching) {
        if (v.indexOf('apply') != -1 && v.indexOf('filter') != -1) {
          this.startSearching = true;
        }
      }

      // Once we can get the price data
      if (this.startSearching) {
        // Get all of the shipping costs
        if (v.indexOf('+$') != -1 && v.indexOf('shipping') != -1) {
          let shippingStr = v.substring(
            v.indexOf('$') + 1,
            v.indexOf(' shipping')
          );
          this.shippingCosts.push(parseFloat(shippingStr));
        }

        // Get the pricing data
        if (
          v.indexOf('$') != -1 &&
          v.indexOf('shipping') == -1 &&
          v.indexOf('Was: ') == -1
        ) {
          let priceStr = 0;

          if (v.indexOf(' to ') == -1) {
            priceStr = v.substring(v.indexOf('$') + 1, v.length - 1);

            if (v.indexOf('%') != -1) {
              priceStr = v.substring(v.indexOf('$') + 1, v.indexOf('%') - 2);
            }
          } else {
            priceStr = v.substring(v.indexOf('$') + 1, v.indexOf(' to'));
          }

          priceStr = priceStr.replace(',', '');

          if (priceStr.indexOf('with coupo') == -1) {
            this.prices.push(parseFloat(priceStr));
          }
        }
      }
    });
  }
}

export default Searcher;
