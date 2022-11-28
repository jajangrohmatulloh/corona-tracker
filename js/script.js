const containerGlobal = Array.from(
  document.getElementsByClassName('container-global')[0].children
);
const containerIndonesia = Array.from(
  document.getElementsByClassName('container-indonesia')[0].children
);
const tableBody = document.getElementsByClassName('table-body')[0];
const dropbtn = document.getElementsByClassName('dropbtn')[0];
const dropdownList = document.getElementsByClassName('dropdown-list')[0];
const dropFilter = document.getElementsByClassName('dropdown-filter')[0];
const lastUpdate = document.getElementsByClassName('last-update')[0];

let globalConfirmed, globalRecovered, globalDeaths;
let indonesiaConfirmed, indonesiaRecovered, indonesiaDeaths;

let contentDropdown, filter;

getGlobalData();
getIndonesiaData();
getCountryData('china');
getCountryList('');

document.addEventListener('click', function (e) {
  if (
    e.target.className == 'dropbtn' ||
    e.target.className == 'dropdown-list' ||
    !e.target.id == ''
  ) {
    return;
  } else {
    dropdownList.classList.remove('appear');
    dropFilter.classList.remove('dropappear');
  }
});

dropbtn.addEventListener('click', function () {
  dropdownList.classList.toggle('appear');
  dropFilter.classList.toggle('dropappear');
  dropFilter.focus();
});

dropdownList.addEventListener('click', function (e) {
  getCountryData(e.target.id);

  dropbtn.innerHTML = e.target.id;
  document.querySelector(
    '.header-countries p'
  ).innerHTML = `Data on Coronavirus Cases in ${e.target.id} by Province`;

  dropdownList.classList.toggle('appear');
  dropFilter.classList.toggle('dropappear');
});

dropFilter.addEventListener('keyup', function (e) {
  getCountryList(e.target.value);
});

function getGlobalData() {
  fetch('https://covid19.mathdro.id/api')
    .then((response) => response.json())
    .then((result) => {
      globalConfirmed = new Intl.NumberFormat().format(result.confirmed.value);
      globalRecovered = new Intl.NumberFormat().format(result.recovered.value);
      globalDeaths = new Intl.NumberFormat().format(result.deaths.value);

      const globalData = [globalConfirmed, globalRecovered, globalDeaths];

      containerGlobal.forEach((el, i) => {
        const elGlobalData = el.getElementsByTagName('h2')[0];

        if (globalData[i] == 0) globalData[i] = 'No Data';

        elGlobalData.append(globalData[i]);
      });
    })
    .catch((err) => alert("Sorry can't retrieve data at this time"));
}

function getIndonesiaData() {
  fetch('https://covid19.mathdro.id/api/countries/indonesia')
    .then((response) => response.json())
    .then((result) => {
      indonesiaConfirmed = new Intl.NumberFormat().format(
        result.confirmed.value
      );
      indonesiaRecovered = new Intl.NumberFormat().format(
        result.recovered.value
      );
      indonesiaDeaths = new Intl.NumberFormat().format(result.deaths.value);

      const indonesiaData = [
        indonesiaConfirmed,
        indonesiaRecovered,
        indonesiaDeaths,
      ];

      containerIndonesia.forEach((el, i) => {
        const elIndonesiaData = el.getElementsByTagName('h2')[0];

        if (indonesiaData[i] == 0) indonesiaData[i] = 'No Data';

        elIndonesiaData.append(indonesiaData[i]);
      });
    })
    .catch((err) => alert("Sorry can't retrieve data at this time"));
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
