let display = document.getElementById("display");
let historyBox = document.getElementById("history");
let mode = "DEG";
let memory = 0;
let ans = 0;

let history = [];
let historyIndex = -1;

/* ================= INPUT ================= */
function insert(val){
  display.value += val;
}

function insertFraction(){
  display.value += "1/2";
}

function del(){
  display.value = display.value.slice(0,-1);
}

function clearAll(){
  display.value = "";
}

/* ================= HISTORY ================= */
function historyUp(){
  if(history.length === 0) return;
  historyIndex = Math.max(0, historyIndex - 1);
  display.value = history[historyIndex];
}

function historyDown(){
  if(history.length === 0) return;
  historyIndex = Math.min(history.length - 1, historyIndex + 1);
  display.value = history[historyIndex];
}

/* ================= MODE ================= */
function toggleMode(){
  mode = mode==="DEG"?"RAD":"DEG";
  document.getElementById("mode").innerText = mode;
}

/* ================= MEMORY ================= */
function memAdd(){ memory += ans; }
function memSub(){ memory -= ans; }
function memRecall(){ display.value += memory; }
function memClear(){ memory = 0; }

/* ================= FRACTION ================= */
function Fraction(n,d){
  this.n = n;
  this.d = d;
}

function simplify(fr){
  let g = gcd(fr.n, fr.d);
  return new Fraction(fr.n/g, fr.d/g);
}

function gcd(a,b){ return b ? gcd(b,a%b) : a; }

/* ================= CALCULATE ================= */
function calculate(){
  try{
    let expr = display.value.replace(/Ans/g, ans);
    let result = parse(expr);

    ans = result;

    history.push(expr);
    historyIndex = history.length;

    historyBox.innerHTML += expr + " = " + result + "<br>";

    display.value = result;

  }catch(e){
    display.value = "Math ERROR";
  }
}

/* ================= PARSER ================= */
function parse(expr){
  expr = expr.replace(/pi/g, Math.PI);

  // basic operators only (RPN-lite)
  let safe = expr
    .replace(/\^/g,"**")
    .replace(/sin\((.*?)\)/g,(_,x)=> trig(Math.sin, x))
    .replace(/cos\((.*?)\)/g,(_,x)=> trig(Math.cos, x))
    .replace(/tan\((.*?)\)/g,(_,x)=> trig(Math.tan, x))
    .replace(/log\((.*?)\)/g,(_,x)=> Math.log10(parse(x)))
    .replace(/ln\((.*?)\)/g,(_,x)=> Math.log(parse(x)))
    .replace(/sqrt\((.*?)\)/g,(_,x)=> Math.sqrt(parse(x)));

  return Function("return "+safe)();
}

/* ================= TRIG ================= */
function trig(fn, x){
  let v = parse(x);
  return mode==="DEG" ? fn(v*Math.PI/180) : fn(v);
}
