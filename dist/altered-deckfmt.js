var de = Object.defineProperty;
var pe = (h, r, n) => r in h ? de(h, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : h[r] = n;
var w = (h, r, n) => pe(h, typeof r != "symbol" ? r + "" : r, n);
var H = /* @__PURE__ */ ((h) => (h.Booster = "B", h.Promo = "P", h.AltArt = "A", h))(H || {}), R = /* @__PURE__ */ ((h) => (h.Axiom = "AX", h.Bravos = "BR", h.Lyra = "LY", h.Muna = "MU", h.Ordis = "OR", h.Yzmir = "YZ", h.Neutral = "NE", h))(R || {}), q = /* @__PURE__ */ ((h) => (h.Common = "C", h.Rare = "R1", h.RareOOF = "R2", h.Unique = "U", h.Exalt = "E", h))(q || {}), L = /* @__PURE__ */ ((h) => (h.CoreKS = "COREKS", h.Core = "CORE", h.Alize = "ALIZE", h.Bise = "BISE", h.TumultS3 = "TCS3", h.WCQualifier25 = "WCQ25", h.WCSeries25 = "WCS25", h.Cyclone = "CYCLONE", h.Duster = "DUSTER", h.DusterTOP = "DUSTERTOP", h.DusterCB = "DUSTERCB", h.DusterOP = "DUSTEROP", h))(L || {});
const ye = {
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
class pt {
  constructor(r) {
    // Raw set name token from the ID (e.g. "CORE", "DUSTEROP").
    // Prefer this over the RefSetCode enum, which only covers a fixed set list.
    w(this, "set_code_name");
    w(this, "set_code");
    w(this, "product");
    w(this, "faction");
    w(this, "num_in_faction");
    w(this, "rarity");
    w(this, "uniq_num");
    const n = r.match(/^ALT_(\w+)_(A|B|P)_(\w{2})_(\d+)_(C|R1|R2|U|E)(?:_(\d+))?$/);
    if (!n)
      throw "unrecognized card id '" + r + "'";
    if (this.set_code_name = n[1], this.set_code = n[1], this.product = n[2], this.faction = n[3], this.num_in_faction = parseInt(n[4], 10), this.rarity = n[5], this.uniq_num = n[6] ? parseInt(n[6]) : void 0, this.rarity == "U" && this.uniq_num == null)
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
    const r = ye[this.set_code_name];
    if (r !== void 0)
      return r;
    throw `Unrecognized SetCode ${this.set_code_name}`;
  }
}
const ct = {
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
}, qt = [
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
class X {
  constructor() {
    w(this, "setCode");
    w(this, "product");
    w(this, "faction");
    w(this, "numberInFaction");
    w(this, "rarity");
    w(this, "uniqueId");
  }
  static decode(r, n) {
    const s = new X();
    if (n.setCode === void 0)
      throw new W("Tried to decode Card without SetCode in context");
    if (s.setCode = n.setCode, r.readSync(1) == 1)
      s.product = null;
    else if (s.product = r.readSync(2), s.product == 0 || s.product == 3)
      throw new W(`Invalid product ID (${s.product})`);
    if (s.faction = r.readSync(3), s.faction == 0)
      throw new W(`Invalid faction ID (${s.faction})`);
    const l = ct[s.setCode];
    if (l == null)
      throw new W(`Invalid set code (${s.setCode}) @${r.offset}`);
    s.numberInFaction = r.readSync(l);
    const d = qt.includes(s.setCode) ? 2 : 3;
    return s.rarity = r.readSync(d), s.rarity == 3 && (s.uniqueId = r.readSync(16)), s;
  }
  encode(r) {
    this.product == null ? r.write(1, 1) : (r.write(1, 0), r.write(2, this.product)), r.write(3, this.faction);
    const n = ct[this.setCode];
    if (n == null)
      throw new K(`Invalid set code (${this.setCode})`);
    if (this.numberInFaction >= 1 << n)
      throw new K(`Family ID out of range (${this.numberInFaction}) for set ${this.setCode} (max: ${1 << n - 1})`);
    r.write(n, this.numberInFaction);
    const s = qt.includes(this.setCode) ? 2 : 3;
    if (r.write(s, this.rarity), this.uniqueId !== void 0) {
      if (this.uniqueId > 65535)
        throw new K("Cannot encode unique ID greater than 65535");
      r.write(16, this.uniqueId);
    }
  }
  get asCardId() {
    let r = "ALT_";
    switch (this.setCode) {
      case 1:
        r += L.CoreKS;
        break;
      case 2:
        r += L.Core;
        break;
      case 3:
        r += L.Alize;
        break;
      case 4:
        r += L.Bise;
        break;
      case 5:
        r += L.TumultS3;
        break;
      case 6:
        r += L.WCQualifier25;
        break;
      case 7:
        r += L.WCSeries25;
        break;
      case 8:
        r += L.Cyclone;
        break;
      case 9:
        r += L.Duster;
        break;
      case 10:
        r += L.DusterTOP;
        break;
      case 11:
        r += L.DusterCB;
        break;
      case 12:
        r += L.DusterOP;
        break;
    }
    switch (r += "_", this.product) {
      case null:
        r += H.Booster;
        break;
      case 1:
        r += H.Promo;
        break;
      case 2:
        r += H.AltArt;
        break;
    }
    switch (r += "_", this.faction) {
      case 1:
        r += R.Axiom;
        break;
      case 2:
        r += R.Bravos;
        break;
      case 3:
        r += R.Lyra;
        break;
      case 4:
        r += R.Muna;
        break;
      case 5:
        r += R.Ordis;
        break;
      case 6:
        r += R.Yzmir;
        break;
      case 7:
        r += R.Neutral;
        break;
    }
    switch (r += "_", this.numberInFaction < 10 && !(this.faction == 7 && (this.setCode == 1 || this.setCode == 2)) && (r += "0"), r += this.numberInFaction, r += "_", this.rarity) {
      case 0:
        r += q.Common;
        break;
      case 1:
        r += q.Rare;
        break;
      case 2:
        r += q.RareOOF;
        break;
      case 3:
        r += q.Unique + "_" + this.uniqueId;
        break;
      case 4:
        r += q.Exalt;
        break;
    }
    return r;
  }
  static fromId(r) {
    let n = new X(), s = new pt(r);
    return n.setCode = s.setId, n.product = s.productId, n.faction = s.factionId, n.numberInFaction = s.num_in_faction, n.rarity = s.rarityId, n.uniqueId = s.uniq_num, n;
  }
}
class Z {
  constructor() {
    w(this, "quantity");
    // VLE: 2 (+6) bits
    w(this, "card");
  }
  static decode(r, n) {
    const s = new Z(), a = r.readSync(2);
    if (a > 0)
      s.quantity = a;
    else {
      const l = r.readSync(6);
      s.quantity = l == 0 ? 0 : l + 3;
    }
    return s.card = X.decode(r, n), s;
  }
  encode(r) {
    if (this.quantity > 0 && this.quantity <= 3)
      r.write(2, this.quantity);
    else if (this.quantity > 3) {
      if (this.quantity > 65)
        throw new K(`Cannot encode card quantity (${this.quantity}) greater than 65`);
      r.write(2, 0), r.write(6, this.quantity - 3);
    } else
      r.write(8, 0);
    this.card.encode(r);
  }
  get asCardRefQty() {
    return {
      quantity: this.quantity,
      id: this.card.asCardId
    };
  }
  static from(r, n) {
    let s = new Z();
    return s.quantity = r, s.card = X.fromId(n), s;
  }
}
class Y {
  constructor() {
    w(this, "setCode");
    // 8 bits
    w(this, "cardQty");
  }
  // count: 6 bits
  static decode(r, n) {
    const s = new Y();
    if (s.setCode = r.readSync(8), !Y.isValidSetCode(s.setCode))
      throw new W(`Invalid SetCode ID (${s.setCode}) @offset=${r.offset}`);
    n.setCode = s.setCode;
    const a = r.readSync(6), l = new Array();
    for (let d = 0; d < a; d++)
      l.push(Z.decode(r, n));
    return s.cardQty = l, n.setCode = void 0, s;
  }
  encode(r) {
    if (this.cardQty.length <= 0)
      throw new K("Cannot encode a SetGroup with 0 cards");
    const n = this.cardQty[0].card.setCode;
    r.write(8, n), r.write(6, this.cardQty.length);
    for (let s of this.cardQty)
      s.encode(r);
  }
  static from(r) {
    let n = new Y();
    return n.cardQty = r.map((s) => Z.from(s.quantity, s.id)), n;
  }
  static isValidSetCode(r) {
    return ct[r] !== void 0;
  }
}
class z {
  constructor() {
    w(this, "version");
    // 4 bits
    w(this, "setGroups");
  }
  // count: 8 bits
  static decode(r) {
    const n = new z(), s = new ge();
    if (n.version = r.readSync(4), n.version !== 1)
      throw new W(`Invalid version (${n.version}`);
    const a = r.readSync(8), l = new Array();
    for (let d = 0; d < a; d++)
      l.push(Y.decode(r, s));
    return n.setGroups = l, n;
  }
  encode(r) {
    r.write(4, this.version), r.write(8, this.setGroups.length);
    for (let n of this.setGroups)
      n.encode(r);
    if (r.offset % 8 > 0) {
      const n = 8 - r.offset % 8;
      r.write(n, 0);
    }
  }
  get asCardRefQty() {
    return this.setGroups.reduce((r, n) => r.concat(n.cardQty.map((s) => s.asCardRefQty)), Array());
  }
  static fromList(r) {
    const n = z.groupedBySet(r).map((a) => we(a, 63).map((d) => Y.from(d)));
    let s = new z();
    return s.version = 1, s.setGroups = n.flat(), s;
  }
  static groupedBySet(r) {
    let n = /* @__PURE__ */ new Map();
    for (let s of r) {
      const a = new pt(s.id).set_code;
      let l = n.get(a);
      l || (l = [], n.set(a, l)), l.push(s);
    }
    return Array.from(n, ([s, a]) => a);
  }
}
function we(h, r) {
  let n = [];
  for (let s = 0; s < h.length; s += r)
    n.push(h.slice(s, s + r));
  return n;
}
class ge {
  constructor() {
    w(this, "setCode");
  }
}
let W = class extends Error {
  constructor(r) {
    super(r), this.name = "DecodingError";
  }
}, K = class extends Error {
  constructor(r) {
    super(r), this.name = "EncodingError";
  }
};
const Ot = ["CORE", "ALIZE", "BISE", "CYCLONE", "DUSTER", "EOLE", "FUGUE"], Be = [
  // CORE — 187 families, 7 ranges
  { dualCoreCoreks: 1, ranges: [[1, 1, 31], [2, 1, 31], [3, 1, 30], [4, 1, 30], [5, 1, 32], [6, 1, 31], [7, 0, 1]] },
  // ALIZE — 93 families, 7 ranges
  { dualCoreCoreks: 0, ranges: [[1, 32, 46], [2, 32, 46], [3, 31, 45], [4, 31, 45], [5, 33, 48], [6, 32, 47], [7, 2, 2]] },
  // BISE — 91 families, 6 ranges
  { dualCoreCoreks: 0, ranges: [[1, 49, 63], [2, 49, 64], [3, 49, 63], [4, 49, 63], [5, 49, 63], [6, 49, 63]] },
  // CYCLONE — 111 families, 7 ranges
  { dualCoreCoreks: 0, ranges: [[1, 65, 82], [2, 65, 83], [3, 65, 82], [4, 65, 83], [5, 65, 82], [6, 65, 82], [7, 3, 3]] },
  // DUSTER — 106 families, 7 ranges
  { dualCoreCoreks: 0, ranges: [[1, 85, 102], [2, 86, 102], [3, 86, 102], [4, 85, 102], [5, 85, 102], [6, 86, 102], [7, 4, 4]] },
  // EOLE — 106 families, 6 ranges
  { dualCoreCoreks: 0, ranges: [[1, 106, 122], [2, 105, 123], [3, 105, 122], [4, 106, 122], [5, 106, 122], [6, 105, 122]] },
  // FUGUE — 114 families, 6 ranges
  { dualCoreCoreks: 0, ranges: [[1, 130, 148], [2, 130, 148], [3, 130, 148], [4, 130, 148], [5, 130, 148], [6, 130, 148]] }
];
function lt(h, r) {
  for (let n = 0; n < Ot.length; n++) {
    const { dualCoreCoreks: s, ranges: a } = Be[n];
    for (const [l, d, y] of a)
      if (h === l && r >= d && r <= y)
        return {
          canonicalSet: Ot[n],
          dualCoreCoreks: s === 1
        };
  }
}
const dt = 63, Nt = 2;
function be(h) {
  if (h === 4)
    return 0;
  if (h < 0 || h > 3)
    throw new k(`Invalid rarity ID (${h})`);
  return h;
}
function me(h, r) {
  const n = h.uniq_num;
  if (n === void 0)
    throw new k(`Unique card is missing unique_id (${h})`);
  if (r.dualCoreCoreks) {
    if (n < 1 || n > 32767)
      throw new k(`Unique ID out of range for dual CORE/COREKS family (${n})`);
    const s = h.set_code_name === "COREKS" ? 1 : 0;
    return n << 1 | s;
  }
  if (n < 1 || n > 65535)
    throw new k(`Unique ID out of range (${n})`);
  return n;
}
function Mt(h, r) {
  if (r.dualCoreCoreks) {
    const n = h & 1, s = h >> 1;
    if (s < 1)
      throw new N(`Invalid dual-family unique_id (${s})`);
    return { uniqueId: s, setName: n ? "COREKS" : "CORE" };
  }
  if (h < 1)
    throw new N(`Invalid unique_id (${h})`);
  return { uniqueId: h, setName: r.canonicalSet };
}
function Ie(h, r, n, s) {
  const a = lt(h, r);
  if (!a)
    throw new N(`Unknown family (faction=${h}, nif=${r})`);
  if (n === 3) {
    if (s === void 0)
      throw new N("Missing unique word for unique card");
    return Mt(s, a).setName;
  }
  return a.canonicalSet;
}
class J {
  constructor() {
    w(this, "faction");
    w(this, "numberInFaction");
    w(this, "wireRarity");
    w(this, "uniqueWord");
  }
  static decode(r, n) {
    const s = new J();
    s.faction = n;
    const a = r.readSync(8);
    if (s.numberInFaction = a + 1, s.numberInFaction < 1)
      throw new N(`Invalid number_in_faction (${s.numberInFaction})`);
    if (s.wireRarity = r.readSync(2), s.wireRarity > 3)
      throw new N(`Invalid rarity (${s.wireRarity})`);
    return s.wireRarity === 3 && (s.uniqueWord = r.readSync(16)), s;
  }
  encode(r) {
    if (this.faction < 1 || this.faction > 7)
      throw new k(`Invalid faction ID (${this.faction})`);
    if (this.numberInFaction < 1 || this.numberInFaction > 256)
      throw new k(`Number in faction out of range (${this.numberInFaction})`);
    if (this.wireRarity > 3)
      throw new k(`Invalid wire rarity (${this.wireRarity})`);
    if (r.write(8, this.numberInFaction - 1), r.write(2, this.wireRarity), this.wireRarity === 3) {
      if (this.uniqueWord === void 0)
        throw new k("Missing unique word for unique card");
      if (this.uniqueWord > 65535)
        throw new k("Cannot encode unique word greater than 65535");
      r.write(16, this.uniqueWord);
    }
  }
  get asCardId() {
    const r = Ie(this.faction, this.numberInFaction, this.wireRarity, this.uniqueWord);
    let n = "ALT_";
    switch (n += r, n += "_", n += H.Booster, n += "_", this.faction) {
      case 1:
        n += R.Axiom;
        break;
      case 2:
        n += R.Bravos;
        break;
      case 3:
        n += R.Lyra;
        break;
      case 4:
        n += R.Muna;
        break;
      case 5:
        n += R.Ordis;
        break;
      case 6:
        n += R.Yzmir;
        break;
      case 7:
        n += R.Neutral;
        break;
      default:
        throw new k(`Invalid faction ID (${this.faction})`);
    }
    switch (n += "_", this.numberInFaction < 10 && !(this.faction === 7 && (r === "CORE" || r === "COREKS")) && (n += "0"), n += this.numberInFaction, n += "_", this.wireRarity) {
      case 0:
        n += q.Common;
        break;
      case 1:
        n += q.Rare;
        break;
      case 2:
        n += q.RareOOF;
        break;
      case 3: {
        const s = lt(this.faction, this.numberInFaction);
        if (!s || this.uniqueWord === void 0)
          throw new k("Missing family metadata for unique card");
        const { uniqueId: a } = Mt(this.uniqueWord, s);
        n += q.Unique + "_" + a;
        break;
      }
      default:
        throw new k(`Invalid wire rarity (${this.wireRarity})`);
    }
    return n;
  }
  static fromId(r) {
    const n = new pt(r), s = lt(n.factionId, n.num_in_faction);
    if (!s)
      throw new k(`Unknown family for card id '${r}'`);
    const a = new J();
    return a.faction = n.factionId, a.numberInFaction = n.num_in_faction, a.wireRarity = be(n.rarityId), a.wireRarity === 3 && (a.uniqueWord = me(n, s)), a;
  }
}
class tt {
  constructor() {
    w(this, "quantity");
    w(this, "entry");
  }
  static decode(r, n, s) {
    const a = new tt();
    if (n)
      a.quantity = 1;
    else {
      const l = r.readSync(2);
      if (l > 0)
        a.quantity = l;
      else {
        const d = r.readSync(6);
        a.quantity = d === 0 ? 0 : d + 3;
      }
    }
    return a.entry = J.decode(r, s), a;
  }
  encode(r, n) {
    if (!n)
      if (this.quantity > 0 && this.quantity <= 3)
        r.write(2, this.quantity);
      else if (this.quantity > 3) {
        if (this.quantity > 65)
          throw new k(`Cannot encode card quantity (${this.quantity}) greater than 65`);
        r.write(2, 0), r.write(6, this.quantity - 3);
      } else
        r.write(8, 0);
    this.entry.encode(r);
  }
  get asCardRefQty() {
    return { quantity: this.quantity, id: this.entry.asCardId };
  }
  static from(r, n) {
    const s = new tt();
    return s.quantity = r, s.entry = J.fromId(n), s;
  }
}
class et {
  constructor() {
    w(this, "factionId");
    w(this, "entries");
  }
  static decode(r, n) {
    const s = new et();
    if (s.factionId = r.readSync(3), s.factionId === 0)
      throw new N(`Invalid faction ID (${s.factionId})`);
    const a = r.readSync(6);
    if (a < 1)
      throw new N(`Invalid refs_count (${a})`);
    const l = new Array();
    for (let d = 0; d < a; d++)
      l.push(tt.decode(r, n, s.factionId));
    return s.entries = l, s;
  }
  encode(r, n) {
    if (this.entries.length <= 0)
      throw new k("Cannot encode a FactionGroup with 0 entries");
    if (this.entries.length > dt)
      throw new k(
        `FactionGroup exceeds max refs (${this.entries.length} > ${dt})`
      );
    r.write(3, this.factionId), r.write(6, this.entries.length);
    for (const s of this.entries)
      s.encode(r, n);
  }
  static from(r) {
    const n = new et();
    return n.entries = r, n.factionId = r[0].entry.faction, n;
  }
}
class rt {
  constructor() {
    w(this, "version");
    w(this, "allQtyOne");
    w(this, "factionGroups");
  }
  static decode(r) {
    const n = new rt();
    if (n.version = r.readSync(4), n.version !== Nt)
      throw new N(`Invalid version (${n.version})`);
    const s = r.readSync(8);
    n.allQtyOne = r.readSync(1) === 1;
    const a = r.readSync(1), l = r.readSync(2);
    if (a !== 0 || l !== 0)
      throw new N("Invalid reserved header bits");
    const d = new Array();
    for (let y = 0; y < s; y++)
      d.push(et.decode(r, n.allQtyOne));
    return n.factionGroups = d, n;
  }
  encode(r) {
    r.write(4, this.version), r.write(8, this.factionGroups.length), r.write(1, this.allQtyOne ? 1 : 0), r.write(1, 0), r.write(2, 0);
    for (const n of this.factionGroups)
      n.encode(r, this.allQtyOne);
    r.offset % 8 > 0 && r.write(8 - r.offset % 8, 0);
  }
  get asCardRefQty() {
    return this.factionGroups.reduce((r, n) => r.concat(n.entries.map((s) => s.asCardRefQty)), Array());
  }
  static fromList(r) {
    const n = Ee(r.map((u) => tt.from(u.quantity, u.id))), s = n.every((u) => u.quantity === 1), a = /* @__PURE__ */ new Map();
    for (const u of n) {
      const b = u.entry.faction;
      let B = a.get(b);
      B || (B = [], a.set(b, B)), B.push(u);
    }
    const l = Array.from(a.keys()).sort((u, b) => u - b), d = [];
    for (const u of l) {
      const b = a.get(u).sort((m, E) => m.entry.numberInFaction - E.entry.numberInFaction), B = Ce(b, dt);
      for (const m of B)
        d.push(et.from(m));
    }
    const y = new rt();
    return y.version = Nt, y.allQtyOne = s, y.factionGroups = d, y;
  }
}
function xe(h) {
  const r = h.entry;
  return `${r.faction}:${r.numberInFaction}:${r.wireRarity}:${r.uniqueWord ?? ""}`;
}
function Ee(h) {
  const r = /* @__PURE__ */ new Map();
  for (const n of h) {
    const s = xe(n), a = r.get(s);
    if (a) {
      if (a.quantity += n.quantity, a.quantity > 65)
        throw new k(`Merged quantity exceeds 65 for ${n.entry.asCardId}`);
    } else
      r.set(s, n);
  }
  return Array.from(r.values());
}
function Ce(h, r) {
  const n = [];
  for (let s = 0; s < h.length; s += r)
    n.push(h.slice(s, s + r));
  return n;
}
class N extends Error {
  constructor(r) {
    super(r), this.name = "DecodingError";
  }
}
class k extends Error {
  constructor(r) {
    super(r), this.name = "EncodingError";
  }
}
var j = {}, ot = {};
ot.byteLength = Fe;
ot.toByteArray = ke;
ot.fromByteArray = $e;
var O = [], T = [], Ae = typeof Uint8Array < "u" ? Uint8Array : Array, ht = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Q = 0, _e = ht.length; Q < _e; ++Q)
  O[Q] = ht[Q], T[ht.charCodeAt(Q)] = Q;
T[45] = 62;
T[95] = 63;
function Dt(h) {
  var r = h.length;
  if (r % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = h.indexOf("=");
  n === -1 && (n = r);
  var s = n === r ? 0 : 4 - n % 4;
  return [n, s];
}
function Fe(h) {
  var r = Dt(h), n = r[0], s = r[1];
  return (n + s) * 3 / 4 - s;
}
function Se(h, r, n) {
  return (r + n) * 3 / 4 - n;
}
function ke(h) {
  var r, n = Dt(h), s = n[0], a = n[1], l = new Ae(Se(h, s, a)), d = 0, y = a > 0 ? s - 4 : s, u;
  for (u = 0; u < y; u += 4)
    r = T[h.charCodeAt(u)] << 18 | T[h.charCodeAt(u + 1)] << 12 | T[h.charCodeAt(u + 2)] << 6 | T[h.charCodeAt(u + 3)], l[d++] = r >> 16 & 255, l[d++] = r >> 8 & 255, l[d++] = r & 255;
  return a === 2 && (r = T[h.charCodeAt(u)] << 2 | T[h.charCodeAt(u + 1)] >> 4, l[d++] = r & 255), a === 1 && (r = T[h.charCodeAt(u)] << 10 | T[h.charCodeAt(u + 1)] << 4 | T[h.charCodeAt(u + 2)] >> 2, l[d++] = r >> 8 & 255, l[d++] = r & 255), l;
}
function Re(h) {
  return O[h >> 18 & 63] + O[h >> 12 & 63] + O[h >> 6 & 63] + O[h & 63];
}
function Ue(h, r, n) {
  for (var s, a = [], l = r; l < n; l += 3)
    s = (h[l] << 16 & 16711680) + (h[l + 1] << 8 & 65280) + (h[l + 2] & 255), a.push(Re(s));
  return a.join("");
}
function $e(h) {
  for (var r, n = h.length, s = n % 3, a = [], l = 16383, d = 0, y = n - s; d < y; d += l)
    a.push(Ue(h, d, d + l > y ? y : d + l));
  return s === 1 ? (r = h[n - 1], a.push(
    O[r >> 2] + O[r << 4 & 63] + "=="
  )) : s === 2 && (r = (h[n - 2] << 8) + h[n - 1], a.push(
    O[r >> 10] + O[r >> 4 & 63] + O[r << 2 & 63] + "="
  )), a.join("");
}
var yt = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
yt.read = function(h, r, n, s, a) {
  var l, d, y = a * 8 - s - 1, u = (1 << y) - 1, b = u >> 1, B = -7, m = n ? a - 1 : 0, E = n ? -1 : 1, F = h[r + m];
  for (m += E, l = F & (1 << -B) - 1, F >>= -B, B += y; B > 0; l = l * 256 + h[r + m], m += E, B -= 8)
    ;
  for (d = l & (1 << -B) - 1, l >>= -B, B += s; B > 0; d = d * 256 + h[r + m], m += E, B -= 8)
    ;
  if (l === 0)
    l = 1 - b;
  else {
    if (l === u)
      return d ? NaN : (F ? -1 : 1) * (1 / 0);
    d = d + Math.pow(2, s), l = l - b;
  }
  return (F ? -1 : 1) * d * Math.pow(2, l - s);
};
yt.write = function(h, r, n, s, a, l) {
  var d, y, u, b = l * 8 - a - 1, B = (1 << b) - 1, m = B >> 1, E = a === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, F = s ? 0 : l - 1, _ = s ? 1 : -1, D = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
  for (r = Math.abs(r), isNaN(r) || r === 1 / 0 ? (y = isNaN(r) ? 1 : 0, d = B) : (d = Math.floor(Math.log(r) / Math.LN2), r * (u = Math.pow(2, -d)) < 1 && (d--, u *= 2), d + m >= 1 ? r += E / u : r += E * Math.pow(2, 1 - m), r * u >= 2 && (d++, u /= 2), d + m >= B ? (y = 0, d = B) : d + m >= 1 ? (y = (r * u - 1) * Math.pow(2, a), d = d + m) : (y = r * Math.pow(2, m - 1) * Math.pow(2, a), d = 0)); a >= 8; h[n + F] = y & 255, F += _, y /= 256, a -= 8)
    ;
  for (d = d << a | y, b += a; b > 0; h[n + F] = d & 255, F += _, d /= 256, b -= 8)
    ;
  h[n + F - _] |= D * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(h) {
  const r = ot, n = yt, s = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  h.Buffer = u, h.SlowBuffer = Yt, h.INSPECT_MAX_BYTES = 50;
  const a = 2147483647;
  h.kMaxLength = a;
  const l = (1 << 28) - 16;
  h.kStringMaxLength = l, h.constants = {
    MAX_LENGTH: a,
    MAX_STRING_LENGTH: l
  }, h.Blob = typeof Blob < "u" ? Blob : void 0, h.File = typeof File < "u" ? File : void 0, h.atob = typeof atob < "u" ? atob : void 0, h.btoa = typeof btoa < "u" ? btoa : void 0, u.TYPED_ARRAY_SUPPORT = d(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function d() {
    try {
      const i = new Uint8Array(1), t = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(i, t), i.foo() === 42;
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
  function y(i) {
    if (i > a)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
    const t = new Uint8Array(i);
    return Object.setPrototypeOf(t, u.prototype), t;
  }
  function u(i, t, e) {
    if (typeof i == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return E(i);
    }
    return b(i, t, e);
  }
  u.poolSize = 8192;
  function b(i, t, e) {
    if (typeof i == "string")
      return F(i, t);
    if (ArrayBuffer.isView(i))
      return D(i);
    if (i == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
      );
    if ($(i, ArrayBuffer) || i && $(i.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && ($(i, SharedArrayBuffer) || i && $(i.buffer, SharedArrayBuffer)))
      return st(i, t, e);
    if (typeof i == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const o = i.valueOf && i.valueOf();
    if (o != null && o !== i)
      return u.from(o, t, e);
    const f = Wt(i);
    if (f) return f;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof i[Symbol.toPrimitive] == "function")
      return u.from(i[Symbol.toPrimitive]("string"), t, e);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
    );
  }
  u.from = function(i, t, e) {
    return b(i, t, e);
  }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array);
  function B(i) {
    if (typeof i != "number")
      throw new TypeError('"size" argument must be of type number');
    if (i < 0)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
  }
  function m(i, t, e) {
    return B(i), i <= 0 ? y(i) : t !== void 0 ? typeof e == "string" ? y(i).fill(t, e) : y(i).fill(t) : y(i);
  }
  u.alloc = function(i, t, e) {
    return m(i, t, e);
  };
  function E(i) {
    return B(i), y(i < 0 ? 0 : ft(i) | 0);
  }
  u.allocUnsafe = function(i) {
    return E(i);
  }, u.allocUnsafeSlow = function(i) {
    return E(i);
  };
  function F(i, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !u.isEncoding(t))
      throw new TypeError("Unknown encoding: " + t);
    const e = wt(i, t) | 0;
    let o = y(e);
    const f = o.write(i, t);
    return f !== e && (o = o.slice(0, f)), o;
  }
  function _(i) {
    const t = i.length < 0 ? 0 : ft(i.length) | 0, e = y(t);
    for (let o = 0; o < t; o += 1)
      e[o] = i[o] & 255;
    return e;
  }
  function D(i) {
    if ($(i, Uint8Array)) {
      const t = new Uint8Array(i);
      return st(t.buffer, t.byteOffset, t.byteLength);
    }
    return _(i);
  }
  function st(i, t, e) {
    if (t < 0 || i.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (i.byteLength < t + (e || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let o;
    return t === void 0 && e === void 0 ? o = new Uint8Array(i) : e === void 0 ? o = new Uint8Array(i, t) : o = new Uint8Array(i, t, e), Object.setPrototypeOf(o, u.prototype), o;
  }
  function Wt(i) {
    if (u.isBuffer(i)) {
      const t = ft(i.length) | 0, e = y(t);
      return e.length === 0 || i.copy(e, 0, 0, t), e;
    }
    if (i.length !== void 0)
      return typeof i.length != "number" || Lt(i.length) ? y(0) : _(i);
    if (i.type === "Buffer" && Array.isArray(i.data))
      return _(i.data);
  }
  function ft(i) {
    if (i >= a)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a.toString(16) + " bytes");
    return i | 0;
  }
  function Yt(i) {
    return +i != i && (i = 0), u.alloc(+i);
  }
  u.isBuffer = function(t) {
    return t != null && t._isBuffer === !0 && t !== u.prototype;
  }, u.compare = function(t, e) {
    if (!$(t, Uint8Array) || !$(e, Uint8Array))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (t === e) return 0;
    let o = t.length, f = e.length;
    for (let c = 0, p = Math.min(o, f); c < p; ++c)
      if (t[c] !== e[c]) {
        o = t[c], f = e[c];
        break;
      }
    return o < f ? -1 : f < o ? 1 : 0;
  }, u.isEncoding = function(t) {
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
  }, u.concat = function(t, e) {
    if (!Array.isArray(t))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (t.length === 0)
      return u.alloc(0);
    let o;
    if (e === void 0)
      for (e = 0, o = 0; o < t.length; ++o)
        e += t[o].length;
    const f = u.allocUnsafe(e);
    let c = 0;
    for (o = 0; o < t.length; ++o) {
      const p = t[o];
      if (!$(p, Uint8Array))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (c + p.length > f.length) {
        f.set(p.subarray(0, f.length - c), c);
        break;
      }
      f.set(p, c), c += p.length;
    }
    return f;
  };
  function wt(i, t) {
    if (ArrayBuffer.isView(i) || $(i, ArrayBuffer) || typeof SharedArrayBuffer < "u" && $(i, SharedArrayBuffer))
      return i.byteLength;
    if (typeof i != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof i
      );
    const e = i.length, o = arguments.length > 2 && arguments[2] === !0;
    if (!o && e === 0) return 0;
    let f = !1;
    for (; ; )
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;
        case "utf8":
        case "utf-8":
          return at(i).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return e * 2;
        case "hex":
          return e >>> 1;
        case "base64":
          return $t(i).length;
        default:
          if (f)
            return o ? -1 : at(i).length;
          t = ("" + t).toLowerCase(), f = !0;
      }
  }
  u.byteLength = wt;
  function zt(i, t, e) {
    let o = !1;
    if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, t >>>= 0, e <= t))
      return "";
    for (i || (i = "utf8"); ; )
      switch (i) {
        case "hex":
          return re(this, t, e);
        case "utf8":
        case "utf-8":
          return bt(this, t, e);
        case "ascii":
          return te(this, t, e);
        case "latin1":
        case "binary":
          return ee(this, t, e);
        case "base64url":
        case "base64":
          return Zt(this, t, e, i);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ie(this, t, e);
        default:
          if (o) throw new TypeError("Unknown encoding: " + i);
          i = (i + "").toLowerCase(), o = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function P(i, t, e) {
    const o = i[t];
    i[t] = i[e], i[e] = o;
  }
  u.prototype.swap16 = function() {
    const t = this.length;
    if (t % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < t; e += 2)
      P(this, e, e + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const t = this.length;
    if (t % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < t; e += 4)
      P(this, e, e + 3), P(this, e + 1, e + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const t = this.length;
    if (t % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < t; e += 8)
      P(this, e, e + 7), P(this, e + 1, e + 6), P(this, e + 2, e + 5), P(this, e + 3, e + 4);
    return this;
  }, u.prototype.toString = function() {
    const t = this.length;
    return t === 0 ? "" : arguments.length === 0 ? bt(this, 0, t) : zt.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(t) {
    return this === t ? !0 : u.compare(this, t) === 0;
  }, u.prototype.inspect = function() {
    let t = "";
    const e = h.INSPECT_MAX_BYTES;
    return t = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (t += " ... "), "<Buffer " + t + ">";
  }, s && (u.prototype[s] = u.prototype.inspect), u.prototype.compare = function(t, e, o, f, c) {
    if (!$(t, Uint8Array))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
      );
    if (e === void 0 && (e = 0), o === void 0 && (o = t ? t.length : 0), f === void 0 && (f = 0), c === void 0 && (c = this.length), e < 0 || o > t.length || f < 0 || c > this.length)
      throw new RangeError("out of range index");
    if (f >= c && e >= o)
      return 0;
    if (f >= c)
      return -1;
    if (e >= o)
      return 1;
    if (e >>>= 0, o >>>= 0, f >>>= 0, c >>>= 0, this === t) return 0;
    let p = c - f, g = o - e;
    const x = Math.min(p, g);
    for (let I = 0; I < x; ++I)
      if (this[f + I] !== t[e + I]) {
        p = this[f + I], g = t[e + I];
        break;
      }
    return p < g ? -1 : g < p ? 1 : 0;
  };
  function gt(i, t, e, o, f) {
    if (i.length === 0) return -1;
    if (typeof e == "string" ? (o = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, Lt(e) && (e = f ? 0 : i.length - 1), e < 0 && (e = i.length + e), e >= i.length) {
      if (f) return -1;
      e = i.length - 1;
    } else if (e < 0)
      if (f) e = 0;
      else return -1;
    if (typeof t == "string" && (t = u.from(t, o)), u.isBuffer(t))
      return t.length === 0 ? -1 : Bt(i, t, e, o, f);
    if (typeof t == "number")
      return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? f ? Uint8Array.prototype.indexOf.call(i, t, e) : Uint8Array.prototype.lastIndexOf.call(i, t, e) : Bt(i, [t], e, o, f);
    throw new TypeError("val must be string, number or Buffer");
  }
  function Bt(i, t, e, o, f) {
    let c = 1, p = i.length, g = t.length;
    if (o !== void 0 && (o = String(o).toLowerCase(), o === "ucs2" || o === "ucs-2" || o === "utf16le" || o === "utf-16le")) {
      if (i.length < 2 || t.length < 2)
        return -1;
      c = 2, p /= 2, g /= 2, e /= 2;
    }
    function x(C, A) {
      return c === 1 ? C[A] : C.readUInt16BE(A * c);
    }
    let I;
    if (f) {
      let C = -1;
      for (I = e; I < p; I++)
        if (x(i, I) === x(t, C === -1 ? 0 : I - C)) {
          if (C === -1 && (C = I), I - C + 1 === g) return C * c;
        } else
          C !== -1 && (I -= I - C), C = -1;
    } else
      for (e + g > p && (e = p - g), I = e; I >= 0; I--) {
        let C = !0;
        for (let A = 0; A < g; A++)
          if (x(i, I + A) !== x(t, A)) {
            C = !1;
            break;
          }
        if (C) return I;
      }
    return -1;
  }
  u.prototype.includes = function(t, e, o) {
    return this.indexOf(t, e, o) !== -1;
  }, u.prototype.indexOf = function(t, e, o) {
    return gt(this, t, e, o, !0);
  }, u.prototype.lastIndexOf = function(t, e, o) {
    return gt(this, t, e, o, !1);
  };
  function jt(i, t, e, o) {
    e = Number(e) || 0;
    const f = i.length - e;
    o ? (o = Number(o), o > f && (o = f)) : o = f;
    const c = t.length;
    o > c >>> 1 && (o = c >>> 1);
    for (let p = 0; p < o; ++p) {
      const g = t.charCodeAt(p * 2 + 0), x = t.charCodeAt(p * 2 + 1), I = Tt[g & 127], C = Tt[x & 127];
      if ((g | x | I | C) & -128)
        return p;
      i[e + p] = I << 4 | C;
    }
    return o;
  }
  function Vt(i, t, e, o) {
    return it(at(t, i.length - e), i, e, o);
  }
  function Ht(i, t, e, o) {
    return it(ae(t), i, e, o);
  }
  function Kt(i, t, e, o, f) {
    const c = f === "base64url" ? se(t) : t;
    return it($t(c), i, e, o);
  }
  function Xt(i, t, e, o) {
    return it(he(t, i.length - e), i, e, o);
  }
  u.prototype.write = function(t, e, o, f) {
    if (e === void 0)
      f = "utf8", o = this.length, e = 0;
    else if (o === void 0 && typeof e == "string")
      f = e, o = this.length, e = 0;
    else if (isFinite(e))
      e = e >>> 0, isFinite(o) ? (o = o >>> 0, f === void 0 && (f = "utf8")) : (f = o, o = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const c = this.length - e;
    if ((o === void 0 || o > c) && (o = c), t.length > 0 && (o < 0 || e < 0) || e > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    f || (f = "utf8");
    let p = !1;
    for (; ; )
      switch (f) {
        case "hex":
          return jt(this, t, e, o);
        case "utf8":
        case "utf-8":
          return Vt(this, t, e, o);
        case "ascii":
        case "latin1":
        case "binary":
          return Ht(this, t, e, o);
        case "base64url":
        case "base64":
          return Kt(this, t, e, o, f);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Xt(this, t, e, o);
        default:
          if (p) throw new TypeError("Unknown encoding: " + f);
          f = ("" + f).toLowerCase(), p = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this, 0)
    };
  };
  function Zt(i, t, e, o) {
    let f;
    return t === 0 && e === i.length ? f = r.fromByteArray(i) : f = r.fromByteArray(i.slice(t, e)), o === "base64url" ? fe(f) : f;
  }
  function bt(i, t, e) {
    e = Math.min(i.length, e);
    const o = [];
    let f = t;
    for (; f < e; ) {
      const c = i[f];
      let p = null, g = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
      if (f + g <= e) {
        let x, I, C, A;
        switch (g) {
          case 1:
            c < 128 && (p = c);
            break;
          case 2:
            x = i[f + 1], (x & 192) === 128 && (A = (c & 31) << 6 | x & 63, A > 127 && (p = A));
            break;
          case 3:
            x = i[f + 1], I = i[f + 2], (x & 192) === 128 && (I & 192) === 128 && (A = (c & 15) << 12 | (x & 63) << 6 | I & 63, A > 2047 && (A < 55296 || A > 57343) && (p = A));
            break;
          case 4:
            x = i[f + 1], I = i[f + 2], C = i[f + 3], (x & 192) === 128 && (I & 192) === 128 && (C & 192) === 128 && (A = (c & 15) << 18 | (x & 63) << 12 | (I & 63) << 6 | C & 63, A > 65535 && A < 1114112 && (p = A));
        }
      }
      p === null ? (p = 65533, g = 1) : p > 65535 && (p -= 65536, o.push(p >>> 10 & 1023 | 55296), p = 56320 | p & 1023), o.push(p), f += g;
    }
    return Jt(o);
  }
  const mt = 4096;
  function Jt(i) {
    const t = i.length;
    if (t <= mt)
      return String.fromCharCode.apply(String, i);
    let e = "", o = 0;
    for (; o < t; )
      e += String.fromCharCode.apply(
        String,
        i.slice(o, o += mt)
      );
    return e;
  }
  function te(i, t, e) {
    let o = "";
    e = Math.min(i.length, e);
    for (let f = t; f < e; ++f)
      o += String.fromCharCode(i[f] & 127);
    return o;
  }
  function ee(i, t, e) {
    let o = "";
    e = Math.min(i.length, e);
    for (let f = t; f < e; ++f)
      o += String.fromCharCode(i[f]);
    return o;
  }
  function re(i, t, e) {
    const o = i.length;
    (!t || t < 0) && (t = 0), (!e || e < 0 || e > o) && (e = o);
    let f = "";
    for (let c = t; c < e; ++c)
      f += ce[i[c]];
    return f;
  }
  function ie(i, t, e) {
    const o = i.slice(t, e);
    let f = "";
    for (let c = 0; c < o.length - 1; c += 2)
      f += String.fromCharCode(o[c] + o[c + 1] * 256);
    return f;
  }
  u.prototype.slice = function(t, e) {
    const o = this.length;
    t = ~~t, e = e === void 0 ? o : ~~e, t < 0 ? (t += o, t < 0 && (t = 0)) : t > o && (t = o), e < 0 ? (e += o, e < 0 && (e = 0)) : e > o && (e = o), e < t && (e = t);
    const f = this.subarray(t, e);
    return Object.setPrototypeOf(f, u.prototype), f;
  };
  function S(i, t, e) {
    if (i % 1 !== 0 || i < 0) throw new RangeError("offset is not uint");
    if (i + t > e) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(t, e, o) {
    t = t >>> 0, e = e >>> 0, o || S(t, e, this.length);
    let f = this[t], c = 1, p = 0;
    for (; ++p < e && (c *= 256); )
      f += this[t + p] * c;
    return f;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(t, e, o) {
    t = t >>> 0, e = e >>> 0, o || S(t, e, this.length);
    let f = this[t + --e], c = 1;
    for (; e > 0 && (c *= 256); )
      f += this[t + --e] * c;
    return f;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(t, e) {
    return t = t >>> 0, e || S(t, 1, this.length), this[t];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(t, e) {
    return t = t >>> 0, e || S(t, 2, this.length), this[t] | this[t + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(t, e) {
    return t = t >>> 0, e || S(t, 2, this.length), this[t] << 8 | this[t + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(t, e) {
    return t = t >>> 0, e || S(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(t, e) {
    return t = t >>> 0, e || S(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
  }, u.prototype.readBigUInt64LE = M(function(t) {
    t = t >>> 0, v(t, "offset");
    const e = this[t], o = this[t + 7];
    (e === void 0 || o === void 0) && V(t, this.length - 8);
    const f = e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24, c = this[++t] + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + o * 2 ** 24;
    return BigInt(f) + (BigInt(c) << BigInt(32));
  }), u.prototype.readBigUInt64BE = M(function(t) {
    t = t >>> 0, v(t, "offset");
    const e = this[t], o = this[t + 7];
    (e === void 0 || o === void 0) && V(t, this.length - 8);
    const f = e * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t], c = this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + o;
    return (BigInt(f) << BigInt(32)) + BigInt(c);
  }), u.prototype.readIntLE = function(t, e, o) {
    t = t >>> 0, e = e >>> 0, o || S(t, e, this.length);
    let f = this[t], c = 1, p = 0;
    for (; ++p < e && (c *= 256); )
      f += this[t + p] * c;
    return c *= 128, f >= c && (f -= Math.pow(2, 8 * e)), f;
  }, u.prototype.readIntBE = function(t, e, o) {
    t = t >>> 0, e = e >>> 0, o || S(t, e, this.length);
    let f = e, c = 1, p = this[t + --f];
    for (; f > 0 && (c *= 256); )
      p += this[t + --f] * c;
    return c *= 128, p >= c && (p -= Math.pow(2, 8 * e)), p;
  }, u.prototype.readInt8 = function(t, e) {
    return t = t >>> 0, e || S(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
  }, u.prototype.readInt16LE = function(t, e) {
    t = t >>> 0, e || S(t, 2, this.length);
    const o = this[t] | this[t + 1] << 8;
    return o & 32768 ? o | 4294901760 : o;
  }, u.prototype.readInt16BE = function(t, e) {
    t = t >>> 0, e || S(t, 2, this.length);
    const o = this[t + 1] | this[t] << 8;
    return o & 32768 ? o | 4294901760 : o;
  }, u.prototype.readInt32LE = function(t, e) {
    return t = t >>> 0, e || S(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
  }, u.prototype.readInt32BE = function(t, e) {
    return t = t >>> 0, e || S(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
  }, u.prototype.readBigInt64LE = M(function(t) {
    t = t >>> 0, v(t, "offset");
    const e = this[t], o = this[t + 7];
    (e === void 0 || o === void 0) && V(t, this.length - 8);
    const f = this[t + 4] + this[t + 5] * 2 ** 8 + this[t + 6] * 2 ** 16 + (o << 24);
    return (BigInt(f) << BigInt(32)) + BigInt(e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24);
  }), u.prototype.readBigInt64BE = M(function(t) {
    t = t >>> 0, v(t, "offset");
    const e = this[t], o = this[t + 7];
    (e === void 0 || o === void 0) && V(t, this.length - 8);
    const f = (e << 24) + // Overflow
    this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t];
    return (BigInt(f) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + o);
  }), u.prototype.readFloatLE = function(t, e) {
    return t = t >>> 0, e || S(t, 4, this.length), n.read(this, t, !0, 23, 4);
  }, u.prototype.readFloatBE = function(t, e) {
    return t = t >>> 0, e || S(t, 4, this.length), n.read(this, t, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(t, e) {
    return t = t >>> 0, e || S(t, 8, this.length), n.read(this, t, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(t, e) {
    return t = t >>> 0, e || S(t, 8, this.length), n.read(this, t, !1, 52, 8);
  };
  function U(i, t, e, o, f, c) {
    if (!u.isBuffer(i)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > f || t < c) throw new RangeError('"value" argument is out of bounds');
    if (e + o > i.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(t, e, o, f) {
    if (t = +t, e = e >>> 0, o = o >>> 0, !f) {
      const g = Math.pow(2, 8 * o) - 1;
      U(this, t, e, o, g, 0);
    }
    let c = 1, p = 0;
    for (this[e] = t & 255; ++p < o && (c *= 256); )
      this[e + p] = t / c & 255;
    return e + o;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(t, e, o, f) {
    if (t = +t, e = e >>> 0, o = o >>> 0, !f) {
      const g = Math.pow(2, 8 * o) - 1;
      U(this, t, e, o, g, 0);
    }
    let c = o - 1, p = 1;
    for (this[e + c] = t & 255; --c >= 0 && (p *= 256); )
      this[e + c] = t / p & 255;
    return e + o;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 1, 255, 0), this[e] = t & 255, e + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 2, 65535, 0), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = t & 255, e + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
  };
  function It(i, t, e, o, f) {
    Ft(t, o, f, i, e, 7);
    let c = Number(t & BigInt(4294967295));
    i[e++] = c, c = c >> 8, i[e++] = c, c = c >> 8, i[e++] = c, c = c >> 8, i[e++] = c;
    let p = Number(t >> BigInt(32) & BigInt(4294967295));
    return i[e++] = p, p = p >> 8, i[e++] = p, p = p >> 8, i[e++] = p, p = p >> 8, i[e++] = p, e;
  }
  function xt(i, t, e, o, f) {
    Ft(t, o, f, i, e, 7);
    let c = Number(t & BigInt(4294967295));
    i[e + 7] = c, c = c >> 8, i[e + 6] = c, c = c >> 8, i[e + 5] = c, c = c >> 8, i[e + 4] = c;
    let p = Number(t >> BigInt(32) & BigInt(4294967295));
    return i[e + 3] = p, p = p >> 8, i[e + 2] = p, p = p >> 8, i[e + 1] = p, p = p >> 8, i[e] = p, e + 8;
  }
  u.prototype.writeBigUInt64LE = M(function(t, e = 0) {
    return It(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = M(function(t, e = 0) {
    return xt(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(t, e, o, f) {
    if (t = +t, e = e >>> 0, !f) {
      const x = Math.pow(2, 8 * o - 1);
      U(this, t, e, o, x - 1, -x);
    }
    let c = 0, p = 1, g = 0;
    for (this[e] = t & 255; ++c < o && (p *= 256); )
      t < 0 && g === 0 && this[e + c - 1] !== 0 && (g = 1), this[e + c] = (t / p >> 0) - g & 255;
    return e + o;
  }, u.prototype.writeIntBE = function(t, e, o, f) {
    if (t = +t, e = e >>> 0, !f) {
      const x = Math.pow(2, 8 * o - 1);
      U(this, t, e, o, x - 1, -x);
    }
    let c = o - 1, p = 1, g = 0;
    for (this[e + c] = t & 255; --c >= 0 && (p *= 256); )
      t < 0 && g === 0 && this[e + c + 1] !== 0 && (g = 1), this[e + c] = (t / p >> 0) - g & 255;
    return e + o;
  }, u.prototype.writeInt8 = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = t & 255, e + 1;
  }, u.prototype.writeInt16LE = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 2, 32767, -32768), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
  }, u.prototype.writeInt16BE = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
  }, u.prototype.writeInt32LE = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 4, 2147483647, -2147483648), this[e] = t & 255, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4;
  }, u.prototype.writeInt32BE = function(t, e, o) {
    return t = +t, e = e >>> 0, o || U(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
  }, u.prototype.writeBigInt64LE = M(function(t, e = 0) {
    return It(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = M(function(t, e = 0) {
    return xt(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function Et(i, t, e, o, f, c) {
    if (e + o > i.length) throw new RangeError("Index out of range");
    if (e < 0) throw new RangeError("Index out of range");
  }
  function Ct(i, t, e, o, f) {
    return t = +t, e = e >>> 0, f || Et(i, t, e, 4), n.write(i, t, e, o, 23, 4), e + 4;
  }
  u.prototype.writeFloatLE = function(t, e, o) {
    return Ct(this, t, e, !0, o);
  }, u.prototype.writeFloatBE = function(t, e, o) {
    return Ct(this, t, e, !1, o);
  };
  function At(i, t, e, o, f) {
    return t = +t, e = e >>> 0, f || Et(i, t, e, 8), n.write(i, t, e, o, 52, 8), e + 8;
  }
  u.prototype.writeDoubleLE = function(t, e, o) {
    return At(this, t, e, !0, o);
  }, u.prototype.writeDoubleBE = function(t, e, o) {
    return At(this, t, e, !1, o);
  }, u.prototype.copy = function(t, e, o, f) {
    if (!$(t, Uint8Array)) throw new TypeError("argument should be a Buffer");
    if (o || (o = 0), !f && f !== 0 && (f = this.length), e >= t.length && (e = t.length), e || (e = 0), f > 0 && f < o && (f = o), f === o || t.length === 0 || this.length === 0) return 0;
    if (e < 0)
      throw new RangeError("targetStart out of bounds");
    if (o < 0 || o >= this.length) throw new RangeError("Index out of range");
    if (f < 0) throw new RangeError("sourceEnd out of bounds");
    f > this.length && (f = this.length), t.length - e < f - o && (f = t.length - e + o);
    const c = f - o;
    return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, o, f) : Uint8Array.prototype.set.call(
      t,
      this.subarray(o, f),
      e
    ), c;
  }, u.prototype.fill = function(t, e, o, f) {
    if (typeof t == "string") {
      if (typeof e == "string" ? (f = e, e = 0, o = this.length) : typeof o == "string" && (f = o, o = this.length), f !== void 0 && typeof f != "string")
        throw new TypeError("encoding must be a string");
      if (typeof f == "string" && !u.isEncoding(f))
        throw new TypeError("Unknown encoding: " + f);
      if (t.length === 1) {
        const p = t.charCodeAt(0);
        (f === "utf8" && p < 128 || f === "latin1") && (t = p);
      }
    } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
    if (e < 0 || this.length < e || this.length < o)
      throw new RangeError("Out of range index");
    if (o <= e)
      return this;
    e = e >>> 0, o = o === void 0 ? this.length : o >>> 0, t || (t = 0);
    let c;
    if (typeof t == "number")
      for (c = e; c < o; ++c)
        this[c] = t;
    else {
      const p = $(t, Uint8Array) ? t : u.from(t, f), g = p.length;
      if (g === 0)
        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
      for (c = 0; c < o - e; ++c)
        this[c + e] = p[c % g];
    }
    return this;
  };
  const G = {};
  function ut(i, t, e) {
    function o() {
      const f = new e(t.apply(null, arguments));
      return Object.setPrototypeOf(f, o.prototype), f.code = i, f.name = `${f.name} [${i}]`, Error.captureStackTrace && Error.captureStackTrace(f, o), f.stack, delete f.name, f;
    }
    Object.setPrototypeOf(o.prototype, e.prototype), Object.setPrototypeOf(o, e), o.prototype.toString = function() {
      return `${this.name} [${i}]: ${this.message}`;
    }, G[i] = o;
  }
  ut(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(i) {
      return i ? `${i} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), ut(
    "ERR_INVALID_ARG_TYPE",
    function(i, t) {
      return `The "${i}" argument must be of type number. Received type ${typeof t}`;
    },
    TypeError
  ), ut(
    "ERR_OUT_OF_RANGE",
    function(i, t, e) {
      let o = `The value of "${i}" is out of range.`, f = e;
      return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? f = _t(String(e)) : typeof e == "bigint" && (f = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (f = _t(f)), f += "n"), o += ` It must be ${t}. Received ${f}`, o;
    },
    RangeError
  );
  function _t(i) {
    let t = "", e = i.length;
    const o = i[0] === "-" ? 1 : 0;
    for (; e >= o + 4; e -= 3)
      t = `_${i.slice(e - 3, e)}${t}`;
    return `${i.slice(0, e)}${t}`;
  }
  function ne(i, t, e) {
    v(t, "offset"), (i[t] === void 0 || i[t + e] === void 0) && V(t, i.length - (e + 1));
  }
  function Ft(i, t, e, o, f, c) {
    if (i > e || i < t) {
      const p = typeof t == "bigint" ? "n" : "";
      let g;
      throw t === 0 || t === BigInt(0) ? g = `>= 0${p} and < 2${p} ** ${(c + 1) * 8}${p}` : g = `>= -(2${p} ** ${(c + 1) * 8 - 1}${p}) and < 2 ** ${(c + 1) * 8 - 1}${p}`, new G.ERR_OUT_OF_RANGE("value", g, i);
    }
    ne(o, f, c);
  }
  function v(i, t) {
    if (typeof i != "number")
      throw new G.ERR_INVALID_ARG_TYPE(t, "number", i);
  }
  function V(i, t, e) {
    throw Math.floor(i) !== i ? (v(i, e), new G.ERR_OUT_OF_RANGE("offset", "an integer", i)) : t < 0 ? new G.ERR_BUFFER_OUT_OF_BOUNDS() : new G.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${t}`,
      i
    );
  }
  const oe = /[^+/0-9A-Za-z-_]/g, St = "+", kt = "/", Rt = "-", Ut = "_";
  function se(i) {
    return i.replaceAll(Rt, St).replaceAll(Ut, kt);
  }
  function fe(i) {
    return i.replaceAll(St, Rt).replaceAll(kt, Ut);
  }
  function ue(i) {
    if (i = i.split("=")[0], i = i.trim().replace(oe, ""), i.length < 2) return "";
    for (; i.length % 4 !== 0; )
      i = i + "=";
    return i;
  }
  function at(i, t) {
    t = t || 1 / 0;
    let e;
    const o = i.length;
    let f = null;
    const c = [];
    for (let p = 0; p < o; ++p) {
      if (e = i.charCodeAt(p), e > 55295 && e < 57344) {
        if (!f) {
          if (e > 56319) {
            (t -= 3) > -1 && c.push(239, 191, 189);
            continue;
          } else if (p + 1 === o) {
            (t -= 3) > -1 && c.push(239, 191, 189);
            continue;
          }
          f = e;
          continue;
        }
        if (e < 56320) {
          (t -= 3) > -1 && c.push(239, 191, 189), f = e;
          continue;
        }
        e = (f - 55296 << 10 | e - 56320) + 65536;
      } else f && (t -= 3) > -1 && c.push(239, 191, 189);
      if (f = null, e < 128) {
        if ((t -= 1) < 0) break;
        c.push(e);
      } else if (e < 2048) {
        if ((t -= 2) < 0) break;
        c.push(
          e >> 6 | 192,
          e & 63 | 128
        );
      } else if (e < 65536) {
        if ((t -= 3) < 0) break;
        c.push(
          e >> 12 | 224,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else if (e < 1114112) {
        if ((t -= 4) < 0) break;
        c.push(
          e >> 18 | 240,
          e >> 12 & 63 | 128,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return c;
  }
  function ae(i) {
    const t = [];
    for (let e = 0; e < i.length; ++e)
      t.push(i.charCodeAt(e) & 255);
    return t;
  }
  function he(i, t) {
    let e, o, f;
    const c = [];
    for (let p = 0; p < i.length && !((t -= 2) < 0); ++p)
      e = i.charCodeAt(p), o = e >> 8, f = e % 256, c.push(f), c.push(o);
    return c;
  }
  function $t(i) {
    return r.toByteArray(ue(i));
  }
  function it(i, t, e, o) {
    let f;
    for (f = 0; f < o && !(f + e >= t.length || f >= i.length); ++f)
      t[f + e] = i[f];
    return f;
  }
  function $(i, t) {
    return i instanceof t || i != null && i.constructor != null && i.constructor.name != null && i.constructor.name === t.name || t === Uint8Array && u.isBuffer(i);
  }
  function Lt(i) {
    return i !== i;
  }
  const ce = function() {
    const i = "0123456789abcdef", t = new Array(256);
    for (let e = 0; e < 16; ++e) {
      const o = e * 16;
      for (let f = 0; f < 16; ++f)
        t[o + f] = i[e] + i[f];
    }
    return t;
  }(), Tt = [
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
  function M(i) {
    return typeof BigInt > "u" ? le : i;
  }
  function le() {
    throw new Error("BigInt not supported");
  }
})(j);
class Pt {
  constructor() {
    w(this, "buffer", new Uint8Array(0));
  }
  write(r) {
    let n = new Uint8Array(this.buffer.length + r.length);
    n.set(this.buffer), n.set(r, this.buffer.length), this.buffer = n;
  }
}
class Gt {
  /**
   * Create a new writer
   * @param stream The writable stream to write to
   * @param bufferSize The number of bytes to buffer before flushing onto the writable
   */
  constructor(r, n = 1) {
    w(this, "pendingByte", BigInt(0));
    w(this, "pendingBits", 0);
    w(this, "buffer");
    w(this, "bufferedBytes", 0);
    w(this, "_offset", 0);
    this.stream = r, this.bufferSize = n, this.buffer = new Uint8Array(n);
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
    this.bufferedBytes > 0 && (this.stream.write(j.Buffer.from(this.buffer.slice(0, this.bufferedBytes))), this.bufferedBytes = 0);
  }
  min(r, n) {
    return r < n ? r : n;
  }
  /**
   * Write the given number to the bitstream with the given bitlength. If the number is too large for the 
   * number of bits specified, the lower-order bits are written and the higher-order bits are ignored.
   * @param length The number of bits to write
   * @param value The number to write
   */
  write(r, n) {
    if (n == null && (n = 0), n = Number(n), Number.isNaN(n))
      throw new Error(`Cannot write to bitstream: Value ${n} is not a number`);
    if (!Number.isFinite(n))
      throw new Error(`Cannot write to bitstream: Value ${n} must be finite`);
    let s = BigInt(n % Math.pow(2, r)), a = r;
    for (; a > 0; ) {
      let l = BigInt(8 - this.pendingBits - a), d = l >= 0 ? s << l : s >> -l, y = Number(l >= 0 ? a : this.min(-l, BigInt(8 - this.pendingBits)));
      this.pendingByte = this.pendingByte | d, this.pendingBits += y, this._offset += y, a -= y, s = s % BigInt(Math.pow(2, a)), this.pendingBits === 8 && (this.finishByte(), this.bufferedBytes >= this.buffer.length && this.flush());
    }
  }
}
let nt;
class vt {
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
  set offset(r) {
    if (r < this._spentBufferSize)
      throw new Error(
        `Offset ${r} points into a discarded buffer! If you need to seek backwards outside the current buffer, make sure to set retainBuffers=true`
      );
    let n = r - this._spentBufferSize, s = 0;
    for (let a = 0, l = this.buffers.length; a < l; ++a) {
      let d = this.buffers[a], y = d.length * 8;
      if (n < y) {
        this._bufferIndex = s, this._offset = r, this._offsetIntoBuffer = n, this.bufferedLength = d.length * 8 - this._offsetIntoBuffer;
        for (let u = a + 1; u < l; ++u)
          this.bufferedLength += this.buffers[u].length * 8;
        return;
      }
      n -= y, ++s;
    }
  }
  /**
   * Run a function which can synchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  simulateSync(r) {
    let n = this.retainBuffers, s = this.offset;
    this.retainBuffers = !0;
    try {
      return r();
    } finally {
      this.retainBuffers = n, this.offset = s;
    }
  }
  /**
   * Run a function which can asynchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  async simulate(r) {
    let n = this.retainBuffers, s = this.offset;
    this.retainBuffers = !0;
    try {
      return await r();
    } finally {
      this.retainBuffers = n, this.offset = s;
    }
  }
  /**
   * Remove any fully used up buffers. Only has an effect if retainBuffers is true.
   * Optional `count` parameter lets you control how many buffers can be freed.
   */
  clean(r) {
    let n = r !== void 0 ? Math.min(r, this._bufferIndex) : this._bufferIndex;
    for (let s = 0, a = n; s < a; ++s)
      this._spentBufferSize += this.buffers[0].length * 8, this.buffers.shift();
    this._bufferIndex -= n;
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
  isAvailable(r) {
    return this.bufferedLength >= r;
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
  async readString(r, n) {
    return this.ensureNoReadPending(), await this.assure(8 * r), this.readStringSync(r, n);
  }
  /**
   * Synchronously read the given number of bytes, encode it into a string, and return the result,
   * optionally using a specific text encoding.
   * @param length The number of bytes to read
   * @param options A set of options to control conversion into a string. @see StringEncodingOptions
   * @returns The resulting string
   */
  readStringSync(r, n) {
    n || (n = {}), this.ensureNoReadPending();
    let s = new Uint8Array(r), a = -1, l = 1, d = n.encoding ?? "utf-8";
    ["utf16le", "ucs-2", "ucs2"].includes(d) && (l = 2);
    for (let y = 0, u = r; y < u; ++y)
      s[y] = this.readSync(8);
    for (let y = 0, u = r; y < u; y += l) {
      let b = s[y];
      if (l === 2 && (b = b << 8 | (s[y + 1] ?? 0)), b === 0) {
        a = y;
        break;
      }
    }
    if (n.nullTerminated !== !1 && a >= 0 && (s = s.subarray(0, a)), d === "utf-8")
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
  peekSync(r) {
    return this.readCoreSync(r, !1);
  }
  /**
   * Skip the given number of bits. 
   * @param length The number of bits to skip
   */
  skip(r) {
    this.skippedLength += r;
  }
  /**
   * Read an unsigned integer of the given bit length synchronously. If there are not enough 
   * bits available, an error is thrown.
   * 
   * @param length The number of bits to read
   * @returns The unsigned integer that was read
   */
  readSync(r) {
    return this.readCoreSync(r, !0);
  }
  /**
   * Read a number of bytes from the stream. Returns a generator that ends when the read is complete,
   * and yields a number of *bytes* still to be read (not bits like in other read methods)
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  *readBytes(r, n = 0, s) {
    var l;
    if (s ?? (s = r.length - n), this._offsetIntoBuffer % 8 === 0) {
      globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    Byte-aligned readBytes(), length=${s}`), console.log(`------------------------------------------------------------    readBytes(): Pre-operation: buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferLength=${((l = this.buffers[this._bufferIndex]) == null ? void 0 : l.length) || "<none>"} bufferCount=${this.buffers.length}`));
      let d = s, y = 0;
      for (; d > 0; ) {
        this.available < d * 8 && (yield Math.max((d * 8 - this.available) / 8));
        let u = Math.floor(this._offsetIntoBuffer / 8), b = this.buffers[this._bufferIndex], B = Math.min(d, b.length);
        for (let E = 0; E < B; ++E)
          r[y + E] = b[u + E];
        y += B;
        let m = B * 8;
        this.consume(m), d -= m, globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    readBytes(): consumed=${B} bytes, remaining=${d}`), console.log(`------------------------------------------------------------    readBytes(): buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferCount=${this.buffers.length}`));
      }
    } else
      for (let d = n, y = Math.min(r.length, n + s); d < y; ++d)
        this.isAvailable(8) || (yield y - d), r[d] = this.readSync(8);
    return r;
  }
  /**
   * Read a number of bytes from the stream synchronously. If not enough bytes are available, an 
   * exception is thrown.
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  readBytesSync(r, n = 0, s) {
    s ?? (s = r.length - n);
    let a = this.readBytes(r, n, s);
    for (; ; ) {
      if (a.next().done === !1)
        throw new Error(`underrun: Not enough bits are available (requested ${s} bytes)`);
      break;
    }
    return r;
  }
  /**
   * Read a number of bytes from the stream. Blocks and waits for more bytes if not enough bytes are available.
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  async readBytesBlocking(r, n = 0, s) {
    s ?? (s = r.length - n);
    let a = this.readBytes(r, n, s);
    for (; ; ) {
      let l = a.next();
      if (l.done === !1)
        await this.assure(l.value * 8);
      else
        break;
    }
    return r;
  }
  /**
   * Read a two's complement signed integer of the given bit length synchronously. If there are not
   * enough bits available, an error is thrown.
   * 
   * @param length The number of bits to read
   * @returns The signed integer that was read
   */
  readSignedSync(r) {
    const n = this.readSync(r), s = 2 ** (r - 1), a = s - 1;
    return n & s ? -((~(n - 1) & a) >>> 0) : n;
  }
  maskOf(r) {
    if (!nt) {
      nt = /* @__PURE__ */ new Map();
      for (let n = 0; n <= 64; ++n)
        nt.set(n, Math.pow(2, n) - 1);
    }
    return nt.get(r) ?? Math.pow(2, r) - 1;
  }
  /**
   * Read an IEEE 754 floating point value with the given bit length (32 or 64). If there are not 
   * enough bits available, an error is thrown.
   * 
   * @param length Must be 32 for 32-bit single-precision or 64 for 64-bit double-precision. All
   *        other values result in TypeError
   * @returns The floating point value that was read
   */
  readFloatSync(r) {
    if (r !== 32 && r !== 64)
      throw new TypeError(`Invalid length (${r} bits) Only 4-byte (32 bit / single-precision) and 8-byte (64 bit / double-precision) IEEE 754 values are supported`);
    if (!this.isAvailable(r))
      throw new Error(`underrun: Not enough bits are available (requested=${r}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    let n = new ArrayBuffer(r / 8), s = new DataView(n);
    for (let a = 0, l = n.byteLength; a < l; ++a)
      s.setUint8(a, this.readSync(8));
    if (r === 32)
      return s.getFloat32(0, !1);
    if (r === 64)
      return s.getFloat64(0, !1);
    throw new TypeError(`Invalid length (${r} bits) Only 4-byte (32 bit / single-precision) and 8-byte (64 bit / double-precision) IEEE 754 values are supported`);
  }
  readByteAligned(r) {
    let n = this.buffers[this._bufferIndex], s = n[this._offsetIntoBuffer / 8];
    return r && (this.bufferedLength -= 8, this._offsetIntoBuffer += 8, this._offset += 8, this._offsetIntoBuffer >= n.length * 8 && (this._bufferIndex += 1, this._offsetIntoBuffer = 0, this.retainBuffers || this.clean())), s;
  }
  consume(r) {
    this.bufferedLength -= r, this._offsetIntoBuffer += r, this._offset += r;
    let n = this.buffers[this._bufferIndex];
    for (; n && this._offsetIntoBuffer >= n.length * 8; )
      this._bufferIndex += 1, this._offsetIntoBuffer -= n.length * 8, n = this.buffers[this._bufferIndex], this.retainBuffers || this.clean();
  }
  readShortByteAligned(r, n) {
    let s = this.buffers[this._bufferIndex], a = this._offsetIntoBuffer / 8, l = s[a], d;
    if (a + 1 >= s.length ? d = this.buffers[this._bufferIndex + 1][0] : d = s[a + 1], r && this.consume(16), n === "lsb") {
      let y = l;
      l = d, d = y;
    }
    return l << 8 | d;
  }
  readLongByteAligned(r, n) {
    let s = this._bufferIndex, a = this.buffers[s], l = this._offsetIntoBuffer / 8, d = a[l++];
    l >= a.length && (a = this.buffers[++s], l = 0);
    let y = a[l++];
    l >= a.length && (a = this.buffers[++s], l = 0);
    let u = a[l++];
    l >= a.length && (a = this.buffers[++s], l = 0);
    let b = a[l++];
    l >= a.length && (a = this.buffers[++s], l = 0), r && this.consume(32);
    let B = (d & 128) !== 0;
    if (d &= -129, n === "lsb") {
      let E = b, F = u, _ = y, D = d;
      d = E, y = F, u = _, b = D;
    }
    let m = d << 24 | y << 16 | u << 8 | b;
    return B && (m += 2 ** 31), m;
  }
  read3ByteAligned(r, n) {
    let s = this._bufferIndex, a = this.buffers[s], l = this._offsetIntoBuffer / 8, d = a[l++];
    l >= a.length && (a = this.buffers[++s], l = 0);
    let y = a[l++];
    l >= a.length && (a = this.buffers[++s], l = 0);
    let u = a[l++];
    if (l >= a.length && (a = this.buffers[++s], l = 0), r && this.consume(24), n === "lsb") {
      let b = d;
      d = u, u = b;
    }
    return d << 16 | y << 8 | u;
  }
  readPartialByte(r, n) {
    let a = this.buffers[this._bufferIndex][Math.floor(this._offsetIntoBuffer / 8)], l = this._offsetIntoBuffer % 8 | 0;
    return n && this.consume(r), a >> 8 - r - l & this.maskOf(r) | 0;
  }
  /**
   * @param length 
   * @param consume 
   * @param byteOrder The byte order to use when the length is greater than 8 and is a multiple of 8. 
   *                  Defaults to MSB (most significant byte). If the length is not a multiple of 8, 
   *                  this is unused
   * @returns 
   */
  readCoreSync(r, n, s = "msb") {
    if (this.ensureNoReadPending(), this.available < r)
      throw new Error(`underrun: Not enough bits are available (requested=${r}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    this.adjustSkip();
    let a = this._offsetIntoBuffer % 8;
    if (a === 0) {
      if (r === 8)
        return this.readByteAligned(n);
      if (r === 16)
        return this.readShortByteAligned(n, s);
      if (r === 24)
        return this.read3ByteAligned(n, s);
      if (r === 32)
        return this.readLongByteAligned(n, s);
    }
    if (r < 8 && (8 - a | 0) >= r)
      return this.readPartialByte(r, n);
    let l = r, d = this._offsetIntoBuffer, y = this._bufferIndex, u = BigInt(0), b = 0, B = r > 31;
    for (; l > 0; ) {
      if (y >= this.buffers.length)
        throw new Error(`Internal error: Buffer index out of range (index=${y}, count=${this.buffers.length}), offset=${this.offset}, readLength=${r}, available=${this.available})`);
      let m = this.buffers[y], E = Math.floor(d / 8);
      if (E >= m.length)
        throw new Error(`Internal error: Current buffer (index ${y}) has length ${m.length} but our position within the buffer is ${E}! offset=${this.offset}, bufs=${this.buffers.length}`);
      let F = d % 8, _, D = m[E];
      _ = Math.min(8 - F, l), B ? u = u << BigInt(_) | BigInt(m[E]) >> BigInt(8) - BigInt(_) - BigInt(F) & BigInt(this.maskOf(_)) : b = b << _ | D >> 8 - _ - F & this.maskOf(_), d += _, l -= _ | 0, d >= m.length * 8 && (y += 1, d = 0);
    }
    return n && this.consume(r), B ? Number(u) : b;
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
  assure(r, n = !1) {
    return this.ensureNoReadPending(), this.bufferedLength >= r ? Promise.resolve() : this.block({ length: r, assure: !0 }).then((s) => {
      if (s < r && !n)
        throw this.endOfStreamError(r);
    });
  }
  /**
   * Read an unsigned integer with the given bit length, waiting until enough bits are 
   * available for the operation. 
   * 
   * @param length The number of bits to read
   * @returns A promise which resolves to the unsigned integer once it is read
   */
  read(r) {
    return this.ensureNoReadPending(), this.available >= r ? Promise.resolve(this.readSync(r)) : this.block({ length: r });
  }
  /**
   * Read a two's complement signed integer with the given bit length, waiting until enough bits are 
   * available for the operation. 
   * 
   * @param length The number of bits to read
   * @returns A promise which resolves to the signed integer value once it is read
   */
  readSigned(r) {
    return this.ensureNoReadPending(), this.available >= r ? Promise.resolve(this.readSignedSync(r)) : this.block({ length: r, signed: !0 });
  }
  promise() {
    let r = () => {
    }, n = () => {
    };
    return { promise: new Promise((a, l) => (r = a, n = l)), resolve: r, reject: n };
  }
  block(r) {
    return this._ended ? r.assure ? Promise.resolve(this.available) : Promise.reject(this.endOfStreamError(r.length)) : (this.blockedRequest = {
      ...r,
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
  readFloat(r) {
    return this.ensureNoReadPending(), this.available >= r ? Promise.resolve(this.readFloatSync(r)) : this.block({ length: r, float: !0 });
  }
  /**
   * Asynchronously read a number of the given bitlength without advancing the read head.
   * @param length The number of bits to read. If there are not enough bits available 
   * to complete the operation, the operation is delayed until enough bits become available.
   * @returns A promise which resolves iwth the number read from the bitstream
   */
  async peek(r) {
    return await this.assure(r), this.peekSync(r);
  }
  /**
   * Add a buffer onto the end of the bitstream.
   * @param buffer The buffer to add to the bitstream
   */
  addBuffer(r) {
    if (this._ended)
      throw new Error("Cannot add buffers to a reader which has been marked as ended without calling reset() first");
    if (this.buffers.push(r), this.bufferedLength += r.length * 8, this.blockedRequest && this.blockedRequest.length <= this.available) {
      let n = this.blockedRequest;
      this.blockedRequest = null, n.assure ? n.resolve(n.length) : n.signed ? n.resolve(this.readSignedSync(n.length)) : n.float ? n.resolve(this.readFloatSync(n.length)) : n.resolve(this.readSync(n.length));
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
      let r = this.blockedRequest;
      if (this.blockedRequest = null, r.length <= this.available)
        throw new Error("Internal inconsistency in @/bitstream: Should have granted request prior. Please report this bug.");
      r.assure ? r.resolve(this.available) : r.reject(this.endOfStreamError(r.length));
    }
  }
  endOfStreamError(r) {
    return new Error(`End of stream reached while reading ${r} bits, only ${this.available} bits are left in the stream`);
  }
}
function Qt(h) {
  return h.split(`
`).flatMap((r) => {
    const n = r.trim().match(/^(\d+) (\w+)$/);
    if (n) {
      const s = parseInt(n[1], 10);
      if (s > 0)
        return [{ quantity: s, id: n[2] }];
    }
    return [];
  });
}
function Oe(h) {
  const r = Qt(h), n = new Pt(), s = new Gt(n, 1024);
  return z.fromList(r).encode(s), s.end(), j.Buffer.concat([n.buffer]).toString("base64url");
}
function Ne(h) {
  const r = j.Buffer.from(h, "base64url");
  let n = new vt();
  return n.addBuffer(r), z.decode(n).asCardRefQty.map((l) => `${l.quantity} ${l.id}`).join(`
`);
}
function Me(h) {
  const r = Qt(h), n = new Pt(), s = new Gt(n, 1024);
  return rt.fromList(r).encode(s), s.end(), j.Buffer.concat([n.buffer]).toString("base64url");
}
function De(h) {
  const r = j.Buffer.from(h, "base64url"), n = new vt();
  return n.addBuffer(r), rt.decode(n).asCardRefQty.map((l) => `${l.quantity} ${l.id}`).join(`
`);
}
export {
  Ne as decodeList,
  De as decodeListCompact,
  Oe as encodeList,
  Me as encodeListCompact
};
