var frindLinkDoms = document.querySelector(".links");
console.log("rdapp - frindLinkDoms", frindLinkDoms);
const onerror_avatar='https://api.btstu.cn/sjtx/api.php?lx=c1&format=images'
fetch("https://api.aigisss.com/comments/friends/")
  .then((res) => res.json())
  .then((item) => {
    const { code, data } = item;
    if (code !== 200) return;
    let appendHtml=''
    data.reverse().map((value)=>{
        const {title,intro,link,avatar}=value;
        const tempHtml=`<div class="card col-lg-4 col-md-6 col-sm-12">
        <a href="${link}" class="card-body hover-with-bg" target="_blank" rel="noopener external nofollow noreferrer">
          <div class="card-content">
              <div class="link-avatar my-auto">
                <img src="${avatar}" alt="${title}" onerror="this.onerror=null; this.src=this.srcset='${onerror_avatar}'">
              </div>
            
            <div class="link-text">
              <div class="link-title">${title}</div>
              <div class="link-intro">${intro}</div>
            </div>
          </div>
        </a>
      </div>`
      appendHtml+=tempHtml
    })
    frindLinkDoms.innerHTML=appendHtml
  });
