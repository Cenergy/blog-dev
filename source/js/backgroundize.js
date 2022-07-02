(function () {
  const { CONFIG: websiteConfig, location: websiteLocation } = window;
  fetch(`${websiteLocation.origin}${websiteConfig.root}config/config.json`)
    .then((response) => response.json()) // parses response to JSON
    .then(function (res) {
      const { pathname } = websiteLocation;
      const bannerContainer = $("#banner");
      const viewBg = $("#web_bg");
      const bannerMask = $("#banner .mask");
      const bg = $(bannerContainer).css("background-image");
      $(bannerContainer).css("background-image", "url()");
      $(bannerMask).css("background-color", `rgba(0,0,0,0)`);
      const composeObject = {
        "background-image": bg,
        "background-size": "cover",
      };

      const handleNames = ["posts"];

      if (pathname.includes("/posts/")) {
        const { content = {}, mask = {} } = res.config.posts;
        if (Object.keys(content).length) {
          $(viewBg).css(content);
        } else {
          $(viewBg).css(composeObject);
        }
        if (Object.keys(mask).length) {
          $(bannerMask).css(mask);
        } else {
          $(bannerMask).css("background-color", `rgba(0,0,0,0)`);
        }

        return;
      }

      const { content: homeContent = {} } = res.config.home;
      $(viewBg).css(homeContent);
    })
    .catch(function () {
      const bannerContainer = $("#banner");
      const viewBg = $("#web_bg");
      const bannerMask = $("#banner .mask");
      const bg = $(bannerContainer).css("background-image");
      const composeObject = {
        "background-image": bg,
        "background-size": "cover",
      };
      $(viewBg).css(composeObject);
      $(bannerContainer).css("background-image", "url()");
      const color = $(bannerMask).css("background-color");
      $(bannerMask).css("background-color", `rgba(0,0,0,0)`);
      $(viewBg).css("background-color", color);
    });
})();
