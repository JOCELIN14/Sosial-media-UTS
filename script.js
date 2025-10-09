const activeUser = localStorage.getItem("activeUser");
if (!activeUser) {
  window.location.href = "login.html";
}

let users = JSON.parse(localStorage.getItem("users")) || {};
let posts = JSON.parse(localStorage.getItem("posts")) || [];

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

function setupNotifications() {
  const allUsers = JSON.parse(localStorage.getItem("users")) || {};
  const currentUser = allUsers[activeUser];
  const notifications = currentUser?.notifications || [];

  const badge = document.getElementById('notificationBadge');

  if (!badge) {
    return; // Badge not on this page
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  if (unreadCount > 0) {
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
}

  bell.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('show');

    if (dropdown.classList.contains('show') && unreadCount > 0) {
      currentUser.notifications.forEach(n => n.read = true);
      allUsers[activeUser] = currentUser;
      localStorage.setItem('users', JSON.stringify(allUsers));
      
      setTimeout(() => {
        badge.classList.remove('show');
      }, 2000);
    }
  });

  document.addEventListener('click', (e) => {
    if (!bell.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
  });


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

const applyTheme = (isDark) => {
  const body = document.body;
  if (isDark) {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
  }
};

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

const updateProfileStats = () => {
  const followingCount = getFollowing(activeUser).length;
  const followersCount = getFollowers(activeUser).length;
  followersBtn.querySelector("strong").textContent = followersCount;
  followingBtn.querySelector("strong").textContent = followingCount;
};

const renderFeed = () => {
  feed.innerHTML = "";
  posts
    .slice()
    .reverse()
    .forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.setAttribute("data-post-id", post.id);

      const isLiked = post.likes.includes(activeUser);
      const isFollowing = getFollowing(activeUser).includes(post.author);

      let followButtonHTML = "";
      if (post.author !== activeUser) {
        followButtonHTML = `<button class="follow-btn">${
          isFollowing ? "Unfollow" : "Follow"
        }</button>`;
      }

      postElement.innerHTML = `
          <div class="post-header">
              <div class="author-info" style="cursor: pointer;">
                  <img src="images/profile.png" alt="Foto Profil">
                  <h3 class="username-link">${post.author}</h3>
              </div>
              ${followButtonHTML}
          </div>
          <p>${post.text}</p>
          ${
            post.imageUrl
              ? `<img src="${post.imageUrl}" class="post-image" alt="Gambar Postingan">`
              : ""
          }
          <div class="post-footer">
              <button class="like-btn">
                  <i class="${isLiked ? "fas" : "far"} fa-heart"></i> 
                  <span class="like-count">${post.likes.length}</span>
              </button>
              <button class="comment-btn"><i class="far fa-comment"></i> ${
                post.comments.length
              }</button>
          </div>
          <div class="comments-section">
              ${post.comments
                .map(
                  (comment) =>
                    `<div class="comment"><strong class="username-link">${comment.author}:</strong> ${comment.text}</div>`
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

  setTimeout(() => {
    document.querySelectorAll(".username-link").forEach((element) => {
      element.addEventListener("click", (e) => {
        const username = e.target.textContent.replace(":", "").trim();
        if (username !== activeUser) {
          window.location.href = `profile.html?user=${username}`;
        }
      });
    });
  }, 0);
};
const showUserListModal = (title, userList) => {
  modalTitle.textContent = title;
  modalUserList.innerHTML = "";

  if (userList.length === 0) {
    modalUserList.innerHTML = "<p>Tidak ada pengguna untuk ditampilkan.</p>";
  } else {
    const currentUserFollowing = getFollowing(activeUser);
    userList.forEach((user) => {
      const userItem = document.createElement("div");
      userItem.classList.add("user-item");

      let buttonHTML = "";
      if (
        title === "Followers" &&
        !currentUserFollowing.includes(user) &&
        user !== activeUser
      ) {
        buttonHTML = `<button class="follow-back-btn" data-username="${user}">Follow Back</button>`;
      }

      userItem.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" class="modal-username">
          <img src="images/profile.png" alt="profil">
          <span>${user}</span>
        </div>
        ${buttonHTML}
      `;

      const usernameElement = userItem.querySelector(".modal-username");
      usernameElement.addEventListener("click", () => {
        if (user !== activeUser) {
          window.location.href = `profile.html?user=${user}`;
        }
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

  Object.keys(users).forEach((username) => {
    if (username === activeUser) return;

    const userItem = document.createElement("div");
    userItem.className = "user-list-item";

    const isFollowing = currentUserFollowing.includes(username);

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

    userItem.addEventListener("click", () => {
      window.location.href = `profile.html?user=${username}`;
    });

    usersList.appendChild(userItem);
  });

  if (Object.keys(users).length <= 1) {
    usersList.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">Belum ada pengguna lain yang terdaftar</p>';
  }
};

postBtn.addEventListener("click", () => {
  const text = postInput.value.trim();
  const imageFile = imageInput.files[0];

  if (text === "" && !imageFile) {
    alert("Tulis status atau pilih gambar terlebih dahulu.");
    return;
  }

  const newPost = {
    id: Date.now(),
    author: activeUser,
    text: text,
    imageUrl: null,
    likes: [],
    comments: [],
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newPost.imageUrl = e.target.result;
      posts.push(newPost);
      localStorage.setItem("posts", JSON.stringify(posts));
      postInput.value = "";
      imageInput.value = "";
      renderFeed();
    };
    reader.readAsDataURL(imageFile);
  } else {
    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    postInput.value = "";
    renderFeed();
  }
});

feed.addEventListener("click", (e) => {
  const target = e.target;
  const postElement = target.closest(".post");
  if (!postElement) return;
  const postId = Number(postElement.getAttribute("data-post-id"));
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (target.closest(".like-btn") && postIndex > -1) {
    const likedIndex = posts[postIndex].likes.indexOf(activeUser);
    if (likedIndex > -1) {
        posts[postIndex].likes.splice(likedIndex, 1);
    } else {
        posts[postIndex].likes.push(activeUser);
        createNotification(posts[postIndex].author, activeUser, 'like', postId);
    }
    localStorage.setItem("posts", JSON.stringify(posts));
    renderFeed();
  } else if (
    target.classList.contains("submit-comment-btn") &&
    postIndex > -1
  ) {
    const commentInput = postElement.querySelector(".comment-input");
    const commentText = commentInput.value.trim();
    if (commentText) {
      posts[postIndex].comments.push({ author: activeUser, text: commentText });
      createNotification(posts[postIndex].author, activeUser, 'comment', postId);
      localStorage.setItem("posts", JSON.stringify(posts));
      commentInput.value = "";
      renderFeed();
    }
  } else if (target.classList.contains("follow-btn") && postIndex > -1) {
    const authorToFollow = posts[postIndex].author;
    if (!users[activeUser]) {
      users[activeUser] = { following: [] };
    }
    const followingIndex = users[activeUser].following.indexOf(authorToFollow);
    if (followingIndex > -1) {
      users[activeUser].following.splice(followingIndex, 1);
    } else {
      users[activeUser].following.push(authorToFollow);
      createNotification(authorToFollow, activeUser, 'follow');
    }
    localStorage.setItem("users", JSON.stringify(users));
    renderFeed();
    renderUsersList();
  }
});

modalUserList.addEventListener("click", (e) => {
  if (e.target.classList.contains("follow-back-btn")) {
    const userToFollow = e.target.getAttribute("data-username");
    if (userToFollow) {
      if (!users[activeUser]) {
        users[activeUser] = { following: [] };
      }
      const followingList = getFollowing(activeUser);
      if (!followingList.includes(userToFollow)) {
        users[activeUser].following.push(userToFollow);
        localStorage.setItem("users", JSON.stringify(users));
        const currentFollowers = getFollowers(activeUser);
        showUserListModal("Followers", currentFollowers);
        updateProfileStats();
        renderUsersList(); // Update daftar pengguna
      }
    }
  }
});

followersBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const userList = getFollowers(activeUser);
  showUserListModal("Followers", userList);
});

followingBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const userList = getFollowing(activeUser);
  showUserListModal("Following", userList);
});

const closeModal = () => {
  modal.style.display = "none";
};

closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target == modal) {
    closeModal();
  }
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  window.location.href = "login.html";
});

const btnProfile = document.getElementById("btn-profile");
if (btnProfile) {
  btnProfile.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "profile.html";
  });
}

profileName.textContent = activeUser;

document.addEventListener("DOMContentLoaded", () => {
  renderFeed();
  renderUsersList();
  setupNotifications();

  if (!users[activeUser]) {
    users[activeUser] = { following: [] };
    localStorage.setItem("users", JSON.stringify(users));
  }
});

const checkAndUpdateProfilePictures = () => {
  const profilePicUpdated = localStorage.getItem("profilePicUpdated");

  if (profilePicUpdated === "true") {
    const updatedUser = localStorage.getItem("updatedUser");
    const updatedProfilePic = localStorage.getItem("updatedProfilePic");

    if (updatedUser && updatedProfilePic) {
      updateAllProfilePictures(updatedUser, updatedProfilePic);

      localStorage.removeItem("profilePicUpdated");
      localStorage.removeItem("updatedProfilePic");
      localStorage.removeItem("updatedUser");
    }
  }
};

const updateAllProfilePictures = (username, imageUrl) => {
  // Update profile picture di header
  const profileHeaderImg = document.querySelector(".profile-header img");
  if (profileHeaderImg && activeUser === username) {
    profileHeaderImg.src = imageUrl;
  }

  const createPostImg = document.querySelector(".create-post img");
  if (createPostImg && activeUser === username) {
    createPostImg.src = imageUrl;
  }

  document.querySelectorAll(".post-header img").forEach((img) => {
    const postAuthor = img.closest(".post-header").querySelector("h3");
    if (postAuthor && postAuthor.textContent === username) {
      img.src = imageUrl;
    }
  });

  document.querySelectorAll(".user-list-item img").forEach((img) => {
    const userName = img.closest(".user-list-item").querySelector(".user-name");
    if (userName && userName.textContent === username) {
      img.src = imageUrl;
    }
  });

  document.querySelectorAll(".user-item img").forEach((img) => {
    const userName = img.nextElementSibling;
    if (userName && userName.textContent === username) {
      img.src = imageUrl;
    }
  });
};
const btnChat = document.getElementById("btn-chat");
if (btnChat) {
  btnChat.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "chat.html";
  });
}