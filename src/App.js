import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';
import LocationMarker from './components/LocationMarker';
import L from 'leaflet'; // Importa Leaflet per gestire le icone personalizzate
import { ReactSearchAutocomplete } from 'react-search-autocomplete';


// Definisci l'icona predefinita
const defaultIcon = new L.Icon({
  iconUrl: 'https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png', // Percorso dell'icona predefinita
  iconSize: [32, 32],
});

function App() {
  const [dataCity, setDataCity] = useState({
    cityName: "",
    street: "",
    country: "",
    state: "",
    address_line2: "",
    pin: ""
  });
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [zoom, setZoom] = useState(2);
  // const [searchResults, setSearchResults] = useState([]);


  const API_KEY = "15a08997377e45a18329ad97763ac114";

  // Array di città che compaiono nell'autocomplete e corrispondono alle città degli alertMap
  const cities = [
    {
      id: 0,
      name: "Bergamo",
      position: [45.695000, 9.670000],
      state: "Lombardia",
      country: "Italy",
      region: "Europe",
      location: "Southern Europe"
    },
    {
      id: 1,
      name: "Milano",
      position: [45.464664, 9.188540],
      state: "Lombardia",
      country: "Italy",
      region: "Europe",
      location: "Southern Europe"
    },
    {
      id: 2,
      name: "Torino",
      position: [45.0703, 7.6869],
      state: "Piemonte",
      country: "Italy",
      region: "Europe",
      location: "Southern Europe"
    },
    {
      id: 3,
      name: "Roma",
      position: [41.9028, 12.4964],
      state: "Lazio",
      country: "Italy",
      region: "Europe",
      location: "Southern Europe"
    },
    {
      id: 4,
      name: "New York",
      position: [40.7128, -74.0060],
      state: "New York",
      country: "United States",
      region: "North America",
      location: "Northern America"
    },
    {
      id: 5,
      name: "Londra",
      position: [51.5074, -0.1278],
      state: "Greater London",
      country: "United Kingdom",
      region: "Europe",
      location: "Northern Europe"
    }
  ];



  // Array di oggetti di coordinate per i marker con le rispettive icone => Alert Map
  const markers = [
    {
      position: [40.779897, -73.968565],
      info: {
        title: "Alarm Crime",
        category: "Security",
        subCategory: "Crime",
        typology: "Information",
        sector: "Security",
        RiskLevel: "High",
        eventData: "22-07-2024",
        description: "Omicide",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/incident/typologyicon-65e052bbd83e27019fa127a6.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e04903d83e27019fa12780.jpg"
      }
    },
    {
      position: [51.505, -0.09],
      info: {
        title: "Sciopero dei trasporti",
        category: "Travel Warning",
        subCategory: "Veichles",
        typology: "Information",
        sector: "Transport & Logistics",
        RiskLevel: "Medium",
        eventData: "22-07-2024",
        description: "Disagi per tutta la giornata causa sciopero dei trasporti. A rischio anche le fasce garantite.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e04903d83e27019fa12780.jpg"
      }
    },
    {
      position: [45.0903, 7.6869], // Torino
      info: {
        title: "Sciopero dei trasporti",
        category: "Travel Warning",
        subCategory: "Veichles",
        typology: "Information",
        sector: "Transport & Logistics",
        RiskLevel: "Medium",
        eventData: "22-07-2024",
        description: "Disagi per tutta la giornata causa sciopero dei trasporti. A rischio anche le fasce garantite.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/natural%20disaster/typologyicon-65e0426cd83e27019fa1273c.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e04903d83e27019fa12780.jpg"
      }
    },
    {
      position: [45.4642, 9.2100], // Milano
      info: {
        title: "Sciopero dei trasporti",
        category: "Travel Warning",
        subCategory: "Veichles",
        typology: "Information",
        sector: "Transport & Logistics",
        RiskLevel: "Medium",
        eventData: "22-07-2024",
        description: "Disagi per tutta la giornata causa sciopero dei trasporti. A rischio anche le fasce garantite.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/natural%20disaster/typologyicon-65e0426cd83e27019fa1273c.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e04903d83e27019fa12780.jpg"
      }
    },
    {
      position: [41.9858, 12.5000], // Roma
      info: {
        title: "Incendio Discarica",
        category: "Travel Warning",
        subCategory: "Veichles",
        typology: "Information",
        sector: "Transport & Logistics",
        RiskLevel: "High",
        eventData: "13-11-2024",
        description: "Disagi causa incendio discarica centrale.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [45.5646, 9.1900], // Milano
      info: {
        title: "Incendio in Centro",
        category: "Emergency",
        subCategory: "Fire",
        typology: "Information",
        sector: "Emergency Services",
        RiskLevel: "High",
        eventData: "25-07-2024",
        description: "Grande incendio nel centro città.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/incident/typologyicon-65e052bbd83e27019fa127a6.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [41.9028, 12.4964], // Roma
      info: {
        title: "Allerta Meteo",
        category: "Weather Warning",
        subCategory: "General",
        typology: "Information",
        sector: "Weather",
        RiskLevel: "Medium",
        eventData: "28-07-2024",
        description: "Prevista pioggia intensa per le prossime 24 ore.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/incident/typologyicon-65e052bbd83e27019fa127a6.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [45.0703, 7.6869], // Torino
      info: {
        title: "Emergenza Traffico",
        category: "Traffic Alert",
        subCategory: "Congestion",
        typology: "Information",
        sector: "Transport & Logistics",
        RiskLevel: "High",
        eventData: "30-07-2024",
        description: "Gravi rallentamenti sulla tangenziale a causa di un incidente.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [51.5994, -0.1278], // Londra
      info: {
        title: "Inondazioni Costiere",
        category: "Weather Warning",
        subCategory: "Flood",
        typology: "Information",
        sector: "Weather",
        RiskLevel: "Medium",
        eventData: "02-08-2024",
        description: "Possibili inondazioni costiere a causa dell'alta marea.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/incident/typologyicon-65e052bbd83e27019fa127a6.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [40.8228, -74.060], // New York
      info: {
        title: "Allarme Terrorismo",
        category: "Security Alert",
        subCategory: "Terrorism",
        typology: "Warning",
        sector: "Security",
        RiskLevel: "High",
        eventData: "05-08-2024",
        description: "Possibile attacco terroristico in prossimità della zona finanziaria.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [40.779434, -73.963402], // New York museum
      info: {
        title: "Attacco al museo",
        category: "Security Alert",
        subCategory: "Terrorism",
        typology: "Warning",
        sector: "Security",
        RiskLevel: "High",
        eventData: "05-08-2024",
        description: "Possibile attacco terroristico in prossimità della zona del museo.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [45.4766974, 9.1205017], // San Siro (inserito indirizzo del piazzale)
      info: {
        title: "Attacco a San Siro",
        category: "Security Alert",
        subCategory: "Terrorism",
        typology: "Warning",
        sector: "Security",
        RiskLevel: "High",
        eventData: "05-08-2024",
        description: "Possibile attacco terroristico in prossimità della zona dello stadio San Siro.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [45.6692407, 9.7016651], // Areoporto Bergamo (inserito indirizzo)
      info: {
        title: "Attacco areoporto",
        category: "Security Alert",
        subCategory: "Terrorism",
        typology: "Warning",
        sector: "Security",
        RiskLevel: "High",
        eventData: "05-08-2024",
        description: "Possibile attacco terroristico in prossimità della zona dell'areoporto di Bergamo.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    },
    {
      position: [45.6105158, 9.2333152], // Beije (inserito indirizzo)
      info: {
        title: "Attacco in corso...",
        category: "Security Alert",
        subCategory: "Terrorism",
        typology: "Warning",
        sector: "Security",
        RiskLevel: "High",
        eventData: "05-08-2024",
        description: "Possibile attacco terroristico in prossimità della zona della sede di Beije.",
        iconUrl: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/information/typologyicon-65df67ffd83e27019fa12734.png",
        file: "https://kriptia-dev.s3.eu-south-1.amazonaws.com/alert-map/alertmapfile-65e049bdd83e27019fa12796.pdf"
      }
    }
  ];



  // Funziona usata senza autocomplete
  const handleSearch = async () => {
    try {
      let searchText = '';
      // Formatta la query dinamica sostituendo gli spazi con '+'
      searchText = dataCity.city.replace(/\s+/g, '+');

      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${searchText}&limit=1&language=it&key=${API_KEY}`);
      const data = await response.json();
      console.log("data", data)
      if (data.results.length > 0) {
        const { country, street, state, road, city, town, village, continent, county } = data.results[0].components;
        const { lat, lng } = data.results[0].geometry;
        setDataCity({ ...dataCity, country, state, street: `${city} ${street}`, address_line2: road ? road : continent, cityName: city ? city : town ? town : village ? village : county });
        setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lng) });
        setZoom(12);
      } else {
        console.log('Location not found');
        setCoordinates(null); // Resetta le coordinate se la città non è stata trovata
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  // Chiamata all'API Reverse Geocoding
  const fetchCityFromCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat},+${lon}&limit=1&language=it&key=${API_KEY}`);
      const data = await response.json();
      console.log("data", data)
      // Estrai il nome della città dalla risposta e imposta lo stato della città
      if (data.results.length > 0) {
        const cityName = data.results[0].components.city ? data.results[0].components.city : data.results[0].components.town ? data.results[0].components.town : data.results[0].components.village;
        const continent = data.results[0].components.continent;
        setDataCity({ ...dataCity, pin: cityName, address_line2: continent });
      }
    } catch (error) {
      console.error('Error fetching city:', error);
    }
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>City: {item.name}</span>
      </>
    )
  }

  // Funzione per gestire la ricerca nell'autocompletamento
  const handleOnSearch = (string, results) => { };

  // Funzione per gestire la selezione di una città dall'autocompletamento
  const handleSelect = (city) => {
    console.log(city)
    setDataCity({ ...dataCity, cityName: city.name, country: city.country, address_line2: city.location, state: city.region });
    setCoordinates({ lat: city.position[0], lon: city.position[1] });
    setZoom(12);
  };


  return (
    <div className="map">
      {/* <input
        type="text"
        placeholder="Enter city name"
        value={dataCity.city}
        onChange={(e) => setDataCity({ ...dataCity, address_line2: "", country: "", state: "", city: e.target.value })}
      />
      <button onClick={handleSearch}>Search</button> */}
      <div style={{ marginBottom: "50px", zIndex: 999, position: "relative" }}>
        <ReactSearchAutocomplete
          items={cities}
          onSelect={handleSelect}
          onSearch={handleOnSearch}
          autoFocus
          placeholder="Search for a city..."
          inputClass="search-input"
          resultClass="search-result"
          showNoResultsText="No alerts for this location"
          formatResult={formatResult}
          fuseOptions={{ keys: ["name"], threshold: 0.1 }} // Imposta la ricerca solo sul campo "name"
        />
      </div>

      <MapContainer center={[51.505, -0.09]} zoom={zoom} style={{ height: '700px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates && (
          <>
            <LocationMarker coordinates={coordinates} />
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                icon={marker.info.iconUrl ? new L.Icon({ iconUrl: marker.info.iconUrl, iconSize: [32, 32] }) : defaultIcon}
                eventHandlers={{
                  click: () => {
                    // Quando il marker viene cliccato, chiama la funzione per trovare la città corrispondente
                    fetchCityFromCoordinates(marker.position[0], marker.position[1]);
                  },
                }}
              >
                <Popup>
                  <h3>{marker.info.title}</h3>
                  <p>City: {dataCity.pin}</p>
                  <p>Type: {marker.info.typology}</p>
                  <p>Sector: {marker.info.sector}</p>
                  <p>Category: {marker.info.category}</p>
                  <p>Subcategory: {marker.info.subCategory}</p>
                  <p>Risk Level: {marker.info.RiskLevel}</p>
                  <p>Description: {marker.info.description}</p>
                  <p>Date: {marker.info.eventData}</p>
                  {marker.info.file && (
                    <a href={marker.info.file} download>
                      <button>Download file or image</button>
                    </a>
                  )}
                </Popup>
              </Marker>
            ))}
            {(coordinates.lat !== 0 && coordinates.lon !== 0) && <Marker position={[coordinates.lat, coordinates.lon]}>
              <Popup>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p> City: {dataCity.cityName}</p>
                  <p> Country: {dataCity.country}</p>
                  <p> Region: {dataCity.state}</p>
                  {dataCity.type === "street" && <p> Adress: {dataCity.street}</p>}
                  <p> Location: {dataCity.address_line2}</p>
                </div>
              </Popup>
            </Marker>}
          </>
        )}
      </MapContainer>
    </div >
  );
}



export default App;
