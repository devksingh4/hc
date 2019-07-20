const brain = require('brain.js')
const fs = require('fs')
const request = require('request')

const config = {
  binaryThresh: 0.5,
  hiddenLayers: [10],     // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid',  // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01   // supported for activation type 'leaky-relu'
}

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config)

net.train([
	{input: [3, 3, 3, 3, 3, 3, 3, 3, 3,3], output: [0]},
  {input: [3, 3, 2, 1, 1, 2, 1, 1, 3,2], output: [0.3]},
  {input: [0, 0, 0, 0, 0, 0, 0, 0, 0,0], output: [1]},
  {input: [0, 0, 1, 1, 0, 0, 1, 0, 0, 2], output: [0.65]},
  {input: [1, 0, 1, 1, 1, 0, 1, 0, 0,1], output: [.80]},
  {input: [0, 2, 1, 1, 0, 0, 1, 0, 0, 1], output: [.65]},
  {input: [0, 3, 1, 1, 0, 0, 1, 0, 0, 3], output: [.30]},
  {input: [0, 3, 0, 0, 0, 0, 1, 0, 3, 1], output: [0.3]},
  {input: [3, 0, 0, 0, 0, 1, 1, 0, 3, 2], output: [0.05]},
  {input: [2, 0, 3, 2, 1, 1, 2, 2, 0, 3], output: [0.60]},
  {input: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3], output: [0.90]}
])                                  

module.exports.evaluate = (query, callback) => {
  let result = net.run(query)

  callback(result)
}
