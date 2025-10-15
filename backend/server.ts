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
// const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

//App confugaration
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!
});

//Routes ping
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

//Route to post a preference
app.post("/create-preference", async (req: Request, res: Response) => {
  try {
    const item = req.body.items[0];

    const preference = await new Preference(client).create({
      body:{
        items: [
          {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price),
          },
        ],
      }
    });

    console.log("Preferencia create:", preference);
    res.json({
      id: preference.id,
      init_point: preference.init_point
    })

  } catch (error) {
    console.error("Error creando preferencia:", error);
    res.status(500).json({ error: "Error creating preference" });
  }
});

//     res.status(200).json({
//       preferenceId: preference.id
//     });
//   } catch (error) {
//     console.error("Error creando preferencia:", error);
//     res.status(500).json({ error: "Error creating preference AAAAAA" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is now running on ${PORT}`);
});
