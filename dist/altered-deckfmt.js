var Ae = Object.defineProperty;
var Fe = (l, e, i) => e in l ? Ae(l, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : l[e] = i;
var w = (l, e, i) => Fe(l, typeof e != "symbol" ? e + "" : e, i);
var N = /* @__PURE__ */ ((l) => (l.Booster = "B", l.Promo = "P", l.AltArt = "A", l))(N || {}), A = /* @__PURE__ */ ((l) => (l.Axiom = "AX", l.Bravos = "BR", l.Lyra = "LY", l.Muna = "MU", l.Ordis = "OR", l.Yzmir = "YZ", l.Neutral = "NE", l))(A || {}), L = /* @__PURE__ */ ((l) => (l.Common = "C", l.Rare = "R1", l.RareOOF = "R2", l.Unique = "U", l.Exalt = "E", l))(L || {}), C = /* @__PURE__ */ ((l) => (l.CoreKS = "COREKS", l.Core = "CORE", l.Alize = "ALIZE", l.Bise = "BISE", l.TumultS3 = "TCS3", l.WCQualifier25 = "WCQ25", l.WCSeries25 = "WCS25", l.Cyclone = "CYCLONE", l.Duster = "DUSTER", l.DusterTOP = "DUSTERTOP", l.DusterCB = "DUSTERCB", l.DusterOP = "DUSTEROP", l))(C || {});
const ke = {
  COREKS: 1,
  CORE: 2,
  ALIZE: 3,
  BISE: 4,
  TCS3: 5,
  WCQ25: 6,
  WCS25: 7,
  CYCLONE: 8,
  DUSTER: 9,
  DUSTERTOP: 10,
  DUSTERCB: 11,
  DUSTEROP: 12
};
class Z {
  constructor(e) {
    // Raw set name token from the ID (e.g. "CORE", "DUSTEROP").
    // V3 uses this as the source of truth instead of RefSetCode.
    w(this, "set_code_name");
    // Kept for backwards compatibility (V1/V2). Prefer set_code_name when possible.
    w(this, "set_code");
    w(this, "product");
    w(this, "faction");
    w(this, "num_in_faction");
    w(this, "rarity");
    w(this, "uniq_num");
    const i = e.match(/^ALT_(\w+)_(A|B|P)_(\w{2})_(\d+)_(C|R1|R2|U|E)(?:_(\d+))?$/);
    if (!i)
      throw "unrecognized card id '" + e + "'";
    if (this.set_code_name = i[1], this.set_code = i[1], this.product = i[2], this.faction = i[3], this.num_in_faction = parseInt(i[4], 10), this.rarity = i[5], this.uniq_num = i[6] ? parseInt(i[6]) : void 0, this.rarity == "U" && this.uniq_num == null)
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
    const e = ke[this.set_code_name];
    if (e !== void 0)
      return e;
    throw `Unrecognized SetCode ${this.set_code_name}`;
  }
}
const gt = {
  1: 5,
  // CoreKS        range 0-31
  2: 5,
  // Core          range 0-31
  3: 6,
  // Alize         range 0-63
  4: 6,
  // Bise          range 0-63
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
  10: 5,
  // Duster TOP    range 0-31
  11: 7,
  // Duster CB     range 0-127
  12: 7
  // Duster OP     range 0-127
}, Yt = [
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
let zt = class It {
  constructor() {
    w(this, "setCode");
    w(this, "product");
    w(this, "faction");
    w(this, "numberInFaction");
    w(this, "rarity");
    w(this, "uniqueId");
  }
  static decode(e, i) {
    const s = new It();
    if (i.setCode === void 0)
      throw new j("Tried to decode Card without SetCode in context");
    if (s.setCode = i.setCode, e.readSync(1) == 1)
      s.product = null;
    else if (s.product = e.readSync(2), s.product == 0 || s.product == 3)
      throw new j(`Invalid product ID (${s.product})`);
    if (s.faction = e.readSync(3), s.faction == 0)
      throw new j(`Invalid faction ID (${s.faction})`);
    const u = gt[s.setCode];
    if (u == null)
      throw new j(`Invalid set code (${s.setCode}) @${e.offset}`);
    s.numberInFaction = e.readSync(u);
    const d = Yt.includes(s.setCode) ? 2 : 3;
    return s.rarity = e.readSync(d), s.rarity == 3 && (s.uniqueId = e.readSync(16)), s;
  }
  encode(e) {
    this.product == null ? e.write(1, 1) : (e.write(1, 0), e.write(2, this.product)), e.write(3, this.faction);
    const i = gt[this.setCode];
    if (i == null)
      throw new tt(`Invalid set code (${this.setCode})`);
    if (this.numberInFaction >= 1 << i)
      throw new tt(`Family ID out of range (${this.numberInFaction}) for set ${this.setCode} (max: ${1 << i - 1})`);
    e.write(i, this.numberInFaction);
    const s = Yt.includes(this.setCode) ? 2 : 3;
    if (e.write(s, this.rarity), this.uniqueId !== void 0) {
      if (this.uniqueId > 65535)
        throw new tt("Cannot encode unique ID greater than 65535");
      e.write(16, this.uniqueId);
    }
  }
  get asCardId() {
    let e = "ALT_";
    switch (this.setCode) {
      case 1:
        e += C.CoreKS;
        break;
      case 2:
        e += C.Core;
        break;
      case 3:
        e += C.Alize;
        break;
      case 4:
        e += C.Bise;
        break;
      case 5:
        e += C.TumultS3;
        break;
      case 6:
        e += C.WCQualifier25;
        break;
      case 7:
        e += C.WCSeries25;
        break;
      case 8:
        e += C.Cyclone;
        break;
      case 9:
        e += C.Duster;
        break;
      case 10:
        e += C.DusterTOP;
        break;
      case 11:
        e += C.DusterCB;
        break;
      case 12:
        e += C.DusterOP;
        break;
    }
    switch (e += "_", this.product) {
      case null:
        e += N.Booster;
        break;
      case 1:
        e += N.Promo;
        break;
      case 2:
        e += N.AltArt;
        break;
    }
    switch (e += "_", this.faction) {
      case 1:
        e += A.Axiom;
        break;
      case 2:
        e += A.Bravos;
        break;
      case 3:
        e += A.Lyra;
        break;
      case 4:
        e += A.Muna;
        break;
      case 5:
        e += A.Ordis;
        break;
      case 6:
        e += A.Yzmir;
        break;
      case 7:
        e += A.Neutral;
        break;
    }
    switch (e += "_", this.numberInFaction < 10 && !(this.faction == 7 && (this.setCode == 1 || this.setCode == 2)) && (e += "0"), e += this.numberInFaction, e += "_", this.rarity) {
      case 0:
        e += L.Common;
        break;
      case 1:
        e += L.Rare;
        break;
      case 2:
        e += L.RareOOF;
        break;
      case 3:
        e += L.Unique + "_" + this.uniqueId;
        break;
      case 4:
        e += L.Exalt;
        break;
    }
    return e;
  }
  static fromId(e) {
    let i = new It(), s = new Z(e);
    return i.setCode = s.setId, i.product = s.productId, i.faction = s.factionId, i.numberInFaction = s.num_in_faction, i.rarity = s.rarityId, i.uniqueId = s.uniq_num, i;
  }
}, Vt = class mt {
  constructor() {
    w(this, "quantity");
    // VLE: 2 (+6) bits
    w(this, "card");
  }
  static decode(e, i) {
    const s = new mt(), a = e.readSync(2);
    if (a > 0)
      s.quantity = a;
    else {
      const u = e.readSync(6);
      s.quantity = u == 0 ? 0 : u + 3;
    }
    return s.card = zt.decode(e, i), s;
  }
  encode(e) {
    if (this.quantity > 0 && this.quantity <= 3)
      e.write(2, this.quantity);
    else if (this.quantity > 3) {
      if (this.quantity > 65)
        throw new tt(`Cannot encode card quantity (${this.quantity}) greater than 65`);
      e.write(2, 0), e.write(6, this.quantity - 3);
    } else
      e.write(8, 0);
    this.card.encode(e);
  }
  get asCardRefQty() {
    return {
      quantity: this.quantity,
      id: this.card.asCardId
    };
  }
  static from(e, i) {
    let s = new mt();
    return s.quantity = e, s.card = zt.fromId(i), s;
  }
}, jt = class ot {
  constructor() {
    w(this, "setCode");
    // 8 bits
    w(this, "cardQty");
  }
  // count: 6 bits
  static decode(e, i) {
    const s = new ot();
    if (s.setCode = e.readSync(8), !ot.isValidSetCode(s.setCode))
      throw new j(`Invalid SetCode ID (${s.setCode}) @offset=${e.offset}`);
    i.setCode = s.setCode;
    const a = e.readSync(6), u = new Array();
    for (let d = 0; d < a; d++)
      u.push(Vt.decode(e, i));
    return s.cardQty = u, i.setCode = void 0, s;
  }
  encode(e) {
    if (this.cardQty.length <= 0)
      throw new tt("Cannot encode a SetGroup with 0 cards");
    const i = this.cardQty[0].card.setCode;
    e.write(8, i), e.write(6, this.cardQty.length);
    for (let s of this.cardQty)
      s.encode(e);
  }
  static from(e) {
    let i = new ot();
    return i.cardQty = e.map((s) => Vt.from(s.quantity, s.id)), i;
  }
  static isValidSetCode(e) {
    return gt[e] !== void 0;
  }
}, te = class at {
  constructor() {
    w(this, "version");
    // 4 bits
    w(this, "setGroups");
  }
  // count: 8 bits
  static decode(e) {
    const i = new at(), s = new $e();
    if (i.version = e.readSync(4), i.version !== 1)
      throw new j(`Invalid version (${i.version}`);
    const a = e.readSync(8), u = new Array();
    for (let d = 0; d < a; d++)
      u.push(jt.decode(e, s));
    return i.setGroups = u, i;
  }
  encode(e) {
    e.write(4, this.version), e.write(8, this.setGroups.length);
    for (let i of this.setGroups)
      i.encode(e);
    if (e.offset % 8 > 0) {
      const i = 8 - e.offset % 8;
      e.write(i, 0);
    }
  }
  get asCardRefQty() {
    return this.setGroups.reduce((e, i) => e.concat(i.cardQty.map((s) => s.asCardRefQty)), Array());
  }
  static fromList(e) {
    const i = at.groupedBySet(e).map((a) => _e(a, 63).map((d) => jt.from(d)));
    let s = new at();
    return s.version = 1, s.setGroups = i.flat(), s;
  }
  static groupedBySet(e) {
    let i = /* @__PURE__ */ new Map();
    for (let s of e) {
      const a = new Z(s.id).set_code;
      let u = i.get(a);
      u || (u = [], i.set(a, u)), u.push(s);
    }
    return Array.from(i, ([s, a]) => a);
  }
};
function _e(l, e) {
  let i = [];
  for (let s = 0; s < l.length; s += e)
    i.push(l.slice(s, s + e));
  return i;
}
let $e = class {
  constructor() {
    w(this, "setCode");
  }
}, j = class extends Error {
  constructor(e) {
    super(e), this.name = "DecodingError";
  }
}, tt = class extends Error {
  constructor(e) {
    super(e), this.name = "EncodingError";
  }
};
const yt = {
  1: 5,
  // CoreKS        range 0-31
  2: 5,
  // Core          range 0-31
  3: 6,
  // Alize         range 0-63
  4: 6,
  // Bise          range 0-63
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
  10: 7,
  // Duster TOP    range 0-127
  11: 7,
  // Duster CB     range 0-127
  12: 7
  // Duster OP     range 0-127
}, v = 12, Ht = [
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
let Xt = class bt {
  constructor() {
    w(this, "setCode");
    w(this, "product");
    w(this, "faction");
    w(this, "numberInFaction");
    w(this, "rarity");
    w(this, "uniqueId");
  }
  static decode(e, i, s) {
    const a = new bt();
    if (i.setCode === void 0)
      throw new H("Tried to decode Card without SetCode in context");
    if (a.setCode = i.setCode, e.readSync(1) == 1)
      a.product = null;
    else if (a.product = e.readSync(2), a.product == 0 || a.product == 3)
      throw new H(`Invalid product ID (${a.product})`);
    if (a.faction = e.readSync(3), a.faction == 0)
      throw new H(`Invalid faction ID (${a.faction})`);
    if (s)
      a.numberInFaction = e.readSync(v), i.familyIdMin = a.numberInFaction;
    else {
      if (i.familyIdMin === void 0 || i.familyIdBitLength === void 0)
        throw new H("Tried to decode Card without familyIdMin/familyIdBitLength in context");
      const y = e.readSync(i.familyIdBitLength);
      a.numberInFaction = i.familyIdMin + y;
    }
    const d = Ht.includes(a.setCode) ? 2 : 3;
    return a.rarity = e.readSync(d), a.rarity == 3 && (a.uniqueId = e.readSync(16)), a;
  }
  encode(e, i, s, a) {
    if (this.product == null ? e.write(1, 1) : (e.write(1, 0), e.write(2, this.product)), e.write(3, this.faction), a) {
      if (this.numberInFaction > (1 << v) - 1)
        throw new W(`First Family ID out of range (${this.numberInFaction}) for set ${this.setCode} (max value ${(1 << v) - 1})`);
      e.write(v, this.numberInFaction);
    } else {
      const d = this.numberInFaction - i;
      if (d >= 1 << s)
        throw new W(`Family ID out of range (${this.numberInFaction}) for set ${this.setCode} (range: ${i} - ${i + (1 << s - 1)})`);
      e.write(s, d);
    }
    const u = Ht.includes(this.setCode) ? 2 : 3;
    if (e.write(u, this.rarity), this.uniqueId !== void 0) {
      if (this.uniqueId > 65535)
        throw new W("Cannot encode unique ID greater than 65535");
      e.write(16, this.uniqueId);
    }
  }
  get asCardId() {
    let e = "ALT_";
    switch (this.setCode) {
      case 1:
        e += C.CoreKS;
        break;
      case 2:
        e += C.Core;
        break;
      case 3:
        e += C.Alize;
        break;
      case 4:
        e += C.Bise;
        break;
      case 5:
        e += C.TumultS3;
        break;
      case 6:
        e += C.WCQualifier25;
        break;
      case 7:
        e += C.WCSeries25;
        break;
      case 8:
        e += C.Cyclone;
        break;
      case 9:
        e += C.Duster;
        break;
      case 10:
        e += C.DusterTOP;
        break;
      case 11:
        e += C.DusterCB;
        break;
      case 12:
        e += C.DusterOP;
        break;
    }
    switch (e += "_", this.product) {
      case null:
        e += N.Booster;
        break;
      case 1:
        e += N.Promo;
        break;
      case 2:
        e += N.AltArt;
        break;
    }
    switch (e += "_", this.faction) {
      case 1:
        e += A.Axiom;
        break;
      case 2:
        e += A.Bravos;
        break;
      case 3:
        e += A.Lyra;
        break;
      case 4:
        e += A.Muna;
        break;
      case 5:
        e += A.Ordis;
        break;
      case 6:
        e += A.Yzmir;
        break;
      case 7:
        e += A.Neutral;
        break;
    }
    switch (e += "_", this.numberInFaction < 10 && !(this.faction == 7 && (this.setCode == 1 || this.setCode == 2)) && (e += "0"), e += this.numberInFaction, e += "_", this.rarity) {
      case 0:
        e += L.Common;
        break;
      case 1:
        e += L.Rare;
        break;
      case 2:
        e += L.RareOOF;
        break;
      case 3:
        e += L.Unique + "_" + this.uniqueId;
        break;
      case 4:
        e += L.Exalt;
        break;
    }
    return e;
  }
  static fromId(e) {
    let i = new bt(), s = new Z(e);
    return i.setCode = s.setId, i.product = s.productId, i.faction = s.factionId, i.numberInFaction = s.num_in_faction, i.rarity = s.rarityId, i.uniqueId = s.uniq_num, i;
  }
}, Zt = class Bt {
  constructor() {
    w(this, "quantity");
    // VLE: 2 (+6) bits
    w(this, "card");
  }
  static decode(e, i, s) {
    const a = new Bt(), u = e.readSync(2);
    if (u > 0)
      a.quantity = u;
    else {
      const d = e.readSync(6);
      a.quantity = d == 0 ? 0 : d + 3;
    }
    return a.card = Xt.decode(e, i, s), a;
  }
  encode(e, i, s, a) {
    if (this.quantity > 0 && this.quantity <= 3)
      e.write(2, this.quantity);
    else if (this.quantity > 3) {
      if (this.quantity > 65)
        throw new W(`Cannot encode card quantity (${this.quantity}) greater than 65`);
      e.write(2, 0), e.write(6, this.quantity - 3);
    } else
      e.write(8, 0);
    this.card.encode(e, i, s, a);
  }
  get asCardRefQty() {
    return {
      quantity: this.quantity,
      id: this.card.asCardId
    };
  }
  static from(e, i) {
    let s = new Bt();
    return s.quantity = e, s.card = Xt.fromId(i), s;
  }
}, Kt = class ft {
  constructor() {
    w(this, "setCode");
    // 8 bits
    w(this, "cardQty");
  }
  // count: 6 bits
  static decode(e, i) {
    const s = new ft();
    if (s.setCode = e.readSync(8), !ft.isValidSetCode(s.setCode))
      throw new H(`Invalid SetCode ID (${s.setCode}) @offset=${e.offset}`);
    i.setCode = s.setCode;
    const a = e.readSync(6);
    a > 1 ? i.familyIdBitLength = e.readSync(4) : i.familyIdBitLength = void 0;
    const u = new Array();
    for (let d = 0; d < a; d++)
      u.push(Zt.decode(e, i, d === 0));
    return s.cardQty = u, i.setCode = void 0, i.familyIdMin = void 0, i.familyIdBitLength = void 0, s;
  }
  encode(e) {
    if (this.cardQty.length <= 0)
      throw new W("Cannot encode a SetGroup with 0 cards");
    const i = [...this.cardQty].sort(
      (I, b) => I.card.numberInFaction - b.card.numberInFaction
    ), s = i[0].card.numberInFaction, a = i[i.length - 1].card.numberInFaction, u = Math.ceil(Math.log2(a - s + 1));
    if (u > 15)
      throw new W(`Family ID range is too large (${a - s + 1}) for set ${this.setCode} (max: 65535)`);
    if (s > (1 << v) - 1)
      throw new W(`Family ID minimum is too large (${s}) for set ${this.setCode} (max: ${(1 << v) - 1})`);
    const d = this.cardQty[0].card.setCode, y = yt[d];
    e.write(8, d), e.write(6, this.cardQty.length), this.cardQty.length > 1 && e.write(4, u);
    {
      const I = (y - u) * (this.cardQty.length - 1) - (this.cardQty.length > 1 ? 4 : 0) - (v - y);
      console.log(`SetGroup: ${d} (qty=${this.cardQty.length}) (range: ${s}-${a}, bit length=${u} vs. ${yt[d]}, saved ${I} bits`);
    }
    let c = 0;
    for (let I of i)
      I.encode(e, s, u, c === 0), c++;
  }
  static from(e) {
    let i = new ft();
    return i.cardQty = e.map((s) => Zt.from(s.quantity, s.id)), i;
  }
  static isValidSetCode(e) {
    return yt[e] !== void 0;
  }
}, ee = class ut {
  constructor() {
    w(this, "version");
    // 4 bits
    w(this, "setGroups");
  }
  // count: 8 bits
  static decode(e) {
    const i = new ut(), s = new Ue();
    if (i.version = e.readSync(4), i.version !== 2)
      throw new H(`Invalid version (${i.version}`);
    const a = e.readSync(8), u = new Array();
    for (let d = 0; d < a; d++)
      u.push(Kt.decode(e, s));
    return i.setGroups = u, i;
  }
  encode(e) {
    e.write(4, this.version), e.write(8, this.setGroups.length);
    for (let i of this.setGroups)
      i.encode(e);
    if (e.offset % 8 > 0) {
      const i = 8 - e.offset % 8;
      e.write(i, 0);
    }
  }
  get asCardRefQty() {
    return this.setGroups.reduce((e, i) => e.concat(i.cardQty.map((s) => s.asCardRefQty)), Array());
  }
  static fromList(e) {
    const i = ut.groupedBySet(e).map((a) => Le(a, 63).map((d) => Kt.from(d)));
    let s = new ut();
    return s.version = 2, s.setGroups = i.flat(), s;
  }
  static groupedBySet(e) {
    let i = /* @__PURE__ */ new Map();
    for (let s of e) {
      const a = new Z(s.id).set_code;
      let u = i.get(a);
      u || (u = [], i.set(a, u)), u.push(s);
    }
    return Array.from(i, ([s, a]) => a);
  }
};
function Le(l, e) {
  let i = [];
  for (let s = 0; s < l.length; s += e)
    i.push(l.slice(s, s + e));
  return i;
}
let Ue = class {
  constructor() {
    w(this, "setCode");
    w(this, "familyIdMin");
    w(this, "familyIdBitLength");
  }
}, H = class extends Error {
  constructor(e) {
    super(e), this.name = "DecodingError";
  }
}, W = class extends Error {
  constructor(e) {
    super(e), this.name = "EncodingError";
  }
};
const Re = {
  COREKS: 1,
  CORE: 2,
  ALIZE: 3,
  BISE: 4,
  TCS3: 5,
  WCQ25: 6,
  WCS25: 7,
  CYCLONE: 8,
  DUSTER: 9,
  DUSTERTOP: 10,
  DUSTERCB: 11,
  DUSTEROP: 12
}, Te = {
  1: 5,
  // CoreKS        range 0-31
  2: 5,
  // Core          range 0-31
  3: 6,
  // Alize         range 0-63
  4: 6,
  // Bise          range 0-63
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
  10: 7,
  // Duster TOP    range 0-127
  11: 7,
  // Duster CB     range 0-127
  12: 7
  // Duster OP     range 0-127
}, Jt = [
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
], J = 12;
function qe(l, e) {
  if (!/^[A-Z0-9]+$/.test(e))
    throw new T(`Invalid set name '${e}' (must match /^[A-Z0-9]+$/)`);
  if (e.length < 1 || e.length > 16)
    throw new T(`Invalid set name length (${e.length}) for '${e}' (must be 1..16)`);
  l.write(4, e.length - 1);
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    let a;
    if (s >= "A" && s <= "Z")
      a = s.charCodeAt(0) - 65;
    else if (s >= "0" && s <= "9")
      a = 26 + (s.charCodeAt(0) - 48);
    else
      throw new T(`Invalid set name character '${s}' in '${e}'`);
    l.write(6, a);
  }
}
function De(l) {
  const i = l.readSync(4) + 1;
  let s = "";
  for (let a = 0; a < i; a++) {
    const u = l.readSync(6);
    if (u < 26)
      s += String.fromCharCode(65 + u);
    else if (u < 36)
      s += String.fromCharCode(48 + (u - 26));
    else
      throw new G(`Invalid set name char code (${u}) @offset=${l.offset}`);
  }
  return s;
}
class et {
  constructor() {
    w(this, "setCodeId");
    w(this, "setCodeName");
    w(this, "product");
    w(this, "faction");
    w(this, "numberInFaction");
    w(this, "rarity");
    w(this, "uniqueId");
  }
  static decode(e, i, s) {
    const a = new et();
    if (i.setCodeId === void 0 || i.setCodeName === void 0)
      throw new G("Tried to decode Card without SetCode in context");
    if (a.setCodeId = i.setCodeId, a.setCodeName = i.setCodeName, e.readSync(1) == 1)
      a.product = null;
    else if (a.product = e.readSync(2), a.product == 0 || a.product == 3)
      throw new G(`Invalid product ID (${a.product})`);
    if (a.faction = e.readSync(3), a.faction == 0)
      throw new G(`Invalid faction ID (${a.faction})`);
    if (s)
      a.numberInFaction = e.readSync(J), i.familyIdMin = a.numberInFaction;
    else {
      if (i.familyIdMin === void 0 || i.familyIdBitLength === void 0)
        throw new G("Tried to decode Card without familyIdMin/familyIdBitLength in context");
      const y = e.readSync(i.familyIdBitLength);
      a.numberInFaction = i.familyIdMin + y;
    }
    const d = Jt.includes(a.setCodeId) ? 2 : 3;
    return a.rarity = e.readSync(d), a.rarity == 3 && (a.uniqueId = e.readSync(16)), a;
  }
  encode(e, i, s, a) {
    if (this.product == null ? e.write(1, 1) : (e.write(1, 0), e.write(2, this.product)), e.write(3, this.faction), a) {
      if (this.numberInFaction > (1 << J) - 1)
        throw new T(
          `First Family ID out of range (${this.numberInFaction}) for set ${this.setCodeName} (max value ${(1 << J) - 1})`
        );
      e.write(J, this.numberInFaction);
    } else {
      const d = this.numberInFaction - i;
      if (d < 0 || d >= 1 << s)
        throw new T(
          `Family ID out of range (${this.numberInFaction}) for set ${this.setCodeName} (range: ${i} - ${i + (1 << s) - 1})`
        );
      e.write(s, d);
    }
    const u = Jt.includes(this.setCodeId) ? 2 : 3;
    if (e.write(u, this.rarity), this.uniqueId !== void 0) {
      if (this.uniqueId > 65535)
        throw new T("Cannot encode unique ID greater than 65535");
      e.write(16, this.uniqueId);
    }
  }
  get asCardId() {
    let e = "ALT_";
    switch (e += this.setCodeName, e += "_", this.product) {
      case null:
        e += N.Booster;
        break;
      case 1:
        e += N.Promo;
        break;
      case 2:
        e += N.AltArt;
        break;
      default:
        throw new T(`Invalid product ID (${this.product})`);
    }
    switch (e += "_", this.faction) {
      case 1:
        e += A.Axiom;
        break;
      case 2:
        e += A.Bravos;
        break;
      case 3:
        e += A.Lyra;
        break;
      case 4:
        e += A.Muna;
        break;
      case 5:
        e += A.Ordis;
        break;
      case 6:
        e += A.Yzmir;
        break;
      case 7:
        e += A.Neutral;
        break;
      default:
        throw new T(`Invalid faction ID (${this.faction})`);
    }
    switch (e += "_", this.numberInFaction < 10 && !(this.faction == 7 && (this.setCodeId == 1 || this.setCodeId == 2)) && (e += "0"), e += this.numberInFaction, e += "_", this.rarity) {
      case 0:
        e += L.Common;
        break;
      case 1:
        e += L.Rare;
        break;
      case 2:
        e += L.RareOOF;
        break;
      case 3:
        e += L.Unique + "_" + this.uniqueId;
        break;
      case 4:
        e += L.Exalt;
        break;
      default:
        throw new T(`Invalid rarity ID (${this.rarity})`);
    }
    return e;
  }
  static fromId(e) {
    const i = new et(), s = new Z(e);
    return i.setCodeName = s.set_code_name, i.setCodeId = s.setId, i.product = s.productId, i.faction = s.factionId, i.numberInFaction = s.num_in_faction, i.rarity = s.rarityId, i.uniqueId = s.uniq_num, i;
  }
}
class rt {
  constructor() {
    w(this, "quantity");
    w(this, "card");
  }
  static decode(e, i, s) {
    const a = new rt(), u = e.readSync(2);
    if (u > 0)
      a.quantity = u;
    else {
      const d = e.readSync(6);
      a.quantity = d == 0 ? 0 : d + 3;
    }
    return a.card = et.decode(e, i, s), a;
  }
  encode(e, i, s, a) {
    if (this.quantity > 0 && this.quantity <= 3)
      e.write(2, this.quantity);
    else if (this.quantity > 3) {
      if (this.quantity > 65)
        throw new T(`Cannot encode card quantity (${this.quantity}) greater than 65`);
      e.write(2, 0), e.write(6, this.quantity - 3);
    } else
      e.write(8, 0);
    this.card.encode(e, i, s, a);
  }
  get asCardRefQty() {
    return { quantity: this.quantity, id: this.card.asCardId };
  }
  static from(e, i) {
    const s = new rt();
    return s.quantity = e, s.card = et.fromId(i), s;
  }
}
class it {
  constructor() {
    w(this, "setCodeName");
    w(this, "setCodeId");
    w(this, "cardQty");
  }
  static decode(e, i) {
    const s = new it();
    s.setCodeName = De(e);
    const a = Re[s.setCodeName];
    if (a === void 0 || Te[a] === void 0)
      throw new G(`Invalid Set name (${s.setCodeName}) @offset=${e.offset}`);
    s.setCodeId = a, i.setCodeName = s.setCodeName, i.setCodeId = s.setCodeId;
    const u = e.readSync(6);
    u > 1 ? i.familyIdBitLength = e.readSync(4) : i.familyIdBitLength = void 0;
    const d = new Array();
    for (let y = 0; y < u; y++)
      d.push(rt.decode(e, i, y === 0));
    return s.cardQty = d, i.setCodeName = void 0, i.setCodeId = void 0, i.familyIdMin = void 0, i.familyIdBitLength = void 0, s;
  }
  encode(e) {
    if (this.cardQty.length <= 0)
      throw new T("Cannot encode a SetGroup with 0 cards");
    const i = [...this.cardQty].sort(
      (c, I) => c.card.numberInFaction - I.card.numberInFaction
    ), s = i[0].card.numberInFaction, a = i[i.length - 1].card.numberInFaction, u = Math.ceil(Math.log2(a - s + 1));
    if (u > 15)
      throw new T(`Family ID range is too large (${a - s + 1}) for set ${this.setCodeName}`);
    if (s > (1 << J) - 1)
      throw new T(`Family ID minimum is too large (${s}) for set ${this.setCodeName}`);
    const d = i[0].card.setCodeName;
    qe(e, d), e.write(6, i.length), i.length > 1 && e.write(4, u);
    let y = 0;
    for (const c of i)
      c.encode(e, s, u, y === 0), y++;
  }
  static from(e) {
    const i = new it();
    return i.cardQty = e.map((s) => rt.from(s.quantity, s.id)), i.setCodeName = i.cardQty[0].card.setCodeName, i.setCodeId = i.cardQty[0].card.setCodeId, i;
  }
}
class X {
  constructor() {
    w(this, "version");
    w(this, "setGroups");
  }
  static decode(e) {
    const i = new X(), s = new Me();
    if (i.version = e.readSync(4), i.version !== 3)
      throw new G(`Invalid version (${i.version})`);
    const a = e.readSync(8), u = new Array();
    for (let d = 0; d < a; d++)
      u.push(it.decode(e, s));
    return i.setGroups = u, i;
  }
  encode(e) {
    e.write(4, this.version), e.write(8, this.setGroups.length);
    for (const i of this.setGroups)
      i.encode(e);
    e.offset % 8 > 0 && e.write(8 - e.offset % 8, 0);
  }
  get asCardRefQty() {
    return this.setGroups.reduce((e, i) => e.concat(i.cardQty.map((s) => s.asCardRefQty)), Array());
  }
  static fromList(e) {
    const i = X.groupedBySetName(e).map((a) => Ne(a, 63).map((d) => it.from(d))), s = new X();
    return s.version = 3, s.setGroups = i.flat(), s;
  }
  static groupedBySetName(e) {
    const i = /* @__PURE__ */ new Map();
    for (const s of e) {
      const a = new Z(s.id).set_code_name;
      let u = i.get(a);
      u || (u = [], i.set(a, u)), u.push(s);
    }
    return Array.from(i, ([s, a]) => a);
  }
}
function Ne(l, e) {
  const i = [];
  for (let s = 0; s < l.length; s += e)
    i.push(l.slice(s, s + e));
  return i;
}
class Me {
  constructor() {
    w(this, "setCodeName");
    w(this, "setCodeId");
    w(this, "familyIdMin");
    w(this, "familyIdBitLength");
  }
}
class G extends Error {
  constructor(e) {
    super(e), this.name = "DecodingError";
  }
}
class T extends Error {
  constructor(e) {
    super(e), this.name = "EncodingError";
  }
}
var O = {}, ct = {};
ct.byteLength = Qe;
ct.toByteArray = Ge;
ct.fromByteArray = ze;
var D = [], q = [], Oe = typeof Uint8Array < "u" ? Uint8Array : Array, wt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var V = 0, Pe = wt.length; V < Pe; ++V)
  D[V] = wt[V], q[wt.charCodeAt(V)] = V;
q[45] = 62;
q[95] = 63;
function re(l) {
  var e = l.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var i = l.indexOf("=");
  i === -1 && (i = e);
  var s = i === e ? 0 : 4 - i % 4;
  return [i, s];
}
function Qe(l) {
  var e = re(l), i = e[0], s = e[1];
  return (i + s) * 3 / 4 - s;
}
function ve(l, e, i) {
  return (e + i) * 3 / 4 - i;
}
function Ge(l) {
  var e, i = re(l), s = i[0], a = i[1], u = new Oe(ve(l, s, a)), d = 0, y = a > 0 ? s - 4 : s, c;
  for (c = 0; c < y; c += 4)
    e = q[l.charCodeAt(c)] << 18 | q[l.charCodeAt(c + 1)] << 12 | q[l.charCodeAt(c + 2)] << 6 | q[l.charCodeAt(c + 3)], u[d++] = e >> 16 & 255, u[d++] = e >> 8 & 255, u[d++] = e & 255;
  return a === 2 && (e = q[l.charCodeAt(c)] << 2 | q[l.charCodeAt(c + 1)] >> 4, u[d++] = e & 255), a === 1 && (e = q[l.charCodeAt(c)] << 10 | q[l.charCodeAt(c + 1)] << 4 | q[l.charCodeAt(c + 2)] >> 2, u[d++] = e >> 8 & 255, u[d++] = e & 255), u;
}
function We(l) {
  return D[l >> 18 & 63] + D[l >> 12 & 63] + D[l >> 6 & 63] + D[l & 63];
}
function Ye(l, e, i) {
  for (var s, a = [], u = e; u < i; u += 3)
    s = (l[u] << 16 & 16711680) + (l[u + 1] << 8 & 65280) + (l[u + 2] & 255), a.push(We(s));
  return a.join("");
}
function ze(l) {
  for (var e, i = l.length, s = i % 3, a = [], u = 16383, d = 0, y = i - s; d < y; d += u)
    a.push(Ye(l, d, d + u > y ? y : d + u));
  return s === 1 ? (e = l[i - 1], a.push(
    D[e >> 2] + D[e << 4 & 63] + "=="
  )) : s === 2 && (e = (l[i - 2] << 8) + l[i - 1], a.push(
    D[e >> 10] + D[e >> 4 & 63] + D[e << 2 & 63] + "="
  )), a.join("");
}
var Et = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
Et.read = function(l, e, i, s, a) {
  var u, d, y = a * 8 - s - 1, c = (1 << y) - 1, I = c >> 1, b = -7, B = i ? a - 1 : 0, x = i ? -1 : 1, _ = l[e + B];
  for (B += x, u = _ & (1 << -b) - 1, _ >>= -b, b += y; b > 0; u = u * 256 + l[e + B], B += x, b -= 8)
    ;
  for (d = u & (1 << -b) - 1, u >>= -b, b += s; b > 0; d = d * 256 + l[e + B], B += x, b -= 8)
    ;
  if (u === 0)
    u = 1 - I;
  else {
    if (u === c)
      return d ? NaN : (_ ? -1 : 1) * (1 / 0);
    d = d + Math.pow(2, s), u = u - I;
  }
  return (_ ? -1 : 1) * d * Math.pow(2, u - s);
};
Et.write = function(l, e, i, s, a, u) {
  var d, y, c, I = u * 8 - a - 1, b = (1 << I) - 1, B = b >> 1, x = a === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, _ = s ? 0 : u - 1, k = s ? 1 : -1, P = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (y = isNaN(e) ? 1 : 0, d = b) : (d = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -d)) < 1 && (d--, c *= 2), d + B >= 1 ? e += x / c : e += x * Math.pow(2, 1 - B), e * c >= 2 && (d++, c /= 2), d + B >= b ? (y = 0, d = b) : d + B >= 1 ? (y = (e * c - 1) * Math.pow(2, a), d = d + B) : (y = e * Math.pow(2, B - 1) * Math.pow(2, a), d = 0)); a >= 8; l[i + _] = y & 255, _ += k, y /= 256, a -= 8)
    ;
  for (d = d << a | y, I += a; I > 0; l[i + _] = d & 255, _ += k, d /= 256, I -= 8)
    ;
  l[i + _ - k] |= P * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(l) {
  const e = ct, i = Et, s = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  l.Buffer = c, l.SlowBuffer = ne, l.INSPECT_MAX_BYTES = 50;
  const a = 2147483647;
  l.kMaxLength = a;
  const u = (1 << 28) - 16;
  l.kStringMaxLength = u, l.constants = {
    MAX_LENGTH: a,
    MAX_STRING_LENGTH: u
  }, l.Blob = typeof Blob < "u" ? Blob : void 0, l.File = typeof File < "u" ? File : void 0, l.atob = typeof atob < "u" ? atob : void 0, l.btoa = typeof btoa < "u" ? btoa : void 0, c.TYPED_ARRAY_SUPPORT = d(), !c.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function d() {
    try {
      const n = new Uint8Array(1), t = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(n, t), n.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(c.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (c.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(c.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (c.isBuffer(this))
        return this.byteOffset;
    }
  });
  function y(n) {
    if (n > a)
      throw new RangeError('The value "' + n + '" is invalid for option "size"');
    const t = new Uint8Array(n);
    return Object.setPrototypeOf(t, c.prototype), t;
  }
  function c(n, t, r) {
    if (typeof n == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return x(n);
    }
    return I(n, t, r);
  }
  c.poolSize = 8192;
  function I(n, t, r) {
    if (typeof n == "string")
      return _(n, t);
    if (ArrayBuffer.isView(n))
      return P(n);
    if (n == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof n
      );
    if (R(n, ArrayBuffer) || n && R(n.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (R(n, SharedArrayBuffer) || n && R(n.buffer, SharedArrayBuffer)))
      return ht(n, t, r);
    if (typeof n == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const o = n.valueOf && n.valueOf();
    if (o != null && o !== n)
      return c.from(o, t, r);
    const f = ie(n);
    if (f) return f;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof n[Symbol.toPrimitive] == "function")
      return c.from(n[Symbol.toPrimitive]("string"), t, r);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof n
    );
  }
  c.from = function(n, t, r) {
    return I(n, t, r);
  }, Object.setPrototypeOf(c.prototype, Uint8Array.prototype), Object.setPrototypeOf(c, Uint8Array);
  function b(n) {
    if (typeof n != "number")
      throw new TypeError('"size" argument must be of type number');
    if (n < 0)
      throw new RangeError('The value "' + n + '" is invalid for option "size"');
  }
  function B(n, t, r) {
    return b(n), n <= 0 ? y(n) : t !== void 0 ? typeof r == "string" ? y(n).fill(t, r) : y(n).fill(t) : y(n);
  }
  c.alloc = function(n, t, r) {
    return B(n, t, r);
  };
  function x(n) {
    return b(n), y(n < 0 ? 0 : dt(n) | 0);
  }
  c.allocUnsafe = function(n) {
    return x(n);
  }, c.allocUnsafeSlow = function(n) {
    return x(n);
  };
  function _(n, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !c.isEncoding(t))
      throw new TypeError("Unknown encoding: " + t);
    const r = At(n, t) | 0;
    let o = y(r);
    const f = o.write(n, t);
    return f !== r && (o = o.slice(0, f)), o;
  }
  function k(n) {
    const t = n.length < 0 ? 0 : dt(n.length) | 0, r = y(t);
    for (let o = 0; o < t; o += 1)
      r[o] = n[o] & 255;
    return r;
  }
  function P(n) {
    if (R(n, Uint8Array)) {
      const t = new Uint8Array(n);
      return ht(t.buffer, t.byteOffset, t.byteLength);
    }
    return k(n);
  }
  function ht(n, t, r) {
    if (t < 0 || n.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (n.byteLength < t + (r || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let o;
    return t === void 0 && r === void 0 ? o = new Uint8Array(n) : r === void 0 ? o = new Uint8Array(n, t) : o = new Uint8Array(n, t, r), Object.setPrototypeOf(o, c.prototype), o;
  }
  function ie(n) {
    if (c.isBuffer(n)) {
      const t = dt(n.length) | 0, r = y(t);
      return r.length === 0 || n.copy(r, 0, 0, t), r;
    }
    if (n.length !== void 0)
      return typeof n.length != "number" || Gt(n.length) ? y(0) : k(n);
    if (n.type === "Buffer" && Array.isArray(n.data))
      return k(n.data);
  }
  function dt(n) {
    if (n >= a)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a.toString(16) + " bytes");
    return n | 0;
  }
  function ne(n) {
    return +n != n && (n = 0), c.alloc(+n);
  }
  c.isBuffer = function(t) {
    return t != null && t._isBuffer === !0 && t !== c.prototype;
  }, c.compare = function(t, r) {
    if (!R(t, Uint8Array) || !R(r, Uint8Array))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (t === r) return 0;
    let o = t.length, f = r.length;
    for (let h = 0, p = Math.min(o, f); h < p; ++h)
      if (t[h] !== r[h]) {
        o = t[h], f = r[h];
        break;
      }
    return o < f ? -1 : f < o ? 1 : 0;
  }, c.isEncoding = function(t) {
    switch (String(t).toLowerCase()) {
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
  }, c.concat = function(t, r) {
    if (!Array.isArray(t))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (t.length === 0)
      return c.alloc(0);
    let o;
    if (r === void 0)
      for (r = 0, o = 0; o < t.length; ++o)
        r += t[o].length;
    const f = c.allocUnsafe(r);
    let h = 0;
    for (o = 0; o < t.length; ++o) {
      const p = t[o];
      if (!R(p, Uint8Array))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (h + p.length > f.length) {
        f.set(p.subarray(0, f.length - h), h);
        break;
      }
      f.set(p, h), h += p.length;
    }
    return f;
  };
  function At(n, t) {
    if (ArrayBuffer.isView(n) || R(n, ArrayBuffer) || typeof SharedArrayBuffer < "u" && R(n, SharedArrayBuffer))
      return n.byteLength;
    if (typeof n != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof n
      );
    const r = n.length, o = arguments.length > 2 && arguments[2] === !0;
    if (!o && r === 0) return 0;
    let f = !1;
    for (; ; )
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return r;
        case "utf8":
        case "utf-8":
          return pt(n).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return r * 2;
        case "hex":
          return r >>> 1;
        case "base64":
          return vt(n).length;
        default:
          if (f)
            return o ? -1 : pt(n).length;
          t = ("" + t).toLowerCase(), f = !0;
      }
  }
  c.byteLength = At;
  function se(n, t, r) {
    let o = !1;
    if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, t >>>= 0, r <= t))
      return "";
    for (n || (n = "utf8"); ; )
      switch (n) {
        case "hex":
          return ye(this, t, r);
        case "utf8":
        case "utf-8":
          return _t(this, t, r);
        case "ascii":
          return le(this, t, r);
        case "latin1":
        case "binary":
          return pe(this, t, r);
        case "base64url":
        case "base64":
          return he(this, t, r, n);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return we(this, t, r);
        default:
          if (o) throw new TypeError("Unknown encoding: " + n);
          n = (n + "").toLowerCase(), o = !0;
      }
  }
  c.prototype._isBuffer = !0;
  function Q(n, t, r) {
    const o = n[t];
    n[t] = n[r], n[r] = o;
  }
  c.prototype.swap16 = function() {
    const t = this.length;
    if (t % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let r = 0; r < t; r += 2)
      Q(this, r, r + 1);
    return this;
  }, c.prototype.swap32 = function() {
    const t = this.length;
    if (t % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let r = 0; r < t; r += 4)
      Q(this, r, r + 3), Q(this, r + 1, r + 2);
    return this;
  }, c.prototype.swap64 = function() {
    const t = this.length;
    if (t % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let r = 0; r < t; r += 8)
      Q(this, r, r + 7), Q(this, r + 1, r + 6), Q(this, r + 2, r + 5), Q(this, r + 3, r + 4);
    return this;
  }, c.prototype.toString = function() {
    const t = this.length;
    return t === 0 ? "" : arguments.length === 0 ? _t(this, 0, t) : se.apply(this, arguments);
  }, c.prototype.toLocaleString = c.prototype.toString, c.prototype.equals = function(t) {
    return this === t ? !0 : c.compare(this, t) === 0;
  }, c.prototype.inspect = function() {
    let t = "";
    const r = l.INSPECT_MAX_BYTES;
    return t = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (t += " ... "), "<Buffer " + t + ">";
  }, s && (c.prototype[s] = c.prototype.inspect), c.prototype.compare = function(t, r, o, f, h) {
    if (!R(t, Uint8Array))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
      );
    if (r === void 0 && (r = 0), o === void 0 && (o = t ? t.length : 0), f === void 0 && (f = 0), h === void 0 && (h = this.length), r < 0 || o > t.length || f < 0 || h > this.length)
      throw new RangeError("out of range index");
    if (f >= h && r >= o)
      return 0;
    if (f >= h)
      return -1;
    if (r >= o)
      return 1;
    if (r >>>= 0, o >>>= 0, f >>>= 0, h >>>= 0, this === t) return 0;
    let p = h - f, g = o - r;
    const E = Math.min(p, g);
    for (let m = 0; m < E; ++m)
      if (this[f + m] !== t[r + m]) {
        p = this[f + m], g = t[r + m];
        break;
      }
    return p < g ? -1 : g < p ? 1 : 0;
  };
  function Ft(n, t, r, o, f) {
    if (n.length === 0) return -1;
    if (typeof r == "string" ? (o = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, Gt(r) && (r = f ? 0 : n.length - 1), r < 0 && (r = n.length + r), r >= n.length) {
      if (f) return -1;
      r = n.length - 1;
    } else if (r < 0)
      if (f) r = 0;
      else return -1;
    if (typeof t == "string" && (t = c.from(t, o)), c.isBuffer(t))
      return t.length === 0 ? -1 : kt(n, t, r, o, f);
    if (typeof t == "number")
      return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? f ? Uint8Array.prototype.indexOf.call(n, t, r) : Uint8Array.prototype.lastIndexOf.call(n, t, r) : kt(n, [t], r, o, f);
    throw new TypeError("val must be string, number or Buffer");
  }
  function kt(n, t, r, o, f) {
    let h = 1, p = n.length, g = t.length;
    if (o !== void 0 && (o = String(o).toLowerCase(), o === "ucs2" || o === "ucs-2" || o === "utf16le" || o === "utf-16le")) {
      if (n.length < 2 || t.length < 2)
        return -1;
      h = 2, p /= 2, g /= 2, r /= 2;
    }
    function E(S, F) {
      return h === 1 ? S[F] : S.readUInt16BE(F * h);
    }
    let m;
    if (f) {
      let S = -1;
      for (m = r; m < p; m++)
        if (E(n, m) === E(t, S === -1 ? 0 : m - S)) {
          if (S === -1 && (S = m), m - S + 1 === g) return S * h;
        } else
          S !== -1 && (m -= m - S), S = -1;
    } else
      for (r + g > p && (r = p - g), m = r; m >= 0; m--) {
        let S = !0;
        for (let F = 0; F < g; F++)
          if (E(n, m + F) !== E(t, F)) {
            S = !1;
            break;
          }
        if (S) return m;
      }
    return -1;
  }
  c.prototype.includes = function(t, r, o) {
    return this.indexOf(t, r, o) !== -1;
  }, c.prototype.indexOf = function(t, r, o) {
    return Ft(this, t, r, o, !0);
  }, c.prototype.lastIndexOf = function(t, r, o) {
    return Ft(this, t, r, o, !1);
  };
  function oe(n, t, r, o) {
    r = Number(r) || 0;
    const f = n.length - r;
    o ? (o = Number(o), o > f && (o = f)) : o = f;
    const h = t.length;
    o > h >>> 1 && (o = h >>> 1);
    for (let p = 0; p < o; ++p) {
      const g = t.charCodeAt(p * 2 + 0), E = t.charCodeAt(p * 2 + 1), m = Wt[g & 127], S = Wt[E & 127];
      if ((g | E | m | S) & -128)
        return p;
      n[r + p] = m << 4 | S;
    }
    return o;
  }
  function ae(n, t, r, o) {
    return nt(pt(t, n.length - r), n, r, o);
  }
  function fe(n, t, r, o) {
    return nt(Ee(t), n, r, o);
  }
  function ue(n, t, r, o, f) {
    const h = f === "base64url" ? me(t) : t;
    return nt(vt(h), n, r, o);
  }
  function ce(n, t, r, o) {
    return nt(Ce(t, n.length - r), n, r, o);
  }
  c.prototype.write = function(t, r, o, f) {
    if (r === void 0)
      f = "utf8", o = this.length, r = 0;
    else if (o === void 0 && typeof r == "string")
      f = r, o = this.length, r = 0;
    else if (isFinite(r))
      r = r >>> 0, isFinite(o) ? (o = o >>> 0, f === void 0 && (f = "utf8")) : (f = o, o = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const h = this.length - r;
    if ((o === void 0 || o > h) && (o = h), t.length > 0 && (o < 0 || r < 0) || r > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    f || (f = "utf8");
    let p = !1;
    for (; ; )
      switch (f) {
        case "hex":
          return oe(this, t, r, o);
        case "utf8":
        case "utf-8":
          return ae(this, t, r, o);
        case "ascii":
        case "latin1":
        case "binary":
          return fe(this, t, r, o);
        case "base64url":
        case "base64":
          return ue(this, t, r, o, f);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ce(this, t, r, o);
        default:
          if (p) throw new TypeError("Unknown encoding: " + f);
          f = ("" + f).toLowerCase(), p = !0;
      }
  }, c.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this, 0)
    };
  };
  function he(n, t, r, o) {
    let f;
    return t === 0 && r === n.length ? f = e.fromByteArray(n) : f = e.fromByteArray(n.slice(t, r)), o === "base64url" ? be(f) : f;
  }
  function _t(n, t, r) {
    r = Math.min(n.length, r);
    const o = [];
    let f = t;
    for (; f < r; ) {
      const h = n[f];
      let p = null, g = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
      if (f + g <= r) {
        let E, m, S, F;
        switch (g) {
          case 1:
            h < 128 && (p = h);
            break;
          case 2:
            E = n[f + 1], (E & 192) === 128 && (F = (h & 31) << 6 | E & 63, F > 127 && (p = F));
            break;
          case 3:
            E = n[f + 1], m = n[f + 2], (E & 192) === 128 && (m & 192) === 128 && (F = (h & 15) << 12 | (E & 63) << 6 | m & 63, F > 2047 && (F < 55296 || F > 57343) && (p = F));
            break;
          case 4:
            E = n[f + 1], m = n[f + 2], S = n[f + 3], (E & 192) === 128 && (m & 192) === 128 && (S & 192) === 128 && (F = (h & 15) << 18 | (E & 63) << 12 | (m & 63) << 6 | S & 63, F > 65535 && F < 1114112 && (p = F));
        }
      }
      p === null ? (p = 65533, g = 1) : p > 65535 && (p -= 65536, o.push(p >>> 10 & 1023 | 55296), p = 56320 | p & 1023), o.push(p), f += g;
    }
    return de(o);
  }
  const $t = 4096;
  function de(n) {
    const t = n.length;
    if (t <= $t)
      return String.fromCharCode.apply(String, n);
    let r = "", o = 0;
    for (; o < t; )
      r += String.fromCharCode.apply(
        String,
        n.slice(o, o += $t)
      );
    return r;
  }
  function le(n, t, r) {
    let o = "";
    r = Math.min(n.length, r);
    for (let f = t; f < r; ++f)
      o += String.fromCharCode(n[f] & 127);
    return o;
  }
  function pe(n, t, r) {
    let o = "";
    r = Math.min(n.length, r);
    for (let f = t; f < r; ++f)
      o += String.fromCharCode(n[f]);
    return o;
  }
  function ye(n, t, r) {
    const o = n.length;
    (!t || t < 0) && (t = 0), (!r || r < 0 || r > o) && (r = o);
    let f = "";
    for (let h = t; h < r; ++h)
      f += xe[n[h]];
    return f;
  }
  function we(n, t, r) {
    const o = n.slice(t, r);
    let f = "";
    for (let h = 0; h < o.length - 1; h += 2)
      f += String.fromCharCode(o[h] + o[h + 1] * 256);
    return f;
  }
  c.prototype.slice = function(t, r) {
    const o = this.length;
    t = ~~t, r = r === void 0 ? o : ~~r, t < 0 ? (t += o, t < 0 && (t = 0)) : t > o && (t = o), r < 0 ? (r += o, r < 0 && (r = 0)) : r > o && (r = o), r < t && (r = t);
    const f = this.subarray(t, r);
    return Object.setPrototypeOf(f, c.prototype), f;
  };
  function $(n, t, r) {
    if (n % 1 !== 0 || n < 0) throw new RangeError("offset is not uint");
    if (n + t > r) throw new RangeError("Trying to access beyond buffer length");
  }
  c.prototype.readUintLE = c.prototype.readUIntLE = function(t, r, o) {
    t = t >>> 0, r = r >>> 0, o || $(t, r, this.length);
    let f = this[t], h = 1, p = 0;
    for (; ++p < r && (h *= 256); )
      f += this[t + p] * h;
    return f;
  }, c.prototype.readUintBE = c.prototype.readUIntBE = function(t, r, o) {
    t = t >>> 0, r = r >>> 0, o || $(t, r, this.length);
    let f = this[t + --r], h = 1;
    for (; r > 0 && (h *= 256); )
      f += this[t + --r] * h;
    return f;
  }, c.prototype.readUint8 = c.prototype.readUInt8 = function(t, r) {
    return t = t >>> 0, r || $(t, 1, this.length), this[t];
  }, c.prototype.readUint16LE = c.prototype.readUInt16LE = function(t, r) {
    return t = t >>> 0, r || $(t, 2, this.length), this[t] | this[t + 1] << 8;
  }, c.prototype.readUint16BE = c.prototype.readUInt16BE = function(t, r) {
    return t = t >>> 0, r || $(t, 2, this.length), this[t] << 8 | this[t + 1];
  }, c.prototype.readUint32LE = c.prototype.readUInt32LE = function(t, r) {
    return t = t >>> 0, r || $(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
  }, c.prototype.readUint32BE = c.prototype.readUInt32BE = function(t, r) {
    return t = t >>> 0, r || $(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
  }, c.prototype.readBigUInt64LE = M(function(t) {
    t = t >>> 0, z(t, "offset");
    const r = this[t], o = this[t + 7];
    (r === void 0 || o === void 0) && K(t, this.length - 8);
    const f = r + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24, h = this[++t] + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + o * 2 ** 24;
    return BigInt(f) + (BigInt(h) << BigInt(32));
  }), c.prototype.readBigUInt64BE = M(function(t) {
    t = t >>> 0, z(t, "offset");
    const r = this[t], o = this[t + 7];
    (r === void 0 || o === void 0) && K(t, this.length - 8);
    const f = r * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t], h = this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + o;
    return (BigInt(f) << BigInt(32)) + BigInt(h);
  }), c.prototype.readIntLE = function(t, r, o) {
    t = t >>> 0, r = r >>> 0, o || $(t, r, this.length);
    let f = this[t], h = 1, p = 0;
    for (; ++p < r && (h *= 256); )
      f += this[t + p] * h;
    return h *= 128, f >= h && (f -= Math.pow(2, 8 * r)), f;
  }, c.prototype.readIntBE = function(t, r, o) {
    t = t >>> 0, r = r >>> 0, o || $(t, r, this.length);
    let f = r, h = 1, p = this[t + --f];
    for (; f > 0 && (h *= 256); )
      p += this[t + --f] * h;
    return h *= 128, p >= h && (p -= Math.pow(2, 8 * r)), p;
  }, c.prototype.readInt8 = function(t, r) {
    return t = t >>> 0, r || $(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
  }, c.prototype.readInt16LE = function(t, r) {
    t = t >>> 0, r || $(t, 2, this.length);
    const o = this[t] | this[t + 1] << 8;
    return o & 32768 ? o | 4294901760 : o;
  }, c.prototype.readInt16BE = function(t, r) {
    t = t >>> 0, r || $(t, 2, this.length);
    const o = this[t + 1] | this[t] << 8;
    return o & 32768 ? o | 4294901760 : o;
  }, c.prototype.readInt32LE = function(t, r) {
    return t = t >>> 0, r || $(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
  }, c.prototype.readInt32BE = function(t, r) {
    return t = t >>> 0, r || $(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
  }, c.prototype.readBigInt64LE = M(function(t) {
    t = t >>> 0, z(t, "offset");
    const r = this[t], o = this[t + 7];
    (r === void 0 || o === void 0) && K(t, this.length - 8);
    const f = this[t + 4] + this[t + 5] * 2 ** 8 + this[t + 6] * 2 ** 16 + (o << 24);
    return (BigInt(f) << BigInt(32)) + BigInt(r + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24);
  }), c.prototype.readBigInt64BE = M(function(t) {
    t = t >>> 0, z(t, "offset");
    const r = this[t], o = this[t + 7];
    (r === void 0 || o === void 0) && K(t, this.length - 8);
    const f = (r << 24) + // Overflow
    this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t];
    return (BigInt(f) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + o);
  }), c.prototype.readFloatLE = function(t, r) {
    return t = t >>> 0, r || $(t, 4, this.length), i.read(this, t, !0, 23, 4);
  }, c.prototype.readFloatBE = function(t, r) {
    return t = t >>> 0, r || $(t, 4, this.length), i.read(this, t, !1, 23, 4);
  }, c.prototype.readDoubleLE = function(t, r) {
    return t = t >>> 0, r || $(t, 8, this.length), i.read(this, t, !0, 52, 8);
  }, c.prototype.readDoubleBE = function(t, r) {
    return t = t >>> 0, r || $(t, 8, this.length), i.read(this, t, !1, 52, 8);
  };
  function U(n, t, r, o, f, h) {
    if (!c.isBuffer(n)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > f || t < h) throw new RangeError('"value" argument is out of bounds');
    if (r + o > n.length) throw new RangeError("Index out of range");
  }
  c.prototype.writeUintLE = c.prototype.writeUIntLE = function(t, r, o, f) {
    if (t = +t, r = r >>> 0, o = o >>> 0, !f) {
      const g = Math.pow(2, 8 * o) - 1;
      U(this, t, r, o, g, 0);
    }
    let h = 1, p = 0;
    for (this[r] = t & 255; ++p < o && (h *= 256); )
      this[r + p] = t / h & 255;
    return r + o;
  }, c.prototype.writeUintBE = c.prototype.writeUIntBE = function(t, r, o, f) {
    if (t = +t, r = r >>> 0, o = o >>> 0, !f) {
      const g = Math.pow(2, 8 * o) - 1;
      U(this, t, r, o, g, 0);
    }
    let h = o - 1, p = 1;
    for (this[r + h] = t & 255; --h >= 0 && (p *= 256); )
      this[r + h] = t / p & 255;
    return r + o;
  }, c.prototype.writeUint8 = c.prototype.writeUInt8 = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 1, 255, 0), this[r] = t & 255, r + 1;
  }, c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 2, 65535, 0), this[r] = t & 255, this[r + 1] = t >>> 8, r + 2;
  }, c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 2, 65535, 0), this[r] = t >>> 8, this[r + 1] = t & 255, r + 2;
  }, c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 4, 4294967295, 0), this[r + 3] = t >>> 24, this[r + 2] = t >>> 16, this[r + 1] = t >>> 8, this[r] = t & 255, r + 4;
  }, c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 4, 4294967295, 0), this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = t & 255, r + 4;
  };
  function Lt(n, t, r, o, f) {
    Nt(t, o, f, n, r, 7);
    let h = Number(t & BigInt(4294967295));
    n[r++] = h, h = h >> 8, n[r++] = h, h = h >> 8, n[r++] = h, h = h >> 8, n[r++] = h;
    let p = Number(t >> BigInt(32) & BigInt(4294967295));
    return n[r++] = p, p = p >> 8, n[r++] = p, p = p >> 8, n[r++] = p, p = p >> 8, n[r++] = p, r;
  }
  function Ut(n, t, r, o, f) {
    Nt(t, o, f, n, r, 7);
    let h = Number(t & BigInt(4294967295));
    n[r + 7] = h, h = h >> 8, n[r + 6] = h, h = h >> 8, n[r + 5] = h, h = h >> 8, n[r + 4] = h;
    let p = Number(t >> BigInt(32) & BigInt(4294967295));
    return n[r + 3] = p, p = p >> 8, n[r + 2] = p, p = p >> 8, n[r + 1] = p, p = p >> 8, n[r] = p, r + 8;
  }
  c.prototype.writeBigUInt64LE = M(function(t, r = 0) {
    return Lt(this, t, r, BigInt(0), BigInt("0xffffffffffffffff"));
  }), c.prototype.writeBigUInt64BE = M(function(t, r = 0) {
    return Ut(this, t, r, BigInt(0), BigInt("0xffffffffffffffff"));
  }), c.prototype.writeIntLE = function(t, r, o, f) {
    if (t = +t, r = r >>> 0, !f) {
      const E = Math.pow(2, 8 * o - 1);
      U(this, t, r, o, E - 1, -E);
    }
    let h = 0, p = 1, g = 0;
    for (this[r] = t & 255; ++h < o && (p *= 256); )
      t < 0 && g === 0 && this[r + h - 1] !== 0 && (g = 1), this[r + h] = (t / p >> 0) - g & 255;
    return r + o;
  }, c.prototype.writeIntBE = function(t, r, o, f) {
    if (t = +t, r = r >>> 0, !f) {
      const E = Math.pow(2, 8 * o - 1);
      U(this, t, r, o, E - 1, -E);
    }
    let h = o - 1, p = 1, g = 0;
    for (this[r + h] = t & 255; --h >= 0 && (p *= 256); )
      t < 0 && g === 0 && this[r + h + 1] !== 0 && (g = 1), this[r + h] = (t / p >> 0) - g & 255;
    return r + o;
  }, c.prototype.writeInt8 = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[r] = t & 255, r + 1;
  }, c.prototype.writeInt16LE = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 2, 32767, -32768), this[r] = t & 255, this[r + 1] = t >>> 8, r + 2;
  }, c.prototype.writeInt16BE = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 2, 32767, -32768), this[r] = t >>> 8, this[r + 1] = t & 255, r + 2;
  }, c.prototype.writeInt32LE = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 4, 2147483647, -2147483648), this[r] = t & 255, this[r + 1] = t >>> 8, this[r + 2] = t >>> 16, this[r + 3] = t >>> 24, r + 4;
  }, c.prototype.writeInt32BE = function(t, r, o) {
    return t = +t, r = r >>> 0, o || U(this, t, r, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = t & 255, r + 4;
  }, c.prototype.writeBigInt64LE = M(function(t, r = 0) {
    return Lt(this, t, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), c.prototype.writeBigInt64BE = M(function(t, r = 0) {
    return Ut(this, t, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function Rt(n, t, r, o, f, h) {
    if (r + o > n.length) throw new RangeError("Index out of range");
    if (r < 0) throw new RangeError("Index out of range");
  }
  function Tt(n, t, r, o, f) {
    return t = +t, r = r >>> 0, f || Rt(n, t, r, 4), i.write(n, t, r, o, 23, 4), r + 4;
  }
  c.prototype.writeFloatLE = function(t, r, o) {
    return Tt(this, t, r, !0, o);
  }, c.prototype.writeFloatBE = function(t, r, o) {
    return Tt(this, t, r, !1, o);
  };
  function qt(n, t, r, o, f) {
    return t = +t, r = r >>> 0, f || Rt(n, t, r, 8), i.write(n, t, r, o, 52, 8), r + 8;
  }
  c.prototype.writeDoubleLE = function(t, r, o) {
    return qt(this, t, r, !0, o);
  }, c.prototype.writeDoubleBE = function(t, r, o) {
    return qt(this, t, r, !1, o);
  }, c.prototype.copy = function(t, r, o, f) {
    if (!R(t, Uint8Array)) throw new TypeError("argument should be a Buffer");
    if (o || (o = 0), !f && f !== 0 && (f = this.length), r >= t.length && (r = t.length), r || (r = 0), f > 0 && f < o && (f = o), f === o || t.length === 0 || this.length === 0) return 0;
    if (r < 0)
      throw new RangeError("targetStart out of bounds");
    if (o < 0 || o >= this.length) throw new RangeError("Index out of range");
    if (f < 0) throw new RangeError("sourceEnd out of bounds");
    f > this.length && (f = this.length), t.length - r < f - o && (f = t.length - r + o);
    const h = f - o;
    return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(r, o, f) : Uint8Array.prototype.set.call(
      t,
      this.subarray(o, f),
      r
    ), h;
  }, c.prototype.fill = function(t, r, o, f) {
    if (typeof t == "string") {
      if (typeof r == "string" ? (f = r, r = 0, o = this.length) : typeof o == "string" && (f = o, o = this.length), f !== void 0 && typeof f != "string")
        throw new TypeError("encoding must be a string");
      if (typeof f == "string" && !c.isEncoding(f))
        throw new TypeError("Unknown encoding: " + f);
      if (t.length === 1) {
        const p = t.charCodeAt(0);
        (f === "utf8" && p < 128 || f === "latin1") && (t = p);
      }
    } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
    if (r < 0 || this.length < r || this.length < o)
      throw new RangeError("Out of range index");
    if (o <= r)
      return this;
    r = r >>> 0, o = o === void 0 ? this.length : o >>> 0, t || (t = 0);
    let h;
    if (typeof t == "number")
      for (h = r; h < o; ++h)
        this[h] = t;
    else {
      const p = R(t, Uint8Array) ? t : c.from(t, f), g = p.length;
      if (g === 0)
        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
      for (h = 0; h < o - r; ++h)
        this[h + r] = p[h % g];
    }
    return this;
  };
  const Y = {};
  function lt(n, t, r) {
    function o() {
      const f = new r(t.apply(null, arguments));
      return Object.setPrototypeOf(f, o.prototype), f.code = n, f.name = `${f.name} [${n}]`, Error.captureStackTrace && Error.captureStackTrace(f, o), f.stack, delete f.name, f;
    }
    Object.setPrototypeOf(o.prototype, r.prototype), Object.setPrototypeOf(o, r), o.prototype.toString = function() {
      return `${this.name} [${n}]: ${this.message}`;
    }, Y[n] = o;
  }
  lt(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(n) {
      return n ? `${n} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), lt(
    "ERR_INVALID_ARG_TYPE",
    function(n, t) {
      return `The "${n}" argument must be of type number. Received type ${typeof t}`;
    },
    TypeError
  ), lt(
    "ERR_OUT_OF_RANGE",
    function(n, t, r) {
      let o = `The value of "${n}" is out of range.`, f = r;
      return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? f = Dt(String(r)) : typeof r == "bigint" && (f = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (f = Dt(f)), f += "n"), o += ` It must be ${t}. Received ${f}`, o;
    },
    RangeError
  );
  function Dt(n) {
    let t = "", r = n.length;
    const o = n[0] === "-" ? 1 : 0;
    for (; r >= o + 4; r -= 3)
      t = `_${n.slice(r - 3, r)}${t}`;
    return `${n.slice(0, r)}${t}`;
  }
  function ge(n, t, r) {
    z(t, "offset"), (n[t] === void 0 || n[t + r] === void 0) && K(t, n.length - (r + 1));
  }
  function Nt(n, t, r, o, f, h) {
    if (n > r || n < t) {
      const p = typeof t == "bigint" ? "n" : "";
      let g;
      throw t === 0 || t === BigInt(0) ? g = `>= 0${p} and < 2${p} ** ${(h + 1) * 8}${p}` : g = `>= -(2${p} ** ${(h + 1) * 8 - 1}${p}) and < 2 ** ${(h + 1) * 8 - 1}${p}`, new Y.ERR_OUT_OF_RANGE("value", g, n);
    }
    ge(o, f, h);
  }
  function z(n, t) {
    if (typeof n != "number")
      throw new Y.ERR_INVALID_ARG_TYPE(t, "number", n);
  }
  function K(n, t, r) {
    throw Math.floor(n) !== n ? (z(n, r), new Y.ERR_OUT_OF_RANGE("offset", "an integer", n)) : t < 0 ? new Y.ERR_BUFFER_OUT_OF_BOUNDS() : new Y.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${t}`,
      n
    );
  }
  const Ie = /[^+/0-9A-Za-z-_]/g, Mt = "+", Ot = "/", Pt = "-", Qt = "_";
  function me(n) {
    return n.replaceAll(Pt, Mt).replaceAll(Qt, Ot);
  }
  function be(n) {
    return n.replaceAll(Mt, Pt).replaceAll(Ot, Qt);
  }
  function Be(n) {
    if (n = n.split("=")[0], n = n.trim().replace(Ie, ""), n.length < 2) return "";
    for (; n.length % 4 !== 0; )
      n = n + "=";
    return n;
  }
  function pt(n, t) {
    t = t || 1 / 0;
    let r;
    const o = n.length;
    let f = null;
    const h = [];
    for (let p = 0; p < o; ++p) {
      if (r = n.charCodeAt(p), r > 55295 && r < 57344) {
        if (!f) {
          if (r > 56319) {
            (t -= 3) > -1 && h.push(239, 191, 189);
            continue;
          } else if (p + 1 === o) {
            (t -= 3) > -1 && h.push(239, 191, 189);
            continue;
          }
          f = r;
          continue;
        }
        if (r < 56320) {
          (t -= 3) > -1 && h.push(239, 191, 189), f = r;
          continue;
        }
        r = (f - 55296 << 10 | r - 56320) + 65536;
      } else f && (t -= 3) > -1 && h.push(239, 191, 189);
      if (f = null, r < 128) {
        if ((t -= 1) < 0) break;
        h.push(r);
      } else if (r < 2048) {
        if ((t -= 2) < 0) break;
        h.push(
          r >> 6 | 192,
          r & 63 | 128
        );
      } else if (r < 65536) {
        if ((t -= 3) < 0) break;
        h.push(
          r >> 12 | 224,
          r >> 6 & 63 | 128,
          r & 63 | 128
        );
      } else if (r < 1114112) {
        if ((t -= 4) < 0) break;
        h.push(
          r >> 18 | 240,
          r >> 12 & 63 | 128,
          r >> 6 & 63 | 128,
          r & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return h;
  }
  function Ee(n) {
    const t = [];
    for (let r = 0; r < n.length; ++r)
      t.push(n.charCodeAt(r) & 255);
    return t;
  }
  function Ce(n, t) {
    let r, o, f;
    const h = [];
    for (let p = 0; p < n.length && !((t -= 2) < 0); ++p)
      r = n.charCodeAt(p), o = r >> 8, f = r % 256, h.push(f), h.push(o);
    return h;
  }
  function vt(n) {
    return e.toByteArray(Be(n));
  }
  function nt(n, t, r, o) {
    let f;
    for (f = 0; f < o && !(f + r >= t.length || f >= n.length); ++f)
      t[f + r] = n[f];
    return f;
  }
  function R(n, t) {
    return n instanceof t || n != null && n.constructor != null && n.constructor.name != null && n.constructor.name === t.name || t === Uint8Array && c.isBuffer(n);
  }
  function Gt(n) {
    return n !== n;
  }
  const xe = function() {
    const n = "0123456789abcdef", t = new Array(256);
    for (let r = 0; r < 16; ++r) {
      const o = r * 16;
      for (let f = 0; f < 16; ++f)
        t[o + f] = n[r] + n[f];
    }
    return t;
  }(), Wt = [
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
  function M(n) {
    return typeof BigInt > "u" ? Se : n;
  }
  function Se() {
    throw new Error("BigInt not supported");
  }
})(O);
class Ct {
  constructor() {
    w(this, "buffer", new Uint8Array(0));
  }
  write(e) {
    let i = new Uint8Array(this.buffer.length + e.length);
    i.set(this.buffer), i.set(e, this.buffer.length), this.buffer = i;
  }
}
class xt {
  /**
   * Create a new writer
   * @param stream The writable stream to write to
   * @param bufferSize The number of bytes to buffer before flushing onto the writable
   */
  constructor(e, i = 1) {
    w(this, "pendingByte", BigInt(0));
    w(this, "pendingBits", 0);
    w(this, "buffer");
    w(this, "bufferedBytes", 0);
    w(this, "_offset", 0);
    this.stream = e, this.bufferSize = i, this.buffer = new Uint8Array(i);
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
    this.bufferedBytes > 0 && (this.stream.write(O.Buffer.from(this.buffer.slice(0, this.bufferedBytes))), this.bufferedBytes = 0);
  }
  min(e, i) {
    return e < i ? e : i;
  }
  /**
   * Write the given number to the bitstream with the given bitlength. If the number is too large for the 
   * number of bits specified, the lower-order bits are written and the higher-order bits are ignored.
   * @param length The number of bits to write
   * @param value The number to write
   */
  write(e, i) {
    if (i == null && (i = 0), i = Number(i), Number.isNaN(i))
      throw new Error(`Cannot write to bitstream: Value ${i} is not a number`);
    if (!Number.isFinite(i))
      throw new Error(`Cannot write to bitstream: Value ${i} must be finite`);
    let s = BigInt(i % Math.pow(2, e)), a = e;
    for (; a > 0; ) {
      let u = BigInt(8 - this.pendingBits - a), d = u >= 0 ? s << u : s >> -u, y = Number(u >= 0 ? a : this.min(-u, BigInt(8 - this.pendingBits)));
      this.pendingByte = this.pendingByte | d, this.pendingBits += y, this._offset += y, a -= y, s = s % BigInt(Math.pow(2, a)), this.pendingBits === 8 && (this.finishByte(), this.bufferedBytes >= this.buffer.length && this.flush());
    }
  }
}
let st;
class St {
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
  set offset(e) {
    if (e < this._spentBufferSize)
      throw new Error(
        `Offset ${e} points into a discarded buffer! If you need to seek backwards outside the current buffer, make sure to set retainBuffers=true`
      );
    let i = e - this._spentBufferSize, s = 0;
    for (let a = 0, u = this.buffers.length; a < u; ++a) {
      let d = this.buffers[a], y = d.length * 8;
      if (i < y) {
        this._bufferIndex = s, this._offset = e, this._offsetIntoBuffer = i, this.bufferedLength = d.length * 8 - this._offsetIntoBuffer;
        for (let c = a + 1; c < u; ++c)
          this.bufferedLength += this.buffers[c].length * 8;
        return;
      }
      i -= y, ++s;
    }
  }
  /**
   * Run a function which can synchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  simulateSync(e) {
    let i = this.retainBuffers, s = this.offset;
    this.retainBuffers = !0;
    try {
      return e();
    } finally {
      this.retainBuffers = i, this.offset = s;
    }
  }
  /**
   * Run a function which can asynchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  async simulate(e) {
    let i = this.retainBuffers, s = this.offset;
    this.retainBuffers = !0;
    try {
      return await e();
    } finally {
      this.retainBuffers = i, this.offset = s;
    }
  }
  /**
   * Remove any fully used up buffers. Only has an effect if retainBuffers is true.
   * Optional `count` parameter lets you control how many buffers can be freed.
   */
  clean(e) {
    let i = e !== void 0 ? Math.min(e, this._bufferIndex) : this._bufferIndex;
    for (let s = 0, a = i; s < a; ++s)
      this._spentBufferSize += this.buffers[0].length * 8, this.buffers.shift();
    this._bufferIndex -= i;
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
  isAvailable(e) {
    return this.bufferedLength >= e;
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
  async readString(e, i) {
    return this.ensureNoReadPending(), await this.assure(8 * e), this.readStringSync(e, i);
  }
  /**
   * Synchronously read the given number of bytes, encode it into a string, and return the result,
   * optionally using a specific text encoding.
   * @param length The number of bytes to read
   * @param options A set of options to control conversion into a string. @see StringEncodingOptions
   * @returns The resulting string
   */
  readStringSync(e, i) {
    i || (i = {}), this.ensureNoReadPending();
    let s = new Uint8Array(e), a = -1, u = 1, d = i.encoding ?? "utf-8";
    ["utf16le", "ucs-2", "ucs2"].includes(d) && (u = 2);
    for (let y = 0, c = e; y < c; ++y)
      s[y] = this.readSync(8);
    for (let y = 0, c = e; y < c; y += u) {
      let I = s[y];
      if (u === 2 && (I = I << 8 | (s[y + 1] ?? 0)), I === 0) {
        a = y;
        break;
      }
    }
    if (i.nullTerminated !== !1 && a >= 0 && (s = s.subarray(0, a)), d === "utf-8")
      return this.textDecoder.decode(s);
    if (typeof Buffer > "u")
      throw new Error(`Encoding '${d}' is not supported: No Node.js Buffer implementation and TextDecoder only supports utf-8`);
    return Buffer.from(s).toString(d);
  }
  /**
   * Read a number of the given bitlength synchronously without advancing
   * the read head.
   * @param length The number of bits to read
   * @returns The number read from the bitstream
   */
  peekSync(e) {
    return this.readCoreSync(e, !1);
  }
  /**
   * Skip the given number of bits. 
   * @param length The number of bits to skip
   */
  skip(e) {
    this.skippedLength += e;
  }
  /**
   * Read an unsigned integer of the given bit length synchronously. If there are not enough 
   * bits available, an error is thrown.
   * 
   * @param length The number of bits to read
   * @returns The unsigned integer that was read
   */
  readSync(e) {
    return this.readCoreSync(e, !0);
  }
  /**
   * Read a number of bytes from the stream. Returns a generator that ends when the read is complete,
   * and yields a number of *bytes* still to be read (not bits like in other read methods)
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  *readBytes(e, i = 0, s) {
    var u;
    if (s ?? (s = e.length - i), this._offsetIntoBuffer % 8 === 0) {
      globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    Byte-aligned readBytes(), length=${s}`), console.log(`------------------------------------------------------------    readBytes(): Pre-operation: buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferLength=${((u = this.buffers[this._bufferIndex]) == null ? void 0 : u.length) || "<none>"} bufferCount=${this.buffers.length}`));
      let d = s, y = 0;
      for (; d > 0; ) {
        this.available < d * 8 && (yield Math.max((d * 8 - this.available) / 8));
        let c = Math.floor(this._offsetIntoBuffer / 8), I = this.buffers[this._bufferIndex], b = Math.min(d, I.length);
        for (let x = 0; x < b; ++x)
          e[y + x] = I[c + x];
        y += b;
        let B = b * 8;
        this.consume(B), d -= B, globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    readBytes(): consumed=${b} bytes, remaining=${d}`), console.log(`------------------------------------------------------------    readBytes(): buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferCount=${this.buffers.length}`));
      }
    } else
      for (let d = i, y = Math.min(e.length, i + s); d < y; ++d)
        this.isAvailable(8) || (yield y - d), e[d] = this.readSync(8);
    return e;
  }
  /**
   * Read a number of bytes from the stream synchronously. If not enough bytes are available, an 
   * exception is thrown.
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  readBytesSync(e, i = 0, s) {
    s ?? (s = e.length - i);
    let a = this.readBytes(e, i, s);
    for (; ; ) {
      if (a.next().done === !1)
        throw new Error(`underrun: Not enough bits are available (requested ${s} bytes)`);
      break;
    }
    return e;
  }
  /**
   * Read a number of bytes from the stream. Blocks and waits for more bytes if not enough bytes are available.
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  async readBytesBlocking(e, i = 0, s) {
    s ?? (s = e.length - i);
    let a = this.readBytes(e, i, s);
    for (; ; ) {
      let u = a.next();
      if (u.done === !1)
        await this.assure(u.value * 8);
      else
        break;
    }
    return e;
  }
  /**
   * Read a two's complement signed integer of the given bit length synchronously. If there are not
   * enough bits available, an error is thrown.
   * 
   * @param length The number of bits to read
   * @returns The signed integer that was read
   */
  readSignedSync(e) {
    const i = this.readSync(e), s = 2 ** (e - 1), a = s - 1;
    return i & s ? -((~(i - 1) & a) >>> 0) : i;
  }
  maskOf(e) {
    if (!st) {
      st = /* @__PURE__ */ new Map();
      for (let i = 0; i <= 64; ++i)
        st.set(i, Math.pow(2, i) - 1);
    }
    return st.get(e) ?? Math.pow(2, e) - 1;
  }
  /**
   * Read an IEEE 754 floating point value with the given bit length (32 or 64). If there are not 
   * enough bits available, an error is thrown.
   * 
   * @param length Must be 32 for 32-bit single-precision or 64 for 64-bit double-precision. All
   *        other values result in TypeError
   * @returns The floating point value that was read
   */
  readFloatSync(e) {
    if (e !== 32 && e !== 64)
      throw new TypeError(`Invalid length (${e} bits) Only 4-byte (32 bit / single-precision) and 8-byte (64 bit / double-precision) IEEE 754 values are supported`);
    if (!this.isAvailable(e))
      throw new Error(`underrun: Not enough bits are available (requested=${e}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    let i = new ArrayBuffer(e / 8), s = new DataView(i);
    for (let a = 0, u = i.byteLength; a < u; ++a)
      s.setUint8(a, this.readSync(8));
    if (e === 32)
      return s.getFloat32(0, !1);
    if (e === 64)
      return s.getFloat64(0, !1);
    throw new TypeError(`Invalid length (${e} bits) Only 4-byte (32 bit / single-precision) and 8-byte (64 bit / double-precision) IEEE 754 values are supported`);
  }
  readByteAligned(e) {
    let i = this.buffers[this._bufferIndex], s = i[this._offsetIntoBuffer / 8];
    return e && (this.bufferedLength -= 8, this._offsetIntoBuffer += 8, this._offset += 8, this._offsetIntoBuffer >= i.length * 8 && (this._bufferIndex += 1, this._offsetIntoBuffer = 0, this.retainBuffers || this.clean())), s;
  }
  consume(e) {
    this.bufferedLength -= e, this._offsetIntoBuffer += e, this._offset += e;
    let i = this.buffers[this._bufferIndex];
    for (; i && this._offsetIntoBuffer >= i.length * 8; )
      this._bufferIndex += 1, this._offsetIntoBuffer -= i.length * 8, i = this.buffers[this._bufferIndex], this.retainBuffers || this.clean();
  }
  readShortByteAligned(e, i) {
    let s = this.buffers[this._bufferIndex], a = this._offsetIntoBuffer / 8, u = s[a], d;
    if (a + 1 >= s.length ? d = this.buffers[this._bufferIndex + 1][0] : d = s[a + 1], e && this.consume(16), i === "lsb") {
      let y = u;
      u = d, d = y;
    }
    return u << 8 | d;
  }
  readLongByteAligned(e, i) {
    let s = this._bufferIndex, a = this.buffers[s], u = this._offsetIntoBuffer / 8, d = a[u++];
    u >= a.length && (a = this.buffers[++s], u = 0);
    let y = a[u++];
    u >= a.length && (a = this.buffers[++s], u = 0);
    let c = a[u++];
    u >= a.length && (a = this.buffers[++s], u = 0);
    let I = a[u++];
    u >= a.length && (a = this.buffers[++s], u = 0), e && this.consume(32);
    let b = (d & 128) !== 0;
    if (d &= -129, i === "lsb") {
      let x = I, _ = c, k = y, P = d;
      d = x, y = _, c = k, I = P;
    }
    let B = d << 24 | y << 16 | c << 8 | I;
    return b && (B += 2 ** 31), B;
  }
  read3ByteAligned(e, i) {
    let s = this._bufferIndex, a = this.buffers[s], u = this._offsetIntoBuffer / 8, d = a[u++];
    u >= a.length && (a = this.buffers[++s], u = 0);
    let y = a[u++];
    u >= a.length && (a = this.buffers[++s], u = 0);
    let c = a[u++];
    if (u >= a.length && (a = this.buffers[++s], u = 0), e && this.consume(24), i === "lsb") {
      let I = d;
      d = c, c = I;
    }
    return d << 16 | y << 8 | c;
  }
  readPartialByte(e, i) {
    let a = this.buffers[this._bufferIndex][Math.floor(this._offsetIntoBuffer / 8)], u = this._offsetIntoBuffer % 8 | 0;
    return i && this.consume(e), a >> 8 - e - u & this.maskOf(e) | 0;
  }
  /**
   * @param length 
   * @param consume 
   * @param byteOrder The byte order to use when the length is greater than 8 and is a multiple of 8. 
   *                  Defaults to MSB (most significant byte). If the length is not a multiple of 8, 
   *                  this is unused
   * @returns 
   */
  readCoreSync(e, i, s = "msb") {
    if (this.ensureNoReadPending(), this.available < e)
      throw new Error(`underrun: Not enough bits are available (requested=${e}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    this.adjustSkip();
    let a = this._offsetIntoBuffer % 8;
    if (a === 0) {
      if (e === 8)
        return this.readByteAligned(i);
      if (e === 16)
        return this.readShortByteAligned(i, s);
      if (e === 24)
        return this.read3ByteAligned(i, s);
      if (e === 32)
        return this.readLongByteAligned(i, s);
    }
    if (e < 8 && (8 - a | 0) >= e)
      return this.readPartialByte(e, i);
    let u = e, d = this._offsetIntoBuffer, y = this._bufferIndex, c = BigInt(0), I = 0, b = e > 31;
    for (; u > 0; ) {
      if (y >= this.buffers.length)
        throw new Error(`Internal error: Buffer index out of range (index=${y}, count=${this.buffers.length}), offset=${this.offset}, readLength=${e}, available=${this.available})`);
      let B = this.buffers[y], x = Math.floor(d / 8);
      if (x >= B.length)
        throw new Error(`Internal error: Current buffer (index ${y}) has length ${B.length} but our position within the buffer is ${x}! offset=${this.offset}, bufs=${this.buffers.length}`);
      let _ = d % 8, k, P = B[x];
      k = Math.min(8 - _, u), b ? c = c << BigInt(k) | BigInt(B[x]) >> BigInt(8) - BigInt(k) - BigInt(_) & BigInt(this.maskOf(k)) : I = I << k | P >> 8 - k - _ & this.maskOf(k), d += k, u -= k | 0, d >= B.length * 8 && (y += 1, d = 0);
    }
    return i && this.consume(e), b ? Number(c) : I;
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
  assure(e, i = !1) {
    return this.ensureNoReadPending(), this.bufferedLength >= e ? Promise.resolve() : this.block({ length: e, assure: !0 }).then((s) => {
      if (s < e && !i)
        throw this.endOfStreamError(e);
    });
  }
  /**
   * Read an unsigned integer with the given bit length, waiting until enough bits are 
   * available for the operation. 
   * 
   * @param length The number of bits to read
   * @returns A promise which resolves to the unsigned integer once it is read
   */
  read(e) {
    return this.ensureNoReadPending(), this.available >= e ? Promise.resolve(this.readSync(e)) : this.block({ length: e });
  }
  /**
   * Read a two's complement signed integer with the given bit length, waiting until enough bits are 
   * available for the operation. 
   * 
   * @param length The number of bits to read
   * @returns A promise which resolves to the signed integer value once it is read
   */
  readSigned(e) {
    return this.ensureNoReadPending(), this.available >= e ? Promise.resolve(this.readSignedSync(e)) : this.block({ length: e, signed: !0 });
  }
  promise() {
    let e = () => {
    }, i = () => {
    };
    return { promise: new Promise((a, u) => (e = a, i = u)), resolve: e, reject: i };
  }
  block(e) {
    return this._ended ? e.assure ? Promise.resolve(this.available) : Promise.reject(this.endOfStreamError(e.length)) : (this.blockedRequest = {
      ...e,
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
  readFloat(e) {
    return this.ensureNoReadPending(), this.available >= e ? Promise.resolve(this.readFloatSync(e)) : this.block({ length: e, float: !0 });
  }
  /**
   * Asynchronously read a number of the given bitlength without advancing the read head.
   * @param length The number of bits to read. If there are not enough bits available 
   * to complete the operation, the operation is delayed until enough bits become available.
   * @returns A promise which resolves iwth the number read from the bitstream
   */
  async peek(e) {
    return await this.assure(e), this.peekSync(e);
  }
  /**
   * Add a buffer onto the end of the bitstream.
   * @param buffer The buffer to add to the bitstream
   */
  addBuffer(e) {
    if (this._ended)
      throw new Error("Cannot add buffers to a reader which has been marked as ended without calling reset() first");
    if (this.buffers.push(e), this.bufferedLength += e.length * 8, this.blockedRequest && this.blockedRequest.length <= this.available) {
      let i = this.blockedRequest;
      this.blockedRequest = null, i.assure ? i.resolve(i.length) : i.signed ? i.resolve(this.readSignedSync(i.length)) : i.float ? i.resolve(this.readFloatSync(i.length)) : i.resolve(this.readSync(i.length));
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
      let e = this.blockedRequest;
      if (this.blockedRequest = null, e.length <= this.available)
        throw new Error("Internal inconsistency in @/bitstream: Should have granted request prior. Please report this bug.");
      e.assure ? e.resolve(this.available) : e.reject(this.endOfStreamError(e.length));
    }
  }
  endOfStreamError(e) {
    return new Error(`End of stream reached while reading ${e} bits, only ${this.available} bits are left in the stream`);
  }
}
function tr(l) {
  const i = l.split(`
`).flatMap((d) => {
    const y = d.trim().match(/^(\d+) (\w+)$/);
    return y && parseInt(y[1], 10) > 0 ? [{ quantity: parseInt(y[1], 10), id: y[2] }] : [];
  }), s = new Ct(), a = new xt(s, 1024);
  return te.fromList(i).encode(a), a.end(), O.Buffer.concat([s.buffer]).toString("base64url");
}
function er(l) {
  const e = O.Buffer.from(l, "base64url");
  let i = new St();
  return i.addBuffer(e), te.decode(i).asCardRefQty.map((u) => `${u.quantity} ${u.id}`).join(`
`);
}
function rr(l) {
  const i = l.split(`
`).flatMap((d) => {
    const y = d.trim().match(/^(\d+) (\w+)$/);
    return y && parseInt(y[1], 10) > 0 ? [{ quantity: parseInt(y[1], 10), id: y[2] }] : [];
  }), s = new Ct(), a = new xt(s, 1024);
  return ee.fromList(i).encode(a), a.end(), O.Buffer.concat([s.buffer]).toString("base64url");
}
function ir(l) {
  const e = O.Buffer.from(l, "base64url");
  let i = new St();
  return i.addBuffer(e), ee.decode(i).asCardRefQty.map((u) => `${u.quantity} ${u.id}`).join(`
`);
}
function nr(l) {
  const i = l.split(`
`).flatMap((d) => {
    const y = d.trim().match(/^(\d+) (\w+)$/);
    return y && parseInt(y[1], 10) > 0 ? [{ quantity: parseInt(y[1], 10), id: y[2] }] : [];
  }), s = new Ct(), a = new xt(s, 1024);
  return X.fromList(i).encode(a), a.end(), O.Buffer.concat([s.buffer]).toString("base64url");
}
function sr(l) {
  const e = O.Buffer.from(l, "base64url");
  let i = new St();
  return i.addBuffer(e), X.decode(i).asCardRefQty.map((u) => `${u.quantity} ${u.id}`).join(`
`);
}
export {
  er as decodeList,
  ir as decodeListV2,
  sr as decodeListV3,
  tr as encodeList,
  rr as encodeListV2,
  nr as encodeListV3
};
