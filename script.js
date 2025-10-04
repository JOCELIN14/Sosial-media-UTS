const authContainer = document.getElementById("authContainer");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const feed = document.getElementById("feed");

postBtn.addEventListener("click", () => {
  const text = postInput.value.trim();
  if (text !== "") {
    const post = document.createElement("div");
    post.classList.add("post");

    post.innerHTML = `
      <h3>Pengguna Anonim</h3>
      <p>${text}</p>
    `;

    feed.prepend(post);

    postInput.value = "";
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