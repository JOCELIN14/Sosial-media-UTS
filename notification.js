document.addEventListener("DOMContentLoaded", () => {
    setupNotifications();

    const activeUser = localStorage.getItem("activeUser");
    if (!activeUser) {
        window.location.href = "login.html";
        return;
    }

    const notificationListContainer = document.getElementById("notificationList");
    let allUsers = JSON.parse(localStorage.getItem("users")) || {};
    const currentUser = allUsers[activeUser];

    const notificationsToDisplay = [...(currentUser?.notifications || [])];

    if (!notificationListContainer) {
        console.error("Error: Notification list container with id='notificationList' not found on the page.");
        return;
    }

    if (notificationsToDisplay.length === 0) {
        notificationListContainer.innerHTML = '<p class="no-notifications-page">Tidak ada notifikasi untuk ditampilkan.</p>';
    } else {
        notificationListContainer.innerHTML = notificationsToDisplay.map(n => {
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
            const isUnread = !n.read ? 'unread' : '';

            return `
                <div class="notification-item-page ${isUnread}">
                    <img src="${profilePic}" alt="${n.fromUser}">
                    <p>${message}</p>
                </div>
            `;
        }).join('');
    }

    if (currentUser && currentUser.notifications && currentUser.notifications.length > 0) {
        currentUser.notifications.forEach(n => n.read = true);
        allUsers[activeUser] = currentUser;
        localStorage.setItem('users', JSON.stringify(allUsers));
    }
});