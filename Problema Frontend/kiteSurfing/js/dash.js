const url_user = "https://5ddbb358041ac10014de140b.mockapi.io/user";
const url_spot = "https://5ddbb358041ac10014de140b.mockapi.io/spot";
const url_fav = 'https://5ddbb358041ac10014de140b.mockapi.io/favourites';
const mymap = L.map('myMap').setView([0, 0], 2);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const mapImg = document.querySelector('.myMap');
const btn = document.querySelector('.logout');
const filterBtn = document.querySelector('.filter');
var spot = [];
var fav = false;
var fav_spot = [];

L.tileLayer(tileUrl, { attribution }).addTo(mymap);

async function fetchApi(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}


var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var queries = queryString.split("=");
var user_Id = queries[1];

class User {
    constructor(email, password, id, avatar, name) {
        this.email = email;
        this.password = password;
        this.id = id;
        this.avatar = avatar;
        this.name = name;
    }

}

fetchApi(url_user + '/' + user_Id).then(response => {
    var user = new User(response.email, response.password, user_Id, response.avatar, response.name);
    var avatar = document.getElementById('avatar');
    // avatar.src = user.avatar; -- link urile nu functioneaza.
});

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

}
class Fav {
    constructor(fav_id, createdAt, spot_id) {
        this.fav_id = fav_id;
        this.createdAt = createdAt;
        this.spot_id = spot_id;
    }
}

function LogoutPopUp() {
    btn.classList.toggle('toggle');
}

function Logout() {
    window.location.href = "index.html";
}

function filterUp() {
    filterBtn.classList.add('filter-toggle');

}

function filterDown() {
    filterBtn.classList.remove('filter-toggle');
}


function makeFav() {
    const favImg = document.getElementById('star');
    const favBtn = document.querySelector('.popUpButton');
    if (favImg.src.includes('assets/star-off.png')) {
        favImg.src = 'assets/star-on.png';
        favBtn.classList.add('toggle');
        document.getElementById('popUpButton').innerText = 'REMOVE FROM FAVOURITE';
        fav = true;
    } else {
        favImg.src = 'assets/star-off.png';
        favBtn.classList.remove('toggle');
        document.getElementById('popUpButton').innerText = 'ADD TO FAVOURITE';
    }

}


function uploadTable() {
    fetchApi(url_spot).then(response => {
        fetchApi(url_fav).then(responseFav => {
            for (var k = 0; k < responseFav.length; k++) {
                fav_spot[k] = new Fav(responseFav[k].id, responseFav[k].createdAt, responseFav[k].spot);
            }
            var myTable = document.getElementById("api");
            var mybTable = document.getElementsByTagName('tbody')[0];
            var country = document.getElementById('countryFilter').value || "";
            var wind = parseInt(document.getElementById('windFilter').value) || 0;
            mybTable.innerHTML = "<tr><th>ID</th><th>Name</th><th>Country</th><th>Latitude</th><th>Longitude</th><th>Probability</th><th>Month</th></tr>";
            for (var i = 0; i < response.length; i++) {
                spot[i] = new Spots(i, response[i].id, response[i].name, response[i].country, response[i].lat, response[i].long, response[i].probability, response[i].month, response[i].createdAt);
                if (wind < 1)
                    wind = 100;
                var windProb = parseInt(spot[i].probability);
                if (spot[i].country.toLowerCase().includes(country.toLowerCase()) && windProb <= wind) {
                    var row = document.createElement('tr');
                    for (var j = 0; j < 7; j++) {
                        var dates = [spot[i].spot_id, spot[i].spot_name, spot[i].country, spot[i].latitude, spot[i].longitude, spot[i].probability, spot[i].month];
                        var cell = document.createElement('td');
                        var cellText = document.createTextNode(dates[j]);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    mybTable.appendChild(row);
                }


            }
            var myIcon;
            myIcon = L.icon({
                iconUrl: 'assets/red-pin.svg',
                iconSize: [38, 95],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -76],
                shadowSize: [0, 0],
                shadowAnchor: [0, 0]
            });
            myTable.appendChild(mybTable);
            var favfav = [];
            for (var i = 0; i < mybTable.rows.length; i++) {

                mybTable.rows[i].onclick = function() {
                    for (var z = 0; z < fav_spot.length; z++) {
                        favfav.push(String(fav_spot[z].spot_id));
                    }
                    rowIndex = this.rowIndex;
                    if (rowIndex > 0) {
                        if (favfav.includes(String(this.cells[0].innerHTML))) {
                            fav = true;
                            myIcon = L.icon({
                                iconUrl: 'assets/gold-pin.svg',
                                iconSize: [38, 95],
                                iconAnchor: [22, 94],
                                popupAnchor: [-3, -76],
                                shadowSize: [0, 0],
                                shadowAnchor: [0, 0]
                            });
                        }
                        var lat = this.cells[3].innerHTML;
                        var long = this.cells[4].innerHTML;
                        var latlong = L.latLng(lat, long);
                        var marker = L.marker([0, 0], { icon: myIcon }).addTo(mymap);
                        marker.setLatLng(latlong);
                        mymap.setView([lat, long], 3);
                        marker.bindPopup(`<div class='popUp'>
                    <p class='titlePop'>${this.cells[1].innerHTML}<img src='assets/star-off.png' alt= 'star' id='star' class='star' onclick='makeFav();'/><p> 
                    <p class='insidePop '>${this.cells[2].innerHTML}<p>
                    <p class='insidePop title'>WIND PROBABILITY<p>
                    <p class='insidePop'>${this.cells[5].innerHTML} %<p>
                    <p class='insidePop title'>LATITUDE<p>
                    <p class='insidePop'>${this.cells[3].innerHTML} N<p>
                    <p class='insidePop title'>LONGITUDE<p>
                    <p class='insidePop'>${this.cells[4].innerHTML} W<p>
                    <p class='insidePop title'>WHEN TO GO<p>
                    <p class='insidePop'>${this.cells[6].innerHTML}<p>
                    <button type="button" class="popUpButton" id='popUpButton' onclick='makeFav();'>ADD TO FAVOURITE</button>
                    <div>`, { maxWidth: 300, closeOnClick: true });


                        if (fav) {
                            const favImg = document.getElementById('star');
                            const favBtn = document.querySelector('.popUpButton');

                            favImg.src = 'assets/star-on.png';
                            favBtn.classList.add('toggle');
                            document.getElementById('popUpButton').innerText = 'REMOVE FROM FAVOURITE';
                        }
                    }
                };

            }
        });
    });
}


uploadTable();