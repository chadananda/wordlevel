// functions for checking word frequency level
'use strict'
 

var nlp = require('compromise'); // for parsing and NLP
var _ = require('underscore');
var removePunctuation = require('remove-punctuation');

 

class Wordlevel {
  
  constructor(lang) { 
    if (!lang) lang='en'
    if (['en','ar','fa'].indexOf(lang)===-1) throw('Language not supported')
    this.lang = lang
    this.lemmatizer = {}
    //this.lemmafreq = {} 
    if (lang==='en') {
      let Lemmatizer = require("javascript-lemmatizer")
      this.lemmatizer = new Lemmatizer()  
    }    
    let that = this
    try { this.list = require('./freq_list_'+lang) } catch(e) { that.list = [] }
  } 
  
  normalize_word(word, pos) { 
    word = removePunctuation(word).toLowerCase().trim();  
    var lemma = '';
    // English
    if (this.lang==='en') { 
      var lemmas = this.lemmatizer.lemmas(word); 
      if (lemmas.length===0) lemma = ''
      else if (lemmas.length===1) lemma = lemmas[0][0];
      else if (!pos) lemma = lemmas[1][0]; // i.e. the noun form (statistically most likely)
      else {
        // try to match known POS 
        var matches = lemmas.filter(function(lem){ return (lem[1]===pos); }); 
        if (matches.length>0) lemma = matches[0][0];
         else lemmas[1][0]; // i.e. the noun form (statistically most likely)
      }
    }
    // TODO: Arabic
    // TODO: Farsi
    return lemma;
  }
  
  // return array of objects describing each word
  parse_str(str) {
    var list = nlp(str).out('terms');
    var pos_options = {Noun:'noun', Verb:'verb', Adjective:'adj', Adverb:'adv'};
    //console.log(list)
    // pull out parts we actually want
    var words = [];
    list.forEach((word, index) => {
      // console.log(word);
      let newword = {}
      newword.discard = word.tags.filter((tag)=>!pos_options[tag] )
      newword.pos = word.tags
       .filter((tag)=>pos_options[tag]).map((tag)=>pos_options[tag]) 
      newword.pos = newword.pos[0] || ''  
      newword.lemma = this.normalize_word(word.normal, newword.pos)
      newword.word = word.text
      //newword = this.pluginWordAnalysis(newword)
      //newword.html = this.word2HTML(newword)
      list[index] = newword
    });
    // console.log(list);
    return list;
  }
  
  frequency(word, pos) {
    if (!this.lemmafreq) {
      this.lemmafreq = this._prepare_lema_index()
      this.lemmacount = Object.keys(this.lemmafreq).length
    }
    let freq = 0
    let lemma = this.normalize_word(word, pos) 
    if (lemma.length>0) freq = this.lemmafreq[lemma] || 0   
    //console.log('frequency', word, freq)   
    return freq
  }
  
  level(word, pos) {   
    let freq = this.frequency(word, pos) 
    // ratio to percentage rounded to first decimal
    return Math.round(((freq / this.lemmacount) * 100)*10)/10  
  }
  
  
  /** internal funcitonality */
  _prepare_lema_index() {
    let result = {}
    let that = this
    if (this.list.length<1) return result
    this.list.forEach(function(word, index) {
      let lemma = that.normalize_word(word)
      if (lemma) result[lemma] = index
    })   
    console.log('Prepared lemma frequency index with ', Object.keys(result).length, 'keys')
    return result
  }
  
  
  
 
//   isSATword (word) {
//     word = word.toLowerCase().trim(); 
//     return (this.sat[word]===true);
//   }
//   isTOEFLword (word) {
//     word = word.toLowerCase().trim(); 
//     return (this.toefl[word]===true);
//   }
//   isTestword (word) {
//     word = word.toLowerCase().trim(); 
//     return (this.allwords[word]===true);
//   }
//   satWordsList () {
//     return Object.keys(this.sat);
//   }
//   toeflWordsList () {
//     return Object.keys(this.sat);
//   }
//   allWordsList () {
//     let allWordsList= Array.concat(this.satWords(), this.toeflWord());
//     allWordsList= Array.from(new Set(allWordsList));
//     return allWordsList;   
//   }  
//   
//     

}

// export default Testwords;
module.exports = Wordlevel



 