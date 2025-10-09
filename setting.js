document.addEventListener("DOMContentLoaded", () => {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    window.location.href = "login.html";
    return;
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

  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Ambil nilai input
      const currentPassword = document
        .getElementById("currentPassword")
        .value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmNewPassword = document
        .getElementById("confirmNewPassword")
        .value.trim();

      // Validasi
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

      // Simpan password baru
      currentUser.password = newPassword;
      users[activeUser] = currentUser;
      localStorage.setItem("users", JSON.stringify(users));

      alert("Password berhasil diubah!");
      changePasswordForm.reset();
    });
  }

  const body = document.body;
  const darkModeToggle = document.getElementById("darkModeToggle");

  const applyTheme = (isDark) => {
    console.log("applyTheme:", isDark ? "dark" : "light");
    if (isDark) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
    }

    localStorage.setItem("themePreference", isDark ? "dark" : "light");
    console.log(
      "Theme saved to localStorage:",
      localStorage.getItem("themePreference")
    ); // Debug log
  };

  if (darkModeToggle) {
    const savedTheme = localStorage.getItem("themePreference");
    const isDarkMode = savedTheme === "dark";
    applyTheme(isDarkMode);
    darkModeToggle.checked = isDarkMode;

    darkModeToggle?.addEventListener("change", (e) => {
      console.log("Toggle changed to:", e.target.checked); // Debug log
      applyTheme(e.target.checked);
    });
    console.log("Dark mode toggle initialized successfully");
  } else {
    console.error("Dark mode toggle element not found!");
  }

  const logoutBtnSetting = document.getElementById("logoutBtnSetting");

  if (logoutBtnSetting) {
    logoutBtnSetting?.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin Logout?")) {
        localStorage.removeItem("activeUser");
        window.location.href = "login.html";
      }
    });
  }

  console.log("Setting page loaded successfully for user:", activeUser);
});
