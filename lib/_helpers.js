function randStr(len = 7) {
	var text = "";
	var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i < len; i++) text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
}

module.exports = {
	randStr,
};
