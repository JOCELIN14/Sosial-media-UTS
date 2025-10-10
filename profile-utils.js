function getProfilePic(username) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  return users[username]?.profilePic || "images/profile.png";
}

function setProfilePic(username, imageUrl) {
  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[username]) {
    users[username] = { following: [], notifications: [] };
  }

  users[username].profilePic = imageUrl;
  localStorage.setItem("users", JSON.stringify(users));

  window.dispatchEvent(
    new CustomEvent("profilePicChanged", {
      detail: { username, imageUrl },
    })
  );
}

function updateAllProfileImages(username, imageUrl) {
  // Update foto di header
  const headerImg = document.getElementById("fotoProfilHeader");
  if (headerImg && localStorage.getItem("activeUser") === username) {
    headerImg.src = imageUrl;
  }

  // Update foto di create post
  const createPostImg = document.getElementById("fotoProfil");
  if (createPostImg && localStorage.getItem("activeUser") === username) {
    createPostImg.src = imageUrl;
  }

  // Update foto di profile page
  const profilePicture = document.getElementById("profilePicture");
  if (profilePicture && localStorage.getItem("activeUser") === username) {
    profilePicture.src = imageUrl;
  }

  // Update semua foto di post feed
  document.querySelectorAll(".post-header img").forEach((img) => {
    const authorElement = img.closest(".post-header")?.querySelector("h3");
    if (authorElement && authorElement.textContent === username) {
      img.src = imageUrl;
    }
  });

  // Update foto di user list
  document.querySelectorAll(".user-list-item img").forEach((img) => {
    const userNameEl = img
      .closest(".user-list-item")
      ?.querySelector(".user-name");
    if (userNameEl && userNameEl.textContent === username) {
      img.src = imageUrl;
    }
  });

  // Update foto di modal
  document.querySelectorAll(".user-item img").forEach((img) => {
    const usernameSpan = img.nextElementSibling;
    if (usernameSpan && usernameSpan.textContent === username) {
      img.src = imageUrl;
    }
  });

  // Update foto di search results
  document.querySelectorAll(".user-card img").forEach((img) => {
    const card = img.closest(".user-card");
    const usernameText = card?.querySelector("p")?.textContent;
    if (usernameText && usernameText.includes(username)) {
      img.src = imageUrl;
    }
  });
}

// Validasi file gambar
function validateImageFile(file) {
  if (!file) {
    return { valid: false, message: "Tidak ada file yang dipilih." };
  }

  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      message: "Format file harus JPG, PNG, atau GIF.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      message: "Ukuran gambar maksimal 5 MB.",
    };
  }

  return { valid: true };
}

// Upload dan simpan foto profil
function uploadProfilePic(file, username, callback) {
  const validation = validateImageFile(file);

  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;

    // Simpan ke localStorage
    setProfilePic(username, imageUrl);

    // Update semua gambar di halaman
    updateAllProfileImages(username, imageUrl);

    // Callback jika ada
    if (typeof callback === "function") {
      callback(imageUrl);
    }
  };

  reader.readAsDataURL(file);
}

// Initialize foto profil saat halaman load
function initProfilePics() {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) return;

  const imageUrl = getProfilePic(activeUser);

  // Set foto di berbagai elemen
  const profilePicture = document.getElementById("profilePicture");
  if (profilePicture) profilePicture.src = imageUrl;

  const headerImg = document.getElementById("fotoProfilHeader");
  if (headerImg) headerImg.src = imageUrl;

  const createPostImg = document.getElementById("fotoProfil");
  if (createPostImg) createPostImg.src = imageUrl;
}

// Listen untuk perubahan foto profil dari halaman lain
window.addEventListener("profilePicChanged", (e) => {
  const { username, imageUrl } = e.detail;
  updateAllProfileImages(username, imageUrl);
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getProfilePic,
    setProfilePic,
    updateAllProfileImages,
    validateImageFile,
    uploadProfilePic,
    initProfilePics,
  };
}
