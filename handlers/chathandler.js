const chatHistory = []

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