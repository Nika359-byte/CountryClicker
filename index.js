const API_KEY = "585fe9caf5f3b76aa736ebc1250028e0";

let fullCityData = [];

/*sunrise/sunset*/
async function fetchSunTimes(lat, lng) {
  const resp = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}`);
  const data = await resp.json();
  return {
    sunrise: data.results.sunrise,
    sunset: data.results.sunset,
  };
}

/*weather*/
async function fetchWeather(lat, lon) {
  const resp = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  const w = await resp.json();
  return {
    temp: w.main?.temp?.toFixed(1) ?? "N/A",
    wind: w.wind?.speed?.toFixed(1) ?? "N/A",
    condition: w.weather?.[0]?.description ?? "N/A",
    lastUpdate: new Date(w.dt * 1000).toLocaleString(),
  };
}

/*table*/
async function populateTable(filteredData = null) {
  try {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    const cities = filteredData || fullCityData;

    for (const loc of cities) {
      try {
        const [sun, weather] = await Promise.all([
          fetchSunTimes(loc.lat, loc.lng),
          fetchWeather(loc.lat, loc.lng),
        ]);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${loc.city}</td>
          <td>${loc.country}</td>
          <td>${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</td>
          <td>${sun.sunrise}</td>
          <td>${sun.sunset}</td>
          <td>${weather.condition}</td>
          <td>${weather.temp} °C</td>
          <td>${weather.wind} m/s</td>
          <td>${weather.lastUpdate}</td>
        `;

        tr.addEventListener("click", () => {
          window.location.href = `details.html?city=${encodeURIComponent(loc.city)}&country=${encodeURIComponent(loc.country)}`;
        });

        tbody.appendChild(tr);
      } catch (apiError) {
        console.error(`API error for ${loc.city}:`, apiError);
      }
    }
  } catch (error) {
    console.error("Error loading or building table:", error);
  }
}

async function initialize() {
  try {
    const resp = await fetch("data/countrydata.json");
    const jsonData = await resp.json();
    fullCityData = jsonData.countries.sort((a, b) => a.city.localeCompare(b.city));

    await populateTable();

    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", async (e) => {
      const searchText = e.target.value.trim().toLowerCase();

      if (searchText === "") {
        await populateTable(); 
        return;
      }

      const filtered = fullCityData.filter(
        (item) =>
          item.city.toLowerCase().includes(searchText) ||
          item.country.toLowerCase().includes(searchText)
      );

      await populateTable(filtered);
    });
  } catch (err) {
    console.error("Failed to initialize app:", err);
  }
}

document.addEventListener("DOMContentLoaded", initialize);

/*refresh the data by pressing on title*/
document.querySelectorAll('.mainTitle').forEach(el => {
  el.addEventListener('click', () => {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === '') {
      location.reload();
    } else {
      window.location.href = 'index.html';
    }
  });
});

