const bannerContainer = $("#banner");
const realBanner = $("#web_bg");
const bannerMask = $("#banner .mask");
console.log("rdapp - bannerMask", bannerMask);
const aa = $(bannerContainer).css("background-image");
$(realBanner).css("background-image", aa);
$(bannerContainer).css("background-image", "");
const color = $(bannerMask).css("background-color");
let realColor;
try {
  const result = color.match(/\(([^)]*)\)/);
  if (result) {
    const colorStr = result[1];
    const realColorStr = `rgba(${colorStr},0)`;
    realColor = realColorStr;
  }
} catch (error) {
    realColor='rgba(0,0,0,0)'
}
// $(bannerMask).css("background-color",`linear-gradient(${color}, ${realColor})`);
$(bannerMask).css("background-color",`rgba(0,0,0,0)`);
$(realBanner).css("background-color", color);

