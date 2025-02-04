/* Load the data and  get the json file
*/
async function loadLitterTrackData () {
    const url = 'https://data.princegeorgescountymd.gov/resource/9tsa-iner.json';
    const data = await fetch(url);
    const json = await data.json();
    return json;
}

/*
inject the type of litter into the website 
*/
function injectHTML(inputValue) {
    // console.log('fired injectHTML');
    // console.log(inputValue);
    const target = document.querySelector('#Type_of_Litter');
    target.innerHTML = inputValue;
  
    // const typeLitter = document.createElement('ol');
    // target.appendChild(inputValue);

}


/*
Filter for the litter when user input the type of litter
Arguments: array and imputValue
return: the index of the array that coresponse with the inputValue
*/
function filterTypeOfLitter(array, inputValue) {
    indexArray = [];
    for(let i=0 ; i< array.length; i++) {
        typeArray = array[i]['type_litter'].split(',');
        let newArray2 =[]
        typeArray.forEach((item) => {
            if (item.includes('_')) {
                let newString = item.replace('_',' ');
                newArray2.push(newString.toLowerCase());
            } else {
                newArray2.push(item.toLowerCase())
            }
        })
        if (newArray2.includes(inputValue.toLowerCase())) {
            indexArray.push(i);
        }
    }
    return indexArray;
}

/*
Init map to the coordinate of the PG county
*/
function initMap() {
    console.log('initMap');
    const map = L.map('map').setView([38.9897, -76.9378], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map;
  }

function markerPlace(list, array, map) {
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });
    array.forEach((item) => {
        const coordinates = list[item]['geocoded_column'];
            console.log(coordinates);
            L.marker([coordinates['longitude'], coordinates['latitude']]).addTo(map);
            map.setView([coordinates['longitude'],coordinates['latitude']]);
    })
}

async function mainEvent() {
    
    const pageMap = initMap();

    const form = document.querySelector('.main_form');
    form.addEventListener('submit', async (SubmitEvent) => {
        SubmitEvent.preventDefault();
        console.log('form submission');
    });

    console.log('fired main event')
    const result = await loadLitterTrackData();
    console.log('Data load Successfuly', result);



    console.log(Array.isArray(result))

    console.log(result[8])
    console.log(result[8]['type_litter'].split(","));
    let newArray = result[8]['type_litter'].split(",");
    const coordinates = result[8]['geocoded_column'];
    console.log(coordinates);
    console.log(coordinates['latitude']);
    console.log(coordinates['longitude']);




  



    let filteredList = [];
    const stringInput = '';

    form.addEventListener('input', (event) => {
        // console.log(event.target.value);
        filteredList = filterTypeOfLitter(result, event.target.value);
        injectHTML(event.target.value);
        // console.log(filteredList);

    });

    form.addEventListener('submit', (submitEvent) => { 
        submitEvent.preventDefault();
        markerPlace(result, filteredList, pageMap);
    })
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());