import { OpenAPIV3 } from "openapi-types";

const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Hogwarts API",
    version: "1.0.0",
    description: "API para gerenciar personagens, casas e matérias de Hogwarts",
  },
  servers: [
    { url: "http://localhost:3000/api", description: "Servidor Local" },
    { url: "https://api.hogwarts.com", description: "Servidor de Produção" },
  ],
  tags: [
    { name: "House", description: "Operações de casas" },
    { name: "Character", description: "Operações de personagens" },
    { name: "Subject", description: "Operações de matérias" },
  ],
  components: {
    schemas: {
      // ===== House =====
      House: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Grifinória" },
          mascot: { type: "string", example: "Leão" },
          founder: { type: "string", example: "Godric Gryffindor" },
          characters: {
            type: "array",
            items: { $ref: "#/components/schemas/Character" },
          },
        },
        required: ["name"],
      },

      // ===== Character =====
      Character: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          firstName: { type: "string", example: "Harry" },
          lastName: { type: "string", example: "Potter" },
          role: { type: "string", example: "student" },
          bloodStatus: { type: "string", example: "half-blood" },
          houseId: { type: "integer", example: 1 },
        },
        required: ["firstName", "lastName"],
      },
      CreateCharacter: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          role: { type: "string" },
          bloodStatus: { type: "string" },
          houseId: { type: "integer" },
        },
        required: ["firstName", "lastName"],
        example: {
          firstName: "Hermione",
          lastName: "Granger",
          role: "student",
          bloodStatus: "muggle-born",
          houseId: 1,
        },
      },

      // ===== Subject =====
      Subject: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Defesa Contra as Artes das Trevas" },
          enrollments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                characterId: { type: "integer", example: 1 },
                character: { $ref: "#/components/schemas/Character" },
              },
            },
          },
        },
        required: ["name"],
      },
    },
  },
  paths: {
    // ===== House =====
    "/houses": {
      get: {
        tags: ["House"],
        summary: "Listar casas",
        responses: {
          200: {
            description: "Lista de casas",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/House" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["House"],
        summary: "Criar casa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  mascot: { type: "string" },
                  founder: { type: "string" },
                },
                required: ["name"],
                example: { name: "Sonserina", mascot: "Serpente", founder: "Salazar Slytherin" },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Casa criada",
            content: { "application/json": { schema: { $ref: "#/components/schemas/House" } } },
          },
        },
      },
    },
    "/houses/{id}": {
      get: {
        tags: ["House"],
        summary: "Buscar casa por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/House" } } } },
          404: { description: "Não encontrada" },
        },
      },
      put: {
        tags: ["House"],
        summary: "Atualizar casa",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { name: { type: "string" }, mascot: { type: "string" }, founder: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Atualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/House" } } } },
          404: { description: "Não encontrada" },
        },
      },
      delete: {
        tags: ["House"],
        summary: "Remover casa",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 204: { description: "Deletado" } },
      },
    },

    // ===== Character =====
    "/characters": {
      get: {
        tags: ["Character"],
        summary: "Listar personagens",
        responses: { 200: { description: "Lista de personagens", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Character" } } } } } },
      },
      post: {
        tags: ["Character"],
        summary: "Criar personagem",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCharacter" } } } },
        responses: { 201: { description: "Personagem criado", content: { "application/json": { schema: { $ref: "#/components/schemas/Character" } } } } },
      },
    },
    "/characters/{id}": {
      get: {
        tags: ["Character"],
        summary: "Buscar personagem por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Character" } } } }, 404: { description: "Não encontrado" } },
      },
      put: {
        tags: ["Character"],
        summary: "Atualizar personagem",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCharacter" } } } },
        responses: { 200: { description: "Atualizado" }, 404: { description: "Não encontrado" } },
      },
      delete: {
        tags: ["Character"],
        summary: "Remover personagem",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 204: { description: "Deletado" } },
      },
    },

    // ===== Subject =====
    "/subjects": {
      get: {
        tags: ["Subject"],
        summary: "Listar matérias",
        responses: { 200: { description: "Lista de matérias", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Subject" } } } } } },
      },
      post: {
        tags: ["Subject"],
        summary: "Criar matéria",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" } }, required: ["name"], example: { name: "Poções" } } } } },
        responses: { 201: { description: "Matéria criada", content: { "application/json": { schema: { $ref: "#/components/schemas/Subject" } } } } },
      },
    },
    "/subjects/{id}": {
      get: {
        tags: ["Subject"],
        summary: "Buscar matéria por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Subject" } } } }, 404: { description: "Não encontrada" } },
      },
      put: {
        tags: ["Subject"],
        summary: "Atualizar matéria",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" } }, example: { name: "Herbologia" } } } } },
        responses: { 200: { description: "Atualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/Subject" } } } }, 404: { description: "Não encontrada" } },
      },
      delete: {
        tags: ["Subject"],
        summary: "Remover matéria",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 204: { description: "Deletado" } },
      },
    },
  },
};

export default swaggerSpec;
