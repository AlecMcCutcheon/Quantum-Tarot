# Quantum Random API Reference

Extracted from `Get-QuantumRandom` (PowerShell). Use these endpoints and assets in the React app; higher-level features (shuffle, GUID, passwords, etc.) are **client-side logic** built on top of the ETH QRNG API and GitHub-hosted data files.

---

## External HTTP APIs

### 1. ETH Zurich QRNG — random integers

| Field | Value |
|-------|--------|
| **Base URL** | `http://qrng.ethz.ch/api/randint` |
| **Method** | `GET` |
| **Query params** | `min`, `max`, `size` |

**Example**

```
GET http://qrng.ethz.ch/api/randint?min=0&max=100&size=5
```

**Response shape** (used in script as `.result`):

```json
{
  "result": [42, 7, 91, 3, 55]
}
```

| Param | Script default | Notes |
|-------|----------------|-------|
| `min` | `0` | Inclusive lower bound (`Int32` range) |
| `max` | `2147483647` (`Int32.MaxValue`) | Inclusive upper bound |
| `size` | `1` | Count of integers to return |

**Used for:** core RNG, array index picks, shuffle batches, GUID nibbles, IPv4 octets, datetime parts, GPS digits, password indices.

---

### 2. ETH Zurich QRNG — random unit floats

| Field | Value |
|-------|--------|
| **Base URL** | `http://qrng.ethz.ch/api/rand` |
| **Method** | `GET` |
| **Query params** | `size` |

**Example**

```
GET http://qrng.ethz.ch/api/rand?size=5
```

**Response shape:**

```json
{
  "result": [0.123456789, 0.987654321, ...]
}
```

Values are in **(0, 1)** (script treats them as strings like `"0.123..."`).

**Used when:** `Decimals !== 0` and **not** shuffling — combined with `randint` results to build numbers like `integer.fractionalDigits` (see [Decimal mode](#decimal-mode-non-shuffle)).

---

### 3. Word list — QDictionary

| Field | Value |
|-------|--------|
| **URL** | `https://raw.githubusercontent.com/AlecMcCutcheon/Get-QuantumRandom/main/QDictionary.txt` |
| **Method** | `GET` |
| **Body** | Plain text, one entry per line (`\n`-split) |

**Script behavior:** drops the last line after split (`[0..($count - 2)]`), then passes lines as `InputArray` into integer-pick or shuffle logic.

---

### 4. Password character sets — QCharSets

| Field | Value |
|-------|--------|
| **URL** | `https://raw.githubusercontent.com/AlecMcCutcheon/Get-QuantumRandom/main/QCharSets` |
| **Method** | `GET` |
| **Body** | JSON object |

**Expected properties** (from script usage):

```json
{
  "Uppercase": ["A", "B", ...],
  "Lowercase": ["a", "b", ...],
  "Number": ["0", "1", ...],
  "Special": ["!", "@", ...]
}
```

Indexed by quantum random integers when building passwords.

---

## Client-side retry (port from PowerShell)

`Invoke-RestMethodWithRetry` behavior to mirror in React/fetch:

| Setting | Value |
|---------|--------|
| Max attempts | 5 |
| Delay between failures | 1 second |
| On total failure | return `undefined` / handle empty |

Only **ETH QRNG** calls use retry in the script; GitHub fetches for dictionary/charset do **not**.

---

## Response handling summary

| Source | Path in response | Type |
|--------|------------------|------|
| `randint` | `result` | `number[]` |
| `rand` | `result` | `number[]` (0–1 floats) |
| `QDictionary.txt` | raw text → `string[]` | lines |
| `QCharSets` | parsed JSON | `{ Uppercase, Lowercase, Number, Special }` |

---

## Feature → API mapping

Features below call **`randint`** (and sometimes **`rand`**) unless noted.

### Core integer RNG (`QRNG_Main`)

```
randint?min={min}&max={max}&size={size}
```

### Decimal mode (non-shuffle)

When `decimals !== 0` and not shuffling:

1. `randint?min={min}&max={max}&size={size}`
2. `rand?size={size}`

For each pair `(integer, float)`:

- If `decimals === -1`: decimal digit count = length of `integer` without minus sign.
- Else: use `decimals` as fractional digit count.
- Take float string, strip leading `0.`, pad to 16 chars, take first `decimalNum` chars, append: `{integer}.{fractional}`.

### Array pick (`InputArray`, no shuffle)

- Set effective `max = inputArray.length - 1`.
- `randint` with that range → use each value as index into `inputArray`.
- `size > 1`: map all indices; `size === 1`: single element.

### Array shuffle (`InputArray` + `Shuffle`)

No extra HTTP API. Algorithm:

1. Collect unique random indices in `[0, inputArray.length)` via repeated `randint` batches until count > `inputArray.length`.
2. Batch size starts at `min(inputArray.length, 500000)`, doubles each loop (cap `500000`).
3. Place `inputArray[i]` at `outputArray[randNum]` when `randNum < length`; filter nulls.

### Dictionary mode (`-Dictionary`)

1. `GET` QDictionary.txt
2. Then array pick or shuffle on lines (same as above).

### GUID mode (`-GUID`)

Per GUID, **32×** `randint?min=0&max=15&size=32` → hex chars → format as UUID `8-4-4-4-12`. Repeat `size` times.

### IPv4 mode (`-IPv4`)

**Public** (`size` addresses):

```
randint?min=1&max=255&size=4  → join with "."
```

**Private** (`-Private`):

```
"10." + randint?min=0&max=255&size=2 (joined) + "." + randint?min=1&max=255&size=1
```

### DateTime mode (`-DateTime`)

Per datetime (clamp years 1–9999):

| Step | Call |
|------|------|
| Year | `randint(min=MinimumYear, max=MaximumYear, size=1)` |
| Month | `randint(1, 12)` |
| Day | `randint(1, daysInMonth(year, month) + 1)` — script uses `Maximum = daysInMonth + 1` |
| Time | `randint(0, 86400)` seconds from midnight |

Build date at 00:00:00, add seconds, format as locale datetime string.

### GPS mode (`-GPSCoords`)

Per coordinate set:

| Part | Logic |
|------|--------|
| Latitude | `randint(-90, 90)`; if not ±90, append `.` + 5 digits `randint(0, 9) × 5` |
| Longitude | `randint(-180, 180)`; same fractional rule |

Optional **Google Maps URL** (client-only, no API):

```
https://www.google.com/maps/place/{latRounded}+{lngRounded}/@{lat},{lng},2z/data=!3m1!1e3
```

(Rounded to 5 decimal places in script.)

### Password mode (`-Password`)

1. `GET` QCharSets (no retry in script).
2. Per password:
   - `randint(1, 4, length)` — charset bucket per position
   - `randint(0, 25, length)` — uppercase indices
   - `randint(0, 25, length)` — lowercase indices
   - `randint(0, 9, length)` — digit indices
   - `randint(0, Special.length - 1, length)` — special indices
3. Force one char from each class at start, fill rest from bucket picks, then **shuffle** the char array via quantum shuffle, **join** to string.

---

## Quantum-only policy (Quantum Tarot app)

The app **never** falls back to local pseudo-randomness for draws. You choose one provider in Settings:

1. **Outshift** — `POST https://api.qrng.outshift.com/api/v1/random_numbers` with header `x-id-api-key` (from Settings UI or `OUTSHIFT_QRNG_API_KEY` in `.env.local`)
2. **qrandom.io** — `GET /api/random/int`, mapped to `{ result: number[] }`

ETH Zurich (`qrng.ethz.ch`) and ANU (`qrng.anu.edu.au`) are not used. If the selected source fails, the draw returns HTTP 503.

### Outshift request shape (proxy)

```json
POST /api/v1/random_numbers
Headers: x-id-api-key: <your key>
Body: {
  "encoding": "raw",
  "format": "decimal",
  "bits_per_block": <computed from min/max>,
  "number_of_blocks": <size>
}
```

Response `random_numbers[].decimal` is mapped into `{ result: number[] }` for the app.

## React / fetch notes

| Topic | Recommendation |
|-------|------------------|
| **CORS** | `qrng.ethz.ch` may block browser `fetch` from arbitrary origins. Use a dev proxy or small backend proxy in production if requests fail. |
| **Mixed content** | Script uses `http://` for ETH API; browsers on HTTPS may block. Prefer HTTPS if ETH provides it, or proxy server-side. |
| **GitHub raw** | Usually CORS-friendly for `raw.githubusercontent.com`; still verify in browser. |
| **Types** | Define `QrngIntResponse`, `QrngFloatResponse`, `QCharSets` interfaces matching shapes above. |
| **Caching** | QRNG GET URLs must be cache-busted; identical URLs were returning stale values in some browsers. |

---

## Minimal TypeScript types

```ts
export interface QrngIntResponse {
  result: number[];
}

export interface QrngFloatResponse {
  result: number[];
}

export interface QCharSets {
  Uppercase: string[];
  Lowercase: string[];
  Number: string[];
  Special: string[];
}

export interface QrngIntParams {
  min?: number;
  max?: number;
  size?: number;
}

export const QRNG_RANDINT = "http://qrng.ethz.ch/api/randint";
export const QRNG_RAND = "http://qrng.ethz.ch/api/rand";
export const QDICTIONARY_URL =
  "https://raw.githubusercontent.com/AlecMcCutcheon/Get-QuantumRandom/main/QDictionary.txt";
export const QCHARSETS_URL =
  "https://raw.githubusercontent.com/AlecMcCutcheon/Get-QuantumRandom/main/QCharSets";
```

---

## Quick reference — all URLs

```
GET http://qrng.ethz.ch/api/randint?min={min}&max={max}&size={size}
GET http://qrng.ethz.ch/api/rand?size={size}
GET https://raw.githubusercontent.com/AlecMcCutcheon/Get-QuantumRandom/main/QDictionary.txt
GET https://raw.githubusercontent.com/AlecMcCutcheon/Get-QuantumRandom/main/QCharSets
```

Optional (not an API): Google Maps place URL built from lat/lng as shown in [GPS mode](#gps-mode--qgpscoords).
