const brain = require('brain.js')
const fs = require('fs')
const parser = require('./parser.js')

const badWords = fs.readFileSync(__dirname + '/badwords.txt', 'utf8').split('\n')

const config = {
  binaryThresh: 0.5, // ¯\_(ツ)_/¯
  hiddenLayers: [10], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid' // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
}

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config)

net.train([
  {input: [1, 5], output: [1]},
  {input: [0, 0], output: [0]},
  {input: [0, 3], output: [0.3]},
  {input: [1, 1], output: [0.6]},
  {input: [1, 0], output: [0]},
  {input: [5, 0], output: [0]},
  {input: [0, 5], output: [0.9]},
  {input: [15, 0], output: [0]},
  {input: [0, 15], output: [0]},
  {input: [0, 0], output: [0]}
])

module.exports.isBad = (str) => {
  str = str.toString()
  let count = 0
  let youc = 0

  for (let badword in badWords) {
    let realBad = badWords[badword]
    if (parser.replaceAll(str, ' ', '').trim().toLowerCase().includes(parser.replaceAll(realBad, ' ', '').trim().toLowerCase())) {
      count++
    }
  }

  if (str.includes('you')) {
    youc++
  }

  let badMeter = net.run([youc, count]) * 100

  if (badMeter > 50) {
    return {
        bad: true,
        score: badMeter
    }
  } else {
    return {
        bad: false,
        score: badMeter
    }
  }
}
