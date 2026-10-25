(function () {
  try {
    var c = localStorage.getItem("parch-dev-theme") || "system";
    var d =
      c === "dark" ||
      (c === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", d);
  } catch (e) {}
})();
