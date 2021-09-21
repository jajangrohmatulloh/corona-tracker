const containerGlobal = Array.from(document.getElementsByClassName('container-global')[0].children);
const containerIndonesia = Array.from(document.getElementsByClassName('container-indonesia')[0].children);
const tableBody = document.getElementsByClassName('table-body')[0];
const dropbtn = document.getElementsByClassName('dropbtn')[0];
const dropdownList = document.getElementsByClassName('dropdown-list')[0];
const dropFilter = document.getElementsByClassName('dropdown-filter')[0];

let globalConfirmed = 0;
let globalRecovered = 0;
let globalDeaths = 0;

let indonesiaConfirmed = 0;
let indonesiaRecovered = 0;
let indonesiaDeaths = 0;

let contentDropdown = '';
let filter = [];

getGlobalData();
getIndonesiaData();
getCountryData('china');
getCountryList();

document.addEventListener('click', function (e) {
    if (e.target.className == 'dropbtn' ||
        e.target.className == 'dropdown-list' ||
        !e.target.id == '') {
        return;
    }
    else {
        dropdownList.classList.remove('appear');
        dropFilter.classList.remove('dropappear');
    }
});

dropbtn.addEventListener('click', function () {
    dropdownList.classList.toggle('appear');
    dropFilter.classList.toggle('dropappear');
})

dropdownList.addEventListener('click', function (e) {
    getCountryData(e.target.id);

    dropbtn.innerHTML = e.target.id;
    document.querySelector('.header-countries span')
        .innerHTML = e.target.id;

    dropdownList.classList.toggle('appear');
    dropFilter.classList.toggle('dropappear');
})

dropFilter.addEventListener('keyup', function (e) {
    fetch('https://covid19.mathdro.id/api/countries')
        .then(response => response.json())
        .then(result => {
            // filter = result.countries.filter((el) => {
            //     return el.name.toLowerCase().includes(e.target.value.toLowerCase());
            // });

            contentDropdown = filter.map(el => {
                return `<div id="${el.name}">${el.name}</div>`
            })

            dropdownList.innerHTML = contentDropdown.join('')
        })
});

function getGlobalData() {
    fetch('https://covid19.mathdro.id/api')
        .then(response => response.json())
        .then(result => {
            globalConfirmed = new Intl.NumberFormat().format(result.confirmed.value);
            globalRecovered = new Intl.NumberFormat().format(result.recovered.value);
            globalDeaths = new Intl.NumberFormat().format(result.deaths.value);

            const globalData = [globalConfirmed, globalRecovered, globalDeaths];

            containerGlobal.forEach((el, i) => {
                const elGlobalData = el.getElementsByTagName('h2')[0];

                if (globalData[i] == 0)
                    globalData[i] = 'No Data';

                elGlobalData.append(globalData[i]);
            });
        })
        .catch(err => alert("Sorry can't retrieve data at this time"));
}

function getIndonesiaData() {
    fetch('https://covid19.mathdro.id/api/countries/indonesia')
        .then(response => response.json())
        .then(result => {
            indonesiaConfirmed = new Intl.NumberFormat().format(result.confirmed.value);
            indonesiaRecovered = new Intl.NumberFormat().format(result.recovered.value);
            indonesiaDeaths = new Intl.NumberFormat().format(result.deaths.value);

            const indonesiaData = [indonesiaConfirmed, indonesiaRecovered, indonesiaDeaths];

            containerIndonesia.forEach((el, i) => {
                const elIndonesiaData = el.getElementsByTagName('h2')[0];

                if (indonesiaData[i] == 0)
                    indonesiaData[i] = 'No Data';

                elIndonesiaData.append(indonesiaData[i]);
            });
        })
        .catch(err => alert("Sorry can't retrieve data at this time"));
}

function getCountryData(country) {
    fetch(`https://covid19.mathdro.id/api/countries/${country}/confirmed`)
        .then(response => response.json())
        .then(result => {
            contentTablebody = result.map((el, i) => {
                return `<div>${i + 1}</div>
            <div>${el.provinceState == null ? 'No Data' : el.provinceState}</div>
            <div>${el.confirmed}</div>
            <div>${el.recovered == null ? 'No Data' : el.recovered}</div>
            <div>${el.deaths}</div>`
            })

            tableBody.innerHTML =
                `<div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        ${contentTablebody.join('')}`;
        })
        .catch(err => alert("Sorry can't retrieve data at this time"));
}

function getCountryList(filter) {
    fetch('https://covid19.mathdro.id/api/countries')
        .then(response => response.json())
        .then(result => {
            if (!filter == '') {

            }
            contentDropdown = result.countries.map((el) => {
                return `<div id="${el.name}">${el.name}</div>`
            });

            dropdownList.innerHTML = contentDropdown.join('')
        })
        .catch(err => alert("Sorry can't retrieve data at this time"));
}

