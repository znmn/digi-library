const { RC4, shiftCipherDecrypt, shiftCipherEncrypt } = require("./src/encryption.js");
const { randChar } = require("./src/utils.js");

function encrypt(plaintext) {
	// random shift
	let shift = Math.floor(Math.random() * 20) + 1;
	// random secret key
	let key = randChar(Math.floor(Math.random() * (50 - 21 + 1)) + 21);
	// encrypt with RC4
	let RC4Encrypted = RC4(key, plaintext);
	// encrypt with shift
	let ciphertext = shiftCipherEncrypt(RC4Encrypted, shift);
	return btoa(JSON.stringify({ c: ciphertext, s: RC4(key, String(key.length - shift + ciphertext.length)), k: key }));
}

function decrypt(cipher) {
	// Destructuring JSON
	let { c: ciphertext, k: key, s } = JSON.parse(atob(cipher));
	s = Number(RC4(key, s));
	let shift = key.length - s + ciphertext.length;

	// decrypt with shift
	let ShiftDecrypted = shiftCipherDecrypt(ciphertext, shift);

	// decrypt with RC4
	let plaintext = RC4(key, ShiftDecrypted);

	return plaintext;
}

module.exports = {
	encrypt,
	decrypt,
};
