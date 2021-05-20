gsap.registerPlugin(TextPlugin); // type animation library

// current time
let _time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: "2-digit" })
let dataset; //object with all 500 posts
let time = document.querySelector('.time')
time.innerHTML = _time
let slider = document.querySelector('#slider')
slider.addEventListener('mouseup', sliderChange)
let sliderValue = slider.value; // 1 week old posts is the default

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
      delay: 1, 
      ease:"power2.in"
   })
   gsap.from('.openInfo', { 
      opacity: 0, 
      duration: 1,
      delay: 2.5,
      ease:"easeIn"
   })
   gsap.from('.timeBox', { 
      opacity: 0, 
      duration: 1,
      delay: 2.5,  
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
}, 7000)

const getData = async () => {
// make a call to server to fetch all data
   let response = await fetch('/keyword')
   let dataJSON = await response.json()
   dataset = dataJSON.list
   let info = document.querySelector('.openInfo')
   info.classList.add('close')
console.log(dataset)
   let bgVid = document.querySelector('.loadingVideo video') 
   bgVid.classList.remove('stillLoading');
   bgVid.classList.add('loaded');
   bgVid.src = "assets/shortLoader.mp4"
   document.querySelector('.main-container').remove()
   document.querySelector('.navData').style.display = 'block'
   btn.remove()

   timeSet(dataset, sliderValue)

   gsap.from('#mainContainer2', { 
      opacity: 0, 
      duration: 1,
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

// make a funciton to create an array of objects with the required time threshold
let currentTimedObjs;

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

function easeInOutQuint(x) {
   return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function getEasedValues(arr) {
   let values = arr.map(a => a.easedX);
   let min =  Math.min(...values)
   let max = Math.max(...values) 

   return [min, max]
}

const displayResults = (arrayOfObjects) => {
   
   let container = document.getElementById("mainContainer2");;
   let scores = getMinMaxScore(arrayOfObjects) // min and max sentiment scores for map function
   removeAllChildNodes(container)
   arrayOfObjects.forEach((obj) => {
      // create a div for every object
      // place each div mapped to the X axis - left will have larger score
      let x = map(obj.averagedScore, scores[0], scores[1], 0, 1)
      // create a new key of eased X value for each object in the array
      obj.easedX =  1 - (easeInOutQuint(x));
      // console.log(obj.easedX)
   })

   // let easedVal = getEasedValues(arrayOfObjects)
   let times = getMinMaxTime(arrayOfObjects) // min and max time post is made for map function
   
   arrayOfObjects.forEach((obj) => {
      let row = document.createElement("div")
      row.classList.add('text')
      row.innerHTML = obj.title
      row.setAttribute('fullText', obj.text)
      row.setAttribute('keywords', obj.keywords)
      
      let sentimentX = map(obj.easedX, 0, 1, 100, window.innerWidth - 200)

      row.style.marginLeft = `${sentimentX}px`;

      // place each div mapped to the Y axis - 0 is older post, 1 new is newest post
      let timeY = Math.floor(map(obj.time, times[1], times[0], 100, 4000))
      row.style.marginTop = `${timeY}px`;

      container.appendChild(row);
   })
  
   let $textContainer, $textBox;
   $( ".text" ).on( "click", function(e) {
      if ($( "body" ).has( $textContainer )) {
         $($textContainer).remove()
      } 
      let fullText =  $(this).attr('fulltext');
      let keywords =  $(this).attr('keywords');
      $textContainer = $("<div>", {id: "text-container", "class": "text-container"});
      $( "body" ).append($textContainer)
      $textBox = $("<div>", {"class": "textbox"})
      $textBox.css({"margin-left": `${e.pageX}px`, "margin-top": `${e.pageY}px`})
      $textBox.text(fullText)
      $($textContainer).append($textBox)
      findKeywords(keywords, $textBox)
    });

    $('.loaded').on('click', function() {
      $($textContainer).remove()
    })
}

function findKeywords(keys, div) {

   let keysArr = keys.split(",")
   let text = div.text()
   keysArr.forEach(k => {
      text = text.replace(k, `<a class='clickable'>${k}</a>`);
   })
  
  div.html(text)
  gsap.to('.clickable', { 
   color: '#d42020',
   duration: 0.8,
   ease:"ease"
   })

   $('.clickable').on('click', function(el) {
      let word = el.target.innerText;
      findSimilar(word)
    })

}

function findSimilar(word) {
   document.querySelectorAll('.text').forEach((t) => {
      t.classList.remove('highlight')
      let txt = t.getAttribute('fullText')
      if (txt.includes(word)) {
         // t.style.color = `#d42020`
         t.classList.add('highlight')
      } else {
         return
      }
   })
}

// document.querySelector('.loaded').addEventListener('click', () => {
//    if (container.querySelector(".textbox")) {
//       document.querySelectorAll('.textbox').forEach(e => e.remove());
//    }
// })

// let stopWords = ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", an, and, any, are, as, at, be, because, been, but, by, can, cannot, could, dear, did, do, does, either, else, ever, every, for, from, get, got, had, has, have, he, her, hers, him, his, how, however, i, if, in, into, is, it, its, just, least, let, like, likely, may, me, might, most, must, my, neither, no, nor, not, of, off, often, on, only, or, other, our, own, rather, said, say, says, she, should, since, so, some, than, that, the, their, them, then, there, these, they, this, tis, to, too, twas, us, wants, was, we, were, what, when, where, which, while, who, whom, why, will, with, would, yet, you, your]



function removeAllChildNodes(parent) {
   while (parent.firstChild) {
       parent.removeChild(parent.firstChild);
   }
}

// let masterTl = gsap.timeline({
//    repeat: -1
// })

// function animateLetters(jumbledWord, el) {

//    let tl = gsap.timeline({
//       repeat: -1,
//       yoyo: true,
//       repeatDelay: 1
//    })
//    tl.to(el, {
//       text: jumbledWord,
//       duration: 1,
//       delay: 1
//    })
//    tl.reverse()
//    masterTl.add(tl)
// }

// function randomNumber(min, max) {
//    return Math.floor(Math.random() * (max - min) + min);
// }

// function jumbleWords(word) {
//    // maybe the jumbled words can be reflective in - words -> sdrow  to show the reflective nature of the text?
//    const jumbled = word.split("").reverse().join("");
//    return jumbled
// }