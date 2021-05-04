gsap.registerPlugin(TextPlugin); // type animation library

// current time
let _time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: "2-digit" })
let dataset; //object with all 500 posts
let sliderValue = 86400; // 1 day old posts is the default
let time = document.querySelector('.time')
time.innerHTML = _time

// grain effect for site
Noise3k({
   grainSize: 1,
});

let currentTexts = [];
let keys = [];
let btn, huh, el, scoreList;

// intro animation
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


setTimeout(() => { // turn this into a normal function that activtes once the  intro animation and all elements are visible ends
   document.querySelector(".loading").remove();
   btn = document.createElement("button");
   btn.innerHTML = "ENTER"
   btn.classList.add("enter")
   document.body.appendChild(btn);
   btn.addEventListener("click", getData);
}, 2000)

const getData = async () => {
// make a call to server to fetch all data
   let response = await fetch('/keyword')
   let dataJSON = await response.json()
   dataset = dataJSON.list
   let info = document.querySelector('.openInfo')
   info.classList.add('close')
   // console.log(data)
   // let textArr = keywordsJSON.textsArr
   // console.log(textsArr)
   // scoreList = keywordsJSON.scored
   // keywordsJSON.list.forEach((arr) => {
   //    const getLongestStr = (longestStr, str) => {
   //       return longestStr.length > str.length ? longestStr : str;
   //    }
   //    var longest = arr.reduce(getLongestStr, "")
   //    keys.push(longest)
   // })
   let bgVid = document.querySelector('.loadingVideo video') 
   bgVid.classList.remove('stillLoading');
   bgVid.classList.add('loaded');
   bgVid.src = "assets/shortLoader.mp4"
   
   btn.remove()
   huh = document.createElement("button");
   huh.classList.add("huh");
   huh.innerHTML = "?"
   document.body.appendChild(huh);
   huh.addEventListener("click", toggleInfo);


   
   timeSet(dataset, sliderValue)

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




// // this is function deploys, everytime there is an update
// const d3display = (timeValues) => {
// console.log(timeValues)
//    d3.select('#mainContainer2') 
//       .selectAll('p')
//       .data(timeValues)
//       .enter()
//       .append('p')
//       .attr("class", "txt")
//       .text('title')
// }


// make a funciton to create an array of objects with the required time threshold

const timeSet = (arrayOfObjects, sliderValueCurrent) => {
   let currentTimedObjs = [] // list of objects that have been

   const timeThresholdMin = (Math.floor(Date.now()/1000)) - sliderValueCurrent;
   arrayOfObjects.forEach((obj) => {
      if (obj.time <= timeThresholdMin) {
         currentTimedObjs.push(obj)
      }
   });

   displayResults(currentTimedObjs)
}

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

const getMinMaxScore = (arr) => {
   let values = arr.map(a => a.averagedScore);
   s =  Math.min(...values)
   l = Math.max(...values) 

   return [s, l];
}

const displayResults = (arrayOfObjects) => {
  
   console.log(arrayOfObjects)
   let scores = getMinMaxScore(arrayOfObjects)
   // if object.averaged score is *high* place it closer to 0 on y axis while *lower* will be placed at window.height
   arrayOfObjects.forEach((obj) => {
      // create a div for every object
      let row = document.createElement("div")
      row.classList.add('text')
      row.innerHTML = obj.title
      
      console.log(smallScore,largeScore)

      // place each div mapped to the y axis
      let sentimentY = Math.floor(map(obj.averagedScore, scores[1], scores[0], 0, 700))
      row.style.top = `${sentimentY}px`;
      document.getElementById("mainContainer2").appendChild(row);
   })
   

   // var rows = arrayOfObjects.length 
   // let Hrow = window.innerHeight / rows
   
  
   // for (var i = 0; i < rows; i++) {

   //    let leftRow, color;
   //    let current = obj[i]
   //    row = document.createElement("div")
   //    row.classList.add('el')

   //    if (current.averagedScore < 0) {
   //       leftRow = Math.floor(map(current.averagedScore, smallScore, largeScore, 80, 500))
   //       color = Math.floor(map(leftRow, 80, 500, 104, 161))
   //    } else if (current.averagedScore > 0) {
   //       leftRow = Math.floor(map(current.averagedScore, 0, 0.5, 900, window.innerWidth-300))
   //       color = Math.floor(map(leftRow, 900, window.innerWidth-300, 161, 190))
   //    } else {
   //       leftRow = Math.floor(window.innerWidth/2)
   //       color = 161
   //    }
   //    let jumbledWord = jumbleWords(array[i])
   //    animateLetters(jumbledWord, row)
   //    row.style.height = `${Hrow}px`
   //    row.style.marginLeft = `${leftRow}px`;
   //    row.style.color = `hsl(${color}, 70%, 50%)`
   //    document.getElementById("mainContainer2").appendChild(row);
   // }

   // for (var i = 1; i <= rows; i++) {
   //    var dir = i % 2; // 0, 1
   //    dir = dir === 0 ? -1 : 1; // -1, 1

   //    var rowNumber = Math.floor(rows / 2);
   //    rowNumber += dir * Math.floor(i / 2);
   //    document.getElementById("mainContainer2").children[rowNumber].innerText = array[rowNumber];
     
   // }
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