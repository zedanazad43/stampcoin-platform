(function () {
    function parseSocialRoute(hash, selectedGroupId) {
        const cleanHash = String(hash || "").replace(/^#/, "").trim();
        if (cleanHash.startsWith("profile/")) {
            return { view: "profile", value: decodeURIComponent(cleanHash.slice("profile/".length)) };
        }
        if (cleanHash.startsWith("group/")) {
            return { view: "group", value: decodeURIComponent(cleanHash.slice("group/".length)) };
        }
        if (cleanHash === "group") {
            return { view: "group", value: selectedGroupId || "" };
        }
        return { view: "feed", value: "" };
    }

    function normalizeTopNavHash(hash) {
        const currentHash = hash || "#hero";
        if (currentHash.startsWith("#profile/") || currentHash.startsWith("#group/")) {
            return "#stampbook-social";
        }
        return currentHash;
    }

    globalThis.StampbookSocialState = {
        parseSocialRoute,
        normalizeTopNavHash
    };
})();
