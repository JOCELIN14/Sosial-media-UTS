function createNotification(targetUser, fromUser, type, postId = null) {
  if (!targetUser || targetUser === fromUser) return;
  const allUsers = JSON.parse(localStorage.getItem("users")) || {};
  if (!allUsers[targetUser])
    allUsers[targetUser] = { ...allUsers[targetUser], notifications: [] };
  if (!Array.isArray(allUsers[targetUser].notifications))
    allUsers[targetUser].notifications = [];

  const newNotification = {
    id: Date.now(),
    type,
    fromUser,
    postId,
    read: false,
    timestamp: new Date().toISOString(),
  };

  allUsers[targetUser].notifications.unshift(newNotification);
  localStorage.setItem("users", JSON.stringify(allUsers));
}

function setupNotifications() {
  const activeUser = localStorage.getItem("activeUser");
  const allUsers = JSON.parse(localStorage.getItem("users")) || {};
  const currentUser = allUsers[activeUser];
  const notifications = currentUser?.notifications || [];

  const badge = document.getElementById('notificationBadge');
  if (!badge) return;

  const unreadCount = notifications.filter(n => !n.read).length;
  if (unreadCount > 0) {
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`]/g, (s) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#96;",
    };
    return map[s];
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    window.location.href = "login.html";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};
  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  const saveUsers = (u) => {
    localStorage.setItem("users", JSON.stringify(u));
    users = u;
  };
  const savePosts = (p) => {
    localStorage.setItem("posts", JSON.stringify(p));
    posts = p;
  };

  const profileName = document.getElementById("profileName");
  const postBtn = document.getElementById("postBtn");
  const postInput = document.getElementById("postInput");
  const imageInput = document.getElementById("imageInput");
  const feed = document.getElementById("feed");
  const btnLogout = document.getElementById("btn-logout");

  const followersBtn = document.getElementById("followersBtn");
  const followingBtn = document.getElementById("followingBtn");
  const modal = document.getElementById("user-list-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalUserList = document.getElementById("modal-user-list");
  const closeModalBtn = document.querySelector(".close-btn");

  const usersList = document.getElementById("usersList");
  const btnProfile = document.getElementById("btn-profile");
  const btnChat = document.getElementById("btn-chat");

  const getFollowing = (username) => users[username]?.following || [];
  const getFollowers = (username) => {
    const followers = [];
    for (const u in users) {
      if (
        u !== username &&
        users[u].following &&
        users[u].following.includes(username)
      ) {
        followers.push(u);
      }
    }
    return followers;
  };

  const updateProfileStats = () => {
    const followingCount = getFollowing(activeUser).length;
    const followersCount = getFollowers(activeUser).length;
    if (followersBtn?.querySelector) {
      const s = followersBtn.querySelector("strong");
      if (s) s.textContent = String(followersCount);
    }
    if (followingBtn?.querySelector) {
      const s2 = followingBtn.querySelector("strong");
      if (s2) s2.textContent = String(followingCount);
    }
  };

  const renderFeed = () => {
    if (!feed) return;
    feed.innerHTML = "";

    posts
      .slice()
      .reverse()
      .forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.setAttribute("data-post-id", post.id);

        const isLiked =
          Array.isArray(post.likes) && post.likes.includes(activeUser);
        const isFollowing = getFollowing(activeUser).includes(post.author);

        let followButtonHTML = "";
        if (post.author !== activeUser) {
          followButtonHTML = `<button class="follow-btn">${
            isFollowing ? "Unfollow" : "Follow"
          }</button>`;
        }

        postElement.innerHTML = `
          <div class="post-header">
            <div class="author-info" style="cursor:pointer;">
              <img src="images/profile.png" alt="Foto Profil">
              <h3 class="username-link">${post.author}</h3>
            </div>
            ${followButtonHTML}
          </div>
          <p>${escapeHtml(String(post.text || ""))}</p>
          ${
            post.imageUrl
              ? `<img src="${post.imageUrl}" class="post-image" alt="Gambar Postingan">`
              : ""
          }
          <div class="post-footer">
            <button class="like-btn"><i class="${
              isLiked ? "fas" : "far"
            } fa-heart"></i> <span class="like-count">${
          (post.likes || []).length
        }</span></button>
            <button class="comment-btn"><i class="far fa-comment"></i> ${
              (post.comments || []).length
            }</button>
          </div>
          <div class="comments-section">
            ${(post.comments || [])
              .map(
                (c) =>
                  `<div class="comment"><strong class="username-link">${
                    c.author
                  }:</strong> ${escapeHtml(c.text)}</div>`
              )
              .join("")}
            <div class="comment-input-container">
              <input type="text" class="comment-input" placeholder="Tulis komentar...">
              <button class="submit-comment-btn">Kirim</button>
            </div>
          </div>
        `;
        feed.appendChild(postElement);
      });

    updateProfileStats();
  };

  const showUserListModal = (title, userList) => {
    if (!modal || !modalUserList || !modalTitle) return;
    modalTitle.textContent = title;
    modalUserList.innerHTML = "";

    if (!userList || userList.length === 0) {
      modalUserList.innerHTML = "<p>Tidak ada pengguna untuk ditampilkan.</p>";
    } else {
      const currentUserFollowing = getFollowing(activeUser);
      userList.forEach((username) => {
        const userItem = document.createElement("div");
        userItem.classList.add("user-item");

        let buttonHTML = "";
        if (
          title === "Followers" &&
          !currentUserFollowing.includes(username) &&
          username !== activeUser
        ) {
          buttonHTML = `<button class="follow-back-btn" data-username="${username}">Follow Back</button>`;
        }

        userItem.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;cursor:pointer;" class="modal-username">
            <img src="images/profile.png" alt="profil">
            <span class="modal-username-text">${username}</span>
          </div>
          ${buttonHTML}
        `;

        userItem
          .querySelector(".modal-username")
          ?.addEventListener("click", () => {
            if (username !== activeUser)
              window.location.href = `profile.html?user=${username}`;
          });

        modalUserList.appendChild(userItem);
      });
    }
    modal.style.display = "block";
  };

  const renderUsersList = () => {
    if (!usersList) return;
    usersList.innerHTML = "";

    const currentUserFollowing = getFollowing(activeUser);
    const allUsernames = Object.keys(users).filter((u) => u !== activeUser);

    if (allUsernames.length === 0) {
      usersList.innerHTML =
        '<p style="text-align:center;color:#666;padding:20px;">Belum ada pengguna lain yang terdaftar</p>';
      return;
    }

    allUsernames.forEach((username) => {
      const isFollowing = currentUserFollowing.includes(username);
      const userItem = document.createElement("div");
      userItem.className = "user-list-item";
      userItem.innerHTML = `
        <img src="images/profile.png" alt="Profil ${username}">
        <div class="user-info">
          <div class="user-name">${username}</div>
          <div class="user-username">@${username}</div>
          <div class="user-follow-status">${
            isFollowing ? "Mengikuti" : "Belum diikuti"
          }</div>
        </div>
      `;
      userItem.addEventListener(
        "click",
        () => (window.location.href = `profile.html?user=${username}`)
      );
      usersList.appendChild(userItem);
    });
  };

  // --- Event Listeners ---
  if (postBtn && postInput) {
    postBtn.addEventListener("click", () => {
      const text = postInput.value.trim();
      const imageFile = imageInput ? imageInput.files[0] : null;

      if (text === "" && !imageFile) {
        alert("Tulis status atau pilih gambar terlebih dahulu.");
        return;
      }
      const newPost = { id: Date.now(), author: activeUser, text, imageUrl: null, likes: [], comments: [] };

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPost.imageUrl = e.target.result;
          posts.push(newPost);
          savePosts(posts);
          postInput.value = "";
          if (imageInput) imageInput.value = "";
          renderFeed();
        };
        reader.readAsDataURL(imageFile);
      } else {
        posts.push(newPost);
        savePosts(posts);
        postInput.value = "";
        renderFeed();
      }
    });
  }

  if (feed) {
    feed.addEventListener("click", (e) => {
      const target = e.target;
      const postElement = target.closest(".post");
      if (!postElement) return;
      const postId = Number(postElement.getAttribute("data-post-id"));
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex === -1) return;

      if (target.closest(".like-btn")) {
        const likedIndex = posts[postIndex].likes.indexOf(activeUser);
        if (likedIndex > -1) {
          posts[postIndex].likes.splice(likedIndex, 1);
        } else {
          posts[postIndex].likes.push(activeUser);
          createNotification(posts[postIndex].author, activeUser, "like", postId);
        }
        savePosts(posts);
        renderFeed();
        return;
      }

      if (target.classList.contains("submit-comment-btn")) {
        const commentInput = postElement.querySelector(".comment-input");
        if (!commentInput) return;
        const commentText = commentInput.value.trim();
        if (commentText) {
          posts[postIndex].comments.push({ author: activeUser, text: commentText });
          savePosts(posts);
          createNotification(posts[postIndex].author, activeUser, "comment", postId);
          commentInput.value = "";
          renderFeed();
        }
        return;
      }

      if (target.classList.contains("follow-btn")) {
        const authorToFollow = posts[postIndex].author;
        if (!users[activeUser]) users[activeUser] = { following: [] };
        const followingIndex = users[activeUser].following.indexOf(authorToFollow);
        if (followingIndex > -1) {
          users[activeUser].following.splice(followingIndex, 1);
        } else {
          users[activeUser].following.push(authorToFollow);
          createNotification(authorToFollow, activeUser, "follow");
        }
        saveUsers(users);
        renderFeed();
        renderUsersList();
        return;
      }
    });
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest(".username-link");
    if (el) {
      const username = el.textContent.replace(":", "").trim();
      if (username && username !== activeUser)
        window.location.href = `profile.html?user=${username}`;
    }
  });

  if (modalUserList) {
    modalUserList.addEventListener("click", (e) => {
      if (e.target.classList.contains("follow-back-btn")) {
        const userToFollow = e.target.getAttribute("data-username");
        if (!userToFollow) return;
        if (!users[activeUser]) users[activeUser] = { following: [] };
        const followingList = getFollowing(activeUser);
        if (!followingList.includes(userToFollow)) {
          users[activeUser].following.push(userToFollow);
          saveUsers(users);
          showUserListModal("Followers", getFollowers(activeUser));
          updateProfileStats();
          renderUsersList();
        }
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

  const closeModal = () => { if (modal) modal.style.display = "none"; };
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  if (btnLogout)
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("activeUser");
      window.location.href = "login.html";
    });
  if (btnProfile)
    btnProfile.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "profile.html";
    });
  if (btnChat)
    btnChat.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "chat.html";
    });

  if (profileName) profileName.textContent = activeUser;

  renderFeed();
  renderUsersList();
  setupNotifications();

  if (!users[activeUser]) {
    users[activeUser] = { following: [], notifications: [] };
    saveUsers(users);
  }
});