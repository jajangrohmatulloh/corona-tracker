const containerGlobal = Array.from(
  document.getElementsByClassName('container-global')[0].children
);
const containerIndonesia = Array.from(
  document.getElementsByClassName('container-indonesia')[0].children
);
const tableBody = document.getElementsByClassName('table-body')[0];
// const dropbtn = document.getElementsByClassName('dropbtn')[0];
// const dropdownList = document.getElementsByClassName('dropdown-list')[0];
const dropFilter = document.getElementsByClassName('dropdown-filter')[0];
const lastUpdate = document.getElementsByClassName('last-update')[0];
const tabs = document.querySelectorAll('.tab');

let globalConfirmed, globalRecovered, globalDeaths;
let indonesiaConfirmed, indonesiaRecovered, indonesiaDeaths;

let contentDropdown, filter;

let countriesData, filteredCountries;

let continent = 'All';
let keyword = '';

const toNumber = new Intl.NumberFormat().format;

async function initializeData() {
  getGlobalData();
  await getCountriesData();
  insertDataToTable(continent, keyword);
  // getCountryData('china');
  // getCountryList('');
}

initializeData();

document.addEventListener('click', function (e) {
  if (
    e.target.className == 'dropbtn' ||
    e.target.className == 'dropdown-list' ||
    !e.target.id == ''
  ) {
    return;
  } else {
    // dropdownList.classList.remove('appear');
    // dropFilter.classList.remove('dropappear');
  }
});

tabs.forEach((el) => {
  el.addEventListener('click', function (e) {
    tabs.forEach((tab) => tab.classList.remove('active'));
    e.target.classList.add('active');

    continent = e.target.dataset.continent;
    insertDataToTable(continent, keyword);
  });
});

// dropbtn.addEventListener('click', function () {
//   dropdownList.classList.toggle('appear');
//   dropFilter.classList.toggle('dropappear');
//   dropFilter.focus();
// });

// dropdownList.addEventListener('click', function (e) {
//   getCountryData(e.target.id);

//   dropbtn.innerHTML = e.target.id;
//   document.querySelector(
//     '.header-countries p'
//   ).innerHTML = `Data on Coronavirus Cases in ${e.target.id} by Province`;

//   dropdownList.classList.toggle('appear');
//   dropFilter.classList.toggle('dropappear');
// });

dropFilter.addEventListener('keyup', function (e) {
  // getCountryList(e.target.value);
  keyword = e.target.value;
  insertDataToTable(continent, keyword);
});

function getGlobalData() {
  fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((result) => {
      globalConfirmed = result.cases === 0 ? 'N/A' : toNumber(result.cases);
      globalRecovered =
        result.recovered === 0 ? 'N/A' : toNumber(result.recovered);
      globalDeaths = result.deaths === 0 ? 'N/A' : toNumber(result.deaths);

      const globalData = [globalConfirmed, globalRecovered, globalDeaths];

      containerGlobal.forEach((el, i) => {
        const elGlobalData = el.getElementsByTagName('h2')[0];

        // if (globalData[i] == 0) globalData[i] = 'No Data';

        elGlobalData.append(globalData[i]);
      });
    })
    .catch((err) => alert("Sorry can't retrieve data at this time"));
}

async function getCountriesData() {
  try {
    const response = await fetch('https://disease.sh/v3/covid-19/countries', {
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await response.json();
    countriesData = result;

    const indonesiaData = countriesData.filter((obj) => {
      return obj.country === 'Indonesia';
    })[0];

    indonesiaConfirmed =
      indonesiaData.cases === 0 ? 'N/A' : toNumber(indonesiaData.cases);
    indonesiaRecovered =
      indonesiaData.recovered === 0 ? 'N/A' : toNumber(indonesiaData.recovered);
    indonesiaDeaths =
      indonesiaData.deaths === 0 ? 'N/A' : toNumber(indonesiaData.deaths);

    const indonesiaDataCollection = [
      indonesiaConfirmed,
      indonesiaRecovered,
      indonesiaDeaths,
    ];

    containerIndonesia.forEach((el, i) => {
      const elIndonesiaData = el.getElementsByTagName('h2')[0];

      // if (indonesiaDataCollection[i] == 0) indonesiaDataCollection[i] = 'N/A';

      elIndonesiaData.append(indonesiaDataCollection[i]);
    });
  } catch (error) {
    // alert("Sorry can't retrieve data at this time");
  }
}

function insertDataToTable(continent, keyword) {
  //   let time = result[0].lastUpdate;

  filteredCountries =
    continent === 'All' && keyword === ''
      ? countriesData
      : countriesData.filter(
          (obj) =>
            (continent === 'All' || obj.continent === continent) &&
            obj.country.toLowerCase().includes(keyword.toLowerCase())
        );

  let contentTablebody = filteredCountries.map((obj, i) => {
    const country = obj.country;

    const cases = obj.cases === 0 ? 'N/A' : toNumber(obj.cases);
    const recovered = obj.recovered === 0 ? 'N/A' : toNumber(obj.recovered);
    const deaths = obj.deaths === 0 ? 'N/A' : toNumber(obj.deaths);

    return `<div>${i + 1}</div>
            <div>${country == null ? 'No Data' : country}</div>
            <div>${cases}</div>
            <div>${recovered == null ? 'No Data' : recovered}</div>
            <div>${deaths}</div>`;
  });

  tableBody.innerHTML = `${contentTablebody.join('')}`;
  //   lastUpdate.innerHTML = `Last Update: ${new Date(time)}`;
}

function getCountryData(country) {
  tableBody.innerHTML = `<span class="loading"></span>`;

  fetch(`https://covid19.mathdro.id/api/countries/${country}/confirmed`)
    .then((response) => response.json())
    .then((result) => {
      let time = result[0].lastUpdate;
      let contentTablebody = result.map((el, i) => {
        return `<div>${i + 1}</div>
            <div>${
              el.provinceState == null ? 'No Data' : el.provinceState
            }</div>
            <div>${el.confirmed}</div>
            <div>${el.recovered == null ? 'No Data' : el.recovered}</div>
            <div>${el.deaths}</div>`;
      });

      tableBody.innerHTML = `${contentTablebody.join('')}`;
      lastUpdate.innerHTML = `Last Update: ${new Date(time)}`;
    })
    .catch((err) => alert("Sorry can't retrieve data at this time"));
}

function getCountryList(keyword) {
  fetch('https://covid19.mathdro.id/api/countries')
    .then((response) => response.json())
    .then((result) => {
      filter = result.countries.filter((el) => {
        return el.name.toLowerCase().includes(keyword.toLowerCase());
      });

      contentDropdown = filter.map((el) => {
        return `<div id="${el.name}">${el.name}</div>`;
      });

      dropdownList.innerHTML = contentDropdown.join('');
    })
    .catch((err) => alert("Sorry can't retrieve data at this time"));
}
