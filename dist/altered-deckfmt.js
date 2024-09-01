var Gt = Object.defineProperty;
var Yt = (p, i, s) => i in p ? Gt(p, i, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[i] = s;
var B = (p, i, s) => Yt(p, typeof i != "symbol" ? i + "" : i, s);
var K = /* @__PURE__ */ ((p) => (p.Booster = "B", p.Promo = "P", p.AltArt = "A", p))(K || {}), N = /* @__PURE__ */ ((p) => (p.Axiom = "AX", p.Bravos = "BR", p.Lyra = "LY", p.Muna = "MU", p.Ordis = "OR", p.Yzmir = "YZ", p.Neutral = "NE", p))(N || {}), G = /* @__PURE__ */ ((p) => (p.Common = "C", p.Rare = "R1", p.RareOOF = "R2", p.Unique = "U", p))(G || {}), it = /* @__PURE__ */ ((p) => (p.CoreKS = "COREKS", p.Core = "CORE", p))(it || {});
class bt {
  constructor(i) {
    B(this, "set_code");
    B(this, "product");
    B(this, "faction");
    B(this, "num_in_faction");
    B(this, "rarity");
    B(this, "uniq_num");
    const s = i.match(/^ALT_(\w+)_(A|B|P)_(\w{2})_(\d{1,2})_(C|R1|R2|U)(?:_(\d+))?$/);
    if (!s)
      throw "unrecognized card id";
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
    }
    throw `Unrecognized Rarity ${this.rarity}`;
  }
  get setId() {
    switch (this.set_code) {
      case "COREKS":
        return 1;
      case "CORE":
        return 2;
    }
    throw `Unrecognized SetCode ${this.rarity}`;
  }
}
class j {
  constructor() {
    B(this, "setCode");
    B(this, "product");
    B(this, "faction");
    B(this, "numberInFaction");
    B(this, "rarity");
    B(this, "uniqueId");
  }
  static decode(i, s) {
    const u = new j();
    if (s.setCode === void 0)
      throw new Y("Tried to decode Card without SetCode in context");
    if (u.setCode = s.setCode, i.readSync(1) == 1)
      u.product = null;
    else if (u.product = i.readSync(2), u.product == 0 || u.product == 3)
      throw new Y(`Invalid product ID (${u.product})`);
    if (u.faction = i.readSync(3), u.faction == 0)
      throw new Y(`Invalid faction ID (${u.faction})`);
    return u.numberInFaction = i.readSync(5), u.rarity = i.readSync(2), u.rarity == 3 && (u.uniqueId = i.readSync(16)), u;
  }
  encode(i) {
    if (this.product == null ? i.write(1, 1) : (i.write(1, 0), i.write(2, this.product)), i.write(3, this.faction), i.write(5, this.numberInFaction), i.write(2, this.rarity), this.uniqueId !== void 0) {
      if (this.uniqueId > 65535)
        throw new nt("Cannot encode unique ID greater than 65535");
      i.write(16, this.uniqueId);
    }
  }
  get asCardId() {
    let i = "ALT_";
    switch (this.setCode) {
      case 1:
        i += it.CoreKS;
        break;
      case 2:
        i += it.Core;
        break;
    }
    switch (i += "_", this.product) {
      case null:
        i += K.Booster;
        break;
      case 1:
        i += K.Promo;
        break;
      case 2:
        i += K.AltArt;
        break;
    }
    switch (i += "_", this.faction) {
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
    let s = new j(), u = new bt(i);
    return s.setCode = u.setId, s.product = u.productId, s.faction = u.factionId, s.numberInFaction = u.num_in_faction, s.rarity = u.rarityId, s.uniqueId = u.uniq_num, s;
  }
}
class Q {
  constructor() {
    B(this, "quantity");
    // VLE: 2 (+6) bits
    B(this, "card");
  }
  static decode(i, s) {
    const u = new Q(), c = i.readSync(2);
    if (c > 0)
      u.quantity = c;
    else {
      const l = i.readSync(6);
      u.quantity = l == 0 ? 0 : l + 3;
    }
    return u.card = j.decode(i, s), u;
  }
  encode(i) {
    if (this.quantity > 0 && this.quantity <= 3)
      i.write(2, this.quantity);
    else if (this.quantity > 3) {
      if (this.quantity > 65)
        throw new nt(`Cannot encode card quantity (${this.quantity}) greater than 65`);
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
    let u = new Q();
    return u.quantity = i, u.card = j.fromId(s), u;
  }
}
class W {
  constructor() {
    B(this, "setCode");
    // 8 bits
    B(this, "cardQty");
  }
  // count: 6 bits
  static decode(i, s) {
    const u = new W();
    if (u.setCode = i.readSync(8), u.setCode == 0)
      throw new Y(`Invalid SetCode ID (${u.setCode})`);
    s.setCode = u.setCode;
    const c = i.readSync(6), l = new Array();
    for (let d = 0; d < c; d++)
      l.push(Q.decode(i, s));
    return u.cardQty = l, s.setCode = void 0, u;
  }
  encode(i) {
    if (this.cardQty.length <= 0)
      throw new nt("Cannot encode a SetGroup with 0 cards");
    const s = this.cardQty[0].card.setCode;
    i.write(8, s), i.write(6, this.cardQty.length);
    for (let u of this.cardQty)
      u.encode(i);
  }
  static from(i) {
    let s = new W();
    return s.cardQty = i.map((u) => Q.from(u.quantity, u.id)), s;
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
    const s = new D(), u = new jt();
    if (s.version = i.readSync(4), s.version !== 1)
      throw new Y(`Invalid version (${s.version}`);
    const c = i.readSync(8), l = new Array();
    for (let d = 0; d < c; d++)
      l.push(W.decode(i, u));
    return s.setGroups = l, s;
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
    return this.setGroups.reduce((i, s) => i.concat(s.cardQty.map((u) => u.asCardRefQty)), Array());
  }
  static fromList(i) {
    const s = D.groupedBySet(i).map((c) => W.from(c));
    let u = new D();
    return u.version = 1, u.setGroups = s, u;
  }
  static groupedBySet(i) {
    let s = /* @__PURE__ */ new Map();
    for (let u of i) {
      const c = new bt(u.id).set_code;
      let l = s.get(c);
      l || (l = [], s.set(c, l)), l.push(u);
    }
    return Array.from(s, ([u, c]) => c);
  }
}
class jt {
  constructor() {
    B(this, "setCode");
  }
}
class Y extends Error {
  constructor(i) {
    super(i), this.name = "DecodingError";
  }
}
class nt extends Error {
  constructor(i) {
    super(i), this.name = "EncodingError";
  }
}
var H = {}, J = {};
J.byteLength = Vt;
J.toByteArray = Kt;
J.fromByteArray = Zt;
var L = [], R = [], Qt = typeof Uint8Array < "u" ? Uint8Array : Array, rt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var P = 0, Wt = rt.length; P < Wt; ++P)
  L[P] = rt[P], R[rt.charCodeAt(P)] = P;
R[45] = 62;
R[95] = 63;
function xt(p) {
  var i = p.length;
  if (i % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var s = p.indexOf("=");
  s === -1 && (s = i);
  var u = s === i ? 0 : 4 - s % 4;
  return [s, u];
}
function Vt(p) {
  var i = xt(p), s = i[0], u = i[1];
  return (s + u) * 3 / 4 - u;
}
function Xt(p, i, s) {
  return (i + s) * 3 / 4 - s;
}
function Kt(p) {
  var i, s = xt(p), u = s[0], c = s[1], l = new Qt(Xt(p, u, c)), d = 0, o = c > 0 ? u - 4 : u, y;
  for (y = 0; y < o; y += 4)
    i = R[p.charCodeAt(y)] << 18 | R[p.charCodeAt(y + 1)] << 12 | R[p.charCodeAt(y + 2)] << 6 | R[p.charCodeAt(y + 3)], l[d++] = i >> 16 & 255, l[d++] = i >> 8 & 255, l[d++] = i & 255;
  return c === 2 && (i = R[p.charCodeAt(y)] << 2 | R[p.charCodeAt(y + 1)] >> 4, l[d++] = i & 255), c === 1 && (i = R[p.charCodeAt(y)] << 10 | R[p.charCodeAt(y + 1)] << 4 | R[p.charCodeAt(y + 2)] >> 2, l[d++] = i >> 8 & 255, l[d++] = i & 255), l;
}
function Ht(p) {
  return L[p >> 18 & 63] + L[p >> 12 & 63] + L[p >> 6 & 63] + L[p & 63];
}
function Jt(p, i, s) {
  for (var u, c = [], l = i; l < s; l += 3)
    u = (p[l] << 16 & 16711680) + (p[l + 1] << 8 & 65280) + (p[l + 2] & 255), c.push(Ht(u));
  return c.join("");
}
function Zt(p) {
  for (var i, s = p.length, u = s % 3, c = [], l = 16383, d = 0, o = s - u; d < o; d += l)
    c.push(Jt(p, d, d + l > o ? o : d + l));
  return u === 1 ? (i = p[s - 1], c.push(
    L[i >> 2] + L[i << 4 & 63] + "=="
  )) : u === 2 && (i = (p[s - 2] << 8) + p[s - 1], c.push(
    L[i >> 10] + L[i >> 4 & 63] + L[i << 2 & 63] + "="
  )), c.join("");
}
var st = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
st.read = function(p, i, s, u, c) {
  var l, d, o = c * 8 - u - 1, y = (1 << o) - 1, b = y >> 1, x = -7, g = s ? c - 1 : 0, F = s ? -1 : 1, _ = p[i + g];
  for (g += F, l = _ & (1 << -x) - 1, _ >>= -x, x += o; x > 0; l = l * 256 + p[i + g], g += F, x -= 8)
    ;
  for (d = l & (1 << -x) - 1, l >>= -x, x += u; x > 0; d = d * 256 + p[i + g], g += F, x -= 8)
    ;
  if (l === 0)
    l = 1 - b;
  else {
    if (l === y)
      return d ? NaN : (_ ? -1 : 1) * (1 / 0);
    d = d + Math.pow(2, u), l = l - b;
  }
  return (_ ? -1 : 1) * d * Math.pow(2, l - u);
};
st.write = function(p, i, s, u, c, l) {
  var d, o, y, b = l * 8 - c - 1, x = (1 << b) - 1, g = x >> 1, F = c === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, _ = u ? 0 : l - 1, S = u ? 1 : -1, T = i < 0 || i === 0 && 1 / i < 0 ? 1 : 0;
  for (i = Math.abs(i), isNaN(i) || i === 1 / 0 ? (o = isNaN(i) ? 1 : 0, d = x) : (d = Math.floor(Math.log(i) / Math.LN2), i * (y = Math.pow(2, -d)) < 1 && (d--, y *= 2), d + g >= 1 ? i += F / y : i += F * Math.pow(2, 1 - g), i * y >= 2 && (d++, y /= 2), d + g >= x ? (o = 0, d = x) : d + g >= 1 ? (o = (i * y - 1) * Math.pow(2, c), d = d + g) : (o = i * Math.pow(2, g - 1) * Math.pow(2, c), d = 0)); c >= 8; p[s + _] = o & 255, _ += S, o /= 256, c -= 8)
    ;
  for (d = d << c | o, b += c; b > 0; p[s + _] = d & 255, _ += S, d /= 256, b -= 8)
    ;
  p[s + _ - S] |= T * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(p) {
  const i = J, s = st, u = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  p.Buffer = o, p.SlowBuffer = It, p.INSPECT_MAX_BYTES = 50;
  const c = 2147483647;
  p.kMaxLength = c, o.TYPED_ARRAY_SUPPORT = l(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function l() {
    try {
      const r = new Uint8Array(1), t = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(r, t), r.foo() === 42;
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
    const t = new Uint8Array(r);
    return Object.setPrototypeOf(t, o.prototype), t;
  }
  function o(r, t, e) {
    if (typeof r == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return g(r);
    }
    return y(r, t, e);
  }
  o.poolSize = 8192;
  function y(r, t, e) {
    if (typeof r == "string")
      return F(r, t);
    if (ArrayBuffer.isView(r))
      return S(r);
    if (r == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
      );
    if (k(r, ArrayBuffer) || r && k(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (k(r, SharedArrayBuffer) || r && k(r.buffer, SharedArrayBuffer)))
      return T(r, t, e);
    if (typeof r == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const n = r.valueOf && r.valueOf();
    if (n != null && n !== r)
      return o.from(n, t, e);
    const f = mt(r);
    if (f) return f;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function")
      return o.from(r[Symbol.toPrimitive]("string"), t, e);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
    );
  }
  o.from = function(r, t, e) {
    return y(r, t, e);
  }, Object.setPrototypeOf(o.prototype, Uint8Array.prototype), Object.setPrototypeOf(o, Uint8Array);
  function b(r) {
    if (typeof r != "number")
      throw new TypeError('"size" argument must be of type number');
    if (r < 0)
      throw new RangeError('The value "' + r + '" is invalid for option "size"');
  }
  function x(r, t, e) {
    return b(r), r <= 0 ? d(r) : t !== void 0 ? typeof e == "string" ? d(r).fill(t, e) : d(r).fill(t) : d(r);
  }
  o.alloc = function(r, t, e) {
    return x(r, t, e);
  };
  function g(r) {
    return b(r), d(r < 0 ? 0 : Z(r) | 0);
  }
  o.allocUnsafe = function(r) {
    return g(r);
  }, o.allocUnsafeSlow = function(r) {
    return g(r);
  };
  function F(r, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !o.isEncoding(t))
      throw new TypeError("Unknown encoding: " + t);
    const e = ot(r, t) | 0;
    let n = d(e);
    const f = n.write(r, t);
    return f !== e && (n = n.slice(0, f)), n;
  }
  function _(r) {
    const t = r.length < 0 ? 0 : Z(r.length) | 0, e = d(t);
    for (let n = 0; n < t; n += 1)
      e[n] = r[n] & 255;
    return e;
  }
  function S(r) {
    if (k(r, Uint8Array)) {
      const t = new Uint8Array(r);
      return T(t.buffer, t.byteOffset, t.byteLength);
    }
    return _(r);
  }
  function T(r, t, e) {
    if (t < 0 || r.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (r.byteLength < t + (e || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return t === void 0 && e === void 0 ? n = new Uint8Array(r) : e === void 0 ? n = new Uint8Array(r, t) : n = new Uint8Array(r, t, e), Object.setPrototypeOf(n, o.prototype), n;
  }
  function mt(r) {
    if (o.isBuffer(r)) {
      const t = Z(r.length) | 0, e = d(t);
      return e.length === 0 || r.copy(e, 0, 0, t), e;
    }
    if (r.length !== void 0)
      return typeof r.length != "number" || et(r.length) ? d(0) : _(r);
    if (r.type === "Buffer" && Array.isArray(r.data))
      return _(r.data);
  }
  function Z(r) {
    if (r >= c)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + c.toString(16) + " bytes");
    return r | 0;
  }
  function It(r) {
    return +r != r && (r = 0), o.alloc(+r);
  }
  o.isBuffer = function(t) {
    return t != null && t._isBuffer === !0 && t !== o.prototype;
  }, o.compare = function(t, e) {
    if (k(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), k(e, Uint8Array) && (e = o.from(e, e.offset, e.byteLength)), !o.isBuffer(t) || !o.isBuffer(e))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (t === e) return 0;
    let n = t.length, f = e.length;
    for (let h = 0, a = Math.min(n, f); h < a; ++h)
      if (t[h] !== e[h]) {
        n = t[h], f = e[h];
        break;
      }
    return n < f ? -1 : f < n ? 1 : 0;
  }, o.isEncoding = function(t) {
    switch (String(t).toLowerCase()) {
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
  }, o.concat = function(t, e) {
    if (!Array.isArray(t))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (t.length === 0)
      return o.alloc(0);
    let n;
    if (e === void 0)
      for (e = 0, n = 0; n < t.length; ++n)
        e += t[n].length;
    const f = o.allocUnsafe(e);
    let h = 0;
    for (n = 0; n < t.length; ++n) {
      let a = t[n];
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
  function ot(r, t) {
    if (o.isBuffer(r))
      return r.length;
    if (ArrayBuffer.isView(r) || k(r, ArrayBuffer))
      return r.byteLength;
    if (typeof r != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
      );
    const e = r.length, n = arguments.length > 2 && arguments[2] === !0;
    if (!n && e === 0) return 0;
    let f = !1;
    for (; ; )
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;
        case "utf8":
        case "utf-8":
          return tt(r).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return e * 2;
        case "hex":
          return e >>> 1;
        case "base64":
          return gt(r).length;
        default:
          if (f)
            return n ? -1 : tt(r).length;
          t = ("" + t).toLowerCase(), f = !0;
      }
  }
  o.byteLength = ot;
  function Et(r, t, e) {
    let n = !1;
    if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, t >>>= 0, e <= t))
      return "";
    for (r || (r = "utf8"); ; )
      switch (r) {
        case "hex":
          return Tt(this, t, e);
        case "utf8":
        case "utf-8":
          return ht(this, t, e);
        case "ascii":
          return kt(this, t, e);
        case "latin1":
        case "binary":
          return Lt(this, t, e);
        case "base64":
          return Ct(this, t, e);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return $t(this, t, e);
        default:
          if (n) throw new TypeError("Unknown encoding: " + r);
          r = (r + "").toLowerCase(), n = !0;
      }
  }
  o.prototype._isBuffer = !0;
  function q(r, t, e) {
    const n = r[t];
    r[t] = r[e], r[e] = n;
  }
  o.prototype.swap16 = function() {
    const t = this.length;
    if (t % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < t; e += 2)
      q(this, e, e + 1);
    return this;
  }, o.prototype.swap32 = function() {
    const t = this.length;
    if (t % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < t; e += 4)
      q(this, e, e + 3), q(this, e + 1, e + 2);
    return this;
  }, o.prototype.swap64 = function() {
    const t = this.length;
    if (t % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < t; e += 8)
      q(this, e, e + 7), q(this, e + 1, e + 6), q(this, e + 2, e + 5), q(this, e + 3, e + 4);
    return this;
  }, o.prototype.toString = function() {
    const t = this.length;
    return t === 0 ? "" : arguments.length === 0 ? ht(this, 0, t) : Et.apply(this, arguments);
  }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(t) {
    if (!o.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
    return this === t ? !0 : o.compare(this, t) === 0;
  }, o.prototype.inspect = function() {
    let t = "";
    const e = p.INSPECT_MAX_BYTES;
    return t = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (t += " ... "), "<Buffer " + t + ">";
  }, u && (o.prototype[u] = o.prototype.inspect), o.prototype.compare = function(t, e, n, f, h) {
    if (k(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), !o.isBuffer(t))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
      );
    if (e === void 0 && (e = 0), n === void 0 && (n = t ? t.length : 0), f === void 0 && (f = 0), h === void 0 && (h = this.length), e < 0 || n > t.length || f < 0 || h > this.length)
      throw new RangeError("out of range index");
    if (f >= h && e >= n)
      return 0;
    if (f >= h)
      return -1;
    if (e >= n)
      return 1;
    if (e >>>= 0, n >>>= 0, f >>>= 0, h >>>= 0, this === t) return 0;
    let a = h - f, w = n - e;
    const E = Math.min(a, w), I = this.slice(f, h), A = t.slice(e, n);
    for (let m = 0; m < E; ++m)
      if (I[m] !== A[m]) {
        a = I[m], w = A[m];
        break;
      }
    return a < w ? -1 : w < a ? 1 : 0;
  };
  function ft(r, t, e, n, f) {
    if (r.length === 0) return -1;
    if (typeof e == "string" ? (n = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, et(e) && (e = f ? 0 : r.length - 1), e < 0 && (e = r.length + e), e >= r.length) {
      if (f) return -1;
      e = r.length - 1;
    } else if (e < 0)
      if (f) e = 0;
      else return -1;
    if (typeof t == "string" && (t = o.from(t, n)), o.isBuffer(t))
      return t.length === 0 ? -1 : ut(r, t, e, n, f);
    if (typeof t == "number")
      return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? f ? Uint8Array.prototype.indexOf.call(r, t, e) : Uint8Array.prototype.lastIndexOf.call(r, t, e) : ut(r, [t], e, n, f);
    throw new TypeError("val must be string, number or Buffer");
  }
  function ut(r, t, e, n, f) {
    let h = 1, a = r.length, w = t.length;
    if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
      if (r.length < 2 || t.length < 2)
        return -1;
      h = 2, a /= 2, w /= 2, e /= 2;
    }
    function E(A, m) {
      return h === 1 ? A[m] : A.readUInt16BE(m * h);
    }
    let I;
    if (f) {
      let A = -1;
      for (I = e; I < a; I++)
        if (E(r, I) === E(t, A === -1 ? 0 : I - A)) {
          if (A === -1 && (A = I), I - A + 1 === w) return A * h;
        } else
          A !== -1 && (I -= I - A), A = -1;
    } else
      for (e + w > a && (e = a - w), I = e; I >= 0; I--) {
        let A = !0;
        for (let m = 0; m < w; m++)
          if (E(r, I + m) !== E(t, m)) {
            A = !1;
            break;
          }
        if (A) return I;
      }
    return -1;
  }
  o.prototype.includes = function(t, e, n) {
    return this.indexOf(t, e, n) !== -1;
  }, o.prototype.indexOf = function(t, e, n) {
    return ft(this, t, e, n, !0);
  }, o.prototype.lastIndexOf = function(t, e, n) {
    return ft(this, t, e, n, !1);
  };
  function At(r, t, e, n) {
    e = Number(e) || 0;
    const f = r.length - e;
    n ? (n = Number(n), n > f && (n = f)) : n = f;
    const h = t.length;
    n > h / 2 && (n = h / 2);
    let a;
    for (a = 0; a < n; ++a) {
      const w = parseInt(t.substr(a * 2, 2), 16);
      if (et(w)) return a;
      r[e + a] = w;
    }
    return a;
  }
  function Ft(r, t, e, n) {
    return V(tt(t, r.length - e), r, e, n);
  }
  function _t(r, t, e, n) {
    return V(Ot(t), r, e, n);
  }
  function Ut(r, t, e, n) {
    return V(gt(t), r, e, n);
  }
  function St(r, t, e, n) {
    return V(Pt(t, r.length - e), r, e, n);
  }
  o.prototype.write = function(t, e, n, f) {
    if (e === void 0)
      f = "utf8", n = this.length, e = 0;
    else if (n === void 0 && typeof e == "string")
      f = e, n = this.length, e = 0;
    else if (isFinite(e))
      e = e >>> 0, isFinite(n) ? (n = n >>> 0, f === void 0 && (f = "utf8")) : (f = n, n = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const h = this.length - e;
    if ((n === void 0 || n > h) && (n = h), t.length > 0 && (n < 0 || e < 0) || e > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    f || (f = "utf8");
    let a = !1;
    for (; ; )
      switch (f) {
        case "hex":
          return At(this, t, e, n);
        case "utf8":
        case "utf-8":
          return Ft(this, t, e, n);
        case "ascii":
        case "latin1":
        case "binary":
          return _t(this, t, e, n);
        case "base64":
          return Ut(this, t, e, n);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return St(this, t, e, n);
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
  function Ct(r, t, e) {
    return t === 0 && e === r.length ? i.fromByteArray(r) : i.fromByteArray(r.slice(t, e));
  }
  function ht(r, t, e) {
    e = Math.min(r.length, e);
    const n = [];
    let f = t;
    for (; f < e; ) {
      const h = r[f];
      let a = null, w = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
      if (f + w <= e) {
        let E, I, A, m;
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
            E = r[f + 1], I = r[f + 2], A = r[f + 3], (E & 192) === 128 && (I & 192) === 128 && (A & 192) === 128 && (m = (h & 15) << 18 | (E & 63) << 12 | (I & 63) << 6 | A & 63, m > 65535 && m < 1114112 && (a = m));
        }
      }
      a === null ? (a = 65533, w = 1) : a > 65535 && (a -= 65536, n.push(a >>> 10 & 1023 | 55296), a = 56320 | a & 1023), n.push(a), f += w;
    }
    return Rt(n);
  }
  const at = 4096;
  function Rt(r) {
    const t = r.length;
    if (t <= at)
      return String.fromCharCode.apply(String, r);
    let e = "", n = 0;
    for (; n < t; )
      e += String.fromCharCode.apply(
        String,
        r.slice(n, n += at)
      );
    return e;
  }
  function kt(r, t, e) {
    let n = "";
    e = Math.min(r.length, e);
    for (let f = t; f < e; ++f)
      n += String.fromCharCode(r[f] & 127);
    return n;
  }
  function Lt(r, t, e) {
    let n = "";
    e = Math.min(r.length, e);
    for (let f = t; f < e; ++f)
      n += String.fromCharCode(r[f]);
    return n;
  }
  function Tt(r, t, e) {
    const n = r.length;
    (!t || t < 0) && (t = 0), (!e || e < 0 || e > n) && (e = n);
    let f = "";
    for (let h = t; h < e; ++h)
      f += Dt[r[h]];
    return f;
  }
  function $t(r, t, e) {
    const n = r.slice(t, e);
    let f = "";
    for (let h = 0; h < n.length - 1; h += 2)
      f += String.fromCharCode(n[h] + n[h + 1] * 256);
    return f;
  }
  o.prototype.slice = function(t, e) {
    const n = this.length;
    t = ~~t, e = e === void 0 ? n : ~~e, t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), e < t && (e = t);
    const f = this.subarray(t, e);
    return Object.setPrototypeOf(f, o.prototype), f;
  };
  function U(r, t, e) {
    if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
    if (r + t > e) throw new RangeError("Trying to access beyond buffer length");
  }
  o.prototype.readUintLE = o.prototype.readUIntLE = function(t, e, n) {
    t = t >>> 0, e = e >>> 0, n || U(t, e, this.length);
    let f = this[t], h = 1, a = 0;
    for (; ++a < e && (h *= 256); )
      f += this[t + a] * h;
    return f;
  }, o.prototype.readUintBE = o.prototype.readUIntBE = function(t, e, n) {
    t = t >>> 0, e = e >>> 0, n || U(t, e, this.length);
    let f = this[t + --e], h = 1;
    for (; e > 0 && (h *= 256); )
      f += this[t + --e] * h;
    return f;
  }, o.prototype.readUint8 = o.prototype.readUInt8 = function(t, e) {
    return t = t >>> 0, e || U(t, 1, this.length), this[t];
  }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(t, e) {
    return t = t >>> 0, e || U(t, 2, this.length), this[t] | this[t + 1] << 8;
  }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(t, e) {
    return t = t >>> 0, e || U(t, 2, this.length), this[t] << 8 | this[t + 1];
  }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(t, e) {
    return t = t >>> 0, e || U(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
  }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(t, e) {
    return t = t >>> 0, e || U(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
  }, o.prototype.readBigUInt64LE = $(function(t) {
    t = t >>> 0, O(t, "offset");
    const e = this[t], n = this[t + 7];
    (e === void 0 || n === void 0) && z(t, this.length - 8);
    const f = e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24, h = this[++t] + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + n * 2 ** 24;
    return BigInt(f) + (BigInt(h) << BigInt(32));
  }), o.prototype.readBigUInt64BE = $(function(t) {
    t = t >>> 0, O(t, "offset");
    const e = this[t], n = this[t + 7];
    (e === void 0 || n === void 0) && z(t, this.length - 8);
    const f = e * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t], h = this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + n;
    return (BigInt(f) << BigInt(32)) + BigInt(h);
  }), o.prototype.readIntLE = function(t, e, n) {
    t = t >>> 0, e = e >>> 0, n || U(t, e, this.length);
    let f = this[t], h = 1, a = 0;
    for (; ++a < e && (h *= 256); )
      f += this[t + a] * h;
    return h *= 128, f >= h && (f -= Math.pow(2, 8 * e)), f;
  }, o.prototype.readIntBE = function(t, e, n) {
    t = t >>> 0, e = e >>> 0, n || U(t, e, this.length);
    let f = e, h = 1, a = this[t + --f];
    for (; f > 0 && (h *= 256); )
      a += this[t + --f] * h;
    return h *= 128, a >= h && (a -= Math.pow(2, 8 * e)), a;
  }, o.prototype.readInt8 = function(t, e) {
    return t = t >>> 0, e || U(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
  }, o.prototype.readInt16LE = function(t, e) {
    t = t >>> 0, e || U(t, 2, this.length);
    const n = this[t] | this[t + 1] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, o.prototype.readInt16BE = function(t, e) {
    t = t >>> 0, e || U(t, 2, this.length);
    const n = this[t + 1] | this[t] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, o.prototype.readInt32LE = function(t, e) {
    return t = t >>> 0, e || U(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
  }, o.prototype.readInt32BE = function(t, e) {
    return t = t >>> 0, e || U(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
  }, o.prototype.readBigInt64LE = $(function(t) {
    t = t >>> 0, O(t, "offset");
    const e = this[t], n = this[t + 7];
    (e === void 0 || n === void 0) && z(t, this.length - 8);
    const f = this[t + 4] + this[t + 5] * 2 ** 8 + this[t + 6] * 2 ** 16 + (n << 24);
    return (BigInt(f) << BigInt(32)) + BigInt(e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24);
  }), o.prototype.readBigInt64BE = $(function(t) {
    t = t >>> 0, O(t, "offset");
    const e = this[t], n = this[t + 7];
    (e === void 0 || n === void 0) && z(t, this.length - 8);
    const f = (e << 24) + // Overflow
    this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t];
    return (BigInt(f) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + n);
  }), o.prototype.readFloatLE = function(t, e) {
    return t = t >>> 0, e || U(t, 4, this.length), s.read(this, t, !0, 23, 4);
  }, o.prototype.readFloatBE = function(t, e) {
    return t = t >>> 0, e || U(t, 4, this.length), s.read(this, t, !1, 23, 4);
  }, o.prototype.readDoubleLE = function(t, e) {
    return t = t >>> 0, e || U(t, 8, this.length), s.read(this, t, !0, 52, 8);
  }, o.prototype.readDoubleBE = function(t, e) {
    return t = t >>> 0, e || U(t, 8, this.length), s.read(this, t, !1, 52, 8);
  };
  function C(r, t, e, n, f, h) {
    if (!o.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > f || t < h) throw new RangeError('"value" argument is out of bounds');
    if (e + n > r.length) throw new RangeError("Index out of range");
  }
  o.prototype.writeUintLE = o.prototype.writeUIntLE = function(t, e, n, f) {
    if (t = +t, e = e >>> 0, n = n >>> 0, !f) {
      const w = Math.pow(2, 8 * n) - 1;
      C(this, t, e, n, w, 0);
    }
    let h = 1, a = 0;
    for (this[e] = t & 255; ++a < n && (h *= 256); )
      this[e + a] = t / h & 255;
    return e + n;
  }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(t, e, n, f) {
    if (t = +t, e = e >>> 0, n = n >>> 0, !f) {
      const w = Math.pow(2, 8 * n) - 1;
      C(this, t, e, n, w, 0);
    }
    let h = n - 1, a = 1;
    for (this[e + h] = t & 255; --h >= 0 && (a *= 256); )
      this[e + h] = t / a & 255;
    return e + n;
  }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 1, 255, 0), this[e] = t & 255, e + 1;
  }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 2, 65535, 0), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
  }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
  }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = t & 255, e + 4;
  }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
  };
  function ct(r, t, e, n, f) {
    Bt(t, n, f, r, e, 7);
    let h = Number(t & BigInt(4294967295));
    r[e++] = h, h = h >> 8, r[e++] = h, h = h >> 8, r[e++] = h, h = h >> 8, r[e++] = h;
    let a = Number(t >> BigInt(32) & BigInt(4294967295));
    return r[e++] = a, a = a >> 8, r[e++] = a, a = a >> 8, r[e++] = a, a = a >> 8, r[e++] = a, e;
  }
  function lt(r, t, e, n, f) {
    Bt(t, n, f, r, e, 7);
    let h = Number(t & BigInt(4294967295));
    r[e + 7] = h, h = h >> 8, r[e + 6] = h, h = h >> 8, r[e + 5] = h, h = h >> 8, r[e + 4] = h;
    let a = Number(t >> BigInt(32) & BigInt(4294967295));
    return r[e + 3] = a, a = a >> 8, r[e + 2] = a, a = a >> 8, r[e + 1] = a, a = a >> 8, r[e] = a, e + 8;
  }
  o.prototype.writeBigUInt64LE = $(function(t, e = 0) {
    return ct(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), o.prototype.writeBigUInt64BE = $(function(t, e = 0) {
    return lt(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), o.prototype.writeIntLE = function(t, e, n, f) {
    if (t = +t, e = e >>> 0, !f) {
      const E = Math.pow(2, 8 * n - 1);
      C(this, t, e, n, E - 1, -E);
    }
    let h = 0, a = 1, w = 0;
    for (this[e] = t & 255; ++h < n && (a *= 256); )
      t < 0 && w === 0 && this[e + h - 1] !== 0 && (w = 1), this[e + h] = (t / a >> 0) - w & 255;
    return e + n;
  }, o.prototype.writeIntBE = function(t, e, n, f) {
    if (t = +t, e = e >>> 0, !f) {
      const E = Math.pow(2, 8 * n - 1);
      C(this, t, e, n, E - 1, -E);
    }
    let h = n - 1, a = 1, w = 0;
    for (this[e + h] = t & 255; --h >= 0 && (a *= 256); )
      t < 0 && w === 0 && this[e + h + 1] !== 0 && (w = 1), this[e + h] = (t / a >> 0) - w & 255;
    return e + n;
  }, o.prototype.writeInt8 = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = t & 255, e + 1;
  }, o.prototype.writeInt16LE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 2, 32767, -32768), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
  }, o.prototype.writeInt16BE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
  }, o.prototype.writeInt32LE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 4, 2147483647, -2147483648), this[e] = t & 255, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4;
  }, o.prototype.writeInt32BE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || C(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
  }, o.prototype.writeBigInt64LE = $(function(t, e = 0) {
    return ct(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), o.prototype.writeBigInt64BE = $(function(t, e = 0) {
    return lt(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function dt(r, t, e, n, f, h) {
    if (e + n > r.length) throw new RangeError("Index out of range");
    if (e < 0) throw new RangeError("Index out of range");
  }
  function pt(r, t, e, n, f) {
    return t = +t, e = e >>> 0, f || dt(r, t, e, 4), s.write(r, t, e, n, 23, 4), e + 4;
  }
  o.prototype.writeFloatLE = function(t, e, n) {
    return pt(this, t, e, !0, n);
  }, o.prototype.writeFloatBE = function(t, e, n) {
    return pt(this, t, e, !1, n);
  };
  function yt(r, t, e, n, f) {
    return t = +t, e = e >>> 0, f || dt(r, t, e, 8), s.write(r, t, e, n, 52, 8), e + 8;
  }
  o.prototype.writeDoubleLE = function(t, e, n) {
    return yt(this, t, e, !0, n);
  }, o.prototype.writeDoubleBE = function(t, e, n) {
    return yt(this, t, e, !1, n);
  }, o.prototype.copy = function(t, e, n, f) {
    if (!o.isBuffer(t)) throw new TypeError("argument should be a Buffer");
    if (n || (n = 0), !f && f !== 0 && (f = this.length), e >= t.length && (e = t.length), e || (e = 0), f > 0 && f < n && (f = n), f === n || t.length === 0 || this.length === 0) return 0;
    if (e < 0)
      throw new RangeError("targetStart out of bounds");
    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
    if (f < 0) throw new RangeError("sourceEnd out of bounds");
    f > this.length && (f = this.length), t.length - e < f - n && (f = t.length - e + n);
    const h = f - n;
    return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, n, f) : Uint8Array.prototype.set.call(
      t,
      this.subarray(n, f),
      e
    ), h;
  }, o.prototype.fill = function(t, e, n, f) {
    if (typeof t == "string") {
      if (typeof e == "string" ? (f = e, e = 0, n = this.length) : typeof n == "string" && (f = n, n = this.length), f !== void 0 && typeof f != "string")
        throw new TypeError("encoding must be a string");
      if (typeof f == "string" && !o.isEncoding(f))
        throw new TypeError("Unknown encoding: " + f);
      if (t.length === 1) {
        const a = t.charCodeAt(0);
        (f === "utf8" && a < 128 || f === "latin1") && (t = a);
      }
    } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
    if (e < 0 || this.length < e || this.length < n)
      throw new RangeError("Out of range index");
    if (n <= e)
      return this;
    e = e >>> 0, n = n === void 0 ? this.length : n >>> 0, t || (t = 0);
    let h;
    if (typeof t == "number")
      for (h = e; h < n; ++h)
        this[h] = t;
    else {
      const a = o.isBuffer(t) ? t : o.from(t, f), w = a.length;
      if (w === 0)
        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
      for (h = 0; h < n - e; ++h)
        this[h + e] = a[h % w];
    }
    return this;
  };
  const M = {};
  function v(r, t, e) {
    M[r] = class extends e {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: t.apply(this, arguments),
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
  v(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(r) {
      return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), v(
    "ERR_INVALID_ARG_TYPE",
    function(r, t) {
      return `The "${r}" argument must be of type number. Received type ${typeof t}`;
    },
    TypeError
  ), v(
    "ERR_OUT_OF_RANGE",
    function(r, t, e) {
      let n = `The value of "${r}" is out of range.`, f = e;
      return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? f = wt(String(e)) : typeof e == "bigint" && (f = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (f = wt(f)), f += "n"), n += ` It must be ${t}. Received ${f}`, n;
    },
    RangeError
  );
  function wt(r) {
    let t = "", e = r.length;
    const n = r[0] === "-" ? 1 : 0;
    for (; e >= n + 4; e -= 3)
      t = `_${r.slice(e - 3, e)}${t}`;
    return `${r.slice(0, e)}${t}`;
  }
  function Nt(r, t, e) {
    O(t, "offset"), (r[t] === void 0 || r[t + e] === void 0) && z(t, r.length - (e + 1));
  }
  function Bt(r, t, e, n, f, h) {
    if (r > e || r < t) {
      const a = typeof t == "bigint" ? "n" : "";
      let w;
      throw t === 0 || t === BigInt(0) ? w = `>= 0${a} and < 2${a} ** ${(h + 1) * 8}${a}` : w = `>= -(2${a} ** ${(h + 1) * 8 - 1}${a}) and < 2 ** ${(h + 1) * 8 - 1}${a}`, new M.ERR_OUT_OF_RANGE("value", w, r);
    }
    Nt(n, f, h);
  }
  function O(r, t) {
    if (typeof r != "number")
      throw new M.ERR_INVALID_ARG_TYPE(t, "number", r);
  }
  function z(r, t, e) {
    throw Math.floor(r) !== r ? (O(r, e), new M.ERR_OUT_OF_RANGE("offset", "an integer", r)) : t < 0 ? new M.ERR_BUFFER_OUT_OF_BOUNDS() : new M.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${t}`,
      r
    );
  }
  const qt = /[^+/0-9A-Za-z-_]/g;
  function Mt(r) {
    if (r = r.split("=")[0], r = r.trim().replace(qt, ""), r.length < 2) return "";
    for (; r.length % 4 !== 0; )
      r = r + "=";
    return r;
  }
  function tt(r, t) {
    t = t || 1 / 0;
    let e;
    const n = r.length;
    let f = null;
    const h = [];
    for (let a = 0; a < n; ++a) {
      if (e = r.charCodeAt(a), e > 55295 && e < 57344) {
        if (!f) {
          if (e > 56319) {
            (t -= 3) > -1 && h.push(239, 191, 189);
            continue;
          } else if (a + 1 === n) {
            (t -= 3) > -1 && h.push(239, 191, 189);
            continue;
          }
          f = e;
          continue;
        }
        if (e < 56320) {
          (t -= 3) > -1 && h.push(239, 191, 189), f = e;
          continue;
        }
        e = (f - 55296 << 10 | e - 56320) + 65536;
      } else f && (t -= 3) > -1 && h.push(239, 191, 189);
      if (f = null, e < 128) {
        if ((t -= 1) < 0) break;
        h.push(e);
      } else if (e < 2048) {
        if ((t -= 2) < 0) break;
        h.push(
          e >> 6 | 192,
          e & 63 | 128
        );
      } else if (e < 65536) {
        if ((t -= 3) < 0) break;
        h.push(
          e >> 12 | 224,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else if (e < 1114112) {
        if ((t -= 4) < 0) break;
        h.push(
          e >> 18 | 240,
          e >> 12 & 63 | 128,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return h;
  }
  function Ot(r) {
    const t = [];
    for (let e = 0; e < r.length; ++e)
      t.push(r.charCodeAt(e) & 255);
    return t;
  }
  function Pt(r, t) {
    let e, n, f;
    const h = [];
    for (let a = 0; a < r.length && !((t -= 2) < 0); ++a)
      e = r.charCodeAt(a), n = e >> 8, f = e % 256, h.push(f), h.push(n);
    return h;
  }
  function gt(r) {
    return i.toByteArray(Mt(r));
  }
  function V(r, t, e, n) {
    let f;
    for (f = 0; f < n && !(f + e >= t.length || f >= r.length); ++f)
      t[f + e] = r[f];
    return f;
  }
  function k(r, t) {
    return r instanceof t || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === t.name;
  }
  function et(r) {
    return r !== r;
  }
  const Dt = function() {
    const r = "0123456789abcdef", t = new Array(256);
    for (let e = 0; e < 16; ++e) {
      const n = e * 16;
      for (let f = 0; f < 16; ++f)
        t[n + f] = r[e] + r[f];
    }
    return t;
  }();
  function $(r) {
    return typeof BigInt > "u" ? zt : r;
  }
  function zt() {
    throw new Error("BigInt not supported");
  }
})(H);
class vt {
  constructor() {
    B(this, "buffer", new Uint8Array(0));
  }
  write(i) {
    let s = new Uint8Array(this.buffer.length + i.length);
    s.set(this.buffer), s.set(i, this.buffer.length), this.buffer = s;
  }
}
class te {
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
    this.bufferedBytes > 0 && (this.stream.write(H.Buffer.from(this.buffer.slice(0, this.bufferedBytes))), this.bufferedBytes = 0);
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
let X;
class ee {
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
      let F = b, _ = y, S = o, T = d;
      d = F, o = _, y = S, b = T;
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
      let _ = d % 8, S, T = g[F];
      S = Math.min(8 - _, l), x ? y = y << BigInt(S) | BigInt(g[F]) >> BigInt(8) - BigInt(S) - BigInt(_) & BigInt(this.maskOf(S)) : b = b << S | T >> 8 - S - _ & this.maskOf(S), d += S, l -= S | 0, d >= g.length * 8 && (o += 1, d = 0);
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
function ne(p) {
  const s = p.split(`
`).flatMap((d) => {
    const o = d.trim().match(/^(\d+) (\w+)$/);
    return o && parseInt(o[1], 10) > 0 ? [{ quantity: parseInt(o[1], 10), id: o[2] }] : [];
  }), u = new vt(), c = new te(u, 1024);
  return D.fromList(s).encode(c), c.end(), H.Buffer.concat([u.buffer]).toString("base64url");
}
function se(p) {
  const i = H.Buffer.from(p, "base64url");
  let s = new ee();
  return s.addBuffer(i), D.decode(s).asCardRefQty.map((l) => `${l.quantity} ${l.id}`).join(`
`);
}
export {
  se as decodeList,
  ne as encodeList
};
