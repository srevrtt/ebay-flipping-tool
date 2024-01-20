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

      let prices = [];
      let shippingCosts = [];
      let startSearching = false;

      lines.forEach((v, i) => {
        if (!startSearching) {
          if (v.indexOf('apply') != -1 && v.indexOf('filter') != -1) {
            startSearching = true;
          }
        }

        if (startSearching) {
          if (v.indexOf('+$') != -1 && v.indexOf('shipping') != -1) {
            let shippingStr = v.substring(
              v.indexOf('$') + 1,
              v.indexOf(' shipping')
            );
            shippingCosts.push(parseFloat(shippingStr));
          }

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
              prices.push(parseFloat(priceStr));
            }
          }
        }
      });

      // Calculate shipping average
      let shippingAverage = 0.0;

      shippingCosts.forEach((v) => {
        shippingAverage += v;
      });

      shippingAverage /= shippingCosts.length;

      // Calculate avearge price
      let priceAverage = 0.0;

      prices.forEach((v) => {
        priceAverage += v;
      });

      priceAverage /= prices.length;

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
