// import dotenv from "dotenv"
import express from "express";
import cors from "cors";
import { Request, Response } from "express";
// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

// dotenv.config();
//Crear una nueva app de express
const app = express();

//App confugaration
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-5703622916048111-101010-ae17dc6f551177af5212e7fa6d6dd76f-396507774"
    
});

//Routes ping
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

//Route to post a preference
app.post("/create_preference", async (req: Request, res: Response) => {
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
        //URLs de redirección
      // back_urls: {
      //   success: "http://localhost:3000/success", // URL a la que volver si el pago es exitoso
      //   failure: "http://localhost:3000/failure", // URL si el pago falla
      //   pending: "http://localhost:3000/pending", // URL si el pago está pendiente
      // },
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

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is now roning on ${process.env.PORT || 8080}`);
});
