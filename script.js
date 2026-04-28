const PROXY = "https://your-worker.workers.dev/?url="; // CHANGE THIS
let selectedText = "";

/* ===== FIND MAIN CONTENT ===== */
function findMainContent(doc){
    let candidates = doc.querySelectorAll("article, main, .entry-content, .post-content, .content");

    let best = null;
    let maxText = 0;

    candidates.forEach(el => {
        let len = el.innerText.length;
        if(len > maxText){
            maxText = len;
            best = el;
        }
    });

    return best || doc.body;
}

/* ===== REMOVE JUNK ===== */
function cleanJunk(container){
    container.querySelectorAll(
        "script, style, noscript, header, footer, nav, aside, iframe, form, button"
    ).forEach(el => el.remove());

    container.querySelectorAll(
        ".sidebar, .ads, .advertisement, .comments, .footer, .menu"
    ).forEach(el => el.remove());
}

/* ===== REMOVE HIDDEN ===== */
function cleanHidden(container){
    container.querySelectorAll("*").forEach(el => {
        let style = window.getComputedStyle(el);

        if(
            style.display === "none" ||
            style.visibility === "hidden" ||
            style.opacity === "0"
        ){
            el.remove();
        }
    });
}

/* ===== REMOVE FAKE TEXT (OFFSCREEN) ===== */
function removeOffscreen(container){
    container.querySelectorAll("*").forEach(el => {
        let rect = el.getBoundingClientRect();

        if(rect.width === 0 || rect.height === 0){
            el.remove();
        }
    });
}

/* ===== KDT DECODE ===== */
function decodeKDT(encoded){
    try{
        let decoded = atob(encoded);
        let reversed = decoded.split("").reverse().join("");

        if(reversed.startsWith("ptth")){
            reversed = reversed.replace(/^ptth/, "http");
        }
        if(reversed.startsWith("sptth")){
            reversed = reversed.replace(/^sptth/, "https");
        }

        return reversed;
    }catch(e){
        return null;
    }
}

/* ===== APPLY PROXY ===== */
function proxify(url){
    return PROXY + encodeURIComponent(url);
}

/* ===== MAIN ===== */
function render(){
    let raw = document.getElementById("input").value;

    let parser = new DOMParser();
    let doc = parser.parseFromString(raw, "text/html");

    let content = findMainContent(doc).cloneNode(true);

    cleanJunk(content);
    cleanHidden(content);
    removeOffscreen(content);

    /* ===== FIX IMAGES ===== */
    content.querySelectorAll("img").forEach(img => {
        let src =
            img.getAttribute("src") ||            img.getAttribute("data-src") ||
            img.getAttribute("data-lazy-src");

        if(src){
            img.src = proxify(src);
        }
    });

    /* ===== KDT CANVAS ===== */
    content.querySelectorAll(".kdt-img-canvas").forEach(canvas => {
        let data = canvas.getAttribute("data-kdt");
        let url = decodeKDT(data);

        if(url){
            let img = document.createElement("img");
            img.src = proxify(url);
            canvas.replaceWith(img);
        }
    });

    document.getElementById("reader").innerHTML = content.innerHTML;
}

/* ===== COPY SYSTEM ===== */
document.addEventListener("mouseup", saveSelection);
document.addEventListener("touchend", saveSelection);

function saveSelection(){
    let sel = window.getSelection().toString().trim();
    if(sel){
        selectedText = sel;
        document.getElementById("copyBtn").style.display = "block";
    }
}

function copyText(){
    if(!selectedText) return;

    navigator.clipboard.writeText(selectedText);
    selectedText = "";
    document.getElementById("copyBtn").style.display = "none";
}
