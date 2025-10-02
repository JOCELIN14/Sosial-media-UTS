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
