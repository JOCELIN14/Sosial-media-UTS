document.addEventListener("DOMContentLoaded", () => {
    // This function from script.js will handle showing the badge in the header
    setupNotifications();

    const activeUser = localStorage.getItem("activeUser");
    if (!activeUser) {
        window.location.href = "login.html";
        return;
    }

    const notificationListContainer = document.getElementById("notificationList");
    let allUsers = JSON.parse(localStorage.getItem("users")) || {};
    const currentUser = allUsers[activeUser];
    const notifications = currentUser?.notifications || [];

    if (notifications.length === 0) {
        notificationListContainer.innerHTML = '<p class="no-notifications-page">Tidak ada notifikasi untuk ditampilkan.</p>';
        return;
    }
    
    // Build the HTML for all notifications
    notificationListContainer.innerHTML = notifications.map(n => {
        let message = '';
        switch (n.type) {
            case 'like':
              message = `<strong>${n.fromUser}</strong> menyukai postingan Anda.`;
              break;
            case 'comment':
              message = `<strong>${n.fromUser}</strong> mengomentari postingan Anda.`;
              break;
            case 'follow':
              message = `<strong>${n.fromUser}</strong> mulai mengikuti Anda.`;
              break;
            default:
              message = 'Notifikasi baru.';
        }
        
        const profilePic = allUsers[n.fromUser]?.profilePic || 'images/profile.png';
        const isUnread = !n.read ? 'unread' : ''; // Check if the notification was unread

        return `
            <div class="notification-item-page ${isUnread}">
                <img src="${profilePic}" alt="${n.fromUser}">
                <p>${message}</p>
            </div>
        `;
    }).join('');

    // Mark all notifications as read once the page is viewed
    if (currentUser && currentUser.notifications) {
        currentUser.notifications.forEach(n => n.read = true);
        allUsers[activeUser] = currentUser;
        localStorage.setItem('users', JSON.stringify(allUsers));
    }
});