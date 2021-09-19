const containerGlobal = Array.from(document.getElementsByClassName('container-global')[0].children);
const containerIndonesia = Array.from(document.getElementsByClassName('container-indonesia')[0].children);

let globalConfirmed = 0;
let globalRecovered = 0;
let globalDeaths = 0;

let indonesiaConfirmed = 0;
let indonesiaRecovered = 0;
let indonesiaDeaths = 0;

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
const tableBody = document.getElementsByClassName('table-body')[0];
fetch('https://covid19.mathdro.id/api/countries/china/confirmed')
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


const dropbtn = document.getElementsByClassName('dropbtn')[0];
const dropdownList = document.getElementsByClassName('dropdown-list')[0];
fetch('https://covid19.mathdro.id/api/countries')
    .then(response => response.json())
    .then(result => {
        contentDropdown = result.countries.map((el) => {
            return `<div id="${el.name}">${el.name}</div>`
        });

        dropdownList.innerHTML = contentDropdown.join('')
    })
dropbtn.addEventListener('click', function (e) {
    dropdownList.classList.toggle('appear');
})

dropdownList.addEventListener('click', function (e) {
    fetch(`https://covid19.mathdro.id/api/countries/${e.target.id}/confirmed`)
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

            dropbtn.innerHTML = e.target.id;
            document.querySelector('.header-countries span')
                .innerHTML = e.target.id;
            dropdownList.classList.toggle('appear');
        })
})

document.addEventListener('click', function (e) {
    console.log(e)
    if (e.target.className == 'dropbtn' || e.target.className == 'dropdown-list' ||
        !e.target.id == '') {
        return;
    }
    else {
        dropdownList.classList.remove('appear');
    }
})

const dropFilter = document.getElementsByClassName('dropdown-filter')[0];

dropFilter.addEventListener('keyup', function (e) {
    fetch('https://covid19.mathdro.id/api/countries')
        .then(response => response.json())
        .then(result => {
            // console.log(result.countries)
            let filter = result.countries.filter((el) => {
                return el.name.toLowerCase().includes(e.target.value);
            });

            contentDropdown = filter.map(el => {
                return `<div id="${el.name}">${el.name}</div>`
            })
            console.log(contentDropdown)

            dropdownList.innerHTML = contentDropdown.join('')
        })
})