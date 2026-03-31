"""
Fetch all card references from the Altered public API for every set.
Unique cards (rarity U) are EXCLUDED.

Sets are auto-discovered by querying each faction separately, avoiding the
1000-card cap on unfiltered queries. No set names are hardcoded.

Generates one file per set: test/generated/generated_test_{SET}.txt
Each line is: 1 {REFERENCE}

Usage:
    python tools/fetch-all-references.py
"""

import urllib.request, json, re, sys, os

API_BASE = "https://api.altered.gg/public/cards"
USER_AGENT = "altered-deckfmt"
ITEMS_PER_PAGE = 36

FACTIONS = ["AX", "BR", "LY", "MU", "OR", "YZ", "NE"]

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "test", "generated")


def api_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    return json.loads(urllib.request.urlopen(req).read())


def discover_sets():
    """Discover all sets by querying each faction separately.

    Aborts with an error if any faction query hits the 1000-card API cap,
    since that means some sets could be hidden beyond the limit.
    """
    API_CAP = 1000
    sets = {}

    for faction in FACTIONS:
        sys.stderr.write(f"  Scanning faction {faction}...")
        sys.stderr.flush()
        page = 1
        count = 0
        while True:
            data = api_get(
                f"{API_BASE}?factions={faction}"
                f"&itemsPerPage={ITEMS_PER_PAGE}&locale=en-us&page={page}"
            )
            total = data.get("hydra:totalItems", 0)
            for card in data["hydra:member"]:
                cs = card.get("cardSet")
                if cs and cs.get("reference"):
                    ref = cs["reference"]
                    if ref not in sets:
                        sets[ref] = cs.get("name", "")
                count += 1
            if "hydra:next" not in data.get("hydra:view", {}):
                break
            page += 1

        if total >= API_CAP:
            sys.stderr.write(
                f"\n\n*** ERROR: faction {faction} hit the API cap "
                f"({total} >= {API_CAP}). Some sets may be missing! ***\n"
                f"Split this faction further (e.g. by cardType) to stay "
                f"under the limit.\n"
            )
            sys.exit(1)

        sys.stderr.write(f" {count} cards (total: {total}), {len(sets)} sets so far\n")
        sys.stderr.flush()

    return sets


def fetch_set_references(set_code):
    """Fetch all non-unique card references for a given set.

    Aborts if the set hits the 1000-card API cap.
    """
    API_CAP = 1000
    refs = []
    total = 0
    page = 1
    while True:
        data = api_get(
            f"{API_BASE}?cardSet={set_code}"
            f"&itemsPerPage={ITEMS_PER_PAGE}&locale=en-us&page={page}"
        )
        total = data.get("hydra:totalItems", 0)

        for card in data["hydra:member"]:
            ref = card["reference"]
            # Exclude uniques: pattern ends with _U or _U_<num>
            if re.search(r"_U(_\d+)?$", ref):
                continue
            # Exclude serialized commons (e.g. ALT_DUSTERCB_P_AX_85_C_XXX)
            if ref.endswith("_C_XXX"):
                continue
            refs.append(ref)

        if "hydra:next" not in data.get("hydra:view", {}):
            break
        page += 1

    if total >= API_CAP:
        sys.stderr.write(
            f"\n\n*** ERROR: set {set_code} hit the API cap "
            f"({total} >= {API_CAP}). Card list may be incomplete! ***\n"
        )
        sys.exit(1)

    return sorted(refs)


def extract_max_num(refs):
    """Extract the maximum card number from a list of references."""
    max_num = 0
    max_ref = ""
    for ref in refs:
        m = re.match(r"ALT_\w+_[ABP]_\w{2}_(\d+)_", ref)
        if m:
            n = int(m.group(1))
            if n > max_num:
                max_num = n
                max_ref = ref
    return max_num, max_ref


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    sys.stderr.write("Discovering sets (scanning all factions)...\n")
    sets = discover_sets()
    sys.stderr.write(f"\nFound {len(sets)} sets: {', '.join(sorted(sets.keys()))}\n\n")

    results = {}

    for s in sorted(sets.keys()):
        sys.stderr.write(f"Fetching {s}...")
        sys.stderr.flush()

        refs = fetch_set_references(s)
        max_num, max_ref = extract_max_num(refs)
        results[s] = (len(refs), max_num, max_ref)

        filename = f"generated_test_{s}.txt"
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, "w", newline="\n") as f:
            for ref in refs:
                f.write(f"1 {ref}\n")

        sys.stderr.write(f" {len(refs)} cards (max #{max_num}) -> {filename}\n")
        sys.stderr.flush()

    # Summary
    sys.stderr.write(f"\n{'Set':12s} {'Cards':>6s} {'Max #':>6s}  Max Reference\n")
    sys.stderr.write(f"{'-'*12} {'-'*6} {'-'*6}  {'-'*40}\n")
    for s in sorted(results.keys()):
        count, max_num, max_ref = results[s]
        sys.stderr.write(f"{s:12s} {count:6d} {max_num:6d}  {max_ref}\n")

    sys.stderr.write(f"\nDone. Files written to {OUTPUT_DIR}\n")


if __name__ == "__main__":
    main()
