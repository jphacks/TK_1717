/**
 * Monkey Patch
 */
void function Monkey () {
    Array.prototype.areduce = async function (reducer, acc) {
        for (let i=0; i<this.length; i++) {
            if (typeof acc === "undefined") {
                acc = this[i];
                continue;
            }
            acc = await reducer(this[i], acc);
        }
        return acc;
    };

    Array.prototype.amin = async function (compare) {
        if (this.length === 0) return;
        if (this.length === 1) return this[0];
        return await this.areduce(async (a,b) => await compare(a,b) >= 0 ? a : b);
    };

    Array.prototype.amap = function (mapper) { return Promise.all(this.map(mapper)); };
    Promise.prototype.map = async function (mapper) { return (await this).map(mapper); }
    Promise.prototype.amap = async function (mapper) { return Promise.all((await this).map(mapper)); }
    Array.prototype.sum = function () { return this.reduce((a,b) => a+b, 0); };
    Array.prototype.includes = function (value) { return this.indexOf(value) >= 0; };
    Array.prototype.zip = function (c) { return this.map((e,i) => [e, c[i]]); };
    Array.prototype.flatten = function () { return [].concat(...this); };
    Promise.prototype.flatten = async function () { return [].concat(...(await this)); };
    Array.prototype.mfill = function (val) { return Array(this.length).fill(val); };
    Array.prototype.prepare = function () { return this.mfill("?").join(","); };
    Array.prototype.product = function () { return this.reduce((ac,el)=>el.map(e=>ac.map(it.concat(e))).flatten(),[[]]); };
    Array.prototype.add = function (val) { return this.concat(val); };
    Array.prototype.rm = function (val) { return this.filter((_,i)=>i!=this.indexOf(val)); };
    Array.prototype.diff = function (c) { return c.reduce((rest,e)=>rest.rm(e),this); };
}();

/**
 * It
 */
const It = response => new Proxy(new Function, {
	get: (_,property) => It((...entity) => {
		const base = response(...entity);
		return (typeof base[property] === "function") ? base[property].bind(base) : base[property];
	}),
	apply: (_,that,args) => {
		if (typeof that === "undefined") return response(...args);
		return It((...entity) => response(...entity)(...args));
	}
});
const it = It((...entity) => entity[0]);
const them = It((...entity) => entity);

/**
 * SQL
 */
const toQuestion = e => [].concat(e).fill("?");
const prepareSQL = (strings, ...values) => [strings.zip(values.map(toQuestion)).flatten().join(" "), ...[].concat(...values)];
const templateSQL = cmd => async (strings, ...values) => cmd(...prepareSQL(strings, ...values));

/**
 * Others
 */
const compareBy = mapper => (a,b) => mapper(a) - mapper(b);
const cl = e => { console.log(e); return e; };

module.exports = {It, it, them, compareBy, prepareSQL, templateSQL, cl};
