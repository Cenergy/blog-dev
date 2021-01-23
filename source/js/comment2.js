console.log("rdapp - window", window)
new Waline({
  el: "#waline",
  path: location.pathname,
  serverURL: "https://waline.aigisss.com/",
  placeholder: "留下您的意见或建议...(审核后可见)!",
});
