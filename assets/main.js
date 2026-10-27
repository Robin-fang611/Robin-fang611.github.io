/* 唯一功能：复制邮箱。
   页面不依赖 JS——所有内容在无脚本时完全一致。 */
(function () {
  "use strict";

  var button = document.querySelector("[data-copy]");
  if (!button) return;

  var status = document.querySelector(".contact__status");
  var label = button.textContent;

  function reset() {
    window.setTimeout(function () {
      button.textContent = label;
      if (status) status.textContent = "";
    }, 2200);
  }

  function succeed() {
    button.textContent = "已复制";
    if (status) status.textContent = "邮箱已复制";
    reset();
  }

  function fail() {
    if (status) status.textContent = "请手动选择邮箱";
    reset();
  }

  function legacyCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-1000px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy") ? succeed() : fail();
    } catch (error) {
      fail();
    }
    document.body.removeChild(field);
  }

  button.addEventListener("click", function () {
    var text = button.getAttribute("data-copy");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(succeed, function () {
        legacyCopy(text);
      });
    } else {
      legacyCopy(text);
    }
  });
})();
