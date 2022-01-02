import Delaunator from "delaunator";
import { Contract, providers } from "ethers";
import { ABI, RPC_URL_97, GEM_CONTRACT } from "../constants";

const CATEGORY_MAP = ["DIAMOND", "CRYSTAL", "GEM"];

export default async function renderGEM(tokenId) {
  // query token attributes
  const attributes = await fetchTokenMetadata(tokenId);
  const geometrical = generatorImage(attributes.geometrical.map((g) => [g[0] * 1.2 + 30, g[1] * 1.2 + 30]));

  const res = renderBlueprint({
    title: "GEM project",
    geometrical,
    category: CATEGORY_MAP[+attributes.category],
    engraving: attributes.engraving,
    color: toColorHexString(attributes.color),
    clarity: attributes.clarity,
    luster: attributes.luster,
    hardness: attributes.hardness,
    tokenId,
  });
  return res;
}

function toColorHexString(number) {
  String.prototype.zfill = function (size) {
    var s = "000000000" + this;
    return s.slice(s.length - size);
  };
  const r = ((number & 0xff0000) >>> 16).toString(16).zfill(2);
  const g = ((number & 0xff00) >>> 8).toString(16).zfill(2);
  const b = (number & 0xff).toString(16).zfill(2);
  return `#${r}${g}${b}`.toUpperCase();
}

async function fetchTokenMetadata(tokenId) {
  const provider = new providers.JsonRpcProvider(RPC_URL_97);

  const gemContract = new Contract(GEM_CONTRACT, ABI.GEM, provider);
  const attributes = await gemContract.getAttributes(tokenId);
  const engraving = await gemContract.engraving(1);
  const engraver = await gemContract.engraver(1);

  return { engraver, engraving, ...attributes };
}

export function generatorImage(points) {
  var w = 840;
  var h = 840;

  var minX = Infinity;
  var minY = Infinity;
  var maxX = -Infinity;
  var maxY = -Infinity;

  for (var i = 0; i < points.length; i++) {
    var x = points[i][0];
    var y = points[i][1];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  var ratio = 2 / Math.max(maxX - minX, maxY - minY);

  function getX(i) {
    return points[i][0];
  }
  function getY(i) {
    return points[i][1];
  }
  console.time("delaunay");
  var delaunay = Delaunator.from(points);
  console.timeEnd("delaunay");

  var triangles = delaunay.triangles;

  var svg = `<g height="${h}" width="${w}" style="margin: 20px">`;

  const fileColor = ["#ffffff15", "#ffffff07", "#ffffff09", "#ffffff11", "#ffffff13", "#ffffff15"];

  for (var i = 0, a = 0; i < triangles.length; i += 3, a++) {
    var p0 = triangles[i];
    var p1 = triangles[i + 1];
    var p2 = triangles[i + 2];
    svg += `<path d="M${getX(p0)} ${getY(p0)} L${getX(p1)} ${getY(p1)} L${getX(p2)} ${getY(p2)} Z" style="fill: ${fileColor[i % 3]}; stroke: white; stroke-width: 1" />`;
  }

  for (var i = 0; i < points.length; i++) {
    const p0 = points[i][0];
    const p1 = points[i][1];
    svg += `<circle cx="${p0}" cy="${p1}" r="5" style="fill:white;" />`;
  }
  svg += "</g>";
  return svg;
}

function renderBlueprint({ title, geometrical, category, engraving, color, clarity, luster, hardness, tokenId }) {
  return `<svg width="900" height="1020" xmlns="http://www.w3.org/2000/svg">
  <style>
    .text {
      fill: #ffffff80;
    }
    .text-tag {
      fill: #296bbe;
      font-size: 12px;
    }
    .grid-frame {
      fill: #296bbe;
      stroke: #ffffff80;
    }
  </style>
  <defs>
    <pattern x="24" y="24" id="smallGrid" width="12" height="12" patternUnits="userSpaceOnUse">
      <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#ffffffcc" stroke-width="0.5" />
    </pattern>
    <pattern x="30" y="30" id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <rect width="120" height="120" fill="url(#smallGrid)" />
      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#ffffffcc" stroke-width="1" />
    </pattern>
  </defs>
    <title>${title}</title>
  <g>
    <rect class="grid-frame" x="0" y="0" width="900" height="1020" stroke-width="0" />
    <rect class="grid-frame" x="20" y="20" width="860" height="980" stroke-width="3" />
    <rect class="grid-frame" x="30" y="30" width="840" height="960" stroke-width="2" />
    <rect x="30" y="30" width="840" height="960" fill="url(#grid)" />
  </g>
  <!-- 镌刻文字 -->
  <text class="text" x="40" y="980" width="50%">${engraving}</text>
  <!-- 属性box -->
  <g>
    <rect x="582" y="870" width="288" height="120" fill="#296bbe" stroke="#ffffffcc" stroke-width="0.5" />
    <text class="text" x="600" y="900">${category} #${tokenId}</text>
    <g>
      <rect ry="3" rx="3" fill="#ffffffcc" height="21" width="21" y="915" x="600" />
      <text font-size="12px" fill="#296bbe" class="text-tag" y="930" x="606">C</text>
      <text class="text" y="930" x="630">${color}</text>
    </g>
    <g>
      <rect ry="3" rx="3" fill="#ffffffcc" height="21" width="21" y="945" x="600" />
      <text font-size="12px" fill="#296bbe" class="text-tag" y="960" x="606">C</text>
      <text class="text" y="960" x="630">${clarity}</text>
    </g>
    <g>
      <rect ry="3" rx="3" fill="#ffffffcc" height="21" width="21" y="915" x="750" />
      <text font-size="12px" fill="#296bbe" class="text-tag" y="930" x="756">L</text>
      <text class="text" y="930" x="786">${luster}</text>
    </g>
    <g>
      <rect ry="3" rx="3" fill="#ffffffcc" height="21" width="21" y="944" x="750" />
      <text font-size="12px" fill="#296bbe" class="text-tag" y="959" x="756">H</text>
      <text class="text" y="960" x="786">${hardness}</text>
    </g>
  </g>
  <g>${geometrical}</g>
</svg>`;
}
