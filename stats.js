const posts = JSON.parse(localStorage.getItem("posts")) || [];
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

function renderStatistics() {
  const postCount = document.getElementById("postCount");
  const likeCount = document.getElementById("likeCount");
  const commentCount = document.getElementById("commentCount");
  const popularList = document.getElementById("popularPosts");
  const canvas = document.getElementById("activityChart");

  if (!activeUser || !postCount || !likeCount || !commentCount) return;

  const userPosts = posts.filter((p) => p.author === activeUser);
  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalComments = userPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

  postCount.textContent = totalPosts;
  likeCount.textContent = totalLikes;
  commentCount.textContent = totalComments;

  const popular = [...userPosts]
    .sort(
      (a, b) =>
        (b.likes?.length || 0) + (b.comments?.length || 0) -
        ((a.likes?.length || 0) + (a.comments?.length || 0))
    )
    .slice(0, 3);

  if (popularList) {
    popularList.innerHTML =
      popular.length === 0
        ? "<p style='text-align:center;'>No posts yet.</p>"
        : popular
            .map(
              (p) =>
                `<div class="post-item">
                  <h4>${p.text || "Untitled"}</h4>
                  <p>❤️ ${p.likes?.length || 0} | 💬 ${p.comments?.length || 0}</p>
                </div>`
            )
            .join("");
  }

  if (canvas) {
    const ctx = canvas.getContext("2d");
    const labels = ["Posts", "Likes", "Comments"];
    const values = [totalPosts, totalLikes, totalComments];
    const colors = ["#1e90ff", "#28a745", "#ffa500"];
    const maxVal = Math.max(...values, 5);
    const chartHeight = 250;

    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };

    function drawGrid() {
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = 320 - (i * chartHeight) / 5;
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(600, y);
        ctx.stroke();
      }
    }

    function drawChart() {
      drawGrid();
      ctx.textAlign = "center";
      ctx.font = "14px Poppins";
      ctx.fillStyle = "#333";

      values.forEach((val, i) => {
        const x = 120 + i * 160;
        const barHeight = (val / maxVal) * chartHeight;
        const y = 320 - barHeight;

        const gradient = ctx.createLinearGradient(x, y, x, 320);
        gradient.addColorStop(0, colors[i]);
        gradient.addColorStop(1, "#b0c4ff");

        ctx.fillStyle = gradient;
        ctx.roundRect(x - 25, y, 50, barHeight, 8);
        ctx.fill();

        ctx.fillStyle = "#333";
        ctx.fillText(val, x, y - 10);
        ctx.fillText(labels[i], x, 340);
      });
    }

    drawChart();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initDropdown();
  renderStatistics();
});
