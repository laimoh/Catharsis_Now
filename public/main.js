gsap.registerPlugin(TextPlugin);

let dt = new Date();
let h =  dt.getHours(), m = dt.getMinutes();
let _time = (h > 12) ? (h-12 + ':' + m +' PM') : (h + ':' + m +' AM');

let time = document.querySelector('.time')
time.innerHTML = _time

Noise3k({
   grainSize: 1, 
 });

let currentTexts = [];
let keys = [];
let btn, huh, el;

setTimeout(() => {
   document.querySelector(".loading").remove();
   btn = document.createElement("button");
   btn.innerHTML ="ENTER"
   btn.classList.add("enter")
   document.body.appendChild(btn); 
   btn.addEventListener ("click", getData);
}, 1000)

const getData = async () => {
      
   let response = await fetch('/keyword')
   let keywordsJSON = await response.json()

   console.log(keywordsJSON)

   keywordsJSON.list.forEach((arr) => {
      const getLongestStr = (longestStr, str) => {
         return longestStr.length > str.length ? longestStr : str;
       }
       var longest = arr.reduce(getLongestStr, "")
       keys.push(longest)
   })

   btn.remove()
   huh = document.createElement("button");
   huh.classList.add("huh");
   huh.innerHTML = "?"
   document.body.appendChild(huh); 

   displayResults(keys) 
}


const displayResults = (array) => {
   // key is an array of strings
   let i = 0;
   array.forEach((word) => {
      
      if (!word) {
         return
      } else {
         var rows = 20;

for(var i = 0; i < rows; i++)
{
  var row = document.createElement("div");
  document.body.appendChild(row);
}



for(var i = 1; i <= rows; i++)
{
  var dir = i % 2; // 0, 1
  dir = dir === 0 ? -1 : 1; // -1, 1
  
  var rowNumber = Math.floor(rows / 2);
  rowNumber += dir * Math.floor(i / 2);
  console.log(rowNumber);
  
  document.body.children[rowNumber].innerText = i;
}

      // let x = randomNumber(0, window.innerWidth - 200)
      // let y = randomNumber(0, window.innerHeight - 100)
      // el = document.createElement("p");
      // el.style.left = `${x}px`;
      // el.style.top = `${y}px`;
      // el.style.margin = `1rem`;
      // el.classList.add("el");
      // el.setAttribute("index", i)
      // el.innerHTML = word;
      // document.body.appendChild(el);

      let jumbledWord = jumbleWords(word)
      animateLetters(jumbledWord, el)
      i++
      
      }
   })
}

let masterTl = gsap.timeline({repeat: -1})

function animateLetters(jumbledWord, el) { 
   // gsap.to(e, { text: j, duration: 2, delay: 1, stagger: 0.5 });
   // gsap.to(e, { text: w, duration: 2, delay: 3, stagger: 0.5 });
   let tl = gsap.timeline({repeat: -1, yoyo: true, repeatDelay: 1})
   tl.to(el, { text: jumbledWord, duration: 1, delay: 1})
   tl.reverse()
   masterTl.add(tl)
}

function randomNumber(min, max) {  
   return Math.floor(Math.random() * (max - min) + min); 
} 

function jumbleWords(word) { 
   // maybe the jumbled words can be reflective in - words -> sdrow  to show the reflective nature of the text?
   const jumbled = word.split("").reverse().join("");
   return jumbled
}



