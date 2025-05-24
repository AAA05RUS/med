const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("."));

// Настройка транспорта для отправки email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Хранилище кодов подтверждения
const verificationCodes = new Map();

// Генерация случайного кода
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Отправка кода подтверждения
app.post("/api/send-code", async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email обязателен" });
  }

  try {
    const code = generateCode();
    const timestamp = Date.now();

    // Сохраняем код
    verificationCodes.set(email, {
      code,
      timestamp,
      name,
    });

    // Отправляем email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Код подтверждения - Медсестра на дом",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2196F3;">Подтверждение ${
            name ? "регистрации" : "входа"
          }</h2>
          <p>Здравствуйте${name ? `, ${name}` : ""}!</p>
          <p>Ваш код подтверждения:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>Код действителен в течение 5 минут.</p>
          <p>Если вы не запрашивали этот код, проигнорируйте это письмо.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            С уважением,<br>
            Команда "Медсестра на дом"
          </p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: `Код подтверждения отправлен на ${email}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Ошибка при отправке кода" });
  }
});

// Проверка кода
app.post("/api/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email и код обязательны" });
  }

  const verification = verificationCodes.get(email);

  if (!verification) {
    return res
      .status(400)
      .json({ error: "Код не найден. Запросите новый код." });
  }

  if (Date.now() - verification.timestamp > 5 * 60 * 1000) {
    verificationCodes.delete(email);
    return res.status(400).json({ error: "Код истек. Запросите новый код." });
  }

  if (verification.code !== code) {
    return res.status(400).json({ error: "Неверный код" });
  }

  // Удаляем использованный код
  verificationCodes.delete(email);

  res.json({
    success: true,
    message: "Код подтвержден",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
