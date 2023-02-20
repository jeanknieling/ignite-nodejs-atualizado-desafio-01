import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    const { title, description, id } = search;
    let data = this.#database[table] || [];

    if (title || description || id) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  completeTask(table, id) {
    const task = this.select(table, { id });

    if (task.length === 0) return false;

    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...task[0],
        updated_at: new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
        completed_at: task[0].completed_at
          ? null
          : new Date().toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            }),
      };
      this.#persist();
    }

    return task;
  }

  update(table, id, data) {
    const { title, description } = data;
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const currentTask = this.select("tasks", { id });

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...currentTask[0],
        title: title ?? currentTask[0].title,
        description: description ?? currentTask[0].description,
        updated_at: new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
