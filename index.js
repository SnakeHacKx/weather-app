import dotenv from "dotenv";
dotenv.config();

import {
  inquirerMenu,
  inquirerPause,
  listPlaces,
  readInput,
} from "./helpers/inquirer.js";
import Search from "./models/search.js";

const main = async () => {
  let opt;

  do {
    const search = new Search();
    opt = await inquirerMenu();

    switch (opt) {
      case 1: // Buscar ciudad
        console.clear();

        // Mostrar mensaje
        const query = await readInput("Ciudad: ");

        // Buscar los lugares
        const places = await search.city(query);

        // Selecionar el lugar
        const selectedId = await listPlaces(places);
        console.log({ selectedId });

        if (selectedId === "0") continue;

        const selectedPlace = places.find((pl) => pl.id === selectedId);

        // Guardar en base de datos (anadir al historial)
        search.addToHistory(selectedPlace.name);

        // Clima
        const weather = await search.placeWeather(
          selectedPlace.lat,
          selectedPlace.lng
        );

        console.log("\nInformación del Lugar:");
        console.log("Ciudad: " + selectedPlace.name.green);
        console.log("Lat: " + selectedPlace.lat);
        console.log("Lng: " + selectedPlace.lng);
        console.log("Temperatura: " + weather.temp);
        console.log("Mínima: " + weather.min);
        console.log("Máxima: " + weather.max);
        console.log("Cómo está el clima: " + weather.desc.yellow);
        break;

      case 2: // Historial
        search.capitalizedHistory.forEach((place, i) => {
          const index = `${i + 1}.`.green;
          console.log(`${index} ${place}`);
        });

        break;

      default:
        break;
    }

    if (opt !== 0) await inquirerPause();
  } while (opt !== 0);
};

main();
