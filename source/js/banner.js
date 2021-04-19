const banner = document.querySelector("#navbar");
const insertDom = document.createElement("div");
insertDom.className = "bannerContainer";
insertDom.id = "bannerContainer";
const { location: currentLocal = {} } = window;
const { pathname: currentPath } = currentLocal;

const bannerImageURL = `https://cdn.jsdelivr.net/gh/Cenergy/images/blog/images/banner/`;
const innerHTML = `
            <div class="animated" style="transform: translateX(0);">
                <div class="layer" style="opacity: 0;">
                    <img src="${bannerImageURL}001.webp" alt="001"/>
                </div>
                <div class="layer" style="opacity: 1;">
                    <img src="${bannerImageURL}002.webp" alt="002"/>
                </div>
                <div class="layer" style="opacity: 0;">
                    <video loop autoplay muted src="${bannerImageURL}003.webm"></video>
                </div>
            </div>`;
insertDom.innerHTML = innerHTML;
banner.append(insertDom);

// 动画逻辑start
// $(".navbar-dark").hover(
//   function () {
//     const navbarDarkLength = $(".navbar-dark").length;
//     if (!navbarDarkLength) return;

//     $(".bannerContainer").removeClass("hideBannerContainer");
//     $(".bannerContainer").addClass("slide-in-fwd-top");
//     $(".bannerContainer").removeClass("flip-out-ver-right");
//   },
//   function () {
//     const navbarDarkLength = $(".navbar-dark").length;
//     if (!navbarDarkLength) return;
//     $(".bannerContainer").removeClass("slide-in-fwd-top");
//     $(".bannerContainer").addClass("flip-out-ver-right");
//   }
// );
// 动画逻辑end

const mainLayers = $(".bannerContainer");
const [mainLayer, ..._] = mainLayers;
const animatedLayers = $(".animated");
const animatedLayer = animatedLayers[0];
const [leftLayer, theLayer, rightLayer] = $(".layer");
// 初始化变量
let countEnter = 0; // 移入位置
const resistance = 110; // 阻力
const opacityDistance = 70; // 透明的距离
// 初始化方法
const sizeLimit = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
const getWidth = () => (leftLayer.offsetWidth - animatedLayer.offsetWidth) / 2;
// 光标进入
const onEnter = ({ clientX }) => (countEnter = clientX);
// 光标移动
const onMove = ({ clientX }) => {
  const differenceWidth = getWidth();
  let translateX = countEnter - clientX; // 光标偏移量
  // 偏移量阻力计算
  const resistanceOffset = translateX / resistance / 100;
  translateX *= translateX > 0 ? resistanceOffset : -resistanceOffset;
  // Box 盒子偏移
  animatedLayer.style.transform = `translateX(${sizeLimit(
    translateX,
    -differenceWidth,
    differenceWidth
  )}px)`;
  // 透明的计算
  const opacity = sizeLimit(
    (translateX >= 0 ? translateX : -translateX) / opacityDistance
  );
  theLayer.style.opacity = (1 - opacity).toString();
  if (translateX >= 0) {
    leftLayer.style.opacity = opacity.toString();
  } else {
    rightLayer.style.opacity = opacity.toString();
  }
};
// 光标离开 ~ 进入css动画 ~ 全部参数重置
const onLeave = () => {
  animatedLayer.classList.add("css-animated");
  theLayer.style.opacity = "1";
  leftLayer.style.opacity = "0";
  rightLayer.style.opacity = "0";
  animatedLayer.style.transform = "translateX(0)";
  setTimeout(function () {
    animatedLayer.classList.remove("css-animated");
  }, 300);
};
// 绑定方法

const navbarDoms = $("#navbar");
if (navbarDoms && navbarDoms.length) {
  navbarDoms[0].addEventListener("mousemove", onMove);
  navbarDoms[0].addEventListener("mouseenter", onEnter);
  navbarDoms[0].addEventListener("mouseleave", onLeave);
}
