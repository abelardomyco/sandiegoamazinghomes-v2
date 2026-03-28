/**
 * One-time helper: insert six micro-sections before ## Internal Links (standard)
 * or before ## Rosamelia notes (alternate format).
 * Run: node scripts/add-neighborhood-microsections.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEIGHBORHOODS = path.join(__dirname, "../content/neighborhoods");

const MARKER_STANDARD = "## Internal Links";
const MARKER_ALT = "## Rosamelia notes";

const blocks = {
  "point-loma.md": `## What you're close to

- Shelter Island marinas and sportfishing docks
- Liberty Station reuse district
- Cabrillo National Monument and tide pools
- Sunset Cliffs overlook pockets
- Harbor Drive toward downtown and the airport

## Where people go from here

- Airport and harbor jobs love the minutes.
- Downtown via Harbor Drive when traffic behaves.

## Daily convenience

- Peninsula loops mean everything is around the bend by car.
- Boating errands are real errands here.

## Weekend pattern

- Tide pools, seafood on the docks, cliff sunsets, Liberty Station markets.

## Hidden reality

- Fog shelf and Cliffs parking on warm Saturdays are weekend math everyone relearns.

## Trade-up / trade-down

- Hillcrest or Mission Hills buyers chasing salt; Ocean Beach or beach towns when sand-on-foot wins.

`,
  "pacific-beach.md": `## What you're close to

- Garnet and Grand corridors
- Crystal Pier and the boardwalk
- Mission Bay across Grand
- Kate Sessions Park up the hill
- The 5 when you need to leave the beach strip

## Where people go from here

- Bikes on the boardwalk to nearby work pockets; 5 to the job spine.
- La Jolla or Mission Bay when you want different water.

## Daily convenience

- Garnet handles food; inland blocks stay quieter for sleep.
- Parking is the hidden calendar item.

## Weekend pattern

- Early beach claim, volleyball, Garnet nights, bay side trips.

## Hidden reality

- Lease-heavy blocks versus owner-heavy streets feel like different neighborhoods late at night.

## Trade-up / trade-down

- Rent years to first buy; north PB or Bay Park when sleep beats bass.

`,
  "la-mesa.md": `## What you're close to

- La Mesa Village core
- Mt Helix panhandle views
- Lake Murray trailhead
- 125 connector toward Spring Valley
- The 8 west into central San Diego

## Where people go from here

- 8 toward downtown; 94 east toward mountain towns.
- Beach or Coronado when the afternoon opens up.

## Daily convenience

- Village errands are park-and-walk; tracts stay quick car hops.
- School pickup patterns set the afternoon clock.

## Weekend pattern

- Village brunch, Helix drives, coast runs as a treat.

## Hidden reality

- Mesa lip versus canyon floor can shift temperature and AC use faster than newcomers expect.

## Trade-up / trade-down

- El Cajon and Santee buyers stepping toward a village; Mission Valley or coastal when commute priority flips.

`,
  "el-cajon.md": `## What you're close to

- Fletcher Hills ridgelines
- Main Street corridor
- Parkway Plaza retail zone
- Santee and lakes country to the north

## Where people go from here

- 8 west to city jobs; 67 north toward mountain towns.
- Sorrento Valley when traffic allows a long diagonal.

## Daily convenience

- Strip retail is fast; foothill pockets add minutes to every straight-line map.
- Youth sports complexes anchor Saturdays.

## Weekend pattern

- Lake runs, youth tournaments, apple-season trips in fall.

## Hidden reality

- Gillespie Field flight paths matter on specific blocks; check before you fall in love with the backyard.

## Trade-up / trade-down

- City Heights or southeast buyers chasing space; La Mesa or Santee when the village pull hits.

`,
  "national-city.md": `## What you're close to

- Bayfront and port-adjacent strips
- Mile of Cars history and commercial corridors
- 805 and 54 merge zone
- Downtown San Diego minutes north

## Where people go from here

- Port logistics, medical corridors, and central SD job bases.
- Silver Strand beaches when you want salt without the tourist crush.

## Daily convenience

- Small-lot grid means tight parking discipline.
- Quick tacos on Broadway are a real weekly rhythm.

## Weekend pattern

- South Bay mall runs, pier trips, family parks.

## Hidden reality

- Rail and industrial buffers create pockets buyers either value for access or rule out fast.

## Trade-up / trade-down

- Southeast San Diego move-ups for location; Chula Vista or Bonita when school names move the needle.

`,
  "chula-vista.md": `## What you're close to

- Third Avenue Village and older core blocks
- Bayfront trails and marina edges
- Otay Ranch town centers to the east
- Olympic Training Center country further east

## Where people go from here

- 805 and 5 triangle to every job pole in the county.
- Border-adjacent work without living on the busiest crossings.

## Daily convenience

- West versus east Chula Vista are different commute spreadsheets and heat profiles.
- Harbor walks reward west-side evenings.

## Weekend pattern

- Eastlake fields, harbor strolls, taco crawls on Broadway.

## Hidden reality

- Bay breeze west, hotter bake east; AC stories do not match across the same city name.

## Trade-up / trade-down

- National City or San Ysidro buyers chasing space; Coronado or Point Loma when the budget stretches to salt polish.

`,
  "eastlake.md": `## What you're close to

- Eastlake retail clusters
- Otay Lakes reservoir views
- Eastern Chula Vista ridges
- 125 and 805 for north or border-adjacent work

## Where people go from here

- South Bay job bases; downtown hauls when traffic is kind.
- Coronado beach runs on good traffic days.

## Daily convenience

- HOA parks and school bells set the weekly clock.
- Errands batch along planned arterials.

## Weekend pattern

- Youth tournaments, reservoir rims, family barbecues that end before Sunday school night.

## Hidden reality

- Mello-Roos lines belong in the real monthly model, not the back of an envelope.

## Trade-up / trade-down

- Older Chula Vista tracts trading for newer roofs; Carmel Valley or Carlsbad when work shifts north.

`,
  "otay.md": `## What you're close to

- Otay Ranch town squares
- 905 belt and Otay Mesa commerce
- Brown hills framing the valley
- Chula Vista core to the west

## Where people go from here

- Border logistics and southern job bases; occasional downtown hauls.
- Beaches as a deliberate drive, not a walk.

## Daily convenience

- Newer roads and big parking plates favor cars over stroller miles between strips.
- Evening retail runs cluster around the town squares.

## Weekend pattern

- Cinema clusters, South Bay beaches, soccer complexes.

## Hidden reality

- Santa Ana wind days and warehouse edges are honest context on some lots.

## Trade-up / trade-down

- Central Chula Vista buyers chasing newer product; north county if the job dot moves.

`,
  "imperial-beach.md": `## What you're close to

- Imperial Beach pier and Estuary trails
- Silver Strand toward Coronado
- Palm Avenue corridor
- Tijuana Estuary to the south

## Where people go from here

- South Bay biotech pockets; downtown when traffic cooperates.
- Coronado bridge for big-box runs.

## Daily convenience

- Small-town errand loop; major shops mean Chula Vista or a bridge crossing.
- Bikes work flat blocks; hills are limited.

## Weekend pattern

- Morning pier walks, estuary birding, Seacoast sunset beers.

## Hidden reality

- Headlines about water quality come and go; buyers either price that emotionally or they do not.

## Trade-up / trade-down

- Nestor or Ocean View steps toward sand; Coronado or Point Loma when polish and schools pull harder.

`,
  "poway.md": `## What you're close to

- Old Poway Park and the heritage railroad
- Lake Poway trailhead
- Poway Road retail spine
- I-15 for Escondido or Temecula runs

## Where people go from here

- Sorrento Valley and PQ office pockets; downtown when meetings demand it.
- Beach as a weekend destination, not a Tuesday commute.

## Daily convenience

- Driving is the default; school and sports maps set the week.
- Batch errands along Poway Road.

## Weekend pattern

- Lake hikes, youth sports, slow Sundays near the park.

## Hidden reality

- Inland heat is real in August; coastal friends forget you live twenty degrees warmer.

## Trade-up / trade-down

- Mira Mesa or Scripps Ranch orbiters chasing schools; Rancho Bernardo or 4S when work moves north.

`,
  "little-italy.md": `## What you're close to

- India Street dining row
- Waterfront Park and the Broadway Pier
- County Civic Center edge
- Santa Fe Depot and trolley fingers

## Where people go from here

- Walking distance to courts, offices, and harbor events.
- Airport via short rideshare; Coronado ferry for a different dinner vector.

## Daily convenience

- Groceries and coffee on foot; car stays parked for days.
- Guest parking is the recurring puzzle.

## Weekend pattern

- Mercato mornings, gallery strolls, Padres nights when schedules align.

## Hidden reality

- Cruise ships and convention weeks change sidewalk density more than locals predict from a Tuesday tour.

## Trade-up / trade-down

- Suburban empty-nesters selling yards; East Village or Point Loma when towers or salt air call.

`,
  "carlsbad.md": `## What you're close to

- Carlsbad Village and the beach
- Legoland and family attractions
- Flower Fields seasonal color
- Tamarack and South Ponto surf access
- The 5 for Sorrento Valley or LA runs

## Where people go from here

- Biotech coast jobs; downtown San Diego as an occasional long commute.
- Oceanside train for a different coastal day.

## Daily convenience

- Village pockets walk; inland tracts are suburban car rhythm.
- School and sports complexes fill weekday maps.

## Weekend pattern

- Beach mornings, village coffee, Legoland passes until the kids age out.

## Hidden reality

- Same city spans tourist magnets and quiet cul-de-sacs; know which one you are buying.

## Trade-up / trade-down

- Encinitas or San Marcos buyers needing schools and sand; Del Mar when sticker shock inverts.

`,
  "bonita.md": `## What you're close to

- Rohr Park fields and playgrounds
- Bonita Road retail spine
- Chula Vista core to the west
- Sweetwater Reservoir context

## Where people go from here

- 805 north to downtown job pockets; South Bay employers close to home.
- Coronado or the beach as a weekend run.

## Daily convenience

- Driving is normal; school zones set morning pacing.
- Errands cluster along Bonita Road.

## Weekend pattern

- Park leagues, backyard gatherings, short drives to the bay.

## Hidden reality

- Bonita reads suburban on a map but still feels South Bay in traffic math and heat.

## Trade-up / trade-down

- Chula Vista buyers chasing a quieter nameplate; Eastlake or Otay when newer roofs win.

`,
  "rancho-del-rey.md": `## What you're close to

- Eastlake and Otay Ranch amenities
- 805 and H Street corridors
- Chula Vista shopping without downtown bustle
- South Bay ridges toward the reservoir

## Where people go from here

- South Bay jobs; downtown when the calendar demands it.
- Otay Ranch town squares for dinner without a long haul.

## Daily convenience

- Cul-de-sac quiet with strip-mall practicality a few minutes away.
- School pickup routes define the afternoon.

## Weekend pattern

- Youth sports, park playdates, Costco restocks.

## Hidden reality

- It feels like a small town until you merge onto the 805 at the wrong hour.

## Trade-up / trade-down

- Older Chula Vista tracts trading for HOA parks; north county if work relocates.

`,
};

function insertBeforeMarker(content, marker, insert) {
  const i = content.indexOf(marker);
  if (i === -1) return { ok: false, reason: `missing ${marker}` };
  if (content.includes("## What you're close to")) return { ok: false, reason: "already has micro-sections" };
  const before = content.slice(0, i).replace(/\s*$/, "");
  const after = content.slice(i);
  return { ok: true, out: `${before}\n\n${insert}${after}` };
}

let updated = 0;
let skipped = 0;
for (const [file, insert] of Object.entries(blocks)) {
  const fp = path.join(NEIGHBORHOODS, file);
  if (!fs.existsSync(fp)) {
    console.error("Missing file:", fp);
    continue;
  }
  const raw = fs.readFileSync(fp, "utf8");
  let r = insertBeforeMarker(raw, MARKER_STANDARD, insert);
  if (!r.ok) r = insertBeforeMarker(raw, MARKER_ALT, insert);
  if (!r.ok) {
    console.error(file, r.reason);
    skipped++;
    continue;
  }
  fs.writeFileSync(fp, r.out, "utf8");
  console.log("Updated", file);
  updated++;
}
console.log("Done. Updated:", updated, "Skipped:", skipped);
