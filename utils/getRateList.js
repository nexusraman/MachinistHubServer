import rateList from '../utils/RateList'; // Adjust path accordingly

function getRate(clientName, size) {
  const clientKey = clientName.toLowerCase();
  const rates = rateList[clientKey] || {};
  return rates[size] || 0;
}
