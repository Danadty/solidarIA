import dotenv from "dotenv"
import express from "express";
import cors from "cors";
import { Request, Response } from "express";
// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

// dotenv.config();
//Crear una nueva app de express
const app = express();

//Importamos el contenido del .env
dotenv.config();
const PORT = process.env.PORT;
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

//App confugaration
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: ACCESS_TOKEN
});

//Routes ping
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

//Route to post a preference
app.post("/create-preference", async (req: Request, res: Response) => {
  try {
    const preference = new Preference(client);
    const item = req.body.items[0];

   const result = await preference.create({
      body:{
        items: [
          {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price),
          },
        ],
         back_urls: {
            success: `http://localhost:3000/success`,
            failure: `http://localhost:3000/failure`,
            pending: `http://localhost:3000/pending`,
      },
      auto_return: "approved", // Redirige automáticamente solo si el pago es aprobado
      }
    });

    console.log("Preferencia create:", result);

    res.status(200).json({
      preferenceId: result.id
    });
  } catch (error) {
    console.error("Error creando preferencia:", error);
    res.status(500).json({ error: "Error creating preference" });
  }
});

app.listen(PORT || 3000, () => {
  console.log(`Server is now running on ${PORT} || 3000`);
});
