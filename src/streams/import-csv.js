import { parse } from "csv-parse";
import fs from "node:fs";

const csvPath = new URL("./tasks.csv", import.meta.url); // Linha para mostrar o arquivo onde serão feitas as requests das tasks

const stream = fs.createReadStream(csvPath); // Método fs que permite abrir um arquivo e ler os dados presentes nele.

// https://csv.js.org/parse/options
const csvParse = parse({
  delimiter: ",",
  skipEmptyLines: true,
  fromLine: 2, // skip the header line
});

async function loadCSV() {
  const loadedLines = stream.pipe(csvParse);

  for await (const line of loadedLines) {
    const [title, description] = line;
    console.log("AQUIIIIIIIIIIIIIIIIIIIIIIII",line);

     fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description
      }),
    });
  }
}

loadCSV();
