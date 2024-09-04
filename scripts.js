const listOfCountries = [
  "Mexico",
  "United Kingdom",
  "Italy",
  "Ukraine",
  "Brazil",
  "France",
  "Spain",
  "Japan",
];

let displayedCountries = [];

async function handleSearchEvent(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const inputCity = event.target.value.trim();
    if (inputCity === "") return;

    try {
      const countryData = await getCountry(inputCity);

      if (!listOfCountries.includes(countryData.name.common)) {
        showCountries(countryData);
        displayedCountries.push(countryData.name.common);
      }

      if (!listOfCountries.includes(countryData.name.common)) {
        listOfCountries.push(countryData.name.common);
      }
    } catch (error) {
      console.error("Error in getCountry:", error.message);
    }

    event.target.value = "";
  }
}

async function getCountry(city) {
  const url = `https://restcountries.com/v3.1/name/${city}?fields=name,population,capital,region,flags`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("City in input not found");
  }
  const data = await response.json();
  return data[0];
}

function showCountries(data) {
  const country = data.name.common;
  const population = data.population;
  const region = data.region;
  const capital = data.capital ? data.capital[0] : "No capital";
  const flag = data.flags.svg;

  const countriesContainer = document.getElementById("countriesContainer");

  const card = document.createElement("div");
  card.classList.add("counties__card");
  card.innerHTML = `
    
      <img
        class="counties__card-img"
        src="${flag}"
        alt="flag"
      />
      <div class="counties__card-info">
        <h2>${country}</h2>
        <p><span class="cards-title">Population:</span> ${population}</p>
        <p class="country-region"><span  class="cards-title">Region:</span> ${region}</p>
        <p><span class="cards-title">Capital:</span> ${capital}</p>
      </div>
  `;
  countriesContainer.appendChild(card);
}

regionSelect.addEventListener("change", function () {
  const selectedRegion = this.value.toLowerCase();

  const countryCards = document.querySelectorAll(".counties__card");

  countryCards.forEach((card) => {
    const region = card
      .querySelector(".country-region")
      .textContent.toLowerCase();
    if (selectedRegion === "region" || region.includes(selectedRegion)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});

window.addEventListener("load", async function () {
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  document.body.classList.toggle("darkmode", prefersDarkScheme);

  for (const country of listOfCountries) {
    try {
      const countryData = await getCountry(country);

      if (!displayedCountries.includes(country)) {
        showCountries(countryData);
        displayedCountries.push(country);
      }
    } catch (error) {
      console.error(`Error loading country ${country}:`, error.message);
    }
  }
});

darkModeToggle.addEventListener("change", function () {
  document.body.classList.toggle("darkmode", this.checked);
});

country.addEventListener("keydown", handleSearchEvent);
countryMobile.addEventListener("keydown", handleSearchEvent);
