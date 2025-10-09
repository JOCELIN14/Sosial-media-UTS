const activeUser = localStorage.getItem("activeUser");
if (!activeUser) window.location.href = "login.html";

const users = JSON.parse(localStorage.getItem("users")) || {};
const posts = JSON.parse(localStorage.getItem("posts")) || [];

const profileName = document.getElementById("profileName");
const profilePic = document.getElementById("profilePicture");
const bio = document.getElementById("bio");
const followersBtn = document.getElementById("followersBtn");
const followingBtn = document.getElementById("followingBtn");
const modal = document.getElementById("user-list-modal");
const modalTitle = document.getElementById("modal-title");
const modalUserList = document.getElementById("modal-user-list");
const closeModalBtn = document.querySelector(".close-btn");
const btnLogout = document.getElementById("btn-logout");
const userPostsContainer = document.getElementById("userPosts");
const profileInfoEl = document.querySelector(".profile-info");
const editProfileForm = document.getElementById("editProfileForm");

const editProfileBtn = document.getElementById("editProfileBtn");
const nameInput = document.getElementById("nameInput"); // PERBAIKI: huruf kecil
const bioInput = document.getElementById("bioInput");
const saveBtnEl = document.getElementById("saveProfileBtn");
const cancelBtn = document.getElementById("cancelEditBtn");

const changePicBtn = document.getElementById("changePicBtn");
const uploadProfilePic = document.getElementById("uploadProfilePic");

const getFollowing = (username) => users[username]?.following || [];

const getFollowers = (username) => {
  const followers = [];
  for (const user in users) {
    if (users[user].following && users[user].following.includes(username)) {
      followers.push(user);
    }
  }
  return followers;
};

if (uploadProfilePic) {
  uploadProfilePic.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;

      let users = JSON.parse(localStorage.getItem("users")) || {};

      if (users[activeUser]) {
        users[activeUser].profilePhoto = imageUrl;
      }
      localStorage.setItem("users", JSON.stringify(users));

      renderProfile();

      alert("Foto profil berhasil diubah!");
    };
    reader.readAsDataURL(file);
  });
}

// === TAMPILKAN FOTO PROFIL YANG SUDAH TERSIMPAN ===
window.addEventListener("load", () => {
  const savedFoto = localStorage.getItem("fotoProfil");
  if (savedFoto) {
    profilePicture.src = savedFoto;
  }
});

// Ganti event listener upload foto:
if (uploadProfilePic) {
  uploadProfilePic.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateProfilePictureEverywhere(activeUser, imageUrl);
      renderProfile();

      // Beri notifikasi bahwa foto telah diubah
      alert(
        "Foto profil berhasil diubah! Perubahan akan terlihat di semua halaman."
      );
    };
    reader.readAsDataURL(file);
  });
}
// TAMBAHKAN: Fungsi toggle edit mode
const toggleEditMode = (showForm) => {
  if (showForm) {
    profileInfoEl.style.display = "none";
    editProfileForm.classList.remove("hidden");
  } else {
    profileInfoEl.style.display = "block";
    editProfileForm.classList.add("hidden");
  }
};

// Inisialisasi data profil default jika belum ada
if (!users[activeUser]) {
  users[activeUser] = {
    name: activeUser,
    bio: "Mahasiswa Universitas Tarumanagara 🎓",
    profilePic: "images/profile.png",
    following: [],
  };
} else {
  if (!users[activeUser].name) users[activeUser].name = activeUser;
  if (!users[activeUser].bio)
    users[activeUser].bio = "Mahasiswa Universitas Tarumanagara 🎓";
  if (!users[activeUser].profilePic)
    users[activeUser].profilePic = "images/profile.png";
}

// Tampilkan data profil
const renderProfile = () => {
  profileName.textContent = users[activeUser].name;
  bio.textContent = users[activeUser].bio;
  profilePic.src = users[activeUser].profilePic;
  updateProfileStats();
};

// Update statistik
const updateProfileStats = () => {
  const followingCount = getFollowing(activeUser).length;
  const followersCount = getFollowers(activeUser).length;

  if (followersBtn) {
    followersBtn.querySelector("strong").textContent = followersCount;
  }
  if (followingBtn) {
    followingBtn.querySelector("strong").textContent = followingCount;
  }
};

// Modal followers/following
const showUserListModal = (title, userList) => {
  modalTitle.textContent = title;
  modalUserList.innerHTML = "";

  if (userList.length === 0) {
    modalUserList.innerHTML = "<p>Tidak ada pengguna untuk ditampilkan.</p>";
  } else {
    userList.forEach((user) => {
      const div = document.createElement("div");
      div.classList.add("user-item");
      div.innerHTML = `
        <img src="${
          users[user]?.profilePic || "images/profile.png"
        }" alt="profil">
        <span>${users[user]?.name || user}</span>
      `;
      modalUserList.appendChild(div);
    });
  }

  modal.style.display = "block";
};

// Render postingan user
const renderUserPosts = () => {
  const userPosts = posts.filter((p) => p.author === activeUser);
  userPostsContainer.innerHTML = "";

  if (userPosts.length === 0) {
    userPostsContainer.innerHTML = "<p>Kamu belum membuat postingan.</p>";
    return;
  }

  userPosts
    .slice()
    .reverse()
    .forEach((post) => {
      const div = document.createElement("div");
      div.classList.add("post");
      div.innerHTML = `
        <div class="post-header">
          <img src="${
            users[post.author]?.profilePic || "images/profile.png"
          }" alt="Foto Profil">
          <h3>${users[post.author]?.name || post.author}</h3>
        </div>
        <p>${post.text}</p>
        ${
          post.imageUrl
            ? `<img src="${post.imageUrl}" class="post-image" alt="Gambar">`
            : ""
        }
        <div class="post-footer">
          <i class="fas fa-heart"></i> ${post.likes.length} suka
          &nbsp; <i class="far fa-comment"></i> ${post.comments.length} komentar
        </div>
      `;
      userPostsContainer.appendChild(div);
    });
};

// ========== EVENT LISTENERS ==========

// Followers / Following modal
if (followersBtn) {
  followersBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showUserListModal("Followers", getFollowers(activeUser));
  });
}

if (followingBtn) {
  followingBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showUserListModal("Following", getFollowing(activeUser));
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    if (modal) modal.style.display = "none";
  });
}

if (modal) {
  window.addEventListener("click", (e) => {
    if (e.target == modal) modal.style.display = "none";
  });
}

// Edit Profile
if (editProfileBtn) {
  editProfileBtn.addEventListener("click", () => {
    nameInput.value = users[activeUser].name;
    bioInput.value = users[activeUser].bio;
    toggleEditMode(true);
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    toggleEditMode(false);
  });
}

// Save Profile
if (saveBtnEl) {
  saveBtnEl.addEventListener("click", () => {
    const newName = nameInput.value.trim();
    const newBio = bioInput.value.trim();

    if (!newName) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    users[activeUser].name = newName;
    users[activeUser].bio = newBio || "Mahasiswa Universitas Tarumanagara 🎓";

    localStorage.setItem("users", JSON.stringify(users));
    renderProfile();
    toggleEditMode(false);
  });
}

if (changePicBtn) {
  changePicBtn.addEventListener("click", () => {
    uploadProfilePic.click();
  });
}

if (uploadProfilePic) {
  uploadProfilePic.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateProfilePicture(activeUser, imageUrl);
      localStorage.setItem("users", JSON.stringify(users));
      renderProfile();
    };
    reader.readAsDataURL(file);
  });
}

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("activeUser");
    window.location.href = "login.html";
  });
}

const btnHome = document.getElementById("btn-home");
if (btnHome) {
  btnHome.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderUserPosts();

  toggleEditMode(false);
});
