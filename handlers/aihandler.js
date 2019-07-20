const brain = require('brain.js')

const config = {
  binaryThresh: 0.5,
  hiddenLayers: [10],     // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid',  // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01   // supported for activation type 'leaky-relu'
}

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config)

net.train([
	{input: [3, 3, 3, 3, 3, 3, 3, 3, 3], output: [1]},
  {input: [3, 3, 2, 3, 1, 2, 1, 1, 3], output: [1]},
  {input: [0, 0, 0, 0, 0, 0, 0, 0, 0], output: [0]},
  {input: [0, 0, 1, 1, 0, 0, 1, 0, 0], output: [0]}])
`                                                                       `                                                                                                                                                                                                                                                                                                                                                                                   
module.exports.evaluate = (query, callback) => {
  let result = net.run(query)

  callback(result)
}