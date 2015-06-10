var init = function(uid) {

}


var action = function(uid, questName, actionName, data) {
	var actionFullName = 'action' + actionName
	questList[questName][actionFullName](uid, data);
}