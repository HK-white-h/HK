let selectedText = "";

/* ===== RENDER ===== */
function render(){
    let raw = document.getElementById("input").value;

    let parser = new DOMParser();
    let doc = parser.parseFromString(raw, "text/html");

    let content = doc.body;

    // REMOVE BLOCKING ELEMENTS
    content.querySelectorAll("script, style, noscript").forEach(el => el.remove());

    // REMOVE COPY BLOCK ATTRIBUTES
    content.querySelectorAll("*").forEach(el => {
        el.removeAttribute("oncopy");
        el.removeAttribute("oncut");
        el.removeAttribute("onpaste");
        el.removeAttribute("oncontextmenu");
        el.removeAttribute("onselectstart");
        el.removeAttribute("ondragstart");
    });

    // REMOVE BLOGGER JUNK
    content.querySelectorAll(
        "#comments, .comments, .footer, #footer, .sidebar, iframe, #Attribution1"
    ).forEach(el => el.remove());

    // OUTPUT CLEAN HTML
    document.getElementById("reader").innerHTML = content.innerHTML;
}

/* ===== CAPTURE SELECTION (FIXED) ===== */
document.addEventListener("mouseup", saveSelection);
document.addEventListener("touchend", saveSelection);

function saveSelection(){
    let sel = window.getSelection().toString().trim();

    if(sel.length > 0){
        selectedText = sel;
        document.getElementById("copyBtn").style.display = "block";
    }
}

/* ===== COPY SELECTED TEXT ===== */
function copyText(){
    if(!selectedText){
        alert("No text selected!");
        return;
    }

    navigator.clipboard.writeText(selectedText).then(() => {
        alert("Copied!");
        selectedText = "";
        document.getElementById("copyBtn").style.display = "none";
        window.getSelection().removeAllRanges();
    });
}
