const url = "https://5ddbb358041ac10014de140b.mockapi.io/spot ";
const mymap = L.map('myMap').setView([0, 0], 2);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileUrl, { attribution }).addTo(mymap);
var lat = 0;
var long = 0;
var marker = L.marker([0, 0]).addTo(mymap);
var latlng = L.latLng(lat, long);
var spot = [];

class Spots {
    constructor(array_id, spot_id, spot_name, country, latitude, longitude, probability, month, createdAt) {
        this.array_id = array_id;
        this.spot_id = spot_id;
        this.spot_name = spot_name;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.probability = probability;
        this.month = month;
        this.createdAt = createdAt;

    }

    get LatLong() {
        return [this.getLat(), this.getLong()];
    }

    get ArrayId() {

        return this.array_id;



    }

    getLat() {
        return this.latitude;
    }
    getLong() {
        return this.longitude;
    }
    getSpotName() {
        return this.spot_name;
    }
    getSpotCounty() {
        return this.spot_name;
    }

}
async function findSpot() {
    let response = await fetch(url);
    let data = await response.json();
    for (var i = 0; i < data.length; i++) {
        spot[i] = new Spots(i, data[i].id, data[i].name, data[i].country, data[i].lat, data[i].long, data[i].probability, data[i].month, data[i].createdAt);

    }

    return spot;

}



async function uploadId() {
    let response = await fetch(url);
    let data = await response.json();
    var select = document.getElementById("selectID");
    for (var i = 0; i < data.length; i++) {
        var option = i;
        var element = document.createElement("option");
        element.textContent = option;
        element.value = option;
        select.appendChild(element);
    }
}
uploadId();

function popUp() {
    id = parseInt(document.getElementById('selectID').value)

    findSpot().then(spot => {
        lat = spot[id].getLat();
        long = spot[id].getLong();
        console.log(lat, long);
        var latlong = L.latLng(lat, long);
        marker.setLatLng(latlong);
        mymap.setView([lat, long], 4);
        marker.bindPopup(`<p>Hello world!<br />This is a nice popup in: ${spot[id].getSpotName()} at lat: ${lat} and long: ${long}.</p>`);
    });


}

async function uploadTable() {
    var search = document.getElementById('searchBar').value;
    let response = await fetch(url);
    let data = await response.json();
    var myTable = document.getElementById("api");
    var mybTable = document.getElementsByTagName('tbody')[0];
    mybTable.innerHTML = "<tr><th>ID</th><th>Name</th><th>City</th><th>Latitude</th><th>Longitude</th><th>Month</th></tr>";
    for (var i = 0; i < data.length; i++) {
        if (data[i].country.toLowerCase().includes(search.toLowerCase())) {
            var row = document.createElement('tr');
            for (var j = 0; j < 6; j++) {
                var dates = [data[i].id, data[i].name, data[i].country, data[i].lat, data[i].long, data[i].month];
                var cell = document.createElement('td');
                var cellText = document.createTextNode(dates[j]);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            mybTable.appendChild(row);

        }
    }
    myTable.appendChild(mybTable);

}

document.getElementById("searchBar")
    .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("searchBar").click();
        }
    })

/*fetchAsync(url).then(function(data) {
    document.getElementById('my_id').textContent = data;
    document.getElementById('my_name').textContent = data;
});*/