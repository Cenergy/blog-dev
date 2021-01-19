console.log("rdapp - window", window)
new Waline({
  el: "#waline",
  path: location.pathname,
  serverURL: "https://weline.vercel.app/",
  placeholder: "您的意见或建议是我的动力!!",
});
