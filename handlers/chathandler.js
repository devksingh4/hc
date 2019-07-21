const identityhandler = require('./identityhandler.js')

module.exports.lobbies = []

module.exports.generateLobby = () => {
	let uid = identityhandler.gen()

	let lobby = {
		uid: uid,
		users: [],
		chat: [],
		names: [],
		die: () => {
			let newlobbies = []

			this.lobbies.forEach(entry => {
				if(entry.uid != uid) {
					newlobbies.push(entry)
				}
			})

			this.lobbies = newlobbies
		}
	}

	this.lobbies.push(lobby)

	return lobby
}

module.exports.lobbiesFromUser = (useruid) => {
	return this.lobbies.filter(lobby => lobby.users.includes(useruid))
}

module.exports.lobbyFromUid = (useruid) => {
	return this.lobbies.filter(lobby => lobby.uid == useruid)[0]
}

module.exports.killLobbies = (useruid) => {
	let dead = this.lobbiesFromUser(useruid)
	dead.forEach(lobby => lobby.die())
}

module.exports.joinLobby = (username, useruid, callback) => {
	this.killLobbies(useruid)

	let lobbies = this.lobbies.filter(lobby => lobby.users.length < 2)

	if(lobbies.length > 0) {
		let uid = this.lobbies.filter(lobby => lobby.users.length < 2)[0].uid
		
		this.lobbyFromUid(uid).users.push(useruid)

		let lobby = this.lobbyFromUid(uid)

		callback(lobby)
	} else {
		let lobby = this.generateLobby()

		lobby.users.push(useruid)
		lobby.names[useruid] = username

		this.lobbies.push(lobby)

		callback(lobby)
	}
}

module.exports.newChat = (username, useruid, message, callback) => {
	let lobby = this.lobbiesFromUser(useruid)[0]
	lobby.chat.push({
		uid: useruid,
		message: message,
		username: username
	})

	callback(lobby)
}