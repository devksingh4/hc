module.exports.gen = () => {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

module.exports.resetCode = () => {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

module.exports.getTime = () => {
  let d = new Date()

  let rMinutes = d.getMinutes()
  let rHours = d.getHours()

  let prefix = "A.M."

  if(rHours > 12) {
    rHours = rHours-12
    prefix = "P.M."
  }

  return rHours + ":" + rMinutes + " " + prefix
}