gsap.registerPlugin(TextPlugin);

let _time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: "2-digit" })

let time = document.querySelector('.time')
time.innerHTML = _time

Noise3k({
   grainSize: 1,
});

let currentTexts = [];
let keys = [];
let btn, huh, el, scoreList;

// setTimeout(() => {
   gsap.from('#logo', { 
      opacity: 0, 
      duration: 1,
      delay: 9, 
      ease:"power2.in"
   })
   gsap.from('.openInfo', { 
      opacity: 0, 
      duration: 1,
      delay: 9.4,
      ease:"easeIn"
   })
   gsap.from('.timeBox', { 
      opacity: 0, 
      duration: 1,
      delay: 9,  
      ease:"power2.in"
   })
   gsap.from('.loading', { 
      opacity: 0, 
      duration: 1,
      delay: 9.4,  
      ease:"power2.in"
   })
// }, 2000)

setTimeout(() => { // turn this into a normal function that activtes once the  intro animation and all elements are visible ends
   document.querySelector(".loading").remove();
   btn = document.createElement("button");
   btn.innerHTML = "ENTER"
   btn.classList.add("enter")
   document.body.appendChild(btn);
   btn.addEventListener("click", getData);
}, 20000)

const getData = async () => {

   let response = await fetch('/keyword')
   let keywordsJSON = await response.json()
   let info = document.querySelector('.openInfo')
   info.classList.add('close')
   console.log(keywordsJSON)

   scoreList = keywordsJSON.scored
   keywordsJSON.list.forEach((arr) => {
      const getLongestStr = (longestStr, str) => {
         return longestStr.length > str.length ? longestStr : str;
      }
      var longest = arr.reduce(getLongestStr, "")
      keys.push(longest)
   })
   document.getElementById('myVideo').src = "assets/shortLoader.mp4"
   btn.remove()
   huh = document.createElement("button");
   huh.classList.add("huh");
   huh.innerHTML = "?"
   document.body.appendChild(huh);
   huh.addEventListener("click", toggleInfo);
   displayResults(keys, scoreList)
   gsap.from('#mainContainer2', { 
      opacity: 0, 
      duration: 0.8,
      ease:"power2.in"
   })
}

function toggleInfo() {
   let info = document.querySelector('.openInfo')
   info.classList.toggle('close')
}



const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

const displayResults = (array, obj) => {
  
   var rows = array.length 
   let row
   let Hrow = window.innerHeight / rows
  
   for (var i = 0; i < rows; i++) {

      let leftRow, color;
      let current = obj[i]
      row = document.createElement("div")
      row.classList.add('el')
      // document.getElementById("mainContainer2").classList.remove('close')
      // mapping a color range between left and right values left- green and blue is green
      //  green = hsl(151, 70%, 50%);
      //  blue = hsl(240, 70%, 50%)
      lowerRange = 20

      if (current.averagedScore < 0) {
         leftRow = Math.floor(map(current.averagedScore, -0.5, 0, 80, 500))
         color = Math.floor(map(leftRow, 80, 500, 104, 161))
      } else if (current.averagedScore > 0) {
         leftRow = Math.floor(map(current.averagedScore, 0, 0.5, 900, window.innerWidth-300))
         color = Math.floor(map(leftRow, 900, window.innerWidth-300, 161, 190))
      } else {
         leftRow = Math.floor(window.innerWidth/2)
         color = 161
      }
      let jumbledWord = jumbleWords(array[i])
      animateLetters(jumbledWord, row)
      row.style.height = `${Hrow}px`
      row.style.marginLeft = `${leftRow}px`;
      row.style.color = `hsl(${color}, 70%, 50%)`
      document.getElementById("mainContainer2").appendChild(row);
   }

   for (var i = 1; i <= rows; i++) {
      var dir = i % 2; // 0, 1
      dir = dir === 0 ? -1 : 1; // -1, 1

      var rowNumber = Math.floor(rows / 2);
      rowNumber += dir * Math.floor(i / 2);
      document.getElementById("mainContainer2").children[rowNumber].innerText = array[rowNumber];
     
   }
}

let masterTl = gsap.timeline({
   repeat: -1
})

function animateLetters(jumbledWord, el) {

   let tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: 1
   })
   tl.to(el, {
      text: jumbledWord,
      duration: 1,
      delay: 1
   })
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