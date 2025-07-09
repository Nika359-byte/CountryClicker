document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const country = params.get("country");

  const titleEl = document.getElementById("title");
  const infoContainer = document.getElementById("countryInfo");

  //page title
  titleEl.textContent = `${country ?? 'Unknown'}`;

  //country info fetch
  async function fetchCountryInfo(countryName) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
      );
      const data = await response.json();
      const c = data[0];

      return {
        commonName: c.name?.common ?? "N/A",
        officialName: c.name?.official ?? "N/A",
        nativeName: Object.values(c.name?.nativeName ?? {})[0]?.common ?? "N/A",
        flagImage: c.flags?.svg ?? "",
        coatOfArmsImage: c.coatOfArms?.svg ?? "",
        capital: c.capital?.[0] ?? "N/A",
        currency: Object.values(c.currencies ?? {})[0]?.name ?? "N/A",
        region: c.region ?? "N/A",
        landlocked: c.landlocked ? "Yes" : "No",
        borders: c.borders?.join(", ") ?? "None",
        demonym: c.demonyms?.eng?.m ?? "N/A",
        population: c.population?.toLocaleString() ?? "N/A",
        continent: c.continents?.[0] ?? "N/A",
        carSide: c.car?.side ?? "N/A",
      };
    } catch (err) {
      console.error("Error fetching country info:", err);
      return null;
    }
  }

  async function showCountryInfo() {
    const info = await fetchCountryInfo(country);
    if (!info) {
      infoContainer.innerHTML = "<p>Could not load country information.</p>";
      return;
    }

    infoContainer.innerHTML = `
      <div class="country-details">
        <div class="info-text">
          <p><strong>Official Name:</strong> ${info.officialName}</p>
          <p><strong>Common Name:</strong> ${info.commonName}</p>
          <p><strong>Native Name:</strong> ${info.nativeName}</p>
          <p><strong>Capital:</strong> ${info.capital}</p>
          <p><strong>Currency:</strong> ${info.currency}</p>
          <p><strong>Region:</strong> ${info.region}</p>
          <p><strong>Landlocked:</strong> ${info.landlocked}</p>
          <p><strong>Borders:</strong> ${info.borders}</p>
          <p><strong>Demonym:</strong> ${info.demonym}</p>
          <p><strong>Population:</strong> ${info.population}</p>
          <p><strong>Continent:</strong> ${info.continent}</p>
          <p><strong>Drives on the:</strong> ${info.carSide}</p>
        </div>

        <div class="info-images">
          <img id="flag" src="${info.flagImage}" alt="Country Flag">
          ${info.coatOfArmsImage 
            ? `<img id="coatOfArms" src="${info.coatOfArmsImage}" alt="The is no Coat of Arms for this country">`
            : "<p>No Coat of Arms image available</p>"}
        </div>
      </div>
    `;
  }

  if (country) {
    showCountryInfo();
  } else {
    infoContainer.textContent = "No country specified in URL.";
  }


  //country title
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

//backtotop button
 const backToTopBtn = document.getElementById("backToTop");

titleEl.addEventListener("click", () => {
  if (infoContainer) {
    infoContainer.scrollIntoView({ behavior: "smooth" });

    
    backToTopBtn.style.display = "block";
  }
});

const header = document.querySelector(".header");

backToTopBtn.addEventListener("click", () => {
  if (header) {
    header.scrollIntoView({ behavior: "smooth" });

    const checkIfHeaderVisible = setInterval(() => {
      const headerTop = header.getBoundingClientRect().top;
      if (headerTop >= 0 && headerTop <= 10) {
        backToTopBtn.style.display = "none";
        clearInterval(checkIfHeaderVisible);
      }
    }, 100);
  }
});
});

//backtoindex button
document.getElementById("backToIndex").addEventListener("click", () => {
  window.location.href = "index.html";
});