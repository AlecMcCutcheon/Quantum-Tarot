export interface KaleidoscopeBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CenteredMirrorOptions {
  /** Opacity of each reflected copy (0–1). */
  reflectOpacity?: number;
  /** Mirror across vertical axis through cx. */
  vertical?: boolean;
  /** Mirror across horizontal axis through cy. */
  horizontal?: boolean;
  /** Mirror across both axes (third ghost). */
  diagonal?: boolean;
}

/**
 * Soft symmetry for centered glyphs: original on top, faint mirrored copies behind.
 * Subtler than full kaleidoscope — no quadrant crop or 45° rotation.
 */
export function centeredMirrorSymmetry(
  innerSvg: string,
  cx: number,
  cy: number,
  uniqueKey: string,
  options: CenteredMirrorOptions = {},
): string {
  const reflectOpacity = options.reflectOpacity ?? 0.3;
  const vertical = options.vertical !== false;
  const horizontal = options.horizontal !== false;
  const diagonal = options.diagonal === true;
  const baseId = `sym-base-${uniqueKey}`;

  const mirror = (sx: number, sy: number, op: number) =>
    `<use href="#${baseId}" transform="translate(${cx},${cy}) scale(${sx},${sy}) translate(${-cx},${-cy})" opacity="${op.toFixed(2)}"/>`;

  const ghosts: string[] = [];
  if (vertical) ghosts.push(mirror(-1, 1, reflectOpacity));
  if (horizontal) ghosts.push(mirror(1, -1, reflectOpacity));
  if (diagonal) ghosts.push(mirror(-1, -1, reflectOpacity * 0.85));

  return `<g>
    ${ghosts.join("")}
    <g id="${baseId}" opacity="1">${innerSvg}</g>
  </g>`;
}

/**
 * Mirror one quadrant into 4-fold symmetry, then rotate 45° for 8-fold kaleidoscope.
 */
export function kaleidoscopeSymmetry(
  innerSvg: string,
  box: KaleidoscopeBox,
  uniqueKey: string,
  clipPathId: string,
): string {
  const mx = box.x + box.width / 2;
  const my = box.y + box.height / 2;
  const hw = box.width / 2;
  const hh = box.height / 2;
  const seedId = `kl-seed-${uniqueKey}`;
  const coreId = `kl-core-${uniqueKey}`;

  return `<g clip-path="url(#${clipPathId})">
  <g transform="translate(${mx},${my})">
    <defs>
      <clipPath id="kl-q-${uniqueKey}"><rect x="0" y="${-hh}" width="${hw}" height="${hh}"/></clipPath>
    </defs>
    <g id="${seedId}" clip-path="url(#kl-q-${uniqueKey})">
      <g transform="translate(${-mx},${-my})">${innerSvg}</g>
    </g>
    <g id="${coreId}">
      <use href="#${seedId}"/>
      <use href="#${seedId}" transform="scale(-1,1)"/>
      <use href="#${seedId}" transform="scale(1,-1)"/>
      <use href="#${seedId}" transform="scale(-1,-1)"/>
    </g>
    <use href="#${coreId}" transform="rotate(45)"/>
  </g>
</g>`;
}
