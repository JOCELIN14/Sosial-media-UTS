const activeUser = localStorage.getItem("activeUser");
if (!activeUser) {
  window.location.href = "login.html";
}

let users = JSON.parse(localStorage.getItem("users")) || {};
let posts = JSON.parse(localStorage.getItem("posts")) || [];

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
    followersBtn.querySelector('strong').textContent = followersCount;
    followingBtn.querySelector('strong').textContent = followingCount;
};

const showUserListModal = (title, userList) => {
    modalTitle.textContent = title;
    modalUserList.innerHTML = "";

    if (userList.length === 0) {
        modalUserList.innerHTML = "<p>Tidak ada pengguna untuk ditampilkan.</p>";
    } else {
        const currentUserFollowing = getFollowing(activeUser);
        userList.forEach(user => {
            const userItem = document.createElement('div');
            userItem.classList.add('user-item');

            let buttonHTML = '';
            if (title === 'Followers' && !currentUserFollowing.includes(user) && user !== activeUser) {
                buttonHTML = `<button class="follow-back-btn" data-username="${user}">Follow Back</button>`;
            }

            userItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="images/profile.png" alt="profil">
                    <span>${user}</span>
                </div>
                ${buttonHTML}
            `;
            modalUserList.appendChild(userItem);
        });
    }
    modal.style.display = "block";
};

const renderFeed = () => {
  feed.innerHTML = "";
  posts.slice().reverse().forEach(post => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.setAttribute('data-post-id', post.id);

      const isLiked = post.likes.includes(activeUser);
      const isFollowing = getFollowing(activeUser).includes(post.author);

      let followButtonHTML = '';
      if (post.author !== activeUser) {
          followButtonHTML = `<button class="follow-btn">${isFollowing ? 'Unfollow' : 'Follow'}</button>`;
      }

      postElement.innerHTML = `
          <div class="post-header">
              <div class="author-info">
                  <img src="images/profile.png" alt="Foto Profil">
                  <h3>${post.author}</h3>
              </div>
              ${followButtonHTML}
          </div>
          <p>${post.text}</p>
          ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image" alt="Gambar Postingan">` : ''}
          <div class="post-footer">
              <button class="like-btn">
                  <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> 
                  <span class="like-count">${post.likes.length}</span>
              </button>
              <button class="comment-btn"><i class="far fa-comment"></i> ${post.comments.length}</button>
          </div>
          <div class="comments-section">
              ${post.comments.map(comment => `<div class="comment"><strong>${comment.author}:</strong> ${comment.text}</div>`).join('')}
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

postBtn.addEventListener("click", () => {
  const text = postInput.value.trim();
  const imageFile = imageInput.files[0];

  if (text === "" && !imageFile) {
    alert("Tulis status atau pilih gambar terlebih dahulu.");
    return;
  }
  const newPost = { id: Date.now(), author: activeUser, text: text, imageUrl: null, likes: [], comments: [] };

  if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
          newPost.imageUrl = e.target.result;
          posts.push(newPost);
          localStorage.setItem("posts", JSON.stringify(posts));
          postInput.value = ""; imageInput.value = "";
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

document.addEventListener('DOMContentLoaded', () => {
    const semuaUser = [
        { id: 1, username: 'jocelin', name: 'Jocelin K.', profilePic: 'https://i.pravatar.cc/150?u=jocelin' },
        { id: 2, username: 'edward_s', name: 'Edward S.', profilePic: 'https://i.pravatar.cc/150?u=edward' },
        { id: 3, username: 'gregorius_d', name: 'Gregorius D.', profilePic: 'https://i.pravatar.cc/150?u=gregorius' },
        { id: 4, username: 'catalina_g', name: 'Giofani Catalina', profilePic: 'https://i.pravatar.cc/150?u=catalina' },
        { id: 5, username: 'raykhel', name: 'Raykhel', profilePic: 'https://i.pravatar.cc/150?u=raykhel' }
    ];

    const semuaPostingan = [
        { id: 1, author: 'Edward S.', content: 'Hari ini belajar framework baru, seru banget! #coding #belajar', tags: ['coding', 'belajar'] },
        { id: 2, author: 'Jocelin K.', content: 'Menikmati senja di pinggir pantai. #healing #travel', tags: ['healing', 'travel'] },
        { id: 3, author: 'Giofani Catalina', content: 'Lagi ngerjain tugas UTS nih, semangat! #mahasiswa #uts', tags: ['mahasiswa', 'uts'] },
        { id: 4, author: 'Gregorius D.', content: 'Mencoba resep masakan baru, semoga berhasil. #memasak #kuliner', tags: ['memasak', 'kuliner'] }
    ];

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResultContainer = document.getElementById('search-result-container');
    const searchResultsDiv = document.getElementById('search-results');
    const homeSection = document.getElementById('home');
    const mainContent = document.getElementById('mainContent');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const kataKunci = searchInput.value.toLowerCase().trim();
        if (kataKunci) {
            cariDanTampilkan(kataKunci);
        } else {
            homeSection.style.display = 'flex';
            mainContent.style.display = 'block';
            searchResultContainer.style.display = 'none';
        }
    });

    function cariDanTampilkan(query) {
        const hasilUser = semuaUser.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        );

        const hasilPostingan = semuaPostingan.filter(post =>
            post.content.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );

        homeSection.style.display = 'none';
        mainContent.style.display = 'none';
        searchResultContainer.style.display = 'block';
        searchResultsDiv.innerHTML = '';

        if (hasilUser.length === 0 && hasilPostingan.length === 0) {
            searchResultsDiv.innerHTML = '<p>Yah, tidak ada hasil untuk pencarianmu...</p>';
            return;
        }

        hasilUser.forEach(user => {
            const userCardHTML = `
                <div class="user-card">
                    <img src="${user.profilePic}" alt="Foto ${user.name}">
                    <h4>${user.name}</h4>
                    <p>@${user.username}</p>
                </div>
            `;
            searchResultsDiv.innerHTML += userCardHTML;
        });

        hasilPostingan.forEach(post => {
            const postCardHTML = `
                <div class="post-card">
                    <p class="post-author">${post.author}</p>
                    <p class="post-content">${post.content}</p>
                    <p class="post-tags">#${post.tags.join(' #')}</p>
                </div>
            `;
            searchResultsDiv.innerHTML += postCardHTML;
        });
    }
});
feed.addEventListener('click', (e) => {
    const target = e.target;
    const postElement = target.closest('.post');
    if (!postElement) return;
    const postId = Number(postElement.getAttribute('data-post-id'));
    const postIndex = posts.findIndex(p => p.id === postId);

    if (target.closest('.like-btn') && postIndex > -1) {
        const likedIndex = posts[postIndex].likes.indexOf(activeUser);
        if (likedIndex > -1) posts[postIndex].likes.splice(likedIndex, 1);
        else posts[postIndex].likes.push(activeUser);
        localStorage.setItem('posts', JSON.stringify(posts));
    }
    else if (target.classList.contains('submit-comment-btn') && postIndex > -1) {
        const commentInput = postElement.querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        if (commentText) {
            posts[postIndex].comments.push({ author: activeUser, text: commentText });
            localStorage.setItem('posts', JSON.stringify(posts));
        }
    }
    else if (target.classList.contains('follow-btn') && postIndex > -1) {
        const authorToFollow = posts[postIndex].author;
        const followingIndex = users[activeUser].following.indexOf(authorToFollow);
        if (followingIndex > -1) users[activeUser].following.splice(followingIndex, 1);
        else users[activeUser].following.push(authorToFollow);
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        return;
    }
    renderFeed();
});

modalUserList.addEventListener('click', (e) => {
    if (e.target.classList.contains('follow-back-btn')) {
        const userToFollow = e.target.getAttribute('data-username');
        if (userToFollow) {
            const followingList = getFollowing(activeUser);
            if (!followingList.includes(userToFollow)) {
                users[activeUser].following.push(userToFollow);
                localStorage.setItem('users', JSON.stringify(users));
                const currentFollowers = getFollowers(activeUser);
                showUserListModal('Followers', currentFollowers);
            }
        }
    }
});

followersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const userList = getFollowers(activeUser);
    showUserListModal('Followers', userList);
});

followingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const userList = getFollowing(activeUser);
    showUserListModal('Following', userList);
});

const closeModal = () => {
    modal.style.display = "none";
    renderFeed();
}

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        closeModal();
    }
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  window.location.href = "login.html";
});

profileName.textContent = activeUser;
document.addEventListener('DOMContentLoaded', renderFeed);
