import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swagger";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

// Rotas da API
app.get("/", (req, res) => {
  res.send("Servidor está rodando! Use /api-docs para acessar a API.");
});
app.use("/api", routes);


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
      /* Topbar temática Hogwarts */
      .swagger-ui .topbar {
        background-color: #4B0082; /* Roxo de Grifinória/Sonserina */
        border-bottom: 3px solid gold; /* Destaque dourado */
      }
      .swagger-ui .topbar a {
        color: gold;
        font-family: 'Cinzel', serif;
        font-weight: bold;
      }

      /* Cards limpos */
      .swagger-ui .opblock {
        border-radius: 8px;
        background: #ffffffcc;
        margin-bottom: 10px;
        border-left: 5px solid transparent;
        position: relative;
      }

      /* Fonte global */
      body, .swagger-ui .opblock-summary-path, .swagger-ui .opblock-summary-method {
        font-family: 'Cinzel', serif;
        font-size: 15px; /* Fonte um pouco maior para leitura */
      }

      /* Borda colorida por método */
      .swagger-ui .opblock.opblock-get { border-left-color: #4B0082; }
      .swagger-ui .opblock.opblock-post { border-left-color: #228B22; }
      .swagger-ui .opblock.opblock-put { border-left-color: #DAA520; }
      .swagger-ui .opblock.opblock-delete { border-left-color: #B22222; }

      /* Scroll leve */
      .swagger-ui .wrapper {
        scrollbar-width: thin;
        scrollbar-color: #4B0082 rgba(0,0,0,0.2);
      }
      .swagger-ui .wrapper::-webkit-scrollbar {
        width: 8px;
      }
      .swagger-ui .wrapper::-webkit-scrollbar-thumb {
        background-color: #4B0082;
        border-radius: 4px;
      }
    `,
    customSiteTitle: "Hogwarts API",
    explorer: true,
  })
);

// Middleware global de erro
app.use(errorHandler);

// Porta configurável via .env ou padrão 3000
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/api-docs`)
);
