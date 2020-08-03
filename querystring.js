/**
 * Javascript class for managing URL query strings.
 * You can:
 *   read the current query string from the URL;
 *   read, add, delete or edit individual parameters;
 *   make a whole new query string;
 *   output the complete query string as plain text;
 *   output the complete query string encoded for use in an HTML link;
 *   navigate to a page with a new query string.
 * Examples:
 *   const q1 = QueryString();  // parse the current document's query string
 *   const q2 = QueryString({a:1,b:2});  // define a new query string object
 * @class
 */
class QueryString {

	/**
	 * Reads or sets a new query string. If used as an empty constructor,
	 * will load the query string from the current document URL. If an object
	 * is passed, a new query string will be initialised from it.
	 * @constructs
	 * @param {object} obj - Optional initialiser for new query string.
	 */
	constructor(obj) {

		if (arguments.length) {

			// If an object was passed, use it to initialise the .values member.
			this.values = typeof obj === 'object' ? obj : {};

		} else {

			// No parameters to the constructor => parse the query string
			// from the current document URL.
			this.values = {};
			const pars = window.location.search.substr(1).split('&');
			for (const p of pars) {

				// Can't use split() because the limit is two parts, but
				// the second part may include the separator (and more),
				// and split() would cut that off.
				const m = p.match(/^([^=]*)=?(.*)$/m);

				// Index 1 is the key, index 2 is the value. Both can be
				// empty, but an empty key makes no sense.
				if (m && m.length == 3 && m[1].length) {

					const key = decodeURIComponent(m[1]);
					let val = decodeURIComponent(m[2]);

					// Try to convert string values to integer, float, boolean
					// or null. No conversion if not a complete & valid match.
					const im = val.match(/^-?(0|[1-9]\d*)/);
					if (im) {

						if (im[0].length == val.length) {

							// The whole thing completely matches
							// a valid integer.
							val = parseInt(val);

						} else {

							const sub = val.substr(im[0].length);
							const fm = sub.match(/^(\.\d+)?(e[+-]?\d+)?$/i);
							if (fm) {

								// The rest completely matches a valid
								// fractional part and/or exponent.
								val = parseFloat(val);

							}
						}

					} else {

						// Check for boolean or null values as strings.
						if (val === 'true') {

							val = true;

						} else if (val === 'false') {

							val = false;

						} else if (val === 'null') {

							val = null;

						}
					}

					// Store the parameter in the .values member.
					this.values[key] = val;
				}
			}
		}
	}

	/**
	 * Serializes and returns the current object collection of query
	 * parameters. By default, returns a query string as plain text.
	 * If the first argument to the method is '&amp;' or ';', returns
	 * it with special characters encoded for use in HTML.
	 * @method
	 * @param {string} [arg0='&'] - Separator between query parameters.
	 * @param {string} [arg1='='] - Separator between keys and values.
	 * @param {string} [arg2='?'] - Prefix of the query string.
	 * @returns {string} Current search query as a string, can be empty.
	 */
	serialize(...args) {
		const sep = args.length ? args.shift() : '&';
		const eq = args.length ? args.shift() : '=';
		const qm = args.length ? args.shift() : '?';
		const a = [];  // array to collect all key=val combinations

		if (sep === '&amp;' || sep === ';') {
			// HTML encoding requested.
			Object.entries(this.values).forEach(([k, v]) => {
				a.push(encodeURIComponent(k) + eq + encodeURIComponent(v));
			});
		} else {
			// Plain text requested.
			Object.entries(this.values).forEach(([k, v]) => {
				a.push('' + k + eq + v);
			});
		}

		return a.length ? qm + a.join(sep) : '';
	}

	/**
	 * Makes a plain text query string from the current query parameters.
	 * @method
	 * @returns {string} Query string as plain text.
	 */
	toText() {
		return this.serialize('&');
	}

	/**
	 * Makes an HTML encoded query string from the current query parameters.
	 * Can be directly written to the href property of a link tag <a ...></a>
	 * in HTML source code.
	 * @method
	 * @returns {string} Query string as HTML encoded text.
	 */
	toHtml() {
		return this.serialize('&amp;');
	}

	/**
	 * Default toString() method that is automatically called when a class
	 * instance is used in a string context. Serializes the current query
	 * parameters as HTML encoded text.
	 * @method
	 * @returns {string} Query string as HTML encoded text.
	 */
	toString() {
		return this.toHtml();
	}

	/**
	 * Navigate to a new URL with the query string of this class instance. If
	 * no argument is supplied, go to the current document + the query string.
	 * @method
	 * @param {string} [newpage=''] - Optional new page address.
	 */
	goto(newpage) {
		const page = arguments.length ? newpage : '';
		location = page + this.toText();
	}

	/**
	 * Get the integer value of the named query parameter.
	 * @method
	 * @param {string} key - Name of the query parameter.
	 * @returns {number} Integer value of the query parameter, or undefined.
	 */
	getInt(key) {
		return key in this.values ? parseInt(this.values[key]) : undefined;
	}

	/**
	 * Get the float value of the named query parameter.
	 * @method
	 * @param {string} key - Name of the query parameter.
	 * @returns {number} Float value of the query parameter, or undefined.
	 */
	getFloat(key) {
		return key in this.values ? parseFloat(this.values[key]) : undefined;
	}

	/**
	 * Get the boolean value of the named query parameter.
	 * @method
	 * @param {string} key - Name of the query parameter.
	 * @returns {boolean} Boolean value of the query parameter, or undefined.
	 */
	getBool(key) {
		return key in this.values ? !!(this.values[key]) : undefined;
	}

	/**
	 * Get the string value of the named query parameter.
	 * @method
	 * @param {string} key - Name of the query parameter.
	 * @returns {string} String value of the query parameter, or undefined.
	 */
	getStr(key) {
		return key in this.values ? '' + this.values[key] : undefined;
	}

	/**
	 * Get the stored value of the named query parameter.
	 * @method
	 * @param {string} key - Name of the query parameter.
	 * @returns Value of the query parameter, any type, could be undefined.
	 */
	get(key) {
		return this.values[key];
	}

	/**
	 * Set the value of the named query parameter.
	 * @method
	 * @param {string} key - Name of the query parameter.
	 * @param val - Value of the query parameter, any assignable type.
	 */
	set(key, val) {
		this.values[key] = val;
	}

	/**
	 * Unset the named query parameter, return the old value.
	 * @method
	 * @param {string} key - Name of the query parameter.
	 * @returns Deleted value of the query parameter, any type, could be undefined.
	 */
	unset(key) {
		const tmp = this.values[key];
		delete this.values[key];
		return tmp;
	}
}
