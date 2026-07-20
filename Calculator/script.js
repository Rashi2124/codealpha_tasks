/* ============================
   NeoCalc v2 - Part 1
============================ */

const display = document.getElementById("display");
const buttons = document.querySelectorAll("[data-value]");

const historyList = document.getElementById("history-list");
const clearHistory = document.getElementById("clear-history");

const themeBtn = document.getElementById("theme-btn");
const sciBtn = document.getElementById("sci-btn");
const sciPanel = document.getElementById("scientific-panel");

const degBtn = document.getElementById("degBtn");
const radBtn = document.getElementById("radBtn");

const time = document.getElementById("time");

let expression = "";
let memory = 0;
let history = [];
// Load History from Local Storage

history = JSON.parse(localStorage.getItem("calcHistory")) || [];

history.forEach(item => {

    const li = document.createElement("li");

    li.textContent = item;

    historyList.appendChild(li);

});

let degreeMode = true;

/* ============================
   Live Clock
============================ */

function updateClock() {

    const now = new Date();

    time.innerHTML = now.toLocaleTimeString();

}

setInterval(updateClock, 1000);

updateClock();

/* ============================
   Theme
============================ */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        themeBtn.innerHTML = "☀️";

    }else{

        themeBtn.innerHTML = "🌙";

    }

});

/* ============================
   Scientific Panel
============================ */

sciBtn.addEventListener("click",()=>{

    if(sciPanel.style.display==="none"){

        sciPanel.style.display="flex";

    }else{

        sciPanel.style.display="none";

    }

});

/* ============================
   DEG / RAD
============================ */

degBtn.onclick=()=>{

    degreeMode=true;

    degBtn.classList.add("active");

    radBtn.classList.remove("active");

}

radBtn.onclick=()=>{

    degreeMode=false;

    radBtn.classList.add("active");

    degBtn.classList.remove("active");

}

/* ============================
   Button Clicks
============================ */

buttons.forEach(btn=>{

    btn.addEventListener("click",()=>{

        const value=btn.dataset.value;

        handleInput(value);

    });

});

/* ============================
   Handle Input
============================ */

function handleInput(value){

    switch(value){

        case "AC":

            expression="";

            display.value="";

            break;

        case "DEL":

            expression=expression.slice(0,-1);

            display.value=expression;

            break;

        case "=":

            calculate();

            break;

        case "+/-":

            if(expression!==""){

                expression=(-parseFloat(expression)).toString();

                display.value=expression;

            }

            break;

        default:

            expression+=value;

            display.value=expression;

    }

}
/* ============================
   Calculate
============================ */

function factorial(n){

    if(n<0) return NaN;

    if(n===0 || n===1) return 1;

    let result=1;

    for(let i=2;i<=n;i++){

        result*=i;

    }

    return result;

}

function calculate(){

    try{

        let exp=expression;

        exp=exp.replace(/π/g,Math.PI);

        exp=exp.replace(/e/g,Math.E);

        exp=exp.replace(/√/g,"Math.sqrt");

        exp=exp.replace(/∛/g,"Math.cbrt");

        exp=exp.replace(/\^2/g,"**2");

        exp=exp.replace(/\^3/g,"**3");

        exp=exp.replace(/\^/g,"**");

        exp=exp.replace(/log\(/g,"Math.log10(");

        exp=exp.replace(/ln\(/g,"Math.log(");

        exp=exp.replace(/sin\((.*?)\)/g,(m,a)=>{

            let value=Number(a);

            if(degreeMode){

                value=value*Math.PI/180;

            }

            return Math.sin(value);

        });

        exp=exp.replace(/cos\((.*?)\)/g,(m,a)=>{

            let value=Number(a);

            if(degreeMode){

                value=value*Math.PI/180;

            }

            return Math.cos(value);

        });

        exp=exp.replace(/tan\((.*?)\)/g,(m,a)=>{

            let value=Number(a);

            if(degreeMode){

                value=value*Math.PI/180;

            }

            return Math.tan(value);

        });

        exp=exp.replace(/asin\((.*?)\)/g,(m,a)=>Math.asin(Number(a)));

        exp=exp.replace(/acos\((.*?)\)/g,(m,a)=>Math.acos(Number(a)));

        exp=exp.replace(/atan\((.*?)\)/g,(m,a)=>Math.atan(Number(a)));

        exp=exp.replace(/(\d+)!/g,(m,a)=>factorial(Number(a)));

        const answer=eval(exp);

const record = expression + " = " + answer;

history.unshift(record);

localStorage.setItem("calcHistory", JSON.stringify(history));

const li = document.createElement("li");

li.textContent = record;

historyList.prepend(li);

        expression=answer.toString();

        display.value=expression;

    }

    catch{

        display.value="Error";

        expression="";

    }

}

/* ============================
   Clear History
============================ */

clearHistory.onclick = () => {

    history = [];

    localStorage.removeItem("calcHistory");

    historyList.innerHTML = "";

}

/* ============================
   Memory Buttons
============================ */

document.getElementById("mc").onclick=()=>{

    memory=0;

}

document.getElementById("mr").onclick=()=>{

    expression+=memory;

    display.value=expression;

}

document.getElementById("mplus").onclick=()=>{

    memory+=Number(display.value)||0;

}

document.getElementById("mminus").onclick=()=>{

    memory-=Number(display.value)||0;

}

/* ============================
   Keyboard Support
============================ */

document.addEventListener("keydown",(e)=>{

    const key=e.key;

    if("0123456789+-*/().%".includes(key)){

        expression+=key;

        display.value=expression;

    }

    else if(key==="Backspace"){

        expression=expression.slice(0,-1);

        display.value=expression;

    }

    else if(key==="Delete"){

        expression="";

        display.value="";

    }

    else if(key==="Enter"){

        e.preventDefault();

        calculate();

    }

});