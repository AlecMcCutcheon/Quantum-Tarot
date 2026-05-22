import type { TarotCard } from "../../types/deck";
import { getCardArtBundle } from "./cardArtConfig";
import { renderCourtEmblem } from "./glyphs/courtSymbols";
import { renderMajorSymbol } from "./glyphs/majorSymbols";
import { getPipPositions } from "./glyphs/pipLayouts";
import { renderSuitSymbolAt } from "./glyphs/suitSymbol";
import { centeredMirrorSymmetry } from "./kaleidoscope";
import type { CenteredMirrorOptions } from "./kaleidoscope";
import type { GlyphSpec } from "./types";

export interface GlyphRenderBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function renderProminentGlyphs(
  card: TarotCard,
  box: GlyphRenderBox,
  hue: number,
): string {
  const { profile, glyph } = getCardArtBundle(card);
  const fill = `hsla(${hue}, 55%, 72%, 0.45)`;
  const stroke = `hsl(${hue}, 75%, 88%)`;
  const strokeDim = `hsla(${hue}, 50%, 60%, 0.35)`;
  const sw = profile.glyphStrokeWidth;

  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const baseScale = (Math.min(box.width, box.height) / 120) * profile.glyphScale;

  const halo =
    profile.showHalo
      ? `<ellipse cx="${cx}" cy="${cy}" rx="${box.width * 0.38}" ry="${box.height * 0.32}" fill="hsla(${hue},40%,25%,0.35)" filter="url(#glyph-halo)"/>`
      : "";

  const inner = renderGlyphSpec(glyph, box, fill, stroke, strokeDim, sw, baseScale);
  const mirrored =
    glyph.kind === "pips"
      ? inner
      : centeredMirrorSymmetry(
          inner,
          cx,
          cy,
          `glyph-${card.id}`,
          glyphMirrorOptions(glyph),
        );

  return `<g id="prominent-glyphs-${card.id}">
    ${halo}
    <g opacity="0.95">${mirrored}</g>
  </g>`;
}

function glyphMirrorOptions(spec: GlyphSpec): CenteredMirrorOptions {
  switch (spec.kind) {
    case "major":
      return { reflectOpacity: 0.32, vertical: true, horizontal: true, diagonal: true };
    case "single":
      return { reflectOpacity: 0.28, vertical: true, horizontal: true, diagonal: false };
    case "court":
      return { reflectOpacity: 0.24, vertical: false, horizontal: true, diagonal: false };
    default:
      return {};
  }
}

function renderGlyphSpec(
  spec: GlyphSpec,
  box: GlyphRenderBox,
  fill: string,
  stroke: string,
  strokeDim: string,
  sw: number,
  baseScale: number,
): string {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  switch (spec.kind) {
    case "major":
      return renderMajorSymbol(spec.majorId, cx, cy, baseScale * 1.35, fill, stroke, sw);

    case "single": {
      const s = baseScale * 2.2;
      return renderSuitSymbolAt(spec.suit, cx, cy, s, { fill, stroke, strokeWidth: sw });
    }

    case "pips": {
      const positions = getPipPositions(spec.count);
      const pipScale =
        spec.count <= 3
          ? baseScale * 1.5
          : spec.count <= 6
            ? baseScale * 1.15
            : spec.count <= 9
              ? baseScale * 0.95
              : baseScale * 0.82;

      const parts: string[] = [];
      for (const pos of positions) {
        const px = box.x + pos.x * box.width;
        const py = box.y + pos.y * box.height;
        parts.push(
          renderSuitSymbolAt(
            spec.suit,
            px,
            py,
            pipScale,
            { fill, stroke, strokeWidth: sw },
            pos.rot ?? 0,
          ),
        );
      }
      // Subtle bounding guide so pips read as a set (e.g. nine cups grid)
      if (spec.count >= 5) {
        parts.unshift(
          `<rect x="${box.x + box.width * 0.22}" y="${box.y + box.height * 0.18}" width="${box.width * 0.56}" height="${box.height * 0.64}" rx="8" fill="none" stroke="${strokeDim}" stroke-width="1" stroke-dasharray="6 8" opacity="0.5"/>`,
        );
      }
      return parts.join("");
    }

    case "court": {
      const courtScale = baseScale * 1.4;
      const suitScale = baseScale * 0.85;
      return (
        renderCourtEmblem(spec.court, cx, cy - 12, courtScale, fill, stroke, sw) +
        renderSuitSymbolAt(spec.suit, cx, cy + 38, suitScale, {
          fill,
          stroke,
          strokeWidth: sw,
        })
      );
    }
  }
}
