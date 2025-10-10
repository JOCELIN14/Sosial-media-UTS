const activeUser = localStorage.getItem("activeUser");
if (!activeUser) {
  window.location.href = "login.html";
}

let users = JSON.parse(localStorage.getItem("users")) || {};
let posts = JSON.parse(localStorage.getItem("posts")) || [];

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
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const saveBtnEl = document.getElementById("saveProfileBtn");
const cancelBtn = document.getElementById("cancelEditBtn");

const changePicBtn = document.getElementById("changePicBtn");
const uploadProfilePicInput = document.getElementById("uploadProfilePic");

const getFollowing = (username) => {
  return users[username]?.following || [];
};

const getFollowers = (username) => {
  const followers = [];
  for (const user in users) {
    if (users[user].following && users[user].following.includes(username)) {
      followers.push(user);
    }
  }
  return followers;
};

const toggleEditMode = (showForm) => {
  if (showForm) {
    if (profileInfoEl) profileInfoEl.style.display = "none";
    if (editProfileForm) editProfileForm.classList.remove("hidden");
  } else {
    if (profileInfoEl) profileInfoEl.style.display = "block";
    if (editProfileForm) editProfileForm.classList.add("hidden");
  }
};

const deletePost = (postId) => {
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    alert("Postingan tidak ditemukan!");
    return;
  }

  const post = posts[postIndex];

  if (post.author !== activeUser) {
    alert("Anda tidak bisa menghapus postingan orang lain!");
    return;
  }

  if (confirm("Yakin ingin menghapus postingan ini?")) {
    posts.splice(postIndex, 1);

    localStorage.setItem("posts", JSON.stringify(posts));

    renderUserPosts();

    console.log("Post deleted:", postId);
    alert("Postingan berhasil dihapus! 🗑️");
  }
};

if (!users[activeUser]) {
  users[activeUser] = {
    name: activeUser,
    bio: "Mahasiswa Universitas Tarumanagara 🎓",
    profilePic: "images/profile.png",
    following: [],
    notifications: [],
  };
  localStorage.setItem("users", JSON.stringify(users));
} else {
  if (!users[activeUser].name) users[activeUser].name = activeUser;
  if (!users[activeUser].bio)
    users[activeUser].bio = "Mahasiswa Universitas Tarumanagara 🎓";
  if (!users[activeUser].profilePic)
    users[activeUser].profilePic = "images/profile.png";
  if (!users[activeUser].following) users[activeUser].following = [];
  if (!users[activeUser].notifications) users[activeUser].notifications = [];
}

const renderProfile = () => {
  if (!profileName || !bio || !profilePic) {
    console.error("❌ Profile elements not found!");
    return;
  }

  users = JSON.parse(localStorage.getItem("users")) || {};

  const currentUser = users[activeUser];

  profileName.textContent = currentUser?.name || activeUser;
  bio.textContent = currentUser?.bio || "Mahasiswa Universitas Tarumanagara 🎓";

  if (typeof getProfilePic === "function") {
    profilePic.src = getProfilePic(activeUser);
    console.log("memproses:", profilePic.src.substring(0, 50));
  } else {
    profilePic.src = currentUser?.profilePic || "images/profile.png";
    console.warn("getProfilePic function not found, using fallback");
  }

  updateProfileStats();
};

const updateProfileStats = () => {
  const followingCount = getFollowing(activeUser).length;
  const followersCount = getFollowers(activeUser).length;

  if (followersBtn && followersBtn.querySelector) {
    const strong = followersBtn.querySelector("strong");
    if (strong) strong.textContent = followersCount;
  }
  if (followingBtn && followingBtn.querySelector) {
    const strong = followingBtn.querySelector("strong");
    if (strong) strong.textContent = followingCount;
  }
};

const showUserListModal = (title, userList) => {
  if (!modal || !modalTitle || !modalUserList) return;

  modalTitle.textContent = title;
  modalUserList.innerHTML = "";

  if (userList.length === 0) {
    modalUserList.innerHTML = "<p>Tidak ada pengguna untuk ditampilkan.</p>";
  } else {
    userList.forEach((user) => {
      const div = document.createElement("div");
      div.classList.add("user-item");

      let userProfilePic = "images/profile.png";
      if (typeof getProfilePic === "function") {
        userProfilePic = getProfilePic(user);
      } else if (users[user]?.profilePic) {
        userProfilePic = users[user].profilePic;
      }

      div.innerHTML = `
        <img src="${userProfilePic}" alt="profil ${user}">
        <span>${users[user]?.name || user}</span>
      `;
      modalUserList.appendChild(div);
    });
  }

  modal.style.display = "block";
};

const renderUserPosts = () => {
  if (!userPostsContainer) return;

  posts = JSON.parse(localStorage.getItem("posts")) || [];

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
      div.setAttribute("data-post-id", post.id);

      let postAuthorPic = "images/profile.png";
      if (typeof getProfilePic === "function") {
        postAuthorPic = getProfilePic(post.author);
      } else if (users[post.author]?.profilePic) {
        postAuthorPic = users[post.author].profilePic;
      }

      div.innerHTML = `
        <div class="post-header">
          <div class="author-info">
            <img src="${postAuthorPic}" alt="Foto Profil ${post.author}">
            <h3>${users[post.author]?.name || post.author}</h3>
          </div>
          <button class="delete-post-btn" data-post-id="${
            post.id
          }" title="Hapus postingan">
            <i class="fas fa-trash-alt"></i>
          </button>
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

      const deleteBtn = div.querySelector(".delete-post-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const postId = Number(e.currentTarget.getAttribute("data-post-id"));
          deletePost(postId);
        });
      }

      userPostsContainer.appendChild(div);
    });
};

if (uploadProfilePicInput) {
  uploadProfilePicInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("📸 Starting profile photo upload...");

    if (typeof uploadProfilePic === "function") {
      uploadProfilePic(file, activeUser, (imageUrl) => {
        console.log(" Upload complete!");

        users = JSON.parse(localStorage.getItem("users")) || {};

        renderProfile();

        uploadProfilePicInput.value = "";

        alert("Foto profil berhasil diubah! 🎉");
      });
    } else {
      console.warn("⚠️ uploadProfilePic function not found, using fallback");

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;

        users[activeUser].profilePic = imageUrl;
        localStorage.setItem("users", JSON.stringify(users));

        renderProfile();

        uploadProfilePicInput.value = "";

        alert("Foto profil berhasil diubah!");
      };
      reader.readAsDataURL(file);
    }
  });
}

if (changePicBtn) {
  changePicBtn.addEventListener("click", () => {
    if (uploadProfilePicInput) {
      uploadProfilePicInput.click();
    }
  });
}

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
    if (nameInput && bioInput) {
      nameInput.value = users[activeUser]?.name || activeUser;
      bioInput.value = users[activeUser]?.bio || "";
      toggleEditMode(true);
    }
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

    alert("Profil berhasil diupdate! ✅");
  });
}

// Logout
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("activeUser");
    window.location.href = "login.html";
  });
}

// Home Button
const btnHome = document.getElementById("btn-home");
if (btnHome) {
  btnHome.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Profile page initializing...");

  // Render profile
  renderProfile();
  renderUserPosts();
  toggleEditMode(false);

  if (typeof initProfilePics === "function") {
    initProfilePics();
    console.log("✅ initProfilePics called");
  }

  console.log("✅ Profile page loaded successfully!");
});

console.log("📄 profile.js loaded");
