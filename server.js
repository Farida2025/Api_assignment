require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

const REST_COUNTRIES_API_KEY = process.env.REST_COUNTRIES_API_KEY;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', async (req, res) => {
  try {
    const userRes = await axios.get('https://randomuser.me/api/');
    const user = userRes.data.results[0];

    const countryName = user.location.country;

    const userData = {
      firstName: user.name.first,
      lastName: user.name.last,
      gender: user.gender,
      age: user.dob.age,
      dob: user.dob.date,
      city: user.location.city,
      country: countryName,
      address: `${user.location.street.name}, ${user.location.street.number}`,
      picture: user.picture.large
    };
    const countryRes = await axios.get(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    const country = countryRes.data[0];

    const currencyCode = country.currencies
      ? Object.keys(country.currencies)[0]
      : 'N/A';

    const countryData = {
      name: country.name?.common || 'Not available',
      capital: country.capital?.[0] || 'Not available',
      languages: country.languages
        ? Object.values(country.languages).join(', ')
        : 'Not available',
      currency: currencyCode,
      flag: country.flags?.png || ''
    };
    let exchangeData = {
      usd: 'Not available',
      kzt: 'Not available'
    };

    if (currencyCode !== 'N/A') {
      const exchangeRes = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${currencyCode}`
      );

      exchangeData.usd = exchangeRes.data.conversion_rates?.USD || 'N/A';
      exchangeData.kzt = exchangeRes.data.conversion_rates?.KZT || 'N/A';
    }
    const newsRes = await axios.get(
      `https://newsapi.org/v2/everything?q=${countryName}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`
    );

    const newsData = newsRes.data.articles.map(article => ({
      title: article.title || 'No title',
      description: article.description || 'No description',
      image: article.urlToImage,
      url: article.url
    }));

    res.json({
      user: userData,
      country: countryData,
      exchange: exchangeData,
      news: newsData
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
