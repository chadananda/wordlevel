# Wordlevel
Home-build word frequency list for looking up distribution level of any words or strings


### Install the interface module into your node project with:
```
npm install --save wordlevel
```

### Functionality
``` Javascript
// ES2015
var wordlevel = new require('wordlevel');

// or ES6
import Wordfreq from 'wordlevel'
var wordlevel = new wordlevel('en')

// constructor code will load the language list, lemmatize each word then index for quick lookups
// this adds a few ms to the object creation time but allows for easy language addition

// FREQUENCY: check the position of any word in a normalized dictionary
wordlevel.frequency("Gasoline")
  // 14970

// LEVEL: check the percentage level of any word in a normalized dictionary
wordlevel.level("Gasoline")
  // 15.4 // %   

// BLOCK LEVEL: check the word frequency reading level of a block of text
// calculates all words and then returns the word level at the 98% range
wordlevel.block_level("The quick brown cow jumped over the large black dog")
  // 32


// TOPWORDS: Get most difficult words, defaults to top 2%
wordlevel.topwords("The quick brown cow jumped over the large black dog", [2])
 // [ {word:'quick', count:1, level:14.3}, ... ]

### Utilities

// NORMALIZE WORD: lowercases word to base lemma for dictionary lookup
// note: this is half-algorithmic, not dictionary-based, so results are not always perfect
//   if you have a POS ([noun,verb,adj,adv]), you can increase accuracy
wordlevel.normalize_word("policing")
  // police
wordlevel.normalize_word("Running", "verb")
  // run
wordlevel.normalize_word("Running", "noun")
  // running

// PARSE WORDS: breaks up text into an array of objects
// Utilizes the "compromise" NLM module
wordlevel.parse_str("That was soon over.")
 // [
 //   {word:"That", pos:"noun", lemma:"that"},
 //   {word:"was", pos:"verb", lemma:"was"},
 //   {word:"soon", pos:"adj", lemma:"soon"},
 //   {word:"over.", pos:"", lemma:"over"}
 // ]



```
