module.exports = () => {

  function isVisible(el){
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  document.querySelectorAll("*").forEach(el => {

    // remove junk
    if(["SCRIPT","STYLE","NOSCRIPT","IFRAME","NAV","FOOTER","HEADER"].includes(el.tagName)){
      el.remove();
      return;
    }

    // remove ads
    let cls = (el.className || "").toLowerCase();
    if(cls.includes("ad") || cls.includes("banner") || cls.includes("popup")){
      el.remove();
      return;
    }

    // remove invisible
    if(!isVisible(el)){
      el.remove();
    }

  });

  return document.body.innerHTML;
};
