gsap.registerPlugin(TextPlugin); // type animation library

// current time
let _time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: "2-digit" })
let dataset; //object with all 500 posts
let sliderValue = 604800; // 1 week old posts is the default
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
      delay: 4, 
      ease:"power2.in"
   })
   gsap.from('.openInfo', { 
      opacity: 0, 
      duration: 1,
      delay: 4,
      ease:"easeIn"
   })
   gsap.from('.timeBox', { 
      opacity: 0, 
      duration: 1,
      delay: 4,  
      ease:"power2.in"
   })
   gsap.from('.loading', { 
      opacity: 0, 
      duration: 1,
      delay: 4,  
      ease:"power2.in"
   })


setTimeout(() => { // turn this into a normal function that activtes once the  intro animation and all elements are visible ends
   document.querySelector(".loading").remove();
   btn = document.createElement("button");
   btn.innerHTML = "ENTER"
   btn.classList.add("enter")
   document.body.appendChild(btn);
   btn.addEventListener("click", getData);
}, 4000)

const getData = async () => {
// make a call to server to fetch all data
   let response = await fetch('/keyword')
   let dataJSON = await response.json()
   dataset = dataJSON.list
   let info = document.querySelector('.openInfo')
   info.classList.add('close')

   let bgVid = document.querySelector('.loadingVideo video') 
   bgVid.classList.remove('stillLoading');
   bgVid.classList.add('loaded');
   bgVid.src = "assets/shortLoader.mp4"
   document.querySelector('.main-container').remove()
   document.querySelector('.navData').style.display = 'block'
   btn.remove()

   timeSet(dataset, 604800)

   gsap.from('#mainContainer2', { 
      opacity: 0, 
      duration: 0.8,
      ease:"power2.in"
   })
   gsap.to('#logo', { 
      scale: 0.4,
      y: -150,
      x: 1,
      duration: 1,
      ease:"ease"
   })
   gsap.to('.timeBox', { 
      x: -550,
      y: -380,
      scale: 0.6,
      duration: 1,
      ease:"ease"
   })

   gsap.to('.navData', { 
      opacity: 1, 
      duration: 1,
      ease:"ease"
   })
   gsap.to('.sliderContainer', { 
      opacity: 1, 
      duration: 1,
      ease:"ease"
   })
   gsap.to('.label', { 
      opacity: 1, 
      duration: 1,
      ease:"ease"
   })
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
let currentTimedObjs;

let slider = document.querySelector('#slider')
slider.addEventListener('mouseup', sliderChange)

function sliderChange() {
   sliderValue = slider.value
   const container = document.querySelector('#mainContainer2');
   removeAllChildNodes(container);
   timeSet(dataset, sliderValue)
}

const timeSet = (arrayOfObjects, sliderValueCurrent) => {
   currentTimedObjs = [] // list of objects that have been conditionally checked
   let timeThresholdMin = (Math.floor(Date.now()/1000)) - sliderValueCurrent;
   arrayOfObjects.forEach((obj) => {
      if (obj.time >= timeThresholdMin) {
         currentTimedObjs.push(obj)
      }
   });

   displayResults(currentTimedObjs)
}

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;


const getMinMaxScore = (arr) => {
   let values = arr.map(a => a.averagedScore);
   let s =  Math.min(...values)
   let l = Math.max(...values) 

   return [s, l];
}

const getMinMaxTime = (arr) => {
   let values = arr.map(a => a.time);
   let s =  Math.min(...values)
   let l = Math.max(...values) 

   return [s, l];
}

function easeInOutCubic(t) {
   return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
}

function getEasedValues(arr) {
   let values = arr.map(a => a.easedX);
   let min =  Math.min(...values)
   let max = Math.max(...values) 

   return [min, max]
}

const displayResults = (arrayOfObjects) => {

   let container;
   let scores = getMinMaxScore(arrayOfObjects) // min and max sentiment scores for map function

   arrayOfObjects.forEach((obj) => {
      // create a div for every object
      // place each div mapped to the X axis - left will have larger score
      let x = map(obj.averagedScore, scores[0], scores[1], 0, 1)
      // create a new key of eased X value for each object in the array
      obj.easedX = 1 - (easeInOutCubic(x));
   })

   let easedVal = getEasedValues(arrayOfObjects)
   let times = getMinMaxTime(arrayOfObjects) // min and max time post is made for map function
   
   arrayOfObjects.forEach((obj) => {
      container = document.getElementById("mainContainer2");
      let row = document.createElement("div")
      row.classList.add('text')
      row.innerHTML = obj.title
      row.setAttribute('fullText', obj.text)

      let sentimentX = (map(obj.easedX, easedVal[0], easedVal[1], 100, window.innerWidth-200))
      row.style.marginLeft = `${sentimentX}px`;
      console.log(easedVal) 
      // place each div mapped to the Y axis - 0 is older post, 1 new is newest post
      let timeY = Math.floor(map(obj.time, times[1], times[0], 100, 4000))
      row.style.marginTop = `${timeY}px`;

      container.appendChild(row);
   })

  
   document.querySelectorAll('.text').forEach(t => {
      t.addEventListener('click', (event) => {
         // if maincontainer 2 conatins a class
         if (container.querySelector(".textbox")) {
            document.querySelectorAll('.textbox').forEach(e => e.remove());
         }
         let selectedText = event.target.getAttribute('fulltext');
         let fullTextBox = document.createElement("div");
         fullTextBox.classList.add('textbox');
        
         fullTextBox.style.marginLeft =  `${event.pageX}px`;
         fullTextBox.style.marginTop =  `${event.pageY}px`;
         fullTextBox.innerHTML = selectedText;
         container.appendChild(fullTextBox);
   })
  
     
   })
   document.querySelector('.loaded').addEventListener('click', () => {
   
      if (container.querySelector(".textbox")) {
         document.querySelectorAll('.textbox').forEach(e => e.remove());
      }
   })

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

function removeAllChildNodes(parent) {
   while (parent.firstChild) {
       parent.removeChild(parent.firstChild);
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