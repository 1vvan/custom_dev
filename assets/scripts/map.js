var map = L.map('map', {
    center: [50.4455, 30.5194],
    zoom: 15,
    zoomControl: false,
});


L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    detectRetina: true
}).addTo(map);

document.querySelector('.leaflet-control-container').style.display = 'none';

var darkIcon = L.icon({
    iconUrl: '../../images/map_point.png', // Путь к темной иконке маркера
    iconSize: [32, 32], // Размер иконки
    iconAnchor: [15, 41], // Точка привязки иконки
    popupAnchor: [1, -40], // Точка привязки для попапа относительно иконки
    shadowSize: [41, 41] // Размер тени
});

var marker = L.marker([50.4455, 30.5194], { icon: darkIcon }).addTo(map);

marker.bindPopup("м. Київ, вул. Чикаленка 9Б").openPopup();