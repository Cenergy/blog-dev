const { root: siteRoot = "/" } = hexo.config;

hexo.extend.injector.register('body_end', function () {
    const {
        enable,
        btn_icon,
        btn_text,
        comment,
        qrcodes,
    } = hexo.config.reward_button;

    if (!enable) {
        return null;
    }

    return `
    <link defer rel="stylesheet" href="${siteRoot}/styles/reward-button.css"/>
    <script src="${siteRoot}/js/reward-button.js"></script>
    <script>
        new RewardButton({
            btnIcon: ${btn_icon ? `"${btn_icon}"` : "null"},
            btnText: "${btn_text}",
            comment: "${comment}",
            qrcodes: ${JSON.stringify(qrcodes)}
        }).init();
    </script>
    `
}, "post");