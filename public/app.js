const btn = document.getElementById('btn');
const content = document.getElementById('content');

btn.addEventListener('click', async () => {
  content.innerHTML = 'Loading...';

  const res = await fetch('/api/data');
  const data = await res.json();

  content.innerHTML = `
    <div class="card">
      <img src="${data.user.picture}">
      <h2>${data.user.firstName} ${data.user.lastName}</h2>
      <p><b>Gender:</b> ${data.user.gender}</p>
      <p><b>Age:</b> ${data.user.age}</p>
      <p><b>Date of birth:</b> ${new Date(data.user.dob).toDateString()}</p>
      <p><b>City:</b> ${data.user.city}</p>
      <p><b>Country:</b> ${data.user.country}</p>
      <p><b>Address:</b> ${data.user.address}</p>
    </div>

    <div class="card">
      <h3>Country Info</h3>
      <img src="${data.country.flag}" width="80">
      <p><b>Capital:</b> ${data.country.capital}</p>
      <p><b>Languages:</b> ${data.country.languages}</p>
      <p><b>Currency:</b> ${data.country.currency}</p>
      <p>1 ${data.country.currency} = ${data.exchange.usd} USD</p>
      <p>1 ${data.country.currency} = ${data.exchange.kzt} KZT</p>
    </div>

    <div class="news">
      <h3>News</h3>
      ${data.news.map(n => `
        <div class="card">
          <h4>${n.title}</h4>
          ${n.image ? `<img src="${n.image}">` : ''}
          <p>${n.description || ''}</p>
          <a href="${n.url}" target="_blank">Read more</a>
        </div>
      `).join('')}
    </div>
  `;
});
