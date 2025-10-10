document.addEventListener("DOMContentLoaded", () => {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    window.location.href = "login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  const contactList = document.getElementById("contactList");
  const chatMessages = document.getElementById("chatMessages");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const currentChatHeader = document.getElementById("currentChatHeader");
  const searchContact = document.getElementById("searchContact");

  let currentChatPartner = null;
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};

  if (!chatHistory[activeUser]) {
    chatHistory[activeUser] = {};
  }

  function loadContacts(searchQuery = "") {
    const contactsScroll = document.querySelector(".contacts-scroll");
    if (!contactsScroll) return;

    contactsScroll.innerHTML = "";

    const otherUsers = Object.keys(users).filter((u) => u !== activeUser);

    const filteredUsers = otherUsers.filter(
      (username) =>
        username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (users[username].name &&
          users[username].name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );

    if (filteredUsers.length === 0) {
      contactsScroll.innerHTML =
        '<div style="text-align: center; padding: 20px; color: #999;">Tidak ada kontak ditemukan</div>';
      return;
    }

    filteredUsers.forEach((username) => {
      const contact = users[username];
      const lastMessage = getLastMessage(username);
      const unreadCount = getUnreadCount(username);

      const contactItem = document.createElement("div");
      contactItem.className = "contact-item";
      contactItem.setAttribute("data-username", username);

      let profilePic = "images/profile.png";
      if (typeof getProfilePic === "function") {
        profilePic = getProfilePic(username);
      } else if (contact.profilePic) {
        profilePic = contact.profilePic;
      }

      contactItem.innerHTML = `
        <img src="${profilePic}" alt="${username}" />
        <div class="contact-info">
          <div class="contact-name">${contact.name || username}</div>
          <div class="contact-last-message">${
            lastMessage || "Belum ada pesan"
          }</div>
        </div>
        <div class="contact-meta">
          <span class="message-time">${getLastMessageTime(username)}</span>
          ${
            unreadCount > 0
              ? `<span class="unread-badge">${unreadCount}</span>`
              : ""
          }
        </div>
      `;

      contactItem.addEventListener("click", () => selectContact(username));
      contactsScroll.appendChild(contactItem);
    });
  }

  function selectContact(username) {
    currentChatPartner = username;

    document.querySelectorAll(".contact-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`[data-username="${username}"]`)
      ?.classList.add("active");

    const contact = users[username];
    let profilePic = "images/profile.png";
    if (typeof getProfilePic === "function") {
      profilePic = getProfilePic(username);
    } else if (contact.profilePic) {
      profilePic = contact.profilePic;
    }

    currentChatHeader.innerHTML = `
      <div class="chat-header-left">
        <img src="${profilePic}" alt="${username}" class="header-avatar" />
        <div class="header-info">
          <h4 class="header-name">${contact.name || username}</h4>
          <span class="header-status">Online</span>
        </div>
      </div>
      <div class="chat-header-actions">
        <button class="header-btn" title="Cari pesan">
          <i class="fas fa-search"></i>
        </button>
        <button class="header-btn" title="Info kontak">
          <i class="fas fa-info-circle"></i>
        </button>
        <button class="header-btn" title="Menu">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    `;

    loadMessages(username);

    markAsRead(username);

    messageInput.focus();
  }

  function loadMessages(username) {
    chatMessages.innerHTML = "";

    const messages = getMessages(username);

    if (messages.length === 0) {
      chatMessages.innerHTML = `
        <div style="text-align: center; color: #888; padding: 50px;">
          <i class="fas fa-comments" style="font-size: 5rem; color: #ccc; margin-bottom: 15px;"></i>
          <p>Belum ada pesan. Mulai percakapan sekarang!</p>
        </div>
      `;
      return;
    }

    let currentDate = null;

    messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp).toLocaleDateString("id-ID");

      if (msgDate !== currentDate) {
        currentDate = msgDate;
        const divider = document.createElement("div");
        divider.className = "date-divider";
        divider.innerHTML = `<span>${formatDateDivider(msg.timestamp)}</span>`;
        chatMessages.appendChild(divider);
      }
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${
        msg.sender === activeUser ? "sender" : "receiver"
      }`;

      messageDiv.innerHTML = `
        <div class="message-content">${escapeHtml(msg.text)}</div>
        <div class="message-time">${formatTime(msg.timestamp)}</div>
      `;

      chatMessages.appendChild(messageDiv);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendMessage() {
    if (!currentChatPartner) {
      alert("Pilih kontak terlebih dahulu!");
      return;
    }

    const text = messageInput.value.trim();
    if (!text) return;

    const message = {
      id: Date.now(),
      sender: activeUser,
      receiver: currentChatPartner,
      text: text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    saveMessage(currentChatPartner, message);

    messageInput.value = "";

    loadMessages(currentChatPartner);

    loadContacts();

    console.log("✅ Message sent:", message);
  }

  function getMessages(username) {
    if (!chatHistory[activeUser] || !chatHistory[activeUser][username]) {
      return [];
    }
    return chatHistory[activeUser][username];
  }

  function saveMessage(username, message) {
    if (!chatHistory[activeUser]) {
      chatHistory[activeUser] = {};
    }
    if (!chatHistory[activeUser][username]) {
      chatHistory[activeUser][username] = [];
    }

    chatHistory[activeUser][username].push(message);

    if (!chatHistory[username]) {
      chatHistory[username] = {};
    }
    if (!chatHistory[username][activeUser]) {
      chatHistory[username][activeUser] = [];
    }
    chatHistory[username][activeUser].push(message);

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }

  function getLastMessage(username) {
    const messages = getMessages(username);
    if (messages.length === 0) return "";

    const lastMsg = messages[messages.length - 1];
    const text =
      lastMsg.text.length > 30
        ? lastMsg.text.substring(0, 30) + "..."
        : lastMsg.text;

    return lastMsg.sender === activeUser ? `Anda: ${text}` : text;
  }

  function getLastMessageTime(username) {
    const messages = getMessages(username);
    if (messages.length === 0) return "";

    const lastMsg = messages[messages.length - 1];
    return formatTime(lastMsg.timestamp);
  }

  function getUnreadCount(username) {
    const messages = getMessages(username);
    return messages.filter((msg) => msg.sender === username && !msg.read)
      .length;
  }

  function markAsRead(username) {
    if (!chatHistory[activeUser] || !chatHistory[activeUser][username]) return;

    chatHistory[activeUser][username].forEach((msg) => {
      if (msg.sender === username) {
        msg.read = true;
      }
    });

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    loadContacts();
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Kemarin";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("id-ID", { weekday: "short" });
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  }

  function formatDateDivider(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hari ini";
    } else if (diffDays === 1) {
      return "Kemarin";
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (messageInput) {
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (searchContact) {
    searchContact.addEventListener("input", (e) => {
      loadContacts(e.target.value);
    });
  }

  const newChatBtn = document.querySelector(".new-chat-btn");
  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      alert("Fitur chat baru akan segera hadir!");
    });
  }

  loadContacts();

  const firstContact = document.querySelector(".contact-item");
  if (firstContact) {
    const username = firstContact.getAttribute("data-username");
    if (username) {
      selectContact(username);
    }
  }

  console.log("Pesan terkirim:", activeUser);
});
