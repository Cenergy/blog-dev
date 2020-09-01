var glslEditor = {};

function loadjscssfile(filename, filetype, callback) {
  if (filetype == "js") {
    //if filename is a external JavaScript file
    var fileref = document.createElement("script");
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
  } else if (filetype == "css") {
    //if filename is an external CSS file
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
  }

  fileref.onload = callback;
  fileref.onreadystatechange = callback;

  if (typeof fileref != "undefined") {
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
}

window.onload = function () {
  // if ()
  if (window.GlslEditor && window.GlslEditor) {
    init();
  } else {
    console.log("Try to load a local glslEditor");
    if (!window.glslEditor) {
      loadjscssfile("src/glslEditor/build/glslEditor.css", "css");
      loadjscssfile("src/glslEditor/build/glslEditor.js", "js", init);
    }
  }
};

function init() {
  glslEditor = new GlslEditor("#glsl_editor", {
    canvas_size: 500,
    canvas_draggable: true,
    theme: "monokai",
    multipleBuffers: true,
    watchHash: true,
    fileDrops: true,
    menu: true,
  });
  document.body.style.backgroundColor = window
    .getComputedStyle(glslEditor.editor.getWrapperElement(), null)
    .getPropertyValue("background-color");
}
