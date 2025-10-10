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

  // ========================================
  // CHANGE PASSWORD
  // ========================================
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

  // ========================================
  // DARK MODE
  // ========================================
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

  // ========================================
  // LOGOUT
  // ========================================
  const logoutBtnSetting = document.getElementById("logoutBtnSetting");

  logoutBtnSetting?.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin Logout?")) {
      localStorage.removeItem("activeUser");
      window.location.href = "login.html";
    }
  });

  // ========================================
  // ⭐ DELETE ACCOUNT ⭐
  // ========================================
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  const deleteAccountModal = document.getElementById("deleteAccountModal");
  const confirmUsername = document.getElementById("confirmUsername");
  const confirmDeleteInput = document.getElementById("confirmDeleteInput");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

  // Open modal
  deleteAccountBtn?.addEventListener("click", () => {
    if (confirmUsername) {
      confirmUsername.textContent = activeUser;
    }
    if (confirmDeleteInput) {
      confirmDeleteInput.value = "";
    }
    if (confirmDeleteBtn) {
      confirmDeleteBtn.disabled = true;
    }
    if (deleteAccountModal) {
      deleteAccountModal.style.display = "flex";
    }
  });

  // Close modal
  cancelDeleteBtn?.addEventListener("click", () => {
    if (deleteAccountModal) {
      deleteAccountModal.style.display = "none";
    }
    if (confirmDeleteInput) {
      confirmDeleteInput.value = "";
    }
  });

  // Enable delete button when user types "HAPUS"
  confirmDeleteInput?.addEventListener("input", (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (confirmDeleteBtn) {
      confirmDeleteBtn.disabled = value !== "HAPUS";
    }
  });

  // Confirm delete
  confirmDeleteBtn?.addEventListener("click", () => {
    const inputValue = confirmDeleteInput?.value.trim().toUpperCase();

    if (inputValue !== "HAPUS") {
      alert("Konfirmasi tidak sesuai!");
      return;
    }

    console.log("🗑️ Deleting account:", activeUser);

    // 1. Hapus semua postingan user
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts = posts.filter((post) => post.author !== activeUser);
    localStorage.setItem("posts", JSON.stringify(posts));
    console.log("✅ Posts deleted");

    // 2. Hapus user dari following/followers orang lain
    Object.keys(users).forEach((username) => {
      if (username !== activeUser && users[username].following) {
        // Hapus activeUser dari following list orang lain
        users[username].following = users[username].following.filter(
          (u) => u !== activeUser
        );
      }
    });

    // 3. Hapus akun user
    delete users[activeUser];
    localStorage.setItem("users", JSON.stringify(users));
    console.log("✅ User account deleted");

    // 4. Clear active user session
    localStorage.removeItem("activeUser");
    console.log("✅ Session cleared");

    // 5. Show success message
    alert(
      `Akun "${activeUser}" berhasil dihapus! 👋\nAnda akan diarahkan ke halaman login.`
    );

    // 6. Redirect to login
    window.location.href = "login.html";
  });

  // Close modal when clicking outside
  deleteAccountModal?.addEventListener("click", (e) => {
    if (e.target === deleteAccountModal) {
      deleteAccountModal.style.display = "none";
      if (confirmDeleteInput) {
        confirmDeleteInput.value = "";
      }
    }
  });

  console.log("✅ setting.js loaded");
});
