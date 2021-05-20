const express = require('express');
const request = require('request');
const fetch = require("node-fetch");
var keyword_extractor = require("keyword-extractor");
var sentiment = require('wink-sentiment');
const {} = require('wink-sentiment/src/afinn-en-165');
const fs = require('fs');

let stopdata = fs.readFileSync('stop.json');
let stop = JSON.parse(stopdata);


let app = express()
app.use(express.static('public'))
app.use(express.json())

let port = process.env.PORT || 3000

app.listen(port, () => {
   console.log(`Listening on port ${port}.`)
})

const postPerRequest = 100;
const maxPostsToFetch = 500;
const maxRequests = maxPostsToFetch / postPerRequest
const responsesReddit = [] // stores all of em




const fetchPosts = async (afterParam) => {
   console.log('fetching data')
   const response = await fetch(`https://www.reddit.com/r/offmychest.json?limit=${postPerRequest}${
      afterParam ? '&after=' + afterParam : ''
   }`)
   const responseJSON = await response.json();
   responsesReddit.push(responseJSON);

   if (responseJSON.data.after && responsesReddit.length < maxRequests) {
      fetchPosts(responseJSON.data.after);
      return
   }
   parseResults(responsesReddit)
}
let dataObj = [];
const parseResults = (r) => {

   console.log('Parsing data')
   const allPosts = []

   responsesReddit.forEach(element => {
      allPosts.push(...element.data.children)
   })

   allPosts.forEach(({
      data: {
         title,
         created_utc,
         author,
         ups,
         selftext
      }
   }) => {
      dataObj.push({
         title: title,
         text: selftext,
         time: created_utc,
         who: author,
         voteCount: ups
      })
   })

   for (let i = 0; i < dataObj.length; i++) {
      let current = dataObj[i]
      if (current.text) {
         sentimentAnalyze(current)
      }

   }

   for (let i = 0; i < dataObj.length; i++) {
      let current = dataObj[i] // object in dataObj array
      if (current.text) {
         extractKeys(current)
      }

   }

}

// var obj = require('stopWords.json');

// console.log(obj); 

// import stop from ('./stopWords.json')
// console.log(stop)

const extractKeys = async (obj) => {
   let sentence = obj.title.concat(". ", obj.text)
   const extraction_result = keyword_extractor.extract(sentence, {
      language:"english",
      remove_digits: true,
      return_changed_case:true,
      remove_duplicates: false
   });
   let counts = {}
   
   for (let i = 0; i < extraction_result.length; i++) {
      let word = extraction_result[i]
      if (!stop.includes(word)) {
         console.log('STOP WORD ADDED: ' + word)
         if (counts[word] === undefined) {
            counts[word] = 1;
         } else {
            counts[word] = counts[word] + 1
         }
      } else {
         console.log('STOP WORD NOT ADDED: ' + word)
      }
}
      
  // extraction_result is an array of key words
  
   var sortable = [];
   for (let word in counts) {
    sortable.push([word, counts[word]]);
   }

   sortable.sort(function(a, b) {
       return b[1] - a[1];
   });
   
   sortable.splice(10)
   let keys = sortable.map(item => item[0])
   
   obj.keywords = keys;
}




let sentArr = []
const sentimentAnalyze = async (obj) => {
   let sentence = obj.title.concat(". ", obj.text)
   let object = sentiment(sentence)
   // push as a key value pair into existing object (dataObj)
   obj.score = object.score;
   obj.averagedScore = object.normalizedScore

} 


app.get('/keyword', (request, response) => {
   response.json({
      list: dataObj
   })
});


fetchPosts()