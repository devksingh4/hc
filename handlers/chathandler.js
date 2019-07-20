const identityhandler = require('./identityhandler.js')

const chatHistory = []

var tempLobby = this.generateLobby()

module.exports.generateLobby = () => {
	return {
		uid: identityhandler.gen(),
		one: undefined,
		two: undefined
	}
}

module.exports.joinLobby = (uid) => {
	if(tempLobby.one == undefined) {
		tempLobby.one = uid
	} else {
		tempLobby.two = uid
	}
}

module.exports.newChat = (name, uid, message) => {
  chatHistory.push({
		name: name,
		uid: uid,
		message: message
	})

	if(chatHistory.length > 200) {
		chatHistory.pop()
	}
}



module.exports.chatHistory = chatHistory