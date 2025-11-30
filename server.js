import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SHOP_ID = process.env.SHOP_ID;
const SECRET_KEY = process.env.SECRET_KEY;

// Создание платежа
app.post("/create-payment", async (req, res) => {
  try {
    const idempotenceKey = Math.random().toString(36).substring(2);

    const response = await axios.post(
      "https://api.yookassa.ru/v3/payments",
      {
        amount: {
          value: "490.00",
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: "https://vk.com/app54348330_-234056692?ref=group_menu" 
        },
        capture: true,
        description: "Подписка Арины (1 месяц)"
      },
      {
        auth: {
          username: SHOP_ID,
          password: SECRET_KEY
        },
        headers: {
          "Idempotence-Key": idempotenceKey,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      confirmationUrl: response.data.confirmation.confirmation_url,
      paymentId: response.data.id
    });

  } catch (error) {
    console.error("Ошибка создания платежа:", error.response?.data);
    res.status(500).json({ error: "Ошибка создания платежа" });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
