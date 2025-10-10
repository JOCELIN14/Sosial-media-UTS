const posts = JSON.parse(localStorage.getItem("posts")) || [];
const users = JSON.parse(localStorage.getItem("users")) || {};
const activeUser = localStorage.getItem("activeUser");

function initDropdown() {
  const dropdown = document.querySelector(".dropdown");
  const btnStats = document.querySelector(".btn-stats");

  if (btnStats) {
    btnStats.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("show");
    });
  }
}

function initSearchRedirect() {
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "search.html";
    });
  }
}

function renderActivityByCategory() {
  if (!activeUser || !users[activeUser]) return;

  const likedContainer = document.querySelector("#liked .activity-items");
  const likedPosts = posts.filter(
    (p) => p.likes?.includes(activeUser) && p.author !== activeUser
  );
  likedContainer.innerHTML =
    likedPosts.length === 0
      ? "<p style='text-align:center;'>No liked posts.</p>"
      : likedPosts
          .map(
            (p) =>
              `<div class="activity-item">
                <div class="activity-icon">❤️</div>
                <div class="activity-text">You liked ${p.author}'s post: "${p.text || "a photo"}"</div>
              </div>`
          )
          .join("");

  const commentedContainer = document.querySelector("#commented .activity-items");
  const commentedPosts = posts.filter((p) =>
    p.comments?.some((c) => c.author === activeUser)
  );
  commentedContainer.innerHTML =
    commentedPosts.length === 0
      ? "<p style='text-align:center;'>No commented posts.</p>"
      : commentedPosts
          .map(
            (p) =>
              `<div class="activity-item">
                <div class="activity-icon">💬</div>
                <div class="activity-text">You commented on ${p.author}'s post: "${p.text || "a photo"}"</div>
              </div>`
          )
          .join("");

  const followedContainer = document.querySelector("#followed .activity-items");
  const followedUsers = users[activeUser]?.following || [];
  followedContainer.innerHTML =
    followedUsers.length === 0
      ? "<p style='text-align:center;'>No followed users.</p>"
      : followedUsers
          .map(
            (u) =>
              `<div class="activity-item">
                <div class="activity-icon">➕</div>
                <div class="activity-text">You followed ${u}</div>
              </div>`
          )
          .join("");

  const postsContainer = document.querySelector("#posts .activity-items");
  const userPosts = posts.filter((p) => p.author === activeUser);
  postsContainer.innerHTML =
    userPosts.length === 0
      ? "<p style='text-align:center;'>No posts yet.</p>"
      : userPosts
          .map(
            (p) =>
              `<div class="activity-item">
                <div class="activity-icon">📝</div>
                <div class="activity-text">You posted: "${p.text || "a photo"}"</div>
              </div>`
          )
          .join("");
}

window.addEventListener("DOMContentLoaded", () => {
  initDropdown();
  initSearchRedirect();
  renderActivityByCategory();
});
