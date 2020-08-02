class QueryString {
	constructor(obj) {
		if (arguments.length) {
			this.values = typeof obj === 'object' ? obj : {};
		} else {
			this.values = {};
			const q = window.location.search.substr(1).split('&');
			for (const p of q) {
				// Can't use split() because the limit is two parts, but
				// the second part may include the separator (and more),
				// and split() would cut that off.
				const m = p.match(/^([^=]*)=?(.*)$/m);
				// Index 1 is the key, index 2 is the value. Both can be
				// empty, but an empty key makes no sense.
				if (Array.isArray(m) && m.length == 3 && m[1].length) {
					let v = decodeURIComponent(m[2]);
					const n = v.match(/^-?(0|[1-9]\d*)/);
					if (n) {
						if (n[0].length == v.length) {
							// Complete match for valid integer
							v = parseInt(v);
						} else if (v.substr(n[0].length).match(/^(\.\d+)?(e[+-]?\d+)?$/i)) {
							// The rest completely matches a valid fractional part and/or exponent
							v = parseFloat(v);
						}
					} else {
						const s = v.toLowerCase();
						if (s === 'true') {
							v = true;
						} else if (s === 'false') {
							v = false;
						} else if (s === 'null') {
							v = null;
						}
					}
					this.values[decodeURIComponent(m[1])] = v;
				}
			}
		}
	}

	serialize(...args) {
		const sep = args.length ? args.shift() : '&';
		const eq = args.length ? args.shift() : '=';
		const qm = args.length ? args.shift() : '?';
		const a = [];
		if (sep === '&amp;' || sep === ';') {
			Object.entries(this.values).forEach(([k, v]) => {
				a.push(encodeURIComponent(k) + eq + encodeURIComponent(v));
			});
		} else {
			Object.entries(this.values).forEach(([k, v]) => {
				a.push('' + k + eq + v);
			});
		}
		if (a.length) {
			return qm + a.join(sep);
		}
		return '';
	}

	toText() {
		return this.serialize('&');
	}

	toHtml() {
		return this.serialize('&amp;');
	}

	toString() {
		return this.toHtml();
	}

	goto() {
		location = this.toText();
	}

	getInt(key) {
		return key in this.values ? parseInt(this.values[key]) : undefined;
	}

	getFloat(key) {
		return key in this.values ? parseFloat(this.values[key]) : undefined;
	}

	getBool(key) {
		return key in this.values ? !!(this.values[key]) : undefined;
	}

	getStr(key) {
		return key in this.values ? '' + this.values[key] : undefined;
	}

	get(key) {
		return this.values[key];
	}

	set(key, val) {
		this.values[key] = val;
	}

	unset(key) {
		delete this.values[key];
	}
}