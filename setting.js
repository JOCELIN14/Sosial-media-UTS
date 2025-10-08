document.addEventListener("DOMContentLoaded", () => {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    window.location.href = "login.html";
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};
  const currentUser = users[activeUser];

  if (!currentUser) {
    alert("Data pengguna aktif tidak ditemukan!");
    localStorage.removeItem("activeUser");
    window.location.href = "login.html";
    return;
  }

  const settingUsernameEl = document.getElementById("settingUsername");
  if (settingUsernameEl) {
    settingUsernameEl.textContent = activeUser;
  }

  const changePasswordForm = document.getElementById("changePasswordForm");

  changePasswordForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const currentPassword = document
      .getElementById("currentPassword")
      .value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmNewPassword = document
      .getElementById("confirmNewPassword")
      .value.trim();

    if (currentPassword !== currentUser.password) {
      alert("Error: Password lama salah!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Error: Password baru minimal 6 karakter!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Error: Konfirmasi password tidak cocok!");
      return;
    }

    currentUser.password = newPassword;
    users[activeUser] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password berhasil diubah!");
    changePasswordForm.reset();
  });

  const body = document.body;
  const darkModeToggle = document.getElementById("darkModeToggle");

  const applyTheme = (isDark) => {
    if (isDark) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
    }

    localStorage.setItem("themePreference", isDark ? "dark" : "light");
  };

  const savedTheme = localStorage.getItem("themePreference");
  const isDarkMode = savedTheme === "dark";
  applyTheme(isDarkMode);
  if (darkModeToggle) darkModeToggle.checked = isDarkMode;

  darkModeToggle?.addEventListener("change", () => {
    applyTheme(darkModeToggle.checked);
  });

  const logoutBtnSetting = document.getElementById("logoutBtnSetting");

  logoutBtnSetting?.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin Logout?")) {
      localStorage.removeItem("activeUser");
      window.location.href = "login.html";
    }
  });
});
