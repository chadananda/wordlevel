var expect    = require("chai").expect
var Wordlevel = require("../wordlevel")


describe("Word Frequency Tests", function() {

  describe("Load English list", function() {
    it("contains 36,663 words", function() {
      var wordlevel = new Wordlevel('en')
      expect(wordlevel.list.length).to.equal(36663)
    })
  })

  describe("Load empty Arabic list", function() {
    it("contains 0 words", function() {
      var wordlevel = new Wordlevel('ar')
      expect(wordlevel.list.length).to.equal(0)
    })
  })

  describe("Try to load non-supported French language", function() {
    it("throws exception 'Language not supported'", function() {
      var errormsg =''
      try { new Wordlevel('fr') }
      catch(e) { errormsg = e }
      expect(errormsg).to.equal('Language not supported')
    })
  })

  describe("Try to normalize some English words", function() {
    var wordlevel = new Wordlevel('en')
    it("'Policing' should normalize to 'police'", function() {
      expect( wordlevel.normalize_word('Policing')).to.equal('police')
    })
    it("'(Robbing!!!)' should normalize to 'rob'", function() {
      expect( wordlevel.normalize_word('(Robbing!!!)')).to.equal('rob')
    })
  })

  describe("Try to normalize with known part of speech", function() {
    var wordlevel = new Wordlevel('en')
    it("('Running', 'verb') should normalize to 'run', not 'running'", function() {
      expect( wordlevel.normalize_word('Running', 'verb')).to.equal('run')
    })
    it("('Running', 'noun') should normalize to 'running', not 'run'", function() {
      expect( wordlevel.normalize_word('Running', 'noun')).to.equal('running')
    })
  })

  describe("Try to parse a list of words", function() {
    var wordlevel = new Wordlevel('en')
    it("'The Quick Brown Cow' should parse to array of 4 objects", function() {
      expect( wordlevel.parse_str('The Quick Brown Cow').length).to.equal(4)
    })
    it("'The Quick Brown Cow' word #4 should be a noun", function() {
      expect( wordlevel.parse_str('The Quick Brown Cow')[3].pos).to.equal('noun')
    })
    it("'Joe ran to the store' word #2 should be a verb", function() {
      expect( wordlevel.parse_str('Joe ran to the store')[1].pos).to.equal('verb')
    })
  })

  describe("Test frequency index lookup", function() {
    var wordlevel = new Wordlevel('en')
    wordlevel.frequency('') // initialize index
    it("'Gasoline' should have a frequency of 14970", function() {
      expect( wordlevel.frequency('Gasoline')).to.equal(14970)
    })
    it("Common words such as 'The' should return 0", function() {
      expect( wordlevel.frequency('The')).to.equal(0)
    })
    it("'ran' and 'run' should have same frequency", function() {
      expect( wordlevel.frequency('ran')).to.equal(wordlevel.frequency('run'))
    })
  })

  describe("Test word level lookup", function() {
    var wordlevel = new Wordlevel('en')
    wordlevel.frequency('') // initialize index
    it("'Perplexed' should have a level of 18.8%", function() {
      expect( wordlevel.level('Perplexed')).to.equal(18.8)
    })
    it("'Diabolical' should have a level of 33.6%", function() {
      expect( wordlevel.level('Diabolical')).to.equal(33.6)
    })
    it("'Missive' should have a level of 42.6%", function() {
      expect( wordlevel.level('Missive')).to.equal(42.6)
    })
    it("'Painstaking' should have a level of 43%", function() {
      expect( wordlevel.level('Painstaking')).to.equal(43)
    })

  })

  describe("Block of words level and top words analysis", function() {
    var wordlevel = new Wordlevel('en')
    wordlevel.frequency('') // initialize index
    it("'To be or not to be, that is the question' should have top level of 11.3", function() {
      expect( wordlevel.block_level('To be or not to be, that is the question')).to.equal(11.3)
    })
    it("'To be or not to be, that is the question' should have one top word, 'question'", function() {
      var result = wordlevel.topwords('To be or not to be, that is the question')
      expect(result.length).to.equal(1)
      expect(result[0].word).to.equal('question')
    })
  })


})
