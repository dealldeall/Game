var questList = {
	becomeMasters: require('quest/becomeMasters')
}

var init = function(uid, name) {
	questList[name].init(uid);
}

var action = function(uid, questName, actionName, data) {
	var actionFullName = 'action' + actionName
	questList[questName][actionFullName](uid, data);
}