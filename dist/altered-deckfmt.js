var Ze = Object.defineProperty;
var ve = (c, i, s) => i in c ? Ze(c, i, { enumerable: !0, configurable: !0, writable: !0, value: s }) : c[i] = s;
var w = (c, i, s) => ve(c, typeof i != "symbol" ? i + "" : i, s);
var J = /* @__PURE__ */ ((c) => (c.Booster = "B", c.Promo = "P", c.AltArt = "A", c))(J || {}), O = /* @__PURE__ */ ((c) => (c.Axiom = "AX", c.Bravos = "BR", c.Lyra = "LY", c.Muna = "MU", c.Ordis = "OR", c.Yzmir = "YZ", c.Neutral = "NE", c))(O || {}), W = /* @__PURE__ */ ((c) => (c.Common = "C", c.Rare = "R1", c.RareOOF = "R2", c.Unique = "U", c.Exalt = "E", c))(W || {}), C = /* @__PURE__ */ ((c) => (c.CoreKS = "COREKS", c.Core = "CORE", c.Alize = "ALIZE", c.Bise = "BISE", c.TumultS3 = "TCS3", c.WCQualifier25 = "WCQ25", c.WCSeries25 = "WCS25", c.Cyclone = "CYCLONE", c.Duster = "DUSTER", c.DusterTOP = "DUSTERTOP", c.DusterCB = "DUSTERCB", c.DusterOP = "DUSTEROP", c.Eole = "EOLE", c.EoleCB = "EOLECB", c.Judge = "JUDGE", c.Musubi = "MUSUBI", c.WCFinals25 = "WCF25", c.WCSeries26 = "WCS26", c))(C || {});
const se = {
  1: 6,
  // CoreKS        range 0-63
  2: 6,
  // Core          range 0-63
  3: 6,
  // Alize         range 0-63
  4: 7,
  // Bise          range 0-127
  5: 6,
  // TumultS3      range 0-63
  6: 5,
  // WCQualifier25 range 0-31
  7: 5,
  // WCSeries25    range 0-31
  8: 7,
  // Cyclone       range 0-127
  9: 7,
  // Duster        range 0-127
  10: 6,
  // Duster TOP    range 0-63
  11: 7,
  // Duster CB     range 0-127
  12: 7,
  // Duster OP     range 0-127
  13: 7,
  // Eole          range 0-127
  14: 7,
  // Eole CB       range 0-127
  15: 5,
  // Judge         range 0-31
  16: 7,
  // Musubi        range 0-127
  17: 5,
  // WCFinals25    range 0-31
  18: 7
  // WCSeries26    range 0-127
}, Fe = [
  1,
  // CoreKS
  2,
  // Core
  3,
  // Alize
  4,
  // Bise
  5,
  // TumultS3
  6,
  // WCQualifier25
  7,
  // WCSeries25
  8
  // Cyclone
];
class Ce {
  constructor(i) {
    w(this, "set_code");
    w(this, "product");
    w(this, "faction");
    w(this, "num_in_faction");
    w(this, "rarity");
    w(this, "uniq_num");
    const s = i.match(/^ALT_(\w+)_(A|B|P)_(\w{2})_(\d+)_(C|R1|R2|U|E)(?:_(\d+))?$/);
    if (!s)
      throw "unrecognized card id '" + i + "'";
    if (this.set_code = s[1], this.product = s[2], this.faction = s[3], this.num_in_faction = parseInt(s[4], 10), this.rarity = s[5], this.uniq_num = s[6] ? parseInt(s[6]) : void 0, this.rarity == "U" && this.uniq_num == null)
      throw "unique card is missing a unique_number";
  }
  get productId() {
    switch (this.product) {
      case "B":
        return null;
      case "P":
        return 1;
      case "A":
        return 2;
    }
  }
  get factionId() {
    switch (this.faction) {
      case "AX":
        return 1;
      case "BR":
        return 2;
      case "LY":
        return 3;
      case "MU":
        return 4;
      case "OR":
        return 5;
      case "YZ":
        return 6;
      case "NE":
        return 7;
    }
    throw `Unrecognized Faction ${this.faction}`;
  }
  get rarityId() {
    switch (this.rarity) {
      case "C":
        return 0;
      case "R1":
        return 1;
      case "R2":
        return 2;
      case "U":
        return 3;
      case "E":
        return 4;
    }
    throw `Unrecognized Rarity ${this.rarity}`;
  }
  get setId() {
    switch (this.set_code) {
      case "COREKS":
        return 1;
      case "CORE":
        return 2;
      case "ALIZE":
        return 3;
      case "BISE":
        return 4;
      case "TCS3":
        return 5;
      case "WCQ25":
        return 6;
      case "WCS25":
        return 7;
      case "CYCLONE":
        return 8;
      case "DUSTER":
        return 9;
      case "DUSTERTOP":
        return 10;
      case "DUSTERCB":
        return 11;
      case "DUSTEROP":
        return 12;
      case "EOLE":
        return 13;
      case "EOLECB":
        return 14;
      case "JUDGE":
        return 15;
      case "MUSUBI":
        return 16;
      case "WCF25":
        return 17;
      case "WCS26":
        return 18;
    }
    throw `Unrecognized SetCode ${this.set_code}`;
  }
}
class j {
  constructor() {
    w(this, "setCode");
    w(this, "product");
    w(this, "faction");
    w(this, "numberInFaction");
    w(this, "rarity");
    w(this, "uniqueId");
  }
  static decode(i, s) {
    const f = new j();
    if (s.setCode === void 0)
      throw new G("Tried to decode Card without SetCode in context");
    if (f.setCode = s.setCode, i.readSync(1) == 1)
      f.product = null;
    else if (f.product = i.readSync(2), f.product == 0 || f.product == 3)
      throw new G(`Invalid product ID (${f.product})`);
    if (f.faction = i.readSync(3), f.faction == 0)
      throw new G(`Invalid faction ID (${f.faction})`);
    const a = se[f.setCode];
    if (a == null)
      throw new G(`Invalid set code (${f.setCode}) @${i.offset}`);
    f.numberInFaction = i.readSync(a);
    const p = Fe.includes(f.setCode) ? 2 : 3;
    return f.rarity = i.readSync(p), f.rarity == 3 && (f.uniqueId = i.readSync(16)), f;
  }
  encode(i) {
    this.product == null ? i.write(1, 1) : (i.write(1, 0), i.write(2, this.product)), i.write(3, this.faction);
    const s = se[this.setCode];
    if (s == null)
      throw new K(`Invalid set code (${this.setCode})`);
    i.write(s, this.numberInFaction);
    const f = Fe.includes(this.setCode) ? 2 : 3;
    if (i.write(f, this.rarity), this.uniqueId !== void 0) {
      if (this.uniqueId > 65535)
        throw new K("Cannot encode unique ID greater than 65535");
      i.write(16, this.uniqueId);
    }
  }
  get asCardId() {
    let i = "ALT_";
    switch (this.setCode) {
      case 1:
        i += C.CoreKS;
        break;
      case 2:
        i += C.Core;
        break;
      case 3:
        i += C.Alize;
        break;
      case 4:
        i += C.Bise;
        break;
      case 5:
        i += C.TumultS3;
        break;
      case 6:
        i += C.WCQualifier25;
        break;
      case 7:
        i += C.WCSeries25;
        break;
      case 8:
        i += C.Cyclone;
        break;
      case 9:
        i += C.Duster;
        break;
      case 10:
        i += C.DusterTOP;
        break;
      case 11:
        i += C.DusterCB;
        break;
      case 12:
        i += C.DusterOP;
        break;
      case 13:
        i += C.Eole;
        break;
      case 14:
        i += C.EoleCB;
        break;
      case 15:
        i += C.Judge;
        break;
      case 16:
        i += C.Musubi;
        break;
      case 17:
        i += C.WCFinals25;
        break;
      case 18:
        i += C.WCSeries26;
        break;
    }
    switch (i += "_", this.product) {
      case null:
        i += J.Booster;
        break;
      case 1:
        i += J.Promo;
        break;
      case 2:
        i += J.AltArt;
        break;
    }
    switch (i += "_", this.faction) {
      case 1:
        i += O.Axiom;
        break;
      case 2:
        i += O.Bravos;
        break;
      case 3:
        i += O.Lyra;
        break;
      case 4:
        i += O.Muna;
        break;
      case 5:
        i += O.Ordis;
        break;
      case 6:
        i += O.Yzmir;
        break;
      case 7:
        i += O.Neutral;
        break;
    }
    switch (i += "_", this.numberInFaction < 10 && !(this.faction == 7 && this.setCode == 1) && (i += "0"), i += this.numberInFaction, i += "_", this.rarity) {
      case 0:
        i += W.Common;
        break;
      case 1:
        i += W.Rare;
        break;
      case 2:
        i += W.RareOOF;
        break;
      case 3:
        i += W.Unique + "_" + this.uniqueId;
        break;
      case 4:
        i += W.Exalt;
        break;
    }
    return i;
  }
  static fromId(i) {
    let s = new j(), f = new Ce(i);
    return s.setCode = f.setId, s.product = f.productId, s.faction = f.factionId, s.numberInFaction = f.num_in_faction, s.rarity = f.rarityId, s.uniqueId = f.uniq_num, s;
  }
}
class H {
  constructor() {
    w(this, "quantity");
    // VLE: 2 (+6) bits
    w(this, "card");
  }
  static decode(i, s) {
    const f = new H(), l = i.readSync(2);
    if (l > 0)
      f.quantity = l;
    else {
      const a = i.readSync(6);
      f.quantity = a == 0 ? 0 : a + 3;
    }
    return f.card = j.decode(i, s), f;
  }
  encode(i) {
    if (this.quantity > 0 && this.quantity <= 3)
      i.write(2, this.quantity);
    else if (this.quantity > 3) {
      if (this.quantity > 65)
        throw new K(`Cannot encode card quantity (${this.quantity}) greater than 65`);
      i.write(2, 0), i.write(6, this.quantity - 3);
    } else
      i.write(8, 0);
    this.card.encode(i);
  }
  get asCardRefQty() {
    return {
      quantity: this.quantity,
      id: this.card.asCardId
    };
  }
  static from(i, s) {
    let f = new H();
    return f.quantity = i, f.card = j.fromId(s), f;
  }
}
class z {
  constructor() {
    w(this, "setCode");
    // 8 bits
    w(this, "cardQty");
  }
  // count: 6 bits
  static decode(i, s) {
    const f = new z();
    if (f.setCode = i.readSync(8), !z.isValidSetCode(f.setCode))
      throw new G(`Invalid SetCode ID (${f.setCode}) @offset=${i.offset}`);
    s.setCode = f.setCode;
    const l = i.readSync(6), a = new Array();
    for (let p = 0; p < l; p++)
      a.push(H.decode(i, s));
    return f.cardQty = a, s.setCode = void 0, f;
  }
  encode(i) {
    if (this.cardQty.length <= 0)
      throw new K("Cannot encode a SetGroup with 0 cards");
    const s = this.cardQty[0].card.setCode;
    i.write(8, s), i.write(6, this.cardQty.length);
    for (let f of this.cardQty)
      f.encode(i);
  }
  static from(i) {
    let s = new z();
    return s.cardQty = i.map((f) => H.from(f.quantity, f.id)), s;
  }
  static isValidSetCode(i) {
    return se[i] !== void 0;
  }
}
class Q {
  constructor() {
    w(this, "version");
    // 4 bits
    w(this, "setGroups");
  }
  // count: 8 bits
  static decode(i) {
    const s = new Q(), f = new tt();
    if (s.version = i.readSync(4), s.version !== 1)
      throw new G(`Invalid version (${s.version}`);
    const l = i.readSync(8), a = new Array();
    for (let p = 0; p < l; p++)
      a.push(z.decode(i, f));
    return s.setGroups = a, s;
  }
  encode(i) {
    i.write(4, this.version), i.write(8, this.setGroups.length);
    for (let s of this.setGroups)
      s.encode(i);
    if (i.offset % 8 > 0) {
      const s = 8 - i.offset % 8;
      i.write(s, 0);
    }
  }
  get asCardRefQty() {
    return this.setGroups.reduce((i, s) => i.concat(s.cardQty.map((f) => f.asCardRefQty)), Array());
  }
  static fromList(i) {
    const s = Q.groupedBySet(i).map((l) => et(l, 63).map((p) => z.from(p)));
    let f = new Q();
    return f.version = 1, f.setGroups = s.flat(), f;
  }
  static groupedBySet(i) {
    let s = /* @__PURE__ */ new Map();
    for (let f of i) {
      const l = new Ce(f.id).set_code;
      let a = s.get(l);
      a || (a = [], s.set(l, a)), a.push(f);
    }
    return Array.from(s, ([f, l]) => l);
  }
}
function et(c, i) {
  let s = [];
  for (let f = 0; f < c.length; f += i)
    s.push(c.slice(f, f + i));
  return s;
}
class tt {
  constructor() {
    w(this, "setCode");
  }
}
class G extends Error {
  constructor(i) {
    super(i), this.name = "DecodingError";
  }
}
class K extends Error {
  constructor(i) {
    super(i), this.name = "EncodingError";
  }
}
var Z = {}, v = {};
v.byteLength = nt;
v.toByteArray = ot;
v.fromByteArray = ht;
var R = [], L = [], rt = typeof Uint8Array < "u" ? Uint8Array : Array, ne = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var P = 0, it = ne.length; P < it; ++P)
  R[P] = ne[P], L[ne.charCodeAt(P)] = P;
L[45] = 62;
L[95] = 63;
function Se(c) {
  var i = c.length;
  if (i % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var s = c.indexOf("=");
  s === -1 && (s = i);
  var f = s === i ? 0 : 4 - s % 4;
  return [s, f];
}
function nt(c) {
  var i = Se(c), s = i[0], f = i[1];
  return (s + f) * 3 / 4 - f;
}
function st(c, i, s) {
  return (i + s) * 3 / 4 - s;
}
function ot(c) {
  var i, s = Se(c), f = s[0], l = s[1], a = new rt(st(c, f, l)), p = 0, y = l > 0 ? f - 4 : f, u;
  for (u = 0; u < y; u += 4)
    i = L[c.charCodeAt(u)] << 18 | L[c.charCodeAt(u + 1)] << 12 | L[c.charCodeAt(u + 2)] << 6 | L[c.charCodeAt(u + 3)], a[p++] = i >> 16 & 255, a[p++] = i >> 8 & 255, a[p++] = i & 255;
  return l === 2 && (i = L[c.charCodeAt(u)] << 2 | L[c.charCodeAt(u + 1)] >> 4, a[p++] = i & 255), l === 1 && (i = L[c.charCodeAt(u)] << 10 | L[c.charCodeAt(u + 1)] << 4 | L[c.charCodeAt(u + 2)] >> 2, a[p++] = i >> 8 & 255, a[p++] = i & 255), a;
}
function ft(c) {
  return R[c >> 18 & 63] + R[c >> 12 & 63] + R[c >> 6 & 63] + R[c & 63];
}
function ut(c, i, s) {
  for (var f, l = [], a = i; a < s; a += 3)
    f = (c[a] << 16 & 16711680) + (c[a + 1] << 8 & 65280) + (c[a + 2] & 255), l.push(ft(f));
  return l.join("");
}
function ht(c) {
  for (var i, s = c.length, f = s % 3, l = [], a = 16383, p = 0, y = s - f; p < y; p += a)
    l.push(ut(c, p, p + a > y ? y : p + a));
  return f === 1 ? (i = c[s - 1], l.push(
    R[i >> 2] + R[i << 4 & 63] + "=="
  )) : f === 2 && (i = (c[s - 2] << 8) + c[s - 1], l.push(
    R[i >> 10] + R[i >> 4 & 63] + R[i << 2 & 63] + "="
  )), l.join("");
}
var oe = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
oe.read = function(c, i, s, f, l) {
  var a, p, y = l * 8 - f - 1, u = (1 << y) - 1, I = u >> 1, b = -7, x = s ? l - 1 : 0, m = s ? -1 : 1, S = c[i + x];
  for (x += m, a = S & (1 << -b) - 1, S >>= -b, b += y; b > 0; a = a * 256 + c[i + x], x += m, b -= 8)
    ;
  for (p = a & (1 << -b) - 1, a >>= -b, b += f; b > 0; p = p * 256 + c[i + x], x += m, b -= 8)
    ;
  if (a === 0)
    a = 1 - I;
  else {
    if (a === u)
      return p ? NaN : (S ? -1 : 1) * (1 / 0);
    p = p + Math.pow(2, f), a = a - I;
  }
  return (S ? -1 : 1) * p * Math.pow(2, a - f);
};
oe.write = function(c, i, s, f, l, a) {
  var p, y, u, I = a * 8 - l - 1, b = (1 << I) - 1, x = b >> 1, m = l === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, S = f ? 0 : a - 1, F = f ? 1 : -1, N = i < 0 || i === 0 && 1 / i < 0 ? 1 : 0;
  for (i = Math.abs(i), isNaN(i) || i === 1 / 0 ? (y = isNaN(i) ? 1 : 0, p = b) : (p = Math.floor(Math.log(i) / Math.LN2), i * (u = Math.pow(2, -p)) < 1 && (p--, u *= 2), p + x >= 1 ? i += m / u : i += m * Math.pow(2, 1 - x), i * u >= 2 && (p++, u /= 2), p + x >= b ? (y = 0, p = b) : p + x >= 1 ? (y = (i * u - 1) * Math.pow(2, l), p = p + x) : (y = i * Math.pow(2, x - 1) * Math.pow(2, l), p = 0)); l >= 8; c[s + S] = y & 255, S += F, y /= 256, l -= 8)
    ;
  for (p = p << l | y, I += l; I > 0; c[s + S] = p & 255, S += F, p /= 256, I -= 8)
    ;
  c[s + S - F] |= N * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(c) {
  const i = v, s = oe, f = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  c.Buffer = u, c.SlowBuffer = ke, c.INSPECT_MAX_BYTES = 50;
  const l = 2147483647;
  c.kMaxLength = l;
  const a = (1 << 28) - 16;
  c.kStringMaxLength = a, c.constants = {
    MAX_LENGTH: l,
    MAX_STRING_LENGTH: a
  }, c.Blob = typeof Blob < "u" ? Blob : void 0, c.File = typeof File < "u" ? File : void 0, c.atob = typeof atob < "u" ? atob : void 0, c.btoa = typeof btoa < "u" ? btoa : void 0, u.TYPED_ARRAY_SUPPORT = p(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function p() {
    try {
      const r = new Uint8Array(1), e = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(r, e), r.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(u.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(u.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.byteOffset;
    }
  });
  function y(r) {
    if (r > l)
      throw new RangeError('The value "' + r + '" is invalid for option "size"');
    const e = new Uint8Array(r);
    return Object.setPrototypeOf(e, u.prototype), e;
  }
  function u(r, e, t) {
    if (typeof r == "number") {
      if (typeof e == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return m(r);
    }
    return I(r, e, t);
  }
  u.poolSize = 8192;
  function I(r, e, t) {
    if (typeof r == "string")
      return S(r, e);
    if (ArrayBuffer.isView(r))
      return N(r);
    if (r == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
      );
    if (T(r, ArrayBuffer) || r && T(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (T(r, SharedArrayBuffer) || r && T(r.buffer, SharedArrayBuffer)))
      return ee(r, e, t);
    if (typeof r == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const n = r.valueOf && r.valueOf();
    if (n != null && n !== r)
      return u.from(n, e, t);
    const o = Ue(r);
    if (o) return o;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function")
      return u.from(r[Symbol.toPrimitive]("string"), e, t);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
    );
  }
  u.from = function(r, e, t) {
    return I(r, e, t);
  }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array);
  function b(r) {
    if (typeof r != "number")
      throw new TypeError('"size" argument must be of type number');
    if (r < 0)
      throw new RangeError('The value "' + r + '" is invalid for option "size"');
  }
  function x(r, e, t) {
    return b(r), r <= 0 ? y(r) : e !== void 0 ? typeof t == "string" ? y(r).fill(e, t) : y(r).fill(e) : y(r);
  }
  u.alloc = function(r, e, t) {
    return x(r, e, t);
  };
  function m(r) {
    return b(r), y(r < 0 ? 0 : te(r) | 0);
  }
  u.allocUnsafe = function(r) {
    return m(r);
  }, u.allocUnsafeSlow = function(r) {
    return m(r);
  };
  function S(r, e) {
    if ((typeof e != "string" || e === "") && (e = "utf8"), !u.isEncoding(e))
      throw new TypeError("Unknown encoding: " + e);
    const t = fe(r, e) | 0;
    let n = y(t);
    const o = n.write(r, e);
    return o !== t && (n = n.slice(0, o)), n;
  }
  function F(r) {
    const e = r.length < 0 ? 0 : te(r.length) | 0, t = y(e);
    for (let n = 0; n < e; n += 1)
      t[n] = r[n] & 255;
    return t;
  }
  function N(r) {
    if (T(r, Uint8Array)) {
      const e = new Uint8Array(r);
      return ee(e.buffer, e.byteOffset, e.byteLength);
    }
    return F(r);
  }
  function ee(r, e, t) {
    if (e < 0 || r.byteLength < e)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (r.byteLength < e + (t || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return e === void 0 && t === void 0 ? n = new Uint8Array(r) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(r, e, t), Object.setPrototypeOf(n, u.prototype), n;
  }
  function Ue(r) {
    if (u.isBuffer(r)) {
      const e = te(r.length) | 0, t = y(e);
      return t.length === 0 || r.copy(t, 0, 0, e), t;
    }
    if (r.length !== void 0)
      return typeof r.length != "number" || Ae(r.length) ? y(0) : F(r);
    if (r.type === "Buffer" && Array.isArray(r.data))
      return F(r.data);
  }
  function te(r) {
    if (r >= l)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + l.toString(16) + " bytes");
    return r | 0;
  }
  function ke(r) {
    return +r != r && (r = 0), u.alloc(+r);
  }
  u.isBuffer = function(e) {
    return e != null && e._isBuffer === !0 && e !== u.prototype;
  }, u.compare = function(e, t) {
    if (!T(e, Uint8Array) || !T(t, Uint8Array))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (e === t) return 0;
    let n = e.length, o = t.length;
    for (let h = 0, d = Math.min(n, o); h < d; ++h)
      if (e[h] !== t[h]) {
        n = e[h], o = t[h];
        break;
      }
    return n < o ? -1 : o < n ? 1 : 0;
  }, u.isEncoding = function(e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64url":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, u.concat = function(e, t) {
    if (!Array.isArray(e))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (e.length === 0)
      return u.alloc(0);
    let n;
    if (t === void 0)
      for (t = 0, n = 0; n < e.length; ++n)
        t += e[n].length;
    const o = u.allocUnsafe(t);
    let h = 0;
    for (n = 0; n < e.length; ++n) {
      const d = e[n];
      if (!T(d, Uint8Array))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (h + d.length > o.length) {
        o.set(d.subarray(0, o.length - h), h);
        break;
      }
      o.set(d, h), h += d.length;
    }
    return o;
  };
  function fe(r, e) {
    if (ArrayBuffer.isView(r) || T(r, ArrayBuffer) || typeof SharedArrayBuffer < "u" && T(r, SharedArrayBuffer))
      return r.byteLength;
    if (typeof r != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
      );
    const t = r.length, n = arguments.length > 2 && arguments[2] === !0;
    if (!n && t === 0) return 0;
    let o = !1;
    for (; ; )
      switch (e) {
        case "ascii":
        case "latin1":
        case "binary":
          return t;
        case "utf8":
        case "utf-8":
          return ie(r).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return t * 2;
        case "hex":
          return t >>> 1;
        case "base64":
          return me(r).length;
        default:
          if (o)
            return n ? -1 : ie(r).length;
          e = ("" + e).toLowerCase(), o = !0;
      }
  }
  u.byteLength = fe;
  function Te(r, e, t) {
    let n = !1;
    if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e))
      return "";
    for (r || (r = "utf8"); ; )
      switch (r) {
        case "hex":
          return We(this, e, t);
        case "utf8":
        case "utf-8":
          return ae(this, e, t);
        case "ascii":
          return qe(this, e, t);
        case "latin1":
        case "binary":
          return Pe(this, e, t);
        case "base64url":
        case "base64":
          return Me(this, e, t, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Ge(this, e, t);
        default:
          if (n) throw new TypeError("Unknown encoding: " + r);
          r = (r + "").toLowerCase(), n = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function M(r, e, t) {
    const n = r[e];
    r[e] = r[t], r[t] = n;
  }
  u.prototype.swap16 = function() {
    const e = this.length;
    if (e % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < e; t += 2)
      M(this, t, t + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const e = this.length;
    if (e % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < e; t += 4)
      M(this, t, t + 3), M(this, t + 1, t + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const e = this.length;
    if (e % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let t = 0; t < e; t += 8)
      M(this, t, t + 7), M(this, t + 1, t + 6), M(this, t + 2, t + 5), M(this, t + 3, t + 4);
    return this;
  }, u.prototype.toString = function() {
    const e = this.length;
    return e === 0 ? "" : arguments.length === 0 ? ae(this, 0, e) : Te.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(e) {
    return this === e ? !0 : u.compare(this, e) === 0;
  }, u.prototype.inspect = function() {
    let e = "";
    const t = c.INSPECT_MAX_BYTES;
    return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
  }, f && (u.prototype[f] = u.prototype.inspect), u.prototype.compare = function(e, t, n, o, h) {
    if (!T(e, Uint8Array))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e
      );
    if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), o === void 0 && (o = 0), h === void 0 && (h = this.length), t < 0 || n > e.length || o < 0 || h > this.length)
      throw new RangeError("out of range index");
    if (o >= h && t >= n)
      return 0;
    if (o >= h)
      return -1;
    if (t >= n)
      return 1;
    if (t >>>= 0, n >>>= 0, o >>>= 0, h >>>= 0, this === e) return 0;
    let d = h - o, B = n - t;
    const E = Math.min(d, B);
    for (let g = 0; g < E; ++g)
      if (this[o + g] !== e[t + g]) {
        d = this[o + g], B = e[t + g];
        break;
      }
    return d < B ? -1 : B < d ? 1 : 0;
  };
  function ue(r, e, t, n, o) {
    if (r.length === 0) return -1;
    if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, Ae(t) && (t = o ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
      if (o) return -1;
      t = r.length - 1;
    } else if (t < 0)
      if (o) t = 0;
      else return -1;
    if (typeof e == "string" && (e = u.from(e, n)), u.isBuffer(e))
      return e.length === 0 ? -1 : he(r, e, t, n, o);
    if (typeof e == "number")
      return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? o ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : he(r, [e], t, n, o);
    throw new TypeError("val must be string, number or Buffer");
  }
  function he(r, e, t, n, o) {
    let h = 1, d = r.length, B = e.length;
    if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
      if (r.length < 2 || e.length < 2)
        return -1;
      h = 2, d /= 2, B /= 2, t /= 2;
    }
    function E(A, _) {
      return h === 1 ? A[_] : A.readUInt16BE(_ * h);
    }
    let g;
    if (o) {
      let A = -1;
      for (g = t; g < d; g++)
        if (E(r, g) === E(e, A === -1 ? 0 : g - A)) {
          if (A === -1 && (A = g), g - A + 1 === B) return A * h;
        } else
          A !== -1 && (g -= g - A), A = -1;
    } else
      for (t + B > d && (t = d - B), g = t; g >= 0; g--) {
        let A = !0;
        for (let _ = 0; _ < B; _++)
          if (E(r, g + _) !== E(e, _)) {
            A = !1;
            break;
          }
        if (A) return g;
      }
    return -1;
  }
  u.prototype.includes = function(e, t, n) {
    return this.indexOf(e, t, n) !== -1;
  }, u.prototype.indexOf = function(e, t, n) {
    return ue(this, e, t, n, !0);
  }, u.prototype.lastIndexOf = function(e, t, n) {
    return ue(this, e, t, n, !1);
  };
  function Le(r, e, t, n) {
    t = Number(t) || 0;
    const o = r.length - t;
    n ? (n = Number(n), n > o && (n = o)) : n = o;
    const h = e.length;
    n > h >>> 1 && (n = h >>> 1);
    for (let d = 0; d < n; ++d) {
      const B = e.charCodeAt(d * 2 + 0), E = e.charCodeAt(d * 2 + 1), g = _e[B & 127], A = _e[E & 127];
      if ((B | E | g | A) & -128)
        return d;
      r[t + d] = g << 4 | A;
    }
    return n;
  }
  function Re(r, e, t, n) {
    return V(ie(e, r.length - t), r, t, n);
  }
  function $e(r, e, t, n) {
    return V(Ve(e), r, t, n);
  }
  function Oe(r, e, t, n, o) {
    const h = o === "base64url" ? Ye(e) : e;
    return V(me(h), r, t, n);
  }
  function Ne(r, e, t, n) {
    return V(Xe(e, r.length - t), r, t, n);
  }
  u.prototype.write = function(e, t, n, o) {
    if (t === void 0)
      o = "utf8", n = this.length, t = 0;
    else if (n === void 0 && typeof t == "string")
      o = t, n = this.length, t = 0;
    else if (isFinite(t))
      t = t >>> 0, isFinite(n) ? (n = n >>> 0, o === void 0 && (o = "utf8")) : (o = n, n = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const h = this.length - t;
    if ((n === void 0 || n > h) && (n = h), e.length > 0 && (n < 0 || t < 0) || t > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    o || (o = "utf8");
    let d = !1;
    for (; ; )
      switch (o) {
        case "hex":
          return Le(this, e, t, n);
        case "utf8":
        case "utf-8":
          return Re(this, e, t, n);
        case "ascii":
        case "latin1":
        case "binary":
          return $e(this, e, t, n);
        case "base64url":
        case "base64":
          return Oe(this, e, t, n, o);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Ne(this, e, t, n);
        default:
          if (d) throw new TypeError("Unknown encoding: " + o);
          o = ("" + o).toLowerCase(), d = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this, 0)
    };
  };
  function Me(r, e, t, n) {
    let o;
    return e === 0 && t === r.length ? o = i.fromByteArray(r) : o = i.fromByteArray(r.slice(e, t)), n === "base64url" ? je(o) : o;
  }
  function ae(r, e, t) {
    t = Math.min(r.length, t);
    const n = [];
    let o = e;
    for (; o < t; ) {
      const h = r[o];
      let d = null, B = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
      if (o + B <= t) {
        let E, g, A, _;
        switch (B) {
          case 1:
            h < 128 && (d = h);
            break;
          case 2:
            E = r[o + 1], (E & 192) === 128 && (_ = (h & 31) << 6 | E & 63, _ > 127 && (d = _));
            break;
          case 3:
            E = r[o + 1], g = r[o + 2], (E & 192) === 128 && (g & 192) === 128 && (_ = (h & 15) << 12 | (E & 63) << 6 | g & 63, _ > 2047 && (_ < 55296 || _ > 57343) && (d = _));
            break;
          case 4:
            E = r[o + 1], g = r[o + 2], A = r[o + 3], (E & 192) === 128 && (g & 192) === 128 && (A & 192) === 128 && (_ = (h & 15) << 18 | (E & 63) << 12 | (g & 63) << 6 | A & 63, _ > 65535 && _ < 1114112 && (d = _));
        }
      }
      d === null ? (d = 65533, B = 1) : d > 65535 && (d -= 65536, n.push(d >>> 10 & 1023 | 55296), d = 56320 | d & 1023), n.push(d), o += B;
    }
    return De(n);
  }
  const ce = 4096;
  function De(r) {
    const e = r.length;
    if (e <= ce)
      return String.fromCharCode.apply(String, r);
    let t = "", n = 0;
    for (; n < e; )
      t += String.fromCharCode.apply(
        String,
        r.slice(n, n += ce)
      );
    return t;
  }
  function qe(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let o = e; o < t; ++o)
      n += String.fromCharCode(r[o] & 127);
    return n;
  }
  function Pe(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let o = e; o < t; ++o)
      n += String.fromCharCode(r[o]);
    return n;
  }
  function We(r, e, t) {
    const n = r.length;
    (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
    let o = "";
    for (let h = e; h < t; ++h)
      o += Je[r[h]];
    return o;
  }
  function Ge(r, e, t) {
    const n = r.slice(e, t);
    let o = "";
    for (let h = 0; h < n.length - 1; h += 2)
      o += String.fromCharCode(n[h] + n[h + 1] * 256);
    return o;
  }
  u.prototype.slice = function(e, t) {
    const n = this.length;
    e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
    const o = this.subarray(e, t);
    return Object.setPrototypeOf(o, u.prototype), o;
  };
  function U(r, e, t) {
    if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
    if (r + e > t) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let o = this[e], h = 1, d = 0;
    for (; ++d < t && (h *= 256); )
      o += this[e + d] * h;
    return o;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let o = this[e + --t], h = 1;
    for (; t > 0 && (h *= 256); )
      o += this[e + --t] * h;
    return o;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(e, t) {
    return e = e >>> 0, t || U(e, 1, this.length), this[e];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(e, t) {
    return e = e >>> 0, t || U(e, 2, this.length), this[e] | this[e + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(e, t) {
    return e = e >>> 0, t || U(e, 2, this.length), this[e] << 8 | this[e + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
  }, u.prototype.readBigUInt64LE = $(function(e) {
    e = e >>> 0, q(e, "offset");
    const t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && Y(e, this.length - 8);
    const o = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, h = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
    return BigInt(o) + (BigInt(h) << BigInt(32));
  }), u.prototype.readBigUInt64BE = $(function(e) {
    e = e >>> 0, q(e, "offset");
    const t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && Y(e, this.length - 8);
    const o = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], h = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
    return (BigInt(o) << BigInt(32)) + BigInt(h);
  }), u.prototype.readIntLE = function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let o = this[e], h = 1, d = 0;
    for (; ++d < t && (h *= 256); )
      o += this[e + d] * h;
    return h *= 128, o >= h && (o -= Math.pow(2, 8 * t)), o;
  }, u.prototype.readIntBE = function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let o = t, h = 1, d = this[e + --o];
    for (; o > 0 && (h *= 256); )
      d += this[e + --o] * h;
    return h *= 128, d >= h && (d -= Math.pow(2, 8 * t)), d;
  }, u.prototype.readInt8 = function(e, t) {
    return e = e >>> 0, t || U(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  }, u.prototype.readInt16LE = function(e, t) {
    e = e >>> 0, t || U(e, 2, this.length);
    const n = this[e] | this[e + 1] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, u.prototype.readInt16BE = function(e, t) {
    e = e >>> 0, t || U(e, 2, this.length);
    const n = this[e + 1] | this[e] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, u.prototype.readInt32LE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
  }, u.prototype.readInt32BE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
  }, u.prototype.readBigInt64LE = $(function(e) {
    e = e >>> 0, q(e, "offset");
    const t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && Y(e, this.length - 8);
    const o = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
    return (BigInt(o) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
  }), u.prototype.readBigInt64BE = $(function(e) {
    e = e >>> 0, q(e, "offset");
    const t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && Y(e, this.length - 8);
    const o = (t << 24) + // Overflow
    this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (BigInt(o) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n);
  }), u.prototype.readFloatLE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), s.read(this, e, !0, 23, 4);
  }, u.prototype.readFloatBE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), s.read(this, e, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(e, t) {
    return e = e >>> 0, t || U(e, 8, this.length), s.read(this, e, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(e, t) {
    return e = e >>> 0, t || U(e, 8, this.length), s.read(this, e, !1, 52, 8);
  };
  function k(r, e, t, n, o, h) {
    if (!u.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > o || e < h) throw new RangeError('"value" argument is out of bounds');
    if (t + n > r.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(e, t, n, o) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !o) {
      const B = Math.pow(2, 8 * n) - 1;
      k(this, e, t, n, B, 0);
    }
    let h = 1, d = 0;
    for (this[t] = e & 255; ++d < n && (h *= 256); )
      this[t + d] = e / h & 255;
    return t + n;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(e, t, n, o) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !o) {
      const B = Math.pow(2, 8 * n) - 1;
      k(this, e, t, n, B, 0);
    }
    let h = n - 1, d = 1;
    for (this[t + h] = e & 255; --h >= 0 && (d *= 256); )
      this[t + h] = e / d & 255;
    return t + n;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 2, 65535, 0), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  };
  function le(r, e, t, n, o) {
    ge(e, n, o, r, t, 7);
    let h = Number(e & BigInt(4294967295));
    r[t++] = h, h = h >> 8, r[t++] = h, h = h >> 8, r[t++] = h, h = h >> 8, r[t++] = h;
    let d = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t++] = d, d = d >> 8, r[t++] = d, d = d >> 8, r[t++] = d, d = d >> 8, r[t++] = d, t;
  }
  function de(r, e, t, n, o) {
    ge(e, n, o, r, t, 7);
    let h = Number(e & BigInt(4294967295));
    r[t + 7] = h, h = h >> 8, r[t + 6] = h, h = h >> 8, r[t + 5] = h, h = h >> 8, r[t + 4] = h;
    let d = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t + 3] = d, d = d >> 8, r[t + 2] = d, d = d >> 8, r[t + 1] = d, d = d >> 8, r[t] = d, t + 8;
  }
  u.prototype.writeBigUInt64LE = $(function(e, t = 0) {
    return le(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = $(function(e, t = 0) {
    return de(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(e, t, n, o) {
    if (e = +e, t = t >>> 0, !o) {
      const E = Math.pow(2, 8 * n - 1);
      k(this, e, t, n, E - 1, -E);
    }
    let h = 0, d = 1, B = 0;
    for (this[t] = e & 255; ++h < n && (d *= 256); )
      e < 0 && B === 0 && this[t + h - 1] !== 0 && (B = 1), this[t + h] = (e / d >> 0) - B & 255;
    return t + n;
  }, u.prototype.writeIntBE = function(e, t, n, o) {
    if (e = +e, t = t >>> 0, !o) {
      const E = Math.pow(2, 8 * n - 1);
      k(this, e, t, n, E - 1, -E);
    }
    let h = n - 1, d = 1, B = 0;
    for (this[t + h] = e & 255; --h >= 0 && (d *= 256); )
      e < 0 && B === 0 && this[t + h + 1] !== 0 && (B = 1), this[t + h] = (e / d >> 0) - B & 255;
    return t + n;
  }, u.prototype.writeInt8 = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
  }, u.prototype.writeInt16LE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, u.prototype.writeInt16BE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, u.prototype.writeInt32LE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 4, 2147483647, -2147483648), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
  }, u.prototype.writeInt32BE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || k(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, u.prototype.writeBigInt64LE = $(function(e, t = 0) {
    return le(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = $(function(e, t = 0) {
    return de(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function pe(r, e, t, n, o, h) {
    if (t + n > r.length) throw new RangeError("Index out of range");
    if (t < 0) throw new RangeError("Index out of range");
  }
  function ye(r, e, t, n, o) {
    return e = +e, t = t >>> 0, o || pe(r, e, t, 4), s.write(r, e, t, n, 23, 4), t + 4;
  }
  u.prototype.writeFloatLE = function(e, t, n) {
    return ye(this, e, t, !0, n);
  }, u.prototype.writeFloatBE = function(e, t, n) {
    return ye(this, e, t, !1, n);
  };
  function Be(r, e, t, n, o) {
    return e = +e, t = t >>> 0, o || pe(r, e, t, 8), s.write(r, e, t, n, 52, 8), t + 8;
  }
  u.prototype.writeDoubleLE = function(e, t, n) {
    return Be(this, e, t, !0, n);
  }, u.prototype.writeDoubleBE = function(e, t, n) {
    return Be(this, e, t, !1, n);
  }, u.prototype.copy = function(e, t, n, o) {
    if (!T(e, Uint8Array)) throw new TypeError("argument should be a Buffer");
    if (n || (n = 0), !o && o !== 0 && (o = this.length), t >= e.length && (t = e.length), t || (t = 0), o > 0 && o < n && (o = n), o === n || e.length === 0 || this.length === 0) return 0;
    if (t < 0)
      throw new RangeError("targetStart out of bounds");
    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
    if (o < 0) throw new RangeError("sourceEnd out of bounds");
    o > this.length && (o = this.length), e.length - t < o - n && (o = e.length - t + n);
    const h = o - n;
    return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, o) : Uint8Array.prototype.set.call(
      e,
      this.subarray(n, o),
      t
    ), h;
  }, u.prototype.fill = function(e, t, n, o) {
    if (typeof e == "string") {
      if (typeof t == "string" ? (o = t, t = 0, n = this.length) : typeof n == "string" && (o = n, n = this.length), o !== void 0 && typeof o != "string")
        throw new TypeError("encoding must be a string");
      if (typeof o == "string" && !u.isEncoding(o))
        throw new TypeError("Unknown encoding: " + o);
      if (e.length === 1) {
        const d = e.charCodeAt(0);
        (o === "utf8" && d < 128 || o === "latin1") && (e = d);
      }
    } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
    if (t < 0 || this.length < t || this.length < n)
      throw new RangeError("Out of range index");
    if (n <= t)
      return this;
    t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
    let h;
    if (typeof e == "number")
      for (h = t; h < n; ++h)
        this[h] = e;
    else {
      const d = T(e, Uint8Array) ? e : u.from(e, o), B = d.length;
      if (B === 0)
        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
      for (h = 0; h < n - t; ++h)
        this[h + t] = d[h % B];
    }
    return this;
  };
  const D = {};
  function re(r, e, t) {
    function n() {
      const o = new t(e.apply(null, arguments));
      return Object.setPrototypeOf(o, n.prototype), o.code = r, o.name = `${o.name} [${r}]`, Error.captureStackTrace && Error.captureStackTrace(o, n), o.stack, delete o.name, o;
    }
    Object.setPrototypeOf(n.prototype, t.prototype), Object.setPrototypeOf(n, t), n.prototype.toString = function() {
      return `${this.name} [${r}]: ${this.message}`;
    }, D[r] = n;
  }
  re(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(r) {
      return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), re(
    "ERR_INVALID_ARG_TYPE",
    function(r, e) {
      return `The "${r}" argument must be of type number. Received type ${typeof e}`;
    },
    TypeError
  ), re(
    "ERR_OUT_OF_RANGE",
    function(r, e, t) {
      let n = `The value of "${r}" is out of range.`, o = t;
      return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? o = we(String(t)) : typeof t == "bigint" && (o = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (o = we(o)), o += "n"), n += ` It must be ${e}. Received ${o}`, n;
    },
    RangeError
  );
  function we(r) {
    let e = "", t = r.length;
    const n = r[0] === "-" ? 1 : 0;
    for (; t >= n + 4; t -= 3)
      e = `_${r.slice(t - 3, t)}${e}`;
    return `${r.slice(0, t)}${e}`;
  }
  function ze(r, e, t) {
    q(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && Y(e, r.length - (t + 1));
  }
  function ge(r, e, t, n, o, h) {
    if (r > t || r < e) {
      const d = typeof e == "bigint" ? "n" : "";
      let B;
      throw e === 0 || e === BigInt(0) ? B = `>= 0${d} and < 2${d} ** ${(h + 1) * 8}${d}` : B = `>= -(2${d} ** ${(h + 1) * 8 - 1}${d}) and < 2 ** ${(h + 1) * 8 - 1}${d}`, new D.ERR_OUT_OF_RANGE("value", B, r);
    }
    ze(n, o, h);
  }
  function q(r, e) {
    if (typeof r != "number")
      throw new D.ERR_INVALID_ARG_TYPE(e, "number", r);
  }
  function Y(r, e, t) {
    throw Math.floor(r) !== r ? (q(r, t), new D.ERR_OUT_OF_RANGE("offset", "an integer", r)) : e < 0 ? new D.ERR_BUFFER_OUT_OF_BOUNDS() : new D.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${e}`,
      r
    );
  }
  const Qe = /[^+/0-9A-Za-z-_]/g, be = "+", Ie = "/", xe = "-", Ee = "_";
  function Ye(r) {
    return r.replaceAll(xe, be).replaceAll(Ee, Ie);
  }
  function je(r) {
    return r.replaceAll(be, xe).replaceAll(Ie, Ee);
  }
  function He(r) {
    if (r = r.split("=")[0], r = r.trim().replace(Qe, ""), r.length < 2) return "";
    for (; r.length % 4 !== 0; )
      r = r + "=";
    return r;
  }
  function ie(r, e) {
    e = e || 1 / 0;
    let t;
    const n = r.length;
    let o = null;
    const h = [];
    for (let d = 0; d < n; ++d) {
      if (t = r.charCodeAt(d), t > 55295 && t < 57344) {
        if (!o) {
          if (t > 56319) {
            (e -= 3) > -1 && h.push(239, 191, 189);
            continue;
          } else if (d + 1 === n) {
            (e -= 3) > -1 && h.push(239, 191, 189);
            continue;
          }
          o = t;
          continue;
        }
        if (t < 56320) {
          (e -= 3) > -1 && h.push(239, 191, 189), o = t;
          continue;
        }
        t = (o - 55296 << 10 | t - 56320) + 65536;
      } else o && (e -= 3) > -1 && h.push(239, 191, 189);
      if (o = null, t < 128) {
        if ((e -= 1) < 0) break;
        h.push(t);
      } else if (t < 2048) {
        if ((e -= 2) < 0) break;
        h.push(
          t >> 6 | 192,
          t & 63 | 128
        );
      } else if (t < 65536) {
        if ((e -= 3) < 0) break;
        h.push(
          t >> 12 | 224,
          t >> 6 & 63 | 128,
          t & 63 | 128
        );
      } else if (t < 1114112) {
        if ((e -= 4) < 0) break;
        h.push(
          t >> 18 | 240,
          t >> 12 & 63 | 128,
          t >> 6 & 63 | 128,
          t & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return h;
  }
  function Ve(r) {
    const e = [];
    for (let t = 0; t < r.length; ++t)
      e.push(r.charCodeAt(t) & 255);
    return e;
  }
  function Xe(r, e) {
    let t, n, o;
    const h = [];
    for (let d = 0; d < r.length && !((e -= 2) < 0); ++d)
      t = r.charCodeAt(d), n = t >> 8, o = t % 256, h.push(o), h.push(n);
    return h;
  }
  function me(r) {
    return i.toByteArray(He(r));
  }
  function V(r, e, t, n) {
    let o;
    for (o = 0; o < n && !(o + t >= e.length || o >= r.length); ++o)
      e[o + t] = r[o];
    return o;
  }
  function T(r, e) {
    return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name || e === Uint8Array && u.isBuffer(r);
  }
  function Ae(r) {
    return r !== r;
  }
  const Je = function() {
    const r = "0123456789abcdef", e = new Array(256);
    for (let t = 0; t < 16; ++t) {
      const n = t * 16;
      for (let o = 0; o < 16; ++o)
        e[n + o] = r[t] + r[o];
    }
    return e;
  }(), _e = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    10,
    11,
    12,
    13,
    14,
    15,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    10,
    11,
    12,
    13,
    14,
    15,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ];
  function $(r) {
    return typeof BigInt > "u" ? Ke : r;
  }
  function Ke() {
    throw new Error("BigInt not supported");
  }
})(Z);
class at {
  constructor() {
    w(this, "buffer", new Uint8Array(0));
  }
  write(i) {
    let s = new Uint8Array(this.buffer.length + i.length);
    s.set(this.buffer), s.set(i, this.buffer.length), this.buffer = s;
  }
}
class ct {
  /**
   * Create a new writer
   * @param stream The writable stream to write to
   * @param bufferSize The number of bytes to buffer before flushing onto the writable
   */
  constructor(i, s = 1) {
    w(this, "pendingByte", BigInt(0));
    w(this, "pendingBits", 0);
    w(this, "buffer");
    w(this, "bufferedBytes", 0);
    w(this, "_offset", 0);
    this.stream = i, this.bufferSize = s, this.buffer = new Uint8Array(s);
  }
  /**
   * How many bits have been written via this writer in total
   */
  get offset() {
    return this._offset;
  }
  /**
   * How many bits into the current byte is the write cursor.
   * If this value is zero, then we are currently byte-aligned.
   * A value of 7 means we are 1 bit away from the byte boundary.
   */
  get byteOffset() {
    return this.pendingBits;
  }
  /**
   * Finish the current byte (assuming zeros for the remaining bits, if necessary)
   * and flushes the output.
   */
  end() {
    this.finishByte(), this.flush();
  }
  /**
   * Reset the bit offset of this writer back to zero.
   */
  reset() {
    this._offset = 0;
  }
  finishByte() {
    this.pendingBits > 0 && (this.buffer[this.bufferedBytes++] = Number(this.pendingByte), this.pendingBits = 0, this.pendingByte = BigInt(0));
  }
  flush() {
    this.bufferedBytes > 0 && (this.stream.write(Z.Buffer.from(this.buffer.slice(0, this.bufferedBytes))), this.bufferedBytes = 0);
  }
  min(i, s) {
    return i < s ? i : s;
  }
  /**
   * Write the given number to the bitstream with the given bitlength. If the number is too large for the 
   * number of bits specified, the lower-order bits are written and the higher-order bits are ignored.
   * @param length The number of bits to write
   * @param value The number to write
   */
  write(i, s) {
    if (s == null && (s = 0), s = Number(s), Number.isNaN(s))
      throw new Error(`Cannot write to bitstream: Value ${s} is not a number`);
    if (!Number.isFinite(s))
      throw new Error(`Cannot write to bitstream: Value ${s} must be finite`);
    let f = BigInt(s % Math.pow(2, i)), l = i;
    for (; l > 0; ) {
      let a = BigInt(8 - this.pendingBits - l), p = a >= 0 ? f << a : f >> -a, y = Number(a >= 0 ? l : this.min(-a, BigInt(8 - this.pendingBits)));
      this.pendingByte = this.pendingByte | p, this.pendingBits += y, this._offset += y, l -= y, f = f % BigInt(Math.pow(2, l)), this.pendingBits === 8 && (this.finishByte(), this.bufferedBytes >= this.buffer.length && this.flush());
    }
  }
}
let X;
class lt {
  constructor() {
    w(this, "buffers", []);
    w(this, "bufferedLength", 0);
    w(this, "blockedRequest", null);
    w(this, "_offsetIntoBuffer", 0);
    w(this, "_bufferIndex", 0);
    w(this, "_offset", 0);
    w(this, "_spentBufferSize", 0);
    /**
     * When true, buffers are not removed, which allows the user to 
     * "rewind" the current offset back into buffers that have already been 
     * visited. If you enable this, you will need to remove buffers manually using 
     * clean()
     */
    w(this, "retainBuffers", !1);
    w(this, "textDecoder", new TextDecoder());
    w(this, "skippedLength", 0);
    w(this, "_ended", !1);
  }
  /**
   * Get the index of the buffer currently being read. This will always be zero unless retainBuffers=true
   */
  get bufferIndex() {
    return this._bufferIndex;
  }
  /**
   * Get the current offset in bits, starting from the very first bit read by this reader (across all 
   * buffers added)
   */
  get offset() {
    return this._offset;
  }
  /**
   * The total number of bits which were in buffers that have previously been read, and have since been discarded.
   */
  get spentBufferSize() {
    return this._spentBufferSize;
  }
  /**
   * Set the current offset in bits, as measured from the very first bit read by this reader (across all buffers
   * added). If the given offset points into a previously discarded buffer, an error will be thrown. See the 
   * retainBuffers option if you need to seek back into previous buffers. If the desired offset is in a previous
   * buffer which has not been discarded, the current read head is moved into the appropriate offset of that buffer.
   */
  set offset(i) {
    if (i < this._spentBufferSize)
      throw new Error(
        `Offset ${i} points into a discarded buffer! If you need to seek backwards outside the current buffer, make sure to set retainBuffers=true`
      );
    let s = i - this._spentBufferSize, f = 0;
    for (let l = 0, a = this.buffers.length; l < a; ++l) {
      let p = this.buffers[l], y = p.length * 8;
      if (s < y) {
        this._bufferIndex = f, this._offset = i, this._offsetIntoBuffer = s, this.bufferedLength = p.length * 8 - this._offsetIntoBuffer;
        for (let u = l + 1; u < a; ++u)
          this.bufferedLength += this.buffers[u].length * 8;
        return;
      }
      s -= y, ++f;
    }
  }
  /**
   * Run a function which can synchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  simulateSync(i) {
    let s = this.retainBuffers, f = this.offset;
    this.retainBuffers = !0;
    try {
      return i();
    } finally {
      this.retainBuffers = s, this.offset = f;
    }
  }
  /**
   * Run a function which can asynchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  async simulate(i) {
    let s = this.retainBuffers, f = this.offset;
    this.retainBuffers = !0;
    try {
      return await i();
    } finally {
      this.retainBuffers = s, this.offset = f;
    }
  }
  /**
   * Remove any fully used up buffers. Only has an effect if retainBuffers is true.
   * Optional `count` parameter lets you control how many buffers can be freed.
   */
  clean(i) {
    let s = i !== void 0 ? Math.min(i, this._bufferIndex) : this._bufferIndex;
    for (let f = 0, l = s; f < l; ++f)
      this._spentBufferSize += this.buffers[0].length * 8, this.buffers.shift();
    this._bufferIndex -= s;
  }
  /**
   * The number of bits that are currently available.
   */
  get available() {
    return this.bufferedLength - this.skippedLength;
  }
  /**
   * Check if the given number of bits are currently available.
   * @param length The number of bits to check for
   * @returns True if the required number of bits is available, false otherwise
   */
  isAvailable(i) {
    return this.bufferedLength >= i;
  }
  ensureNoReadPending() {
    if (this.blockedRequest)
      throw new Error("Only one read() can be outstanding at a time.");
  }
  /**
   * Asynchronously read the given number of bytes, encode it into a string, and return the result,
   * optionally using a specific text encoding.
   * @param length The number of bytes to read
   * @param options A set of options to control conversion into a string. @see StringEncodingOptions
   * @returns The resulting string
   */
  async readString(i, s) {
    return this.ensureNoReadPending(), await this.assure(8 * i), this.readStringSync(i, s);
  }
  /**
   * Synchronously read the given number of bytes, encode it into a string, and return the result,
   * optionally using a specific text encoding.
   * @param length The number of bytes to read
   * @param options A set of options to control conversion into a string. @see StringEncodingOptions
   * @returns The resulting string
   */
  readStringSync(i, s) {
    s || (s = {}), this.ensureNoReadPending();
    let f = new Uint8Array(i), l = -1, a = 1, p = s.encoding ?? "utf-8";
    ["utf16le", "ucs-2", "ucs2"].includes(p) && (a = 2);
    for (let y = 0, u = i; y < u; ++y)
      f[y] = this.readSync(8);
    for (let y = 0, u = i; y < u; y += a) {
      let I = f[y];
      if (a === 2 && (I = I << 8 | (f[y + 1] ?? 0)), I === 0) {
        l = y;
        break;
      }
    }
    if (s.nullTerminated !== !1 && l >= 0 && (f = f.subarray(0, l)), p === "utf-8")
      return this.textDecoder.decode(f);
    if (typeof Buffer > "u")
      throw new Error(`Encoding '${p}' is not supported: No Node.js Buffer implementation and TextDecoder only supports utf-8`);
    return Buffer.from(f).toString(p);
  }
  /**
   * Read a number of the given bitlength synchronously without advancing
   * the read head.
   * @param length The number of bits to read
   * @returns The number read from the bitstream
   */
  peekSync(i) {
    return this.readCoreSync(i, !1);
  }
  /**
   * Skip the given number of bits. 
   * @param length The number of bits to skip
   */
  skip(i) {
    this.skippedLength += i;
  }
  /**
   * Read an unsigned integer of the given bit length synchronously. If there are not enough 
   * bits available, an error is thrown.
   * 
   * @param length The number of bits to read
   * @returns The unsigned integer that was read
   */
  readSync(i) {
    return this.readCoreSync(i, !0);
  }
  /**
   * Read a number of bytes from the stream. Returns a generator that ends when the read is complete,
   * and yields a number of *bytes* still to be read (not bits like in other read methods)
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  *readBytes(i, s = 0, f) {
    var a;
    if (f ?? (f = i.length - s), this._offsetIntoBuffer % 8 === 0) {
      globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    Byte-aligned readBytes(), length=${f}`), console.log(`------------------------------------------------------------    readBytes(): Pre-operation: buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferLength=${((a = this.buffers[this._bufferIndex]) == null ? void 0 : a.length) || "<none>"} bufferCount=${this.buffers.length}`));
      let p = f, y = 0;
      for (; p > 0; ) {
        this.available < p * 8 && (yield Math.max((p * 8 - this.available) / 8));
        let u = Math.floor(this._offsetIntoBuffer / 8), I = this.buffers[this._bufferIndex], b = Math.min(p, I.length);
        for (let m = 0; m < b; ++m)
          i[y + m] = I[u + m];
        y += b;
        let x = b * 8;
        this.consume(x), p -= x, globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    readBytes(): consumed=${b} bytes, remaining=${p}`), console.log(`------------------------------------------------------------    readBytes(): buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferCount=${this.buffers.length}`));
      }
    } else
      for (let p = s, y = Math.min(i.length, s + f); p < y; ++p)
        this.isAvailable(8) || (yield y - p), i[p] = this.readSync(8);
    return i;
  }
  /**
   * Read a number of bytes from the stream synchronously. If not enough bytes are available, an 
   * exception is thrown.
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  readBytesSync(i, s = 0, f) {
    f ?? (f = i.length - s);
    let l = this.readBytes(i, s, f);
    for (; ; ) {
      if (l.next().done === !1)
        throw new Error(`underrun: Not enough bits are available (requested ${f} bytes)`);
      break;
    }
    return i;
  }
  /**
   * Read a number of bytes from the stream. Blocks and waits for more bytes if not enough bytes are available.
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  async readBytesBlocking(i, s = 0, f) {
    f ?? (f = i.length - s);
    let l = this.readBytes(i, s, f);
    for (; ; ) {
      let a = l.next();
      if (a.done === !1)
        await this.assure(a.value * 8);
      else
        break;
    }
    return i;
  }
  /**
   * Read a two's complement signed integer of the given bit length synchronously. If there are not
   * enough bits available, an error is thrown.
   * 
   * @param length The number of bits to read
   * @returns The signed integer that was read
   */
  readSignedSync(i) {
    const s = this.readSync(i), f = 2 ** (i - 1), l = f - 1;
    return s & f ? -((~(s - 1) & l) >>> 0) : s;
  }
  maskOf(i) {
    if (!X) {
      X = /* @__PURE__ */ new Map();
      for (let s = 0; s <= 64; ++s)
        X.set(s, Math.pow(2, s) - 1);
    }
    return X.get(i) ?? Math.pow(2, i) - 1;
  }
  /**
   * Read an IEEE 754 floating point value with the given bit length (32 or 64). If there are not 
   * enough bits available, an error is thrown.
   * 
   * @param length Must be 32 for 32-bit single-precision or 64 for 64-bit double-precision. All
   *        other values result in TypeError
   * @returns The floating point value that was read
   */
  readFloatSync(i) {
    if (i !== 32 && i !== 64)
      throw new TypeError(`Invalid length (${i} bits) Only 4-byte (32 bit / single-precision) and 8-byte (64 bit / double-precision) IEEE 754 values are supported`);
    if (!this.isAvailable(i))
      throw new Error(`underrun: Not enough bits are available (requested=${i}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    let s = new ArrayBuffer(i / 8), f = new DataView(s);
    for (let l = 0, a = s.byteLength; l < a; ++l)
      f.setUint8(l, this.readSync(8));
    if (i === 32)
      return f.getFloat32(0, !1);
    if (i === 64)
      return f.getFloat64(0, !1);
    throw new TypeError(`Invalid length (${i} bits) Only 4-byte (32 bit / single-precision) and 8-byte (64 bit / double-precision) IEEE 754 values are supported`);
  }
  readByteAligned(i) {
    let s = this.buffers[this._bufferIndex], f = s[this._offsetIntoBuffer / 8];
    return i && (this.bufferedLength -= 8, this._offsetIntoBuffer += 8, this._offset += 8, this._offsetIntoBuffer >= s.length * 8 && (this._bufferIndex += 1, this._offsetIntoBuffer = 0, this.retainBuffers || this.clean())), f;
  }
  consume(i) {
    this.bufferedLength -= i, this._offsetIntoBuffer += i, this._offset += i;
    let s = this.buffers[this._bufferIndex];
    for (; s && this._offsetIntoBuffer >= s.length * 8; )
      this._bufferIndex += 1, this._offsetIntoBuffer -= s.length * 8, s = this.buffers[this._bufferIndex], this.retainBuffers || this.clean();
  }
  readShortByteAligned(i, s) {
    let f = this.buffers[this._bufferIndex], l = this._offsetIntoBuffer / 8, a = f[l], p;
    if (l + 1 >= f.length ? p = this.buffers[this._bufferIndex + 1][0] : p = f[l + 1], i && this.consume(16), s === "lsb") {
      let y = a;
      a = p, p = y;
    }
    return a << 8 | p;
  }
  readLongByteAligned(i, s) {
    let f = this._bufferIndex, l = this.buffers[f], a = this._offsetIntoBuffer / 8, p = l[a++];
    a >= l.length && (l = this.buffers[++f], a = 0);
    let y = l[a++];
    a >= l.length && (l = this.buffers[++f], a = 0);
    let u = l[a++];
    a >= l.length && (l = this.buffers[++f], a = 0);
    let I = l[a++];
    a >= l.length && (l = this.buffers[++f], a = 0), i && this.consume(32);
    let b = (p & 128) !== 0;
    if (p &= -129, s === "lsb") {
      let m = I, S = u, F = y, N = p;
      p = m, y = S, u = F, I = N;
    }
    let x = p << 24 | y << 16 | u << 8 | I;
    return b && (x += 2 ** 31), x;
  }
  read3ByteAligned(i, s) {
    let f = this._bufferIndex, l = this.buffers[f], a = this._offsetIntoBuffer / 8, p = l[a++];
    a >= l.length && (l = this.buffers[++f], a = 0);
    let y = l[a++];
    a >= l.length && (l = this.buffers[++f], a = 0);
    let u = l[a++];
    if (a >= l.length && (l = this.buffers[++f], a = 0), i && this.consume(24), s === "lsb") {
      let I = p;
      p = u, u = I;
    }
    return p << 16 | y << 8 | u;
  }
  readPartialByte(i, s) {
    let l = this.buffers[this._bufferIndex][Math.floor(this._offsetIntoBuffer / 8)], a = this._offsetIntoBuffer % 8 | 0;
    return s && this.consume(i), l >> 8 - i - a & this.maskOf(i) | 0;
  }
  /**
   * @param length 
   * @param consume 
   * @param byteOrder The byte order to use when the length is greater than 8 and is a multiple of 8. 
   *                  Defaults to MSB (most significant byte). If the length is not a multiple of 8, 
   *                  this is unused
   * @returns 
   */
  readCoreSync(i, s, f = "msb") {
    if (this.ensureNoReadPending(), this.available < i)
      throw new Error(`underrun: Not enough bits are available (requested=${i}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    this.adjustSkip();
    let l = this._offsetIntoBuffer % 8;
    if (l === 0) {
      if (i === 8)
        return this.readByteAligned(s);
      if (i === 16)
        return this.readShortByteAligned(s, f);
      if (i === 24)
        return this.read3ByteAligned(s, f);
      if (i === 32)
        return this.readLongByteAligned(s, f);
    }
    if (i < 8 && (8 - l | 0) >= i)
      return this.readPartialByte(i, s);
    let a = i, p = this._offsetIntoBuffer, y = this._bufferIndex, u = BigInt(0), I = 0, b = i > 31;
    for (; a > 0; ) {
      if (y >= this.buffers.length)
        throw new Error(`Internal error: Buffer index out of range (index=${y}, count=${this.buffers.length}), offset=${this.offset}, readLength=${i}, available=${this.available})`);
      let x = this.buffers[y], m = Math.floor(p / 8);
      if (m >= x.length)
        throw new Error(`Internal error: Current buffer (index ${y}) has length ${x.length} but our position within the buffer is ${m}! offset=${this.offset}, bufs=${this.buffers.length}`);
      let S = p % 8, F, N = x[m];
      F = Math.min(8 - S, a), b ? u = u << BigInt(F) | BigInt(x[m]) >> BigInt(8) - BigInt(F) - BigInt(S) & BigInt(this.maskOf(F)) : I = I << F | N >> 8 - F - S & this.maskOf(F), p += F, a -= F | 0, p >= x.length * 8 && (y += 1, p = 0);
    }
    return s && this.consume(i), b ? Number(u) : I;
  }
  adjustSkip() {
    if (!(this.skippedLength <= 0)) {
      for (; this.buffers && this.skippedLength > this.buffers[0].length * 8 - this._offsetIntoBuffer; )
        this.skippedLength -= this.buffers[0].length * 8 - this._offsetIntoBuffer, this._offsetIntoBuffer = 0, this.buffers.shift();
      this.buffers.length > 0 && (this._offsetIntoBuffer += this.skippedLength, this.skippedLength = 0);
    }
  }
  /**
   * Wait until the given number of bits is available
   * @param length The number of bits to wait for
   * @param optional When true, the returned promise will resolve even if the stream ends before all bits are 
   *                 available. Otherwise, the promise will reject. 
   * @returns A promise which will resolve when the requested number of bits are available. Rejects if the stream 
   *          ends before the request is satisfied, unless optional parameter is true. 
   */
  assure(i, s = !1) {
    return this.ensureNoReadPending(), this.bufferedLength >= i ? Promise.resolve() : this.block({ length: i, assure: !0 }).then((f) => {
      if (f < i && !s)
        throw this.endOfStreamError(i);
    });
  }
  /**
   * Read an unsigned integer with the given bit length, waiting until enough bits are 
   * available for the operation. 
   * 
   * @param length The number of bits to read
   * @returns A promise which resolves to the unsigned integer once it is read
   */
  read(i) {
    return this.ensureNoReadPending(), this.available >= i ? Promise.resolve(this.readSync(i)) : this.block({ length: i });
  }
  /**
   * Read a two's complement signed integer with the given bit length, waiting until enough bits are 
   * available for the operation. 
   * 
   * @param length The number of bits to read
   * @returns A promise which resolves to the signed integer value once it is read
   */
  readSigned(i) {
    return this.ensureNoReadPending(), this.available >= i ? Promise.resolve(this.readSignedSync(i)) : this.block({ length: i, signed: !0 });
  }
  promise() {
    let i = () => {
    }, s = () => {
    };
    return { promise: new Promise((l, a) => (i = l, s = a)), resolve: i, reject: s };
  }
  block(i) {
    return this._ended ? i.assure ? Promise.resolve(this.available) : Promise.reject(this.endOfStreamError(i.length)) : (this.blockedRequest = {
      ...i,
      ...this.promise()
    }, this.blockedRequest.promise);
  }
  /**
   * Read an IEEE 754 floating point value with the given bit length, waiting until enough bits are
   * available for the operation.
   * 
   * @param length The number of bits to read (must be 32 for 32-bit single-precision or 
   *                  64 for 64-bit double-precision)
   * @returns A promise which resolves to the floating point value once it is read
   */
  readFloat(i) {
    return this.ensureNoReadPending(), this.available >= i ? Promise.resolve(this.readFloatSync(i)) : this.block({ length: i, float: !0 });
  }
  /**
   * Asynchronously read a number of the given bitlength without advancing the read head.
   * @param length The number of bits to read. If there are not enough bits available 
   * to complete the operation, the operation is delayed until enough bits become available.
   * @returns A promise which resolves iwth the number read from the bitstream
   */
  async peek(i) {
    return await this.assure(i), this.peekSync(i);
  }
  /**
   * Add a buffer onto the end of the bitstream.
   * @param buffer The buffer to add to the bitstream
   */
  addBuffer(i) {
    if (this._ended)
      throw new Error("Cannot add buffers to a reader which has been marked as ended without calling reset() first");
    if (this.buffers.push(i), this.bufferedLength += i.length * 8, this.blockedRequest && this.blockedRequest.length <= this.available) {
      let s = this.blockedRequest;
      this.blockedRequest = null, s.assure ? s.resolve(s.length) : s.signed ? s.resolve(this.readSignedSync(s.length)) : s.float ? s.resolve(this.readFloatSync(s.length)) : s.resolve(this.readSync(s.length));
    }
  }
  get ended() {
    return this._ended;
  }
  reset() {
    if (this.blockedRequest)
      throw new Error("Cannot reset while there is a blocked request!");
    this.buffers = [], this.bufferedLength = 0, this.blockedRequest = null, this._offsetIntoBuffer = 0, this._bufferIndex = 0, this._offset = 0, this._spentBufferSize = 0, this._ended = !1;
  }
  /**
   * Inform this reader that it will not receive any further buffers. Any requests to assure bits beyond the end of the 
   * buffer will result ss
   */
  end() {
    if (this._ended = !0, this.blockedRequest) {
      let i = this.blockedRequest;
      if (this.blockedRequest = null, i.length <= this.available)
        throw new Error("Internal inconsistency in @/bitstream: Should have granted request prior. Please report this bug.");
      i.assure ? i.resolve(this.available) : i.reject(this.endOfStreamError(i.length));
    }
  }
  endOfStreamError(i) {
    return new Error(`End of stream reached while reading ${i} bits, only ${this.available} bits are left in the stream`);
  }
}
function pt(c) {
  const s = c.split(`
`).flatMap((p) => {
    const y = p.trim().match(/^(\d+) (\w+)$/);
    return y && parseInt(y[1], 10) > 0 ? [{ quantity: parseInt(y[1], 10), id: y[2] }] : [];
  }), f = new at(), l = new ct(f, 1024);
  return Q.fromList(s).encode(l), l.end(), Z.Buffer.concat([f.buffer]).toString("base64url");
}
function yt(c) {
  const i = Z.Buffer.from(c, "base64url");
  let s = new lt();
  return s.addBuffer(i), Q.decode(s).asCardRefQty.map((a) => `${a.quantity} ${a.id}`).join(`
`);
}
export {
  yt as decodeList,
  pt as encodeList
};
