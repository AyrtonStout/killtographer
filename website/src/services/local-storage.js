export function getBoolean(key, defaultValue) {
	const value = localStorage.getItem(key);

	if (value === undefined || value === null) {
		return defaultValue;
	} else if (parseInt(value) === 0) {
		return false;
	} else if (parseInt(value) === 1) {
		return true;
	} else {
		throw Error(`Unexpected value (${value}) for key ${key}. Was this value set with setBoolean()?`)
	}
}

export function setBoolean(key, value) {
	if (value === true) {
		localStorage.setItem(key, "1");
	} else if (value === false) {
		localStorage.setItem(key, "0");
	} else {
		throw Error(`Non-boolean value (${value}) passed to setBoolean for key ${key}`)
	}
}

export function setObject(key, object) {
	if (typeof object !== 'object' || object === null) {
		throw Error(`Non-object value (${object}) passed to setObject for key ${key}`);
	}

	localStorage.setItem(key, JSON.stringify(object));
}

export function getObject(key, defaultValue) {
	const value = localStorage.getItem(key);

	if (value === undefined || value === null) {
		return defaultValue;
	}

	return JSON.parse(value);
}

export function setNumber(key, number) {
	if (number === null || number === undefined) {
		throw Error(`Non-numeric value (${number}) passed to setNumber for key ${key}`);
	}
	let parsedNumber = Number.parseFloat(number);

	if (isNaN(parsedNumber)) {
		throw Error(`Non-numeric value (${number}) passed to setNumber for key ${key}`);
	}

	localStorage.setItem(key, number);
}

export function getNumber(key, defaultValue) {
	const value = localStorage.getItem(key);

	if (value === undefined || value === null) {
		return defaultValue;
	}

	let parsedNumber = Number.parseFloat(value);
	if (isNaN(parsedNumber)) {
		throw Error(`Non-numeric value (${value}) retrieved with getNumber`);
	}

	return parsedNumber;
}

export function setString(key, string) {
	if (typeof string !== "string") {
		throw Error(`Non-string value (${string}) passed to setString for key ${key}`);
	}

	localStorage.setItem(key, string);
}

export function getString(key, defaultValue) {
	const value = localStorage.getItem(key);

	if (value === undefined || value === null) {
		return defaultValue;
	}

	if (typeof value !== "string") {
		throw Error(`Non-string value (${value}) retrieved with getString`);
	}

	return value;
}

export function deleteKey(key) {
	localStorage.removeItem(key);
}
