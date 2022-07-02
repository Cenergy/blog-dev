function RewardButton(config) {
    this.btnIcon = config.btnIcon;
    this.btnText = config.btnText;
    this.comment = config.comment;
    this.qrcodes = config.qrcodes;
}

RewardButton.prototype = {
    init: function () {
        let btnId = "reward-btn";
        let qrcodesId = "reward-qrcodes";

        var btn = document.createElement("a");
        btn.className = "btn";
        btn.id = btnId;

        if (this.btnIcon) {
            btn.className = `${this.btnIcon} ${btn.className}`;
            btn.innerHTML = " " + this.btnText;
        } else {
            btn.innerHTML = this.btnText;
        }

        var qrcodes = document.createElement("div");
        qrcodes.id = qrcodesId;

        var div = document.createElement("div");
        div.className = "markdown-body";
        div.style.textAlign = "center"
        div.appendChild(btn);
        div.innerHTML += `<br><span class="image-caption">${this.comment}</span>`;
        div.appendChild(qrcodes);

        var postNav = document.querySelector('.post-prevnext');
        postNav.parentNode.insertBefore(div, postNav);

        document.getElementById(btnId).onclick = (function () {
            var container = document.getElementById(qrcodesId);

            if (container.childNodes.length == 0) {
                for (var i = 0; i < this.qrcodes.length; i++) {
                    var qrcode = document.createElement("p");
                    qrcode.className = "reward-qrcode";

                    var img = document.createElement("img");
                    img.src = this.qrcodes[i].src;
                    img.title = this.qrcodes[i].title;
                    img.alt = this.qrcodes[i].title;

                    var caption = document.createElement("p");
                    caption.className = "image-caption";
                    caption.innerText = this.qrcodes[i].caption;

                    qrcode.appendChild(img);
                    qrcode.appendChild(caption);
                    container.appendChild(qrcode);
                }
            } else if (container.style.display == "none") {
                container.style.removeProperty("display");
            } else {
                container.style.display = "none";
            }
        }).bind(this);
    }
};