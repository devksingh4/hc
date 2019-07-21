const identityhandler = require('./identityhandler.js')

var lobbies = []

module.exports.generateLobby = () => {
	return {
		uid: identityhandler.gen(),
		history: [],
		one: {
			name: undefined,
			uid: undefined
		},
		two: {
			name: undefined,
			uid: undefined
		},
		users: []
	}
}

module.exports.killLobby = (useruid) => {
	let onelobbies = this.lobbies.filter(lobby => lobby.one.uid == useruid)
	let twolobbies = this.lobbies.filter(lobby => lobby.two.uid == useruid)

	let newolobbies = []
	let newtlobbies = []

	onelobbies.forEach(entry => {
		if(!lobbies.includes(entry)) {
			newolobbies.push(entry)
		}
	})

	twolobbies.forEach(entry => {
		if(!lobbies.includes(entry)) {
			newtlobbies.push(entry)
		}
	})

	lobbies = []

	newolobbies.forEach(lobby => {
		lobbies.push(lobby)
	})

	twolobbies.forEach(lobby => {
		lobbies.push(lobby)
	})
}

var tempLobby = this.generateLobby()

module.exports.joinLobby = (uid, name, callback) => {
	let reset = false

	this.killLobby(uid)

	if(tempLobby.one.uid == undefined) {
		tempLobby.one.uid = uid
		tempLobby.one.name = name

		tempLobby.users.push(uid)
	} else {
		reset = true
		tempLobby.two.uid = uid
		tempLobby.two.name = name

		tempLobby.users.push(uid)
	}

	callback(tempLobby)

	if(reset) {
		lobbies.push(tempLobby)
		tempLobby = this.generateLobby()
	}
}

module.exports.newChat = (name, uid, message) => {
	let lobby = lobbies.filter(lobby => lobby.users.includes(uid))[0]

	if(lobby != undefined) {
		lobby.history.push({
			name: name,
			uid: uid,
			message: message
		})

		
	}
}

module.exports.lobbies = lobbies