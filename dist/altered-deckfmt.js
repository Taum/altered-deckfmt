var ze = Object.defineProperty;
var Ge = (p, i, s) => i in p ? ze(p, i, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[i] = s;
var B = (p, i, s) => Ge(p, typeof i != "symbol" ? i + "" : i, s);
var N = /* @__PURE__ */ ((p) => (p.Axiom = "AX", p.Bravos = "BR", p.Lyra = "LY", p.Muna = "MU", p.Ordis = "OR", p.Yzmir = "YZ", p.Neutral = "NE", p))(N || {}), G = /* @__PURE__ */ ((p) => (p.Common = "C", p.Rare = "R1", p.RareOOF = "R2", p.Unique = "U", p))(G || {}), re = /* @__PURE__ */ ((p) => (p.Core = "CORE", p.CoreKS = "COREKS", p))(re || {});
class Be {
  constructor(i) {
    B(this, "set_code");
    B(this, "b_p");
    B(this, "faction");
    B(this, "num_in_faction");
    B(this, "rarity");
    B(this, "uniq_num");
    const s = i.match(/^ALT_(\w+)_(B|P)_(\w{2})_(\d{1,2})_(C|R1|R2|U)(?:_(\d+))?$/);
    if (!s)
      throw "unrecognized card id";
    if (this.set_code = s[1], this.b_p = s[2] == "B" ? 0 : 1, this.faction = s[3], this.num_in_faction = parseInt(s[4], 10), this.rarity = s[5], this.uniq_num = s[6] ? parseInt(s[6]) : void 0, this.rarity == "U" && this.uniq_num == null)
      throw "unique card is missing a unique_number";
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
    }
    throw `Unrecognized Rarity ${this.rarity}`;
  }
  get setId() {
    switch (this.set_code) {
      case "CORE":
        return 1;
      case "COREKS":
        return 2;
    }
    throw `Unrecognized SetCode ${this.rarity}`;
  }
}
class Y {
  constructor() {
    B(this, "setCode");
    B(this, "faction");
    B(this, "numberInFaction");
    B(this, "rarity");
    B(this, "uniqueId");
  }
  static decode(i, s) {
    const u = new Y();
    if (s.setCode === void 0)
      throw new X("Tried to decode Card without SetCode in context");
    if (u.setCode = s.setCode, u.faction = i.readSync(3), u.faction == 0)
      throw new X(`Invalid faction ID (${u.faction})`);
    return u.numberInFaction = i.readSync(5), u.rarity = i.readSync(2), u.rarity == 3 && (u.uniqueId = i.readSync(16)), u;
  }
  encode(i) {
    i.write(3, this.faction), i.write(5, this.numberInFaction), i.write(2, this.rarity), this.uniqueId !== void 0 && i.write(16, this.uniqueId);
  }
  get asCardId() {
    let i = "ALT_";
    switch (this.setCode) {
      case 1:
        i += re.Core;
        break;
      case 2:
        i += re.CoreKS;
        break;
    }
    switch (i += "_B_", this.faction) {
      case 1:
        i += N.Axiom;
        break;
      case 2:
        i += N.Bravos;
        break;
      case 3:
        i += N.Lyra;
        break;
      case 4:
        i += N.Muna;
        break;
      case 5:
        i += N.Ordis;
        break;
      case 6:
        i += N.Yzmir;
        break;
      case 7:
        i += N.Neutral;
        break;
    }
    switch (i += "_", this.numberInFaction < 10 && this.faction != 7 && (i += "0"), i += this.numberInFaction, i += "_", this.rarity) {
      case 0:
        i += G.Common;
        break;
      case 1:
        i += G.Rare;
        break;
      case 2:
        i += G.RareOOF;
        break;
      case 3:
        i += G.Unique + "_" + this.uniqueId;
        break;
    }
    return i;
  }
  static fromId(i) {
    let s = new Y(), u = new Be(i);
    return s.setCode = u.setId, s.faction = u.factionId, s.numberInFaction = u.num_in_faction, s.rarity = u.rarityId, s.uniqueId = u.uniq_num, s;
  }
}
class j {
  constructor() {
    B(this, "quantity");
    // VLE: 2 (+6) bits
    B(this, "card");
  }
  static decode(i, s) {
    const u = new j(), c = i.readSync(2);
    if (c > 0)
      u.quantity = c;
    else {
      const l = i.readSync(6);
      u.quantity = l == 0 ? 0 : l + 3;
    }
    return u.card = Y.decode(i, s), u;
  }
  encode(i) {
    if (this.quantity > 0 && this.quantity <= 3)
      i.write(2, this.quantity);
    else if (this.quantity > 3) {
      if (this.quantity > 65)
        throw new ge(`Cannot encode card quantity (${this.quantity}) greater than 65`);
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
    let u = new j();
    return u.quantity = i, u.card = Y.fromId(s), u;
  }
}
class Q {
  constructor() {
    B(this, "setCode");
    // 8 bits
    B(this, "cardQty");
  }
  // count: 6 bits
  static decode(i, s) {
    const u = new Q();
    if (u.setCode = i.readSync(8), u.setCode == 0)
      throw new X(`Invalid SetCode ID (${u.setCode})`);
    s.setCode = u.setCode;
    const c = i.readSync(6), l = new Array();
    for (let d = 0; d < c; d++)
      l.push(j.decode(i, s));
    return u.cardQty = l, s.setCode = void 0, u;
  }
  encode(i) {
    if (this.cardQty.length <= 0)
      throw new ge("Cannot encode a SetGroup with 0 cards");
    const s = this.cardQty[0].card.setCode;
    i.write(8, s), i.write(6, this.cardQty.length);
    for (let u of this.cardQty)
      u.encode(i);
  }
  static from(i) {
    let s = new Q();
    return s.cardQty = i.map((u) => j.from(u.quantity, u.id)), s;
  }
}
class D {
  constructor() {
    B(this, "version");
    // 4 bits
    B(this, "setGroups");
  }
  // count: 8 bits
  static decode(i) {
    const s = new D(), u = new Ye();
    if (s.version = i.readSync(4), s.version !== 1)
      throw new X(`Invalid version (${s.version}`);
    const c = i.readSync(8), l = new Array();
    for (let d = 0; d < c; d++)
      l.push(Q.decode(i, u));
    return s.setGroups = l, s;
  }
  encode(i) {
    i.write(4, this.version), i.write(8, this.setGroups.length);
    for (let u of this.setGroups)
      u.encode(i);
    const s = 8 - i.offset % 8;
    i.write(s, 0);
  }
  get asCardRefQty() {
    return this.setGroups.reduce((i, s) => i.concat(s.cardQty.map((u) => u.asCardRefQty)), Array());
  }
  static fromList(i) {
    const s = D.groupedBySet(i).map((c) => Q.from(c));
    let u = new D();
    return u.version = 1, u.setGroups = s, u;
  }
  static groupedBySet(i) {
    let s = /* @__PURE__ */ new Map();
    for (let u of i) {
      const c = new Be(u.id).set_code;
      let l = s.get(c);
      l || (l = [], s.set(c, l)), l.push(u);
    }
    return Array.from(s, ([u, c]) => c);
  }
}
class Ye {
  constructor() {
    B(this, "setCode");
  }
}
class X extends Error {
  constructor(i) {
    super(i), this.name = "DecodingError";
  }
}
class ge extends Error {
  constructor(i) {
    super(i), this.name = "EncodingError";
  }
}
var K = {}, H = {};
H.byteLength = We;
H.toByteArray = Xe;
H.fromByteArray = Je;
var L = [], R = [], je = typeof Uint8Array < "u" ? Uint8Array : Array, te = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var P = 0, Qe = te.length; P < Qe; ++P)
  L[P] = te[P], R[te.charCodeAt(P)] = P;
R[45] = 62;
R[95] = 63;
function be(p) {
  var i = p.length;
  if (i % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var s = p.indexOf("=");
  s === -1 && (s = i);
  var u = s === i ? 0 : 4 - s % 4;
  return [s, u];
}
function We(p) {
  var i = be(p), s = i[0], u = i[1];
  return (s + u) * 3 / 4 - u;
}
function Ve(p, i, s) {
  return (i + s) * 3 / 4 - s;
}
function Xe(p) {
  var i, s = be(p), u = s[0], c = s[1], l = new je(Ve(p, u, c)), d = 0, o = c > 0 ? u - 4 : u, y;
  for (y = 0; y < o; y += 4)
    i = R[p.charCodeAt(y)] << 18 | R[p.charCodeAt(y + 1)] << 12 | R[p.charCodeAt(y + 2)] << 6 | R[p.charCodeAt(y + 3)], l[d++] = i >> 16 & 255, l[d++] = i >> 8 & 255, l[d++] = i & 255;
  return c === 2 && (i = R[p.charCodeAt(y)] << 2 | R[p.charCodeAt(y + 1)] >> 4, l[d++] = i & 255), c === 1 && (i = R[p.charCodeAt(y)] << 10 | R[p.charCodeAt(y + 1)] << 4 | R[p.charCodeAt(y + 2)] >> 2, l[d++] = i >> 8 & 255, l[d++] = i & 255), l;
}
function Ke(p) {
  return L[p >> 18 & 63] + L[p >> 12 & 63] + L[p >> 6 & 63] + L[p & 63];
}
function He(p, i, s) {
  for (var u, c = [], l = i; l < s; l += 3)
    u = (p[l] << 16 & 16711680) + (p[l + 1] << 8 & 65280) + (p[l + 2] & 255), c.push(Ke(u));
  return c.join("");
}
function Je(p) {
  for (var i, s = p.length, u = s % 3, c = [], l = 16383, d = 0, o = s - u; d < o; d += l)
    c.push(He(p, d, d + l > o ? o : d + l));
  return u === 1 ? (i = p[s - 1], c.push(
    L[i >> 2] + L[i << 4 & 63] + "=="
  )) : u === 2 && (i = (p[s - 2] << 8) + p[s - 1], c.push(
    L[i >> 10] + L[i >> 4 & 63] + L[i << 2 & 63] + "="
  )), c.join("");
}
var ie = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ie.read = function(p, i, s, u, c) {
  var l, d, o = c * 8 - u - 1, y = (1 << o) - 1, b = y >> 1, x = -7, g = s ? c - 1 : 0, F = s ? -1 : 1, A = p[i + g];
  for (g += F, l = A & (1 << -x) - 1, A >>= -x, x += o; x > 0; l = l * 256 + p[i + g], g += F, x -= 8)
    ;
  for (d = l & (1 << -x) - 1, l >>= -x, x += u; x > 0; d = d * 256 + p[i + g], g += F, x -= 8)
    ;
  if (l === 0)
    l = 1 - b;
  else {
    if (l === y)
      return d ? NaN : (A ? -1 : 1) * (1 / 0);
    d = d + Math.pow(2, u), l = l - b;
  }
  return (A ? -1 : 1) * d * Math.pow(2, l - u);
};
ie.write = function(p, i, s, u, c, l) {
  var d, o, y, b = l * 8 - c - 1, x = (1 << b) - 1, g = x >> 1, F = c === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, A = u ? 0 : l - 1, S = u ? 1 : -1, T = i < 0 || i === 0 && 1 / i < 0 ? 1 : 0;
  for (i = Math.abs(i), isNaN(i) || i === 1 / 0 ? (o = isNaN(i) ? 1 : 0, d = x) : (d = Math.floor(Math.log(i) / Math.LN2), i * (y = Math.pow(2, -d)) < 1 && (d--, y *= 2), d + g >= 1 ? i += F / y : i += F * Math.pow(2, 1 - g), i * y >= 2 && (d++, y /= 2), d + g >= x ? (o = 0, d = x) : d + g >= 1 ? (o = (i * y - 1) * Math.pow(2, c), d = d + g) : (o = i * Math.pow(2, g - 1) * Math.pow(2, c), d = 0)); c >= 8; p[s + A] = o & 255, A += S, o /= 256, c -= 8)
    ;
  for (d = d << c | o, b += c; b > 0; p[s + A] = d & 255, A += S, d /= 256, b -= 8)
    ;
  p[s + A - S] |= T * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(p) {
  const i = H, s = ie, u = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  p.Buffer = o, p.SlowBuffer = me, p.INSPECT_MAX_BYTES = 50;
  const c = 2147483647;
  p.kMaxLength = c, o.TYPED_ARRAY_SUPPORT = l(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function l() {
    try {
      const r = new Uint8Array(1), e = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(r, e), r.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(o.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (o.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(o.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (o.isBuffer(this))
        return this.byteOffset;
    }
  });
  function d(r) {
    if (r > c)
      throw new RangeError('The value "' + r + '" is invalid for option "size"');
    const e = new Uint8Array(r);
    return Object.setPrototypeOf(e, o.prototype), e;
  }
  function o(r, e, t) {
    if (typeof r == "number") {
      if (typeof e == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return g(r);
    }
    return y(r, e, t);
  }
  o.poolSize = 8192;
  function y(r, e, t) {
    if (typeof r == "string")
      return F(r, e);
    if (ArrayBuffer.isView(r))
      return S(r);
    if (r == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
      );
    if (k(r, ArrayBuffer) || r && k(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (k(r, SharedArrayBuffer) || r && k(r.buffer, SharedArrayBuffer)))
      return T(r, e, t);
    if (typeof r == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const n = r.valueOf && r.valueOf();
    if (n != null && n !== r)
      return o.from(n, e, t);
    const f = xe(r);
    if (f) return f;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function")
      return o.from(r[Symbol.toPrimitive]("string"), e, t);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
    );
  }
  o.from = function(r, e, t) {
    return y(r, e, t);
  }, Object.setPrototypeOf(o.prototype, Uint8Array.prototype), Object.setPrototypeOf(o, Uint8Array);
  function b(r) {
    if (typeof r != "number")
      throw new TypeError('"size" argument must be of type number');
    if (r < 0)
      throw new RangeError('The value "' + r + '" is invalid for option "size"');
  }
  function x(r, e, t) {
    return b(r), r <= 0 ? d(r) : e !== void 0 ? typeof t == "string" ? d(r).fill(e, t) : d(r).fill(e) : d(r);
  }
  o.alloc = function(r, e, t) {
    return x(r, e, t);
  };
  function g(r) {
    return b(r), d(r < 0 ? 0 : J(r) | 0);
  }
  o.allocUnsafe = function(r) {
    return g(r);
  }, o.allocUnsafeSlow = function(r) {
    return g(r);
  };
  function F(r, e) {
    if ((typeof e != "string" || e === "") && (e = "utf8"), !o.isEncoding(e))
      throw new TypeError("Unknown encoding: " + e);
    const t = ne(r, e) | 0;
    let n = d(t);
    const f = n.write(r, e);
    return f !== t && (n = n.slice(0, f)), n;
  }
  function A(r) {
    const e = r.length < 0 ? 0 : J(r.length) | 0, t = d(e);
    for (let n = 0; n < e; n += 1)
      t[n] = r[n] & 255;
    return t;
  }
  function S(r) {
    if (k(r, Uint8Array)) {
      const e = new Uint8Array(r);
      return T(e.buffer, e.byteOffset, e.byteLength);
    }
    return A(r);
  }
  function T(r, e, t) {
    if (e < 0 || r.byteLength < e)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (r.byteLength < e + (t || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return e === void 0 && t === void 0 ? n = new Uint8Array(r) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(r, e, t), Object.setPrototypeOf(n, o.prototype), n;
  }
  function xe(r) {
    if (o.isBuffer(r)) {
      const e = J(r.length) | 0, t = d(e);
      return t.length === 0 || r.copy(t, 0, 0, e), t;
    }
    if (r.length !== void 0)
      return typeof r.length != "number" || ee(r.length) ? d(0) : A(r);
    if (r.type === "Buffer" && Array.isArray(r.data))
      return A(r.data);
  }
  function J(r) {
    if (r >= c)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + c.toString(16) + " bytes");
    return r | 0;
  }
  function me(r) {
    return +r != r && (r = 0), o.alloc(+r);
  }
  o.isBuffer = function(e) {
    return e != null && e._isBuffer === !0 && e !== o.prototype;
  }, o.compare = function(e, t) {
    if (k(e, Uint8Array) && (e = o.from(e, e.offset, e.byteLength)), k(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), !o.isBuffer(e) || !o.isBuffer(t))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (e === t) return 0;
    let n = e.length, f = t.length;
    for (let h = 0, a = Math.min(n, f); h < a; ++h)
      if (e[h] !== t[h]) {
        n = e[h], f = t[h];
        break;
      }
    return n < f ? -1 : f < n ? 1 : 0;
  }, o.isEncoding = function(e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, o.concat = function(e, t) {
    if (!Array.isArray(e))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (e.length === 0)
      return o.alloc(0);
    let n;
    if (t === void 0)
      for (t = 0, n = 0; n < e.length; ++n)
        t += e[n].length;
    const f = o.allocUnsafe(t);
    let h = 0;
    for (n = 0; n < e.length; ++n) {
      let a = e[n];
      if (k(a, Uint8Array))
        h + a.length > f.length ? (o.isBuffer(a) || (a = o.from(a)), a.copy(f, h)) : Uint8Array.prototype.set.call(
          f,
          a,
          h
        );
      else if (o.isBuffer(a))
        a.copy(f, h);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      h += a.length;
    }
    return f;
  };
  function ne(r, e) {
    if (o.isBuffer(r))
      return r.length;
    if (ArrayBuffer.isView(r) || k(r, ArrayBuffer))
      return r.byteLength;
    if (typeof r != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
      );
    const t = r.length, n = arguments.length > 2 && arguments[2] === !0;
    if (!n && t === 0) return 0;
    let f = !1;
    for (; ; )
      switch (e) {
        case "ascii":
        case "latin1":
        case "binary":
          return t;
        case "utf8":
        case "utf-8":
          return v(r).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return t * 2;
        case "hex":
          return t >>> 1;
        case "base64":
          return we(r).length;
        default:
          if (f)
            return n ? -1 : v(r).length;
          e = ("" + e).toLowerCase(), f = !0;
      }
  }
  o.byteLength = ne;
  function Ie(r, e, t) {
    let n = !1;
    if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e))
      return "";
    for (r || (r = "utf8"); ; )
      switch (r) {
        case "hex":
          return Le(this, e, t);
        case "utf8":
        case "utf-8":
          return fe(this, e, t);
        case "ascii":
          return Re(this, e, t);
        case "latin1":
        case "binary":
          return ke(this, e, t);
        case "base64":
          return Se(this, e, t);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Te(this, e, t);
        default:
          if (n) throw new TypeError("Unknown encoding: " + r);
          r = (r + "").toLowerCase(), n = !0;
      }
  }
  o.prototype._isBuffer = !0;
  function M(r, e, t) {
    const n = r[e];
    r[e] = r[t], r[t] = n;
  }
  o.prototype.swap16 = function() {
    const e = this.length;
    if (e % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < e; t += 2)
      M(this, t, t + 1);
    return this;
  }, o.prototype.swap32 = function() {
    const e = this.length;
    if (e % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < e; t += 4)
      M(this, t, t + 3), M(this, t + 1, t + 2);
    return this;
  }, o.prototype.swap64 = function() {
    const e = this.length;
    if (e % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let t = 0; t < e; t += 8)
      M(this, t, t + 7), M(this, t + 1, t + 6), M(this, t + 2, t + 5), M(this, t + 3, t + 4);
    return this;
  }, o.prototype.toString = function() {
    const e = this.length;
    return e === 0 ? "" : arguments.length === 0 ? fe(this, 0, e) : Ie.apply(this, arguments);
  }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(e) {
    if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e ? !0 : o.compare(this, e) === 0;
  }, o.prototype.inspect = function() {
    let e = "";
    const t = p.INSPECT_MAX_BYTES;
    return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
  }, u && (o.prototype[u] = o.prototype.inspect), o.prototype.compare = function(e, t, n, f, h) {
    if (k(e, Uint8Array) && (e = o.from(e, e.offset, e.byteLength)), !o.isBuffer(e))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e
      );
    if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), f === void 0 && (f = 0), h === void 0 && (h = this.length), t < 0 || n > e.length || f < 0 || h > this.length)
      throw new RangeError("out of range index");
    if (f >= h && t >= n)
      return 0;
    if (f >= h)
      return -1;
    if (t >= n)
      return 1;
    if (t >>>= 0, n >>>= 0, f >>>= 0, h >>>= 0, this === e) return 0;
    let a = h - f, w = n - t;
    const E = Math.min(a, w), I = this.slice(f, h), _ = e.slice(t, n);
    for (let m = 0; m < E; ++m)
      if (I[m] !== _[m]) {
        a = I[m], w = _[m];
        break;
      }
    return a < w ? -1 : w < a ? 1 : 0;
  };
  function se(r, e, t, n, f) {
    if (r.length === 0) return -1;
    if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, ee(t) && (t = f ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
      if (f) return -1;
      t = r.length - 1;
    } else if (t < 0)
      if (f) t = 0;
      else return -1;
    if (typeof e == "string" && (e = o.from(e, n)), o.isBuffer(e))
      return e.length === 0 ? -1 : oe(r, e, t, n, f);
    if (typeof e == "number")
      return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? f ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : oe(r, [e], t, n, f);
    throw new TypeError("val must be string, number or Buffer");
  }
  function oe(r, e, t, n, f) {
    let h = 1, a = r.length, w = e.length;
    if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
      if (r.length < 2 || e.length < 2)
        return -1;
      h = 2, a /= 2, w /= 2, t /= 2;
    }
    function E(_, m) {
      return h === 1 ? _[m] : _.readUInt16BE(m * h);
    }
    let I;
    if (f) {
      let _ = -1;
      for (I = t; I < a; I++)
        if (E(r, I) === E(e, _ === -1 ? 0 : I - _)) {
          if (_ === -1 && (_ = I), I - _ + 1 === w) return _ * h;
        } else
          _ !== -1 && (I -= I - _), _ = -1;
    } else
      for (t + w > a && (t = a - w), I = t; I >= 0; I--) {
        let _ = !0;
        for (let m = 0; m < w; m++)
          if (E(r, I + m) !== E(e, m)) {
            _ = !1;
            break;
          }
        if (_) return I;
      }
    return -1;
  }
  o.prototype.includes = function(e, t, n) {
    return this.indexOf(e, t, n) !== -1;
  }, o.prototype.indexOf = function(e, t, n) {
    return se(this, e, t, n, !0);
  }, o.prototype.lastIndexOf = function(e, t, n) {
    return se(this, e, t, n, !1);
  };
  function Ee(r, e, t, n) {
    t = Number(t) || 0;
    const f = r.length - t;
    n ? (n = Number(n), n > f && (n = f)) : n = f;
    const h = e.length;
    n > h / 2 && (n = h / 2);
    let a;
    for (a = 0; a < n; ++a) {
      const w = parseInt(e.substr(a * 2, 2), 16);
      if (ee(w)) return a;
      r[t + a] = w;
    }
    return a;
  }
  function _e(r, e, t, n) {
    return W(v(e, r.length - t), r, t, n);
  }
  function Fe(r, e, t, n) {
    return W(qe(e), r, t, n);
  }
  function Ae(r, e, t, n) {
    return W(we(e), r, t, n);
  }
  function Ue(r, e, t, n) {
    return W(Oe(e, r.length - t), r, t, n);
  }
  o.prototype.write = function(e, t, n, f) {
    if (t === void 0)
      f = "utf8", n = this.length, t = 0;
    else if (n === void 0 && typeof t == "string")
      f = t, n = this.length, t = 0;
    else if (isFinite(t))
      t = t >>> 0, isFinite(n) ? (n = n >>> 0, f === void 0 && (f = "utf8")) : (f = n, n = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const h = this.length - t;
    if ((n === void 0 || n > h) && (n = h), e.length > 0 && (n < 0 || t < 0) || t > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    f || (f = "utf8");
    let a = !1;
    for (; ; )
      switch (f) {
        case "hex":
          return Ee(this, e, t, n);
        case "utf8":
        case "utf-8":
          return _e(this, e, t, n);
        case "ascii":
        case "latin1":
        case "binary":
          return Fe(this, e, t, n);
        case "base64":
          return Ae(this, e, t, n);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Ue(this, e, t, n);
        default:
          if (a) throw new TypeError("Unknown encoding: " + f);
          f = ("" + f).toLowerCase(), a = !0;
      }
  }, o.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Se(r, e, t) {
    return e === 0 && t === r.length ? i.fromByteArray(r) : i.fromByteArray(r.slice(e, t));
  }
  function fe(r, e, t) {
    t = Math.min(r.length, t);
    const n = [];
    let f = e;
    for (; f < t; ) {
      const h = r[f];
      let a = null, w = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
      if (f + w <= t) {
        let E, I, _, m;
        switch (w) {
          case 1:
            h < 128 && (a = h);
            break;
          case 2:
            E = r[f + 1], (E & 192) === 128 && (m = (h & 31) << 6 | E & 63, m > 127 && (a = m));
            break;
          case 3:
            E = r[f + 1], I = r[f + 2], (E & 192) === 128 && (I & 192) === 128 && (m = (h & 15) << 12 | (E & 63) << 6 | I & 63, m > 2047 && (m < 55296 || m > 57343) && (a = m));
            break;
          case 4:
            E = r[f + 1], I = r[f + 2], _ = r[f + 3], (E & 192) === 128 && (I & 192) === 128 && (_ & 192) === 128 && (m = (h & 15) << 18 | (E & 63) << 12 | (I & 63) << 6 | _ & 63, m > 65535 && m < 1114112 && (a = m));
        }
      }
      a === null ? (a = 65533, w = 1) : a > 65535 && (a -= 65536, n.push(a >>> 10 & 1023 | 55296), a = 56320 | a & 1023), n.push(a), f += w;
    }
    return Ce(n);
  }
  const ue = 4096;
  function Ce(r) {
    const e = r.length;
    if (e <= ue)
      return String.fromCharCode.apply(String, r);
    let t = "", n = 0;
    for (; n < e; )
      t += String.fromCharCode.apply(
        String,
        r.slice(n, n += ue)
      );
    return t;
  }
  function Re(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let f = e; f < t; ++f)
      n += String.fromCharCode(r[f] & 127);
    return n;
  }
  function ke(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let f = e; f < t; ++f)
      n += String.fromCharCode(r[f]);
    return n;
  }
  function Le(r, e, t) {
    const n = r.length;
    (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
    let f = "";
    for (let h = e; h < t; ++h)
      f += Pe[r[h]];
    return f;
  }
  function Te(r, e, t) {
    const n = r.slice(e, t);
    let f = "";
    for (let h = 0; h < n.length - 1; h += 2)
      f += String.fromCharCode(n[h] + n[h + 1] * 256);
    return f;
  }
  o.prototype.slice = function(e, t) {
    const n = this.length;
    e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
    const f = this.subarray(e, t);
    return Object.setPrototypeOf(f, o.prototype), f;
  };
  function U(r, e, t) {
    if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
    if (r + e > t) throw new RangeError("Trying to access beyond buffer length");
  }
  o.prototype.readUintLE = o.prototype.readUIntLE = function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let f = this[e], h = 1, a = 0;
    for (; ++a < t && (h *= 256); )
      f += this[e + a] * h;
    return f;
  }, o.prototype.readUintBE = o.prototype.readUIntBE = function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let f = this[e + --t], h = 1;
    for (; t > 0 && (h *= 256); )
      f += this[e + --t] * h;
    return f;
  }, o.prototype.readUint8 = o.prototype.readUInt8 = function(e, t) {
    return e = e >>> 0, t || U(e, 1, this.length), this[e];
  }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(e, t) {
    return e = e >>> 0, t || U(e, 2, this.length), this[e] | this[e + 1] << 8;
  }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(e, t) {
    return e = e >>> 0, t || U(e, 2, this.length), this[e] << 8 | this[e + 1];
  }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
  }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
  }, o.prototype.readBigUInt64LE = $(function(e) {
    e = e >>> 0, O(e, "offset");
    const t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && z(e, this.length - 8);
    const f = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, h = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
    return BigInt(f) + (BigInt(h) << BigInt(32));
  }), o.prototype.readBigUInt64BE = $(function(e) {
    e = e >>> 0, O(e, "offset");
    const t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && z(e, this.length - 8);
    const f = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], h = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
    return (BigInt(f) << BigInt(32)) + BigInt(h);
  }), o.prototype.readIntLE = function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let f = this[e], h = 1, a = 0;
    for (; ++a < t && (h *= 256); )
      f += this[e + a] * h;
    return h *= 128, f >= h && (f -= Math.pow(2, 8 * t)), f;
  }, o.prototype.readIntBE = function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || U(e, t, this.length);
    let f = t, h = 1, a = this[e + --f];
    for (; f > 0 && (h *= 256); )
      a += this[e + --f] * h;
    return h *= 128, a >= h && (a -= Math.pow(2, 8 * t)), a;
  }, o.prototype.readInt8 = function(e, t) {
    return e = e >>> 0, t || U(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  }, o.prototype.readInt16LE = function(e, t) {
    e = e >>> 0, t || U(e, 2, this.length);
    const n = this[e] | this[e + 1] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, o.prototype.readInt16BE = function(e, t) {
    e = e >>> 0, t || U(e, 2, this.length);
    const n = this[e + 1] | this[e] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, o.prototype.readInt32LE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
  }, o.prototype.readInt32BE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
  }, o.prototype.readBigInt64LE = $(function(e) {
    e = e >>> 0, O(e, "offset");
    const t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && z(e, this.length - 8);
    const f = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
    return (BigInt(f) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
  }), o.prototype.readBigInt64BE = $(function(e) {
    e = e >>> 0, O(e, "offset");
    const t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && z(e, this.length - 8);
    const f = (t << 24) + // Overflow
    this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (BigInt(f) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n);
  }), o.prototype.readFloatLE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), s.read(this, e, !0, 23, 4);
  }, o.prototype.readFloatBE = function(e, t) {
    return e = e >>> 0, t || U(e, 4, this.length), s.read(this, e, !1, 23, 4);
  }, o.prototype.readDoubleLE = function(e, t) {
    return e = e >>> 0, t || U(e, 8, this.length), s.read(this, e, !0, 52, 8);
  }, o.prototype.readDoubleBE = function(e, t) {
    return e = e >>> 0, t || U(e, 8, this.length), s.read(this, e, !1, 52, 8);
  };
  function C(r, e, t, n, f, h) {
    if (!o.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > f || e < h) throw new RangeError('"value" argument is out of bounds');
    if (t + n > r.length) throw new RangeError("Index out of range");
  }
  o.prototype.writeUintLE = o.prototype.writeUIntLE = function(e, t, n, f) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !f) {
      const w = Math.pow(2, 8 * n) - 1;
      C(this, e, t, n, w, 0);
    }
    let h = 1, a = 0;
    for (this[t] = e & 255; ++a < n && (h *= 256); )
      this[t + a] = e / h & 255;
    return t + n;
  }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(e, t, n, f) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !f) {
      const w = Math.pow(2, 8 * n) - 1;
      C(this, e, t, n, w, 0);
    }
    let h = n - 1, a = 1;
    for (this[t + h] = e & 255; --h >= 0 && (a *= 256); )
      this[t + h] = e / a & 255;
    return t + n;
  }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
  }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 2, 65535, 0), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
  }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  };
  function he(r, e, t, n, f) {
    ye(e, n, f, r, t, 7);
    let h = Number(e & BigInt(4294967295));
    r[t++] = h, h = h >> 8, r[t++] = h, h = h >> 8, r[t++] = h, h = h >> 8, r[t++] = h;
    let a = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t++] = a, a = a >> 8, r[t++] = a, a = a >> 8, r[t++] = a, a = a >> 8, r[t++] = a, t;
  }
  function ae(r, e, t, n, f) {
    ye(e, n, f, r, t, 7);
    let h = Number(e & BigInt(4294967295));
    r[t + 7] = h, h = h >> 8, r[t + 6] = h, h = h >> 8, r[t + 5] = h, h = h >> 8, r[t + 4] = h;
    let a = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t + 3] = a, a = a >> 8, r[t + 2] = a, a = a >> 8, r[t + 1] = a, a = a >> 8, r[t] = a, t + 8;
  }
  o.prototype.writeBigUInt64LE = $(function(e, t = 0) {
    return he(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }), o.prototype.writeBigUInt64BE = $(function(e, t = 0) {
    return ae(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }), o.prototype.writeIntLE = function(e, t, n, f) {
    if (e = +e, t = t >>> 0, !f) {
      const E = Math.pow(2, 8 * n - 1);
      C(this, e, t, n, E - 1, -E);
    }
    let h = 0, a = 1, w = 0;
    for (this[t] = e & 255; ++h < n && (a *= 256); )
      e < 0 && w === 0 && this[t + h - 1] !== 0 && (w = 1), this[t + h] = (e / a >> 0) - w & 255;
    return t + n;
  }, o.prototype.writeIntBE = function(e, t, n, f) {
    if (e = +e, t = t >>> 0, !f) {
      const E = Math.pow(2, 8 * n - 1);
      C(this, e, t, n, E - 1, -E);
    }
    let h = n - 1, a = 1, w = 0;
    for (this[t + h] = e & 255; --h >= 0 && (a *= 256); )
      e < 0 && w === 0 && this[t + h + 1] !== 0 && (w = 1), this[t + h] = (e / a >> 0) - w & 255;
    return t + n;
  }, o.prototype.writeInt8 = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
  }, o.prototype.writeInt16LE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, o.prototype.writeInt16BE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, o.prototype.writeInt32LE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 4, 2147483647, -2147483648), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
  }, o.prototype.writeInt32BE = function(e, t, n) {
    return e = +e, t = t >>> 0, n || C(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, o.prototype.writeBigInt64LE = $(function(e, t = 0) {
    return he(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), o.prototype.writeBigInt64BE = $(function(e, t = 0) {
    return ae(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ce(r, e, t, n, f, h) {
    if (t + n > r.length) throw new RangeError("Index out of range");
    if (t < 0) throw new RangeError("Index out of range");
  }
  function le(r, e, t, n, f) {
    return e = +e, t = t >>> 0, f || ce(r, e, t, 4), s.write(r, e, t, n, 23, 4), t + 4;
  }
  o.prototype.writeFloatLE = function(e, t, n) {
    return le(this, e, t, !0, n);
  }, o.prototype.writeFloatBE = function(e, t, n) {
    return le(this, e, t, !1, n);
  };
  function de(r, e, t, n, f) {
    return e = +e, t = t >>> 0, f || ce(r, e, t, 8), s.write(r, e, t, n, 52, 8), t + 8;
  }
  o.prototype.writeDoubleLE = function(e, t, n) {
    return de(this, e, t, !0, n);
  }, o.prototype.writeDoubleBE = function(e, t, n) {
    return de(this, e, t, !1, n);
  }, o.prototype.copy = function(e, t, n, f) {
    if (!o.isBuffer(e)) throw new TypeError("argument should be a Buffer");
    if (n || (n = 0), !f && f !== 0 && (f = this.length), t >= e.length && (t = e.length), t || (t = 0), f > 0 && f < n && (f = n), f === n || e.length === 0 || this.length === 0) return 0;
    if (t < 0)
      throw new RangeError("targetStart out of bounds");
    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
    if (f < 0) throw new RangeError("sourceEnd out of bounds");
    f > this.length && (f = this.length), e.length - t < f - n && (f = e.length - t + n);
    const h = f - n;
    return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, f) : Uint8Array.prototype.set.call(
      e,
      this.subarray(n, f),
      t
    ), h;
  }, o.prototype.fill = function(e, t, n, f) {
    if (typeof e == "string") {
      if (typeof t == "string" ? (f = t, t = 0, n = this.length) : typeof n == "string" && (f = n, n = this.length), f !== void 0 && typeof f != "string")
        throw new TypeError("encoding must be a string");
      if (typeof f == "string" && !o.isEncoding(f))
        throw new TypeError("Unknown encoding: " + f);
      if (e.length === 1) {
        const a = e.charCodeAt(0);
        (f === "utf8" && a < 128 || f === "latin1") && (e = a);
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
      const a = o.isBuffer(e) ? e : o.from(e, f), w = a.length;
      if (w === 0)
        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
      for (h = 0; h < n - t; ++h)
        this[h + t] = a[h % w];
    }
    return this;
  };
  const q = {};
  function Z(r, e, t) {
    q[r] = class extends t {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: e.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${r}]`, this.stack, delete this.name;
      }
      get code() {
        return r;
      }
      set code(f) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: f,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${r}]: ${this.message}`;
      }
    };
  }
  Z(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(r) {
      return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), Z(
    "ERR_INVALID_ARG_TYPE",
    function(r, e) {
      return `The "${r}" argument must be of type number. Received type ${typeof e}`;
    },
    TypeError
  ), Z(
    "ERR_OUT_OF_RANGE",
    function(r, e, t) {
      let n = `The value of "${r}" is out of range.`, f = t;
      return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? f = pe(String(t)) : typeof t == "bigint" && (f = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (f = pe(f)), f += "n"), n += ` It must be ${e}. Received ${f}`, n;
    },
    RangeError
  );
  function pe(r) {
    let e = "", t = r.length;
    const n = r[0] === "-" ? 1 : 0;
    for (; t >= n + 4; t -= 3)
      e = `_${r.slice(t - 3, t)}${e}`;
    return `${r.slice(0, t)}${e}`;
  }
  function $e(r, e, t) {
    O(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && z(e, r.length - (t + 1));
  }
  function ye(r, e, t, n, f, h) {
    if (r > t || r < e) {
      const a = typeof e == "bigint" ? "n" : "";
      let w;
      throw e === 0 || e === BigInt(0) ? w = `>= 0${a} and < 2${a} ** ${(h + 1) * 8}${a}` : w = `>= -(2${a} ** ${(h + 1) * 8 - 1}${a}) and < 2 ** ${(h + 1) * 8 - 1}${a}`, new q.ERR_OUT_OF_RANGE("value", w, r);
    }
    $e(n, f, h);
  }
  function O(r, e) {
    if (typeof r != "number")
      throw new q.ERR_INVALID_ARG_TYPE(e, "number", r);
  }
  function z(r, e, t) {
    throw Math.floor(r) !== r ? (O(r, t), new q.ERR_OUT_OF_RANGE("offset", "an integer", r)) : e < 0 ? new q.ERR_BUFFER_OUT_OF_BOUNDS() : new q.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${e}`,
      r
    );
  }
  const Ne = /[^+/0-9A-Za-z-_]/g;
  function Me(r) {
    if (r = r.split("=")[0], r = r.trim().replace(Ne, ""), r.length < 2) return "";
    for (; r.length % 4 !== 0; )
      r = r + "=";
    return r;
  }
  function v(r, e) {
    e = e || 1 / 0;
    let t;
    const n = r.length;
    let f = null;
    const h = [];
    for (let a = 0; a < n; ++a) {
      if (t = r.charCodeAt(a), t > 55295 && t < 57344) {
        if (!f) {
          if (t > 56319) {
            (e -= 3) > -1 && h.push(239, 191, 189);
            continue;
          } else if (a + 1 === n) {
            (e -= 3) > -1 && h.push(239, 191, 189);
            continue;
          }
          f = t;
          continue;
        }
        if (t < 56320) {
          (e -= 3) > -1 && h.push(239, 191, 189), f = t;
          continue;
        }
        t = (f - 55296 << 10 | t - 56320) + 65536;
      } else f && (e -= 3) > -1 && h.push(239, 191, 189);
      if (f = null, t < 128) {
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
  function qe(r) {
    const e = [];
    for (let t = 0; t < r.length; ++t)
      e.push(r.charCodeAt(t) & 255);
    return e;
  }
  function Oe(r, e) {
    let t, n, f;
    const h = [];
    for (let a = 0; a < r.length && !((e -= 2) < 0); ++a)
      t = r.charCodeAt(a), n = t >> 8, f = t % 256, h.push(f), h.push(n);
    return h;
  }
  function we(r) {
    return i.toByteArray(Me(r));
  }
  function W(r, e, t, n) {
    let f;
    for (f = 0; f < n && !(f + t >= e.length || f >= r.length); ++f)
      e[f + t] = r[f];
    return f;
  }
  function k(r, e) {
    return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name;
  }
  function ee(r) {
    return r !== r;
  }
  const Pe = function() {
    const r = "0123456789abcdef", e = new Array(256);
    for (let t = 0; t < 16; ++t) {
      const n = t * 16;
      for (let f = 0; f < 16; ++f)
        e[n + f] = r[t] + r[f];
    }
    return e;
  }();
  function $(r) {
    return typeof BigInt > "u" ? De : r;
  }
  function De() {
    throw new Error("BigInt not supported");
  }
})(K);
class Ze {
  constructor() {
    B(this, "buffer", new Uint8Array(0));
  }
  write(i) {
    let s = new Uint8Array(this.buffer.length + i.length);
    s.set(this.buffer), s.set(i, this.buffer.length), this.buffer = s;
  }
}
class ve {
  /**
   * Create a new writer
   * @param stream The writable stream to write to
   * @param bufferSize The number of bytes to buffer before flushing onto the writable
   */
  constructor(i, s = 1) {
    B(this, "pendingByte", BigInt(0));
    B(this, "pendingBits", 0);
    B(this, "buffer");
    B(this, "bufferedBytes", 0);
    B(this, "_offset", 0);
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
    this.bufferedBytes > 0 && (this.stream.write(K.Buffer.from(this.buffer.slice(0, this.bufferedBytes))), this.bufferedBytes = 0);
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
    let u = BigInt(s % Math.pow(2, i)), c = i;
    for (; c > 0; ) {
      let l = BigInt(8 - this.pendingBits - c), d = l >= 0 ? u << l : u >> -l, o = Number(l >= 0 ? c : this.min(-l, BigInt(8 - this.pendingBits)));
      this.pendingByte = this.pendingByte | d, this.pendingBits += o, this._offset += o, c -= o, u = u % BigInt(Math.pow(2, c)), this.pendingBits === 8 && (this.finishByte(), this.bufferedBytes >= this.buffer.length && this.flush());
    }
  }
}
let V;
class et {
  constructor() {
    B(this, "buffers", []);
    B(this, "bufferedLength", 0);
    B(this, "blockedRequest", null);
    B(this, "_offsetIntoBuffer", 0);
    B(this, "_bufferIndex", 0);
    B(this, "_offset", 0);
    B(this, "_spentBufferSize", 0);
    /**
     * When true, buffers are not removed, which allows the user to 
     * "rewind" the current offset back into buffers that have already been 
     * visited. If you enable this, you will need to remove buffers manually using 
     * clean()
     */
    B(this, "retainBuffers", !1);
    B(this, "textDecoder", new TextDecoder());
    B(this, "skippedLength", 0);
    B(this, "_ended", !1);
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
    let s = i - this._spentBufferSize, u = 0;
    for (let c = 0, l = this.buffers.length; c < l; ++c) {
      let d = this.buffers[c], o = d.length * 8;
      if (s < o) {
        this._bufferIndex = u, this._offset = i, this._offsetIntoBuffer = s, this.bufferedLength = d.length * 8 - this._offsetIntoBuffer;
        for (let y = c + 1; y < l; ++y)
          this.bufferedLength += this.buffers[y].length * 8;
        return;
      }
      s -= o, ++u;
    }
  }
  /**
   * Run a function which can synchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  simulateSync(i) {
    let s = this.retainBuffers, u = this.offset;
    this.retainBuffers = !0;
    try {
      return i();
    } finally {
      this.retainBuffers = s, this.offset = u;
    }
  }
  /**
   * Run a function which can asynchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  async simulate(i) {
    let s = this.retainBuffers, u = this.offset;
    this.retainBuffers = !0;
    try {
      return await i();
    } finally {
      this.retainBuffers = s, this.offset = u;
    }
  }
  /**
   * Remove any fully used up buffers. Only has an effect if retainBuffers is true.
   * Optional `count` parameter lets you control how many buffers can be freed.
   */
  clean(i) {
    let s = i !== void 0 ? Math.min(i, this._bufferIndex) : this._bufferIndex;
    for (let u = 0, c = s; u < c; ++u)
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
    let u = new Uint8Array(i), c = -1, l = 1, d = s.encoding ?? "utf-8";
    ["utf16le", "ucs-2", "ucs2"].includes(d) && (l = 2);
    for (let o = 0, y = i; o < y; ++o)
      u[o] = this.readSync(8);
    for (let o = 0, y = i; o < y; o += l) {
      let b = u[o];
      if (l === 2 && (b = b << 8 | (u[o + 1] ?? 0)), b === 0) {
        c = o;
        break;
      }
    }
    if (s.nullTerminated !== !1 && c >= 0 && (u = u.subarray(0, c)), d === "utf-8")
      return this.textDecoder.decode(u);
    if (typeof Buffer > "u")
      throw new Error(`Encoding '${d}' is not supported: No Node.js Buffer implementation and TextDecoder only supports utf-8`);
    return Buffer.from(u).toString(d);
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
  *readBytes(i, s = 0, u) {
    var l;
    if (u ?? (u = i.length - s), this._offsetIntoBuffer % 8 === 0) {
      globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    Byte-aligned readBytes(), length=${u}`), console.log(`------------------------------------------------------------    readBytes(): Pre-operation: buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferLength=${((l = this.buffers[this._bufferIndex]) == null ? void 0 : l.length) || "<none>"} bufferCount=${this.buffers.length}`));
      let d = u, o = 0;
      for (; d > 0; ) {
        this.available < d * 8 && (yield Math.max((d * 8 - this.available) / 8));
        let y = Math.floor(this._offsetIntoBuffer / 8), b = this.buffers[this._bufferIndex], x = Math.min(d, b.length);
        for (let F = 0; F < x; ++F)
          i[o + F] = b[y + F];
        o += x;
        let g = x * 8;
        this.consume(g), d -= g, globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    readBytes(): consumed=${x} bytes, remaining=${d}`), console.log(`------------------------------------------------------------    readBytes(): buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferCount=${this.buffers.length}`));
      }
    } else
      for (let d = s, o = Math.min(i.length, s + u); d < o; ++d)
        this.isAvailable(8) || (yield o - d), i[d] = this.readSync(8);
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
  readBytesSync(i, s = 0, u) {
    u ?? (u = i.length - s);
    let c = this.readBytes(i, s, u);
    for (; ; ) {
      if (c.next().done === !1)
        throw new Error(`underrun: Not enough bits are available (requested ${u} bytes)`);
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
  async readBytesBlocking(i, s = 0, u) {
    u ?? (u = i.length - s);
    let c = this.readBytes(i, s, u);
    for (; ; ) {
      let l = c.next();
      if (l.done === !1)
        await this.assure(l.value * 8);
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
    const s = this.readSync(i), u = 2 ** (i - 1), c = u - 1;
    return s & u ? -((~(s - 1) & c) >>> 0) : s;
  }
  maskOf(i) {
    if (!V) {
      V = /* @__PURE__ */ new Map();
      for (let s = 0; s <= 64; ++s)
        V.set(s, Math.pow(2, s) - 1);
    }
    return V.get(i) ?? Math.pow(2, i) - 1;
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
    let s = new ArrayBuffer(i / 8), u = new DataView(s);
    for (let c = 0, l = s.byteLength; c < l; ++c)
      u.setUint8(c, this.readSync(8));
    if (i === 32)
      return u.getFloat32(0, !1);
    if (i === 64)
      return u.getFloat64(0, !1);
  }
  readByteAligned(i) {
    let s = this.buffers[this._bufferIndex], u = s[this._offsetIntoBuffer / 8];
    return i && (this.bufferedLength -= 8, this._offsetIntoBuffer += 8, this._offset += 8, this._offsetIntoBuffer >= s.length * 8 && (this._bufferIndex += 1, this._offsetIntoBuffer = 0, this.retainBuffers || this.clean())), u;
  }
  consume(i) {
    this.bufferedLength -= i, this._offsetIntoBuffer += i, this._offset += i;
    let s = this.buffers[this._bufferIndex];
    for (; s && this._offsetIntoBuffer >= s.length * 8; )
      this._bufferIndex += 1, this._offsetIntoBuffer -= s.length * 8, s = this.buffers[this._bufferIndex], this.retainBuffers || this.clean();
  }
  readShortByteAligned(i, s) {
    let u = this.buffers[this._bufferIndex], c = this._offsetIntoBuffer / 8, l = u[c], d;
    if (c + 1 >= u.length ? d = this.buffers[this._bufferIndex + 1][0] : d = u[c + 1], i && this.consume(16), s === "lsb") {
      let o = l;
      l = d, d = o;
    }
    return l << 8 | d;
  }
  readLongByteAligned(i, s) {
    let u = this._bufferIndex, c = this.buffers[u], l = this._offsetIntoBuffer / 8, d = c[l++];
    l >= c.length && (c = this.buffers[++u], l = 0);
    let o = c[l++];
    l >= c.length && (c = this.buffers[++u], l = 0);
    let y = c[l++];
    l >= c.length && (c = this.buffers[++u], l = 0);
    let b = c[l++];
    l >= c.length && (c = this.buffers[++u], l = 0), i && this.consume(32);
    let x = (d & 128) !== 0;
    if (d &= -129, s === "lsb") {
      let F = b, A = y, S = o, T = d;
      d = F, o = A, y = S, b = T;
    }
    let g = d << 24 | o << 16 | y << 8 | b;
    return x && (g += 2 ** 31), g;
  }
  read3ByteAligned(i, s) {
    let u = this._bufferIndex, c = this.buffers[u], l = this._offsetIntoBuffer / 8, d = c[l++];
    l >= c.length && (c = this.buffers[++u], l = 0);
    let o = c[l++];
    l >= c.length && (c = this.buffers[++u], l = 0);
    let y = c[l++];
    if (l >= c.length && (c = this.buffers[++u], l = 0), i && this.consume(24), s === "lsb") {
      let b = d;
      d = y, y = b;
    }
    return d << 16 | o << 8 | y;
  }
  readPartialByte(i, s) {
    let c = this.buffers[this._bufferIndex][Math.floor(this._offsetIntoBuffer / 8)], l = this._offsetIntoBuffer % 8 | 0;
    return s && this.consume(i), c >> 8 - i - l & this.maskOf(i) | 0;
  }
  /**
   * @param length 
   * @param consume 
   * @param byteOrder The byte order to use when the length is greater than 8 and is a multiple of 8. 
   *                  Defaults to MSB (most significant byte). If the length is not a multiple of 8, 
   *                  this is unused
   * @returns 
   */
  readCoreSync(i, s, u = "msb") {
    if (this.ensureNoReadPending(), this.available < i)
      throw new Error(`underrun: Not enough bits are available (requested=${i}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    this.adjustSkip();
    let c = this._offsetIntoBuffer % 8;
    if (c === 0) {
      if (i === 8)
        return this.readByteAligned(s);
      if (i === 16)
        return this.readShortByteAligned(s, u);
      if (i === 24)
        return this.read3ByteAligned(s, u);
      if (i === 32)
        return this.readLongByteAligned(s, u);
    }
    if (i < 8 && (8 - c | 0) >= i)
      return this.readPartialByte(i, s);
    let l = i, d = this._offsetIntoBuffer, o = this._bufferIndex, y = BigInt(0), b = 0, x = i > 31;
    for (; l > 0; ) {
      if (o >= this.buffers.length)
        throw new Error(`Internal error: Buffer index out of range (index=${o}, count=${this.buffers.length}), offset=${this.offset}, readLength=${i}, available=${this.available})`);
      let g = this.buffers[o], F = Math.floor(d / 8);
      if (F >= g.length)
        throw new Error(`Internal error: Current buffer (index ${o}) has length ${g.length} but our position within the buffer is ${F}! offset=${this.offset}, bufs=${this.buffers.length}`);
      let A = d % 8, S, T = g[F];
      S = Math.min(8 - A, l), x ? y = y << BigInt(S) | BigInt(g[F]) >> BigInt(8) - BigInt(S) - BigInt(A) & BigInt(this.maskOf(S)) : b = b << S | T >> 8 - S - A & this.maskOf(S), d += S, l -= S | 0, d >= g.length * 8 && (o += 1, d = 0);
    }
    return s && this.consume(i), x ? Number(y) : b;
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
    return this.ensureNoReadPending(), this.bufferedLength >= i ? Promise.resolve() : this.block({ length: i, assure: !0 }).then((u) => {
      if (u < i && !s)
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
    let i, s;
    return { promise: new Promise((c, l) => (i = c, s = l)), resolve: i, reject: s };
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
function it(p) {
  const s = p.split(`
`).flatMap((d) => {
    let o = d.trim().match(/^(\d+) (\w+)$/);
    return o ? [{ quantity: parseInt(o[1], 10), id: o[2] }] : [];
  }), u = new Ze(), c = new ve(u, 1024);
  return D.fromList(s).encode(c), c.end(), K.Buffer.concat([u.buffer]).toString("base64");
}
function nt(p) {
  const i = K.Buffer.from(p, "base64");
  let s = new et();
  return s.addBuffer(i), D.decode(s).asCardRefQty.map((l) => `${l.quantity} ${l.id}`).join(`
`);
}
export {
  nt as decodeList,
  it as encodeList
};
