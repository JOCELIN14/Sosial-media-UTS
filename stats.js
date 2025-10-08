const posts = JSON.parse(localStorage.getItem("posts")) || [];
const activeUser = localStorage.getItem("activeUser");

const userPosts = posts.filter(p => p.author === activeUser);
const totalPosts = userPosts.length;
const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
const totalComments = userPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

document.getElementById("postCount").textContent = totalPosts;
document.getElementById("likeCount").textContent = totalLikes;
document.getElementById("commentCount").textContent = totalComments;

const popular = [...userPosts].sort((a, b) => 
  (b.likes?.length || 0) + (b.comments?.length || 0) - ((a.likes?.length || 0) + (a.comments?.length || 0))
).slice(0, 3);

const popularList = document.getElementById("popularPosts");
if (popular.length === 0) {
  popularList.innerHTML = "<p>No Posts</p>";
} else {
  popular.forEach(p => {
    const el = document.createElement("div");
    el.classList.add("post-item");
    el.innerHTML = `
      <h4>${p.text || "No Text"}</h4>
      <p>❤️ ${p.likes?.length || 0} | 💬 ${p.comments?.length || 0}</p>
    `;
    popularList.appendChild(el);
  });
}

const canvas = document.getElementById("activityChart");
const ctx = canvas.getContext("2d");

const labels = ["Posts", "Likes", "Comments"];
const values = [totalPosts, totalLikes, totalComments];
const colors = ["#1e90ff", "#28a745", "#ffa500"];
const maxVal = Math.max(...values, 5);
const chartHeight = 250;

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

    let progress = 0;
    const animate = () => {
      if (progress < barHeight) {
        ctx.clearRect(x - 40, 50, 120, 280);
        drawGrid();
        ctx.fillStyle = gradient;
        ctx.roundRect(x - 25, 320 - progress, 50, progress, 8);
        ctx.fill();
        progress += 5;
        requestAnimationFrame(animate);
      } else {
        ctx.fillStyle = gradient;
        ctx.roundRect(x - 25, y, 50, barHeight, 8);
        ctx.fill();
        ctx.fillStyle = "#333";
        ctx.fillText(val, x, y - 10);
        ctx.fillText(labels[i], x, 340);
      }
    };
    animate();
  });
}

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

drawChart();


