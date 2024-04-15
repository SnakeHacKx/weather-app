import inquirer from "inquirer";
import "colors";

const questions = [
  {
    type: "list",
    name: "option",
    message: "¿Qué deseas hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.".green} Historial`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log("=================================".green);
  console.log("  Seleccione una opción".yellow);
  console.log("=================================".green);

  const { option } = await inquirer.prompt(questions);

  return option;
};

const inquirerPause = async () => {
  const question = [
    {
      type: "input",
      name: "ipt",
      message: `Presione ${"ENTER".green} para continuar:\n`,
    },
  ];

  console.log("\n");

  const { ipt } = await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      typeof: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }

        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    const index = `${i + 1}`.green;

    return {
      value: place.id,
      name: `${index} ${place.name}`,
    };
  });

  // unshift es para agregar un elemento al inicio del array
  choices.unshift({
    value: "0",
    name: `${"0.".green} Cancelar`,
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Seleccione un lugar",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);

  return id;
};

const confirmDeleteTask = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

const showChecklist = async (tasks = []) => {
  const choices = tasks.map((task, i) => {
    const index = `${i + 1}`.green;

    return {
      value: task.id,
      name: `${index} ${task.description}`,
      checked: task.completedAt ? true : false,
    };
  });

  const question = [
    {
      type: "checkbox",
      name: "ids",
      message: "Selecciones",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(question);

  return ids;
};

export {
  inquirerMenu,
  inquirerPause,
  readInput,
  listPlaces,
  confirmDeleteTask,
  showChecklist,
};
