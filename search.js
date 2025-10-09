function createNotification(targetUser, fromUser, type, postId = null) {
  if (targetUser === fromUser) {
    return;
  }
  let allUsers = JSON.parse(localStorage.getItem("users")) || {};
  if (!allUsers[targetUser]) {
    allUsers[targetUser] = { notifications: [] };
  } else if (!allUsers[targetUser].notifications) {
    allUsers[targetUser].notifications = [];
  }
  const newNotification = {
    id: Date.now(),
    type: type,
    fromUser: fromUser,
    postId: postId,
    read: false,
    timestamp: new Date().toISOString()
  };
  allUsers[targetUser].notifications.unshift(newNotification);
  localStorage.setItem("users", JSON.stringify(allUsers));
}

document.addEventListener("DOMContentLoaded", () => {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    window.location.href = "login.html";
  }

  // Ambil data user dari localStorage
  let users = JSON.parse(localStorage.getItem("users")) || {};

  // Pastikan user aktif sudah punya data
  if (!users[activeUser]) {
    users[activeUser] = {
      name: activeUser,
      profilePic: "images/profile.png",
      following: [],
    };
    localStorage.setItem("users", JSON.stringify(users));
  }
  const defaultProfilePic = "images/profile.png";
  // Dummy users tambahan
  const dummyUsers = [
    {
      username: "jocelin",
      name: "Jocelin K.",
      profilePic: "https://i.pravatar.cc/150?u=jocelin",
    },
    {
      username: "edward_s",
      name: "Edward S.",
      profilePic: "https://i.pravatar.cc/150?u=edward",
    },
    {
      username: "gregorius_d",
      name: "Gregorius D.",
      profilePic: "https://i.pravatar.cc/150?u=gregorius",
    },
    {
      username: "catalina_g",
      name: "Giofani Catalina",
      profilePic: "https://i.pravatar.cc/150?u=catalina",
    },
    {
      username: "raykhel",
      name: "Raykhel",
      profilePic: "https://i.pravatar.cc/150?u=raykhel",
    },
  ];

  // Gabungkan semua user (dummy + signup)
  const signupUsers = Object.keys(users).map((u) => {
    const userData = users[u];
    return {
      username: u,
      name: userData.name || u,
      profilePic: userData.profilePic || defaultProfilePic,
    };
  });

  const semuaUser = [...signupUsers, ...dummyUsers].filter(
    (u) => u.username !== activeUser
  );

  // Ambil elemen dari HTML
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  // Fungsi untuk follow/unfollow
  const toggleFollow = (targetUsername, btn) => {
    let following = users[activeUser].following || [];
    const isFollowing = following.includes(targetUsername);

    if (isFollowing) {
      // Unfollow
      following = following.filter((u) => u !== targetUsername);
      btn.textContent = "Follow";
      btn.classList.remove("unfollow");
    } else {
      // Follow
      following.push(targetUsername);
      // Notifikasi - trigger untuk follow
      createNotification(targetUsername, activeUser, 'follow');
      btn.textContent = "Unfollow";
      btn.classList.add("unfollow");
    }

    users[activeUser].following = following;
    localStorage.setItem("users", JSON.stringify(users));
  };

  // Fungsi tampilkan hasil pencarian
  const tampilkanHasil = (query = "") => {
    searchResults.innerHTML = "";

    const hasil = semuaUser.filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
    );

    if (hasil.length === 0) {
      searchResults.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
      return;
    }

    hasil.forEach((user) => {
      const card = document.createElement("div");
      card.classList.add("user-card");

      const isFollowing = users[activeUser].following.includes(user.username);

      card.innerHTML = `
        <img src="${user.profilePic}" alt="${user.name}" />
        <div class="user-info">
          <h3 class="user-link" data-username="${user.username}">${
        user.name
      }</h3>
          <p>@${user.username}</p>
          <button class="follow-btn ${isFollowing ? "unfollow" : ""}">${
        isFollowing ? "Unfollow" : "Follow"
      }</button>
        </div>
      `;

      // Klik nama ke profil
      card.querySelector(".user-link").addEventListener("click", (e) => {
        const username = e.target.dataset.username;
        localStorage.setItem("viewUser", username);
        window.location.href = "profile.html";
      });

      // Klik tombol follow/unfollow
      const followBtn = card.querySelector(".follow-btn");
      followBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // biar gak klik ke profile
        toggleFollow(user.username, followBtn);
      });

      searchResults.appendChild(card);
    });
  };

  // Initial display
  tampilkanHasil();

  // Search form submit event
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    tampilkanHasil(searchInput.value.trim());
  });

  setupNotifications();

  const btnLogout = document.getElementById("btn-logout");
  if(btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("activeUser");
      window.location.href = "login.html";
    });
  }

  const btnProfile = document.getElementById("btn-profile");
  if (btnProfile) {
    btnProfile.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "profile.html";
    });
  }
  
  const btnHome = document.getElementById("btn-home");
  if (btnHome) {
      btnHome.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = "index.html";
      });
  }

  const btnChat = document.getElementById("btn-chat");
  if (btnChat) {
    btnChat.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "chat.html";
    });
  }
});