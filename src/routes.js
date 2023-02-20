import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const { search } = req.query;

      const tasks = await database.select("tasks", {
        title: search,
        description: search,
      });

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: `${!title ? "title " : "description "}` + "is required",
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
        updated_at: new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
        completed_at: null,
      };

      database.insert("tasks", task);

      return res
        .writeHead(201)
        .end(JSON.stringify("Task cadastrada com sucesso!"));
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.completeTask("tasks", id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found!" }));
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: `${!title ? "title " : "description "}` + "is required",
          })
        );
      }

      database.update("tasks", id, {
        title,
        description,
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
