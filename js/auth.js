// Маска для телефона
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    IMask(phoneInput, {
      mask: "+{7} (000) 000-00-00",
      lazy: false,
      placeholderChar: "_",
    });
  }
});

// Функция для переключения между шагами
function showStep(stepNumber) {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step, index) => {
    step.style.display = index + 1 === stepNumber ? "block" : "none";
  });
}

// Функция для отправки кода подтверждения
async function sendCode() {
  const email = document.getElementById("email").value;
  const name = document.getElementById("name")?.value; // Опционально для формы регистрации

  if (!email) {
    alert("Пожалуйста, введите email");
    return;
  }

  try {
    const response = await fetch("/api/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name }),
    });

    const data = await response.json();

    if (data.success) {
      // Показываем инструкции
      if (data.message) {
        alert(data.message);
      }
      // Переходим к шагу ввода кода
      document.getElementById("step1").style.display = "none";
      document.getElementById("step2").style.display = "block";
    } else {
      alert(data.error || "Ошибка при отправке кода");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Произошла ошибка при отправке кода");
  }
}

// Функция для проверки кода
async function verifyCode() {
  const email = document.getElementById("email").value;
  const code = document.getElementById("code").value;
  const name = document.getElementById("name")?.value; // Опционально для формы регистрации

  if (!code) {
    alert("Пожалуйста, введите код подтверждения");
    return;
  }

  try {
    const response = await fetch("/api/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, name }),
    });

    const data = await response.json();

    if (data.success) {
      // Если это регистрация, сохраняем данные пользователя
      if (name) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            name,
            email,
            isRegistered: true,
          })
        );
      }
      // Перенаправляем на главную страницу
      window.location.href = "/";
    } else {
      alert(data.error || "Неверный код подтверждения");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Произошла ошибка при проверке кода");
  }
}

// Регистрация пользователя
async function register() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("Пожалуйста, заполните все поля");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Регистрация успешно завершена!");
      window.location.href = "/";
    } else {
      alert(data.error || "Произошла ошибка при регистрации");
    }
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    alert("Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.");
  }
}

// Вход в систему
async function login() {
  const phone = document.getElementById("phone").value;

  if (!phone || phone.length < 15) {
    alert("Пожалуйста, введите корректный номер телефона");
    return;
  }

  try {
    // Здесь будет запрос к API для входа
    // const response = await fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ phone })
    // });

    // Временная имитация успешного входа
    console.log("Вход в систему:", { phone });
    window.location.href = "/";
  } catch (error) {
    console.error("Ошибка при входе:", error);
    alert("Неверный номер телефона");
  }
}
