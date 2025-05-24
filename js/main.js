// Проверка авторизации
function checkAuth() {
  // Здесь будет проверка наличия токена авторизации
  const token = localStorage.getItem("authToken");
  const authButtons = document.querySelector(".nav");

  if (token) {
    // Пользователь авторизован
    authButtons.innerHTML = `
            <button class="btn btn-outline" onclick="logout()">Выйти</button>
            <button class="btn btn-secondary">
                <span class="material-icons">phone</span>
                +7 (495) 123-45-67
            </button>
        `;
  }
}

// Выход из системы
function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "/";
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
});
