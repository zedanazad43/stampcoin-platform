(function () {
    function initializeSocialExperience(ctx) {
        const {
            loadSocialBootstrap,
            loadCommunityPosts,
            loadGroups,
            loadFriendsBoard,
            loadNotifications,
            handleSocialRoute,
            syncTopNav,
            setTheme,
            setCompactMode,
            setLeftRailCollapsed,
            compactModeStorageKey,
            leftRailStorageKey,
            notificationPollIntervalMs
        } = ctx;

        loadSocialBootstrap();
        loadCommunityPosts();
        loadGroups();
        loadFriendsBoard();
        loadNotifications();
        handleSocialRoute();
        syncTopNav();

        setTheme(localStorage.getItem("stampbook-theme") || "classic");
        setCompactMode(localStorage.getItem(compactModeStorageKey) === "1");
        setLeftRailCollapsed(localStorage.getItem(leftRailStorageKey) === "1");

        return window.setInterval(() => {
            if (document.hidden) {
                return;
            }
            loadNotifications();
        }, Number(notificationPollIntervalMs) || 30000);
    }

    globalThis.StampbookSocialCore = {
        initializeSocialExperience
    };
})();
