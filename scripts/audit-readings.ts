/**
 * Audit built readings for minimum depth. Run: npm run audit:readings
 */
import { buildAllReadings } from "../src/data/readings/buildReadings.ts";
import { loadReadingDepth } from "../src/data/readings/readingDepthLoader.ts";
import { frameReadingForOrientation } from "../src/lib/readingOrientationFraming.ts";
import type { Orientation } from "../src/types/deck.ts";

const ORIENTATIONS: Orientation[] = [
  "upright",
  "reversed",
  "transverse",
  "conjugate",
];

export const DETAIL_MIN = 800;
export const GUIDANCE_MIN = 120;
export const SUMMARY_MIN = 80;

interface Row {
  cardId: string;
  orientation: Orientation;
  detailLen: number;
  guidanceLen: number;
  summaryLen: number;
  ok: boolean;
}

function audit(): { rows: Row[]; failures: Row[] } {
  const readings = buildAllReadings();
  const rows: Row[] = [];

  for (const card of readings) {
    for (const orientation of ORIENTATIONS) {
      const raw = card[orientation];
      const reading = frameReadingForOrientation(raw, orientation);
      const detailLen = reading.detail.length;
      const guidanceLen = reading.guidance.length;
      const summaryLen = reading.summary.length;
      const ok =
        detailLen >= DETAIL_MIN &&
        guidanceLen >= GUIDANCE_MIN &&
        summaryLen >= SUMMARY_MIN;
      rows.push({
        cardId: card.cardId,
        orientation,
        detailLen,
        guidanceLen,
        summaryLen,
        ok,
      });
    }
  }

  const failures = rows.filter((r) => !r.ok);
  return { rows, failures };
}

async function main(): Promise<void> {
  const failOnShort = process.argv.includes("--fail");
  const cardFilter = process.argv.find((a) => a.startsWith("--card="))?.slice(7);

  await loadReadingDepth();
  const { rows, failures } = audit();
  const filtered = cardFilter
    ? rows.filter((r) => r.cardId === cardFilter)
    : rows;

  const short = cardFilter
    ? filtered.filter((r) => !r.ok)
    : failures;

  console.log(
    `Readings audit: ${rows.length - failures.length}/${rows.length} pass ` +
      `(detail≥${DETAIL_MIN}, guidance≥${GUIDANCE_MIN}, summary≥${SUMMARY_MIN})`,
  );

  if (cardFilter) {
    for (const r of filtered) {
      const mark = r.ok ? "OK" : "SHORT";
      console.log(
        `${mark}  ${r.cardId} ${r.orientation}  detail=${r.detailLen}  guidance=${r.guidanceLen}  summary=${r.summaryLen}`,
      );
    }
  } else {
    const byCard = new Map<string, Row[]>();
    for (const r of short) {
      const list = byCard.get(r.cardId) ?? [];
      list.push(r);
      byCard.set(r.cardId, list);
    }
    const sorted = [...byCard.entries()].sort((a, b) => {
      const minA = Math.min(...a[1].map((x) => x.detailLen));
      const minB = Math.min(...b[1].map((x) => x.detailLen));
      return minA - minB;
    });
    for (const [cardId, poles] of sorted) {
      const parts = poles
        .map((p) => `${p.orientation[0]}:${p.detailLen}`)
        .join(" ");
      console.log(`${cardId}  ${parts}`);
    }
  }

  if (failOnShort && failures.length > 0 && !cardFilter) {
    process.exit(1);
  }
}

void main();
