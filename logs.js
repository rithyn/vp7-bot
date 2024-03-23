/**
 * @param {string} type - The type of the option
 * @param {string} text - The text to log
 */

function log(text, type) {
	if (type == 'error') {
		console.error("\x1b[31m", `[${new Date().toLocaleString()}] [ERROR] ${text}`);
	}
	if (type == 'warn') {
		console.warn("\x1b[33m",`[${new Date().toLocaleString()}] [WARN] ${text}`);
	}
	if (type == 'info') {
		console.info("\x1b[32m",`[${new Date().toLocaleString()}] [INFO] ${text}`);
	}
	if (type == 'log') {
		console.log("\x1b[34m", `[${new Date().toLocaleString()}] [LOG] ${text}`);
	}
	if (type == 'debug') {
		console.debug("\x1b[35m", `[${new Date().toLocaleString()}] [DEBUG] ${text}`);
	}
	if (type == 'trace') {
		console.trace("\x1b[35m", `[${new Date().toLocaleString()}] [TRACE] ${text}`);
	}
	if (type == 'command') {
		console.log("\x1b[36m", `[${new Date().toLocaleString()}] [COMMAND] ${text}`);
	}
}
module.exports = log;
