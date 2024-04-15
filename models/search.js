import fs from "fs";

import axios from "axios";

class Search {
  history = ["Panamá", "San Jose", "Tegucigalpa"];

  dbPath = "./db/database.json";

  constructor() {
    this.loadDB();
  }

  get capitalizedHistory() { 
    return this.history.map(place => {
      let words = place.split(" ");
      words = words.map(word => word[0].toUpperCase() + word.substring(1));
      return words.join(" ");
    });
  }

  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      proximity: "ip",
      language: "es",
      limit: 5,
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async city(place = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapBox,
      });

      const resp = await instance.get();
      return resp.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      console.log("No se ha encontrado la ciudad");
      return [];
    }
    return [];
  }

  async placeWeather(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon },
      });

      const resp = await instance.get();

      const { weather, main } = resp.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      return [];
    }
  }

  addToHistory(place = "") {
    // Evitar duplicados
    if (this.history.includes(place.toLowerCase())) return;

    this.history = this.history.splice(0, 5); // Mantener solamente 6 elementos en el historial

    this.history.unshift(place.toLowerCase());

    // Guardar en base de datos
    this.saveOnDB();
  }

  saveOnDB() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  loadDB() {
    if (!fs.existsSync(this.dbPath, { encoding: 'utf-8' })) return;

    const info = fs.readFileSync(this.dbPath);
    const data = JSON.parse(info);
    this.history = data.history;
  }
}

export default Search;
