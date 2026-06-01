// ============================================================================
//  SITE CONFIG  — the only file you normally need to edit for keys / endpoints.
// ============================================================================

// ----- Contact form ---------------------------------------------------------
// Order of preference: Web3Forms → Formspree → mailto fallback (zero-config).
//
//  1) WEB3FORMS (recommended — delivers straight to your inbox): create a free
//     access key at https://web3forms.com and paste it below. When set, the form
//     POSTs to Web3Forms and the message lands in the email tied to the key.
//
//  2) FORMSPREE: create a form at https://formspree.io and paste its endpoint
//     into FORMSPREE_ENDPOINT, e.g. "https://formspree.io/f/abcdwxyz".
//
// Leave BOTH blank to use the mailto fallback (opens the visitor's mail app).
export const WEB3FORMS_ACCESS_KEY = "ff53a6ab-753f-4bd7-9f20-dad781362dd0";
export const FORMSPREE_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

// ----- Map ------------------------------------------------------------------
// By default the map uses Google's KEYLESS embed (no API key required).
// If you'd rather use the official Google Maps Embed API, set your key here and
// the MapPanel will switch to it automatically. (Get a key in Google Cloud →
// "Maps Embed API".)
export const GOOGLE_MAPS_EMBED_KEY = ""; // e.g. "AIzaSy..."

export const LOCATION = {
  label: "639 Lonsdale Street, Melbourne VIC 3000",
  query: "639 Lonsdale Street, Melbourne VIC 3000, Australia",
  lat: -37.812,
  lng: 144.957,
};

// ----- Personal --------------------------------------------------------------
export const CONTACT = {
  email: "2singhyeshwant@gmail.com",
  phone: "+61481329663",
  phoneDisplay: "+61 481 329 663",
  linkedin: "https://www.linkedin.com/in/singhyeshwant",
};

// ----- AI assistant ----------------------------------------------------------
// The conversational assistant embedded in the floating "Ask my AI" window and
// linked from the Projects section. Hosted separately (GitHub Pages).
export const ASSISTANT_URL = "https://singhyeshwant.github.io/assistant/";

// ============================================================================
//  3D MODEL TUNING
//  The torso .glb is centered at the origin, ~2 units tall (Y up). Its motion is
//  driven by SCROLL in a left-then-right arc:
//    hero        back to you, centred, behind the quote
//    About       slides RIGHT, turns to FACE RIGHT, sinks under About's text
//    Experience  rides on the RIGHT, facing right
//    Projects    turns its BACK to you (the long way), then the cards scroll over it
//    (reappears) glides to the LEFT, turning to a clean dead-LEFT profile
//    Skills/Edu  rides on the LEFT, facing strictly left
//    Contact     sweeps back to the RIGHT and turns to FACE YOU (a touch left, looking down)
//  It also tilts a little in 3D as you scroll. You can DRAG to nudge it (the nudge
//  eases back). See TorsoModel.jsx for the choreography.
// ============================================================================
export const MODEL = {
  url: "assets/model/torso.glb", // resolved through asset() at load time

  // ---- the "facings" (radians). Camera looks down -Z, local +Z is front.
  // The second half turns the LONG way (via the back), so the values keep climbing
  // past π instead of dropping below 0 — that's what makes it turn the other way.
  // If your model loads facing the wrong way, nudge BASE_ROTATION_Y by ±Math.PI.
  BASE_ROTATION_Y: Math.PI, //  back to you (hero) — also the BACK it turns to over Projects
  FACE_RIGHT_YAW: Math.PI / 2, //  front points RIGHT (About → Experience, on the right)
  FACE_LEFT_YAW: (3 * Math.PI) / 2, //  front points LEFT — reached by turning PAST the back
  CONTACT_YAW: 2 * Math.PI - 0.22, //  at contact: faces you, a touch toward the left
  CONTACT_PITCH: 0.16, //  at contact: looks slightly DOWN, into your eyes (not up)

  // ---- a little 3D tilt while scrolling (pitch = nod, roll = lean). Small. ----
  TILT_PITCH: 0.13, //  nod while it turns to face right
  TILT_PITCH_FRONT: 0, //  level once its back is to you over the projects
  TILT_ROLL: -0.12, //  lean while turning right
  TILT_ROLL_FRONT: 0, //  level afterwards — keeps the left profile clean & straight

  // ---- vertical placement + size ----
  POS_Y: -0.12,
  SCALE: 1.5,
  POS_Y_MOBILE: -0.05,
  SCALE_MOBILE: 1.04,

  // ---- where it slides to on the RIGHT (About → Experience → over Projects) ----
  RIGHT_X: 1.6,
  RIGHT_X_MOBILE: 0.25,
  // ---- where it rides on the LEFT (Skills → Education) ----
  LEFT_X: -1.6,
  LEFT_X_MOBILE: -0.25,
  // ---- where it settles for contact — back on the RIGHT, facing you ----
  CONTACT_X: 1.6,
  CONTACT_X_MOBILE: 0.25,

  // How far it eases BACK in depth as a solid section covers it, so it "sinks
  // inside" smoothly instead of being sliced by the section edge. 0 = off.
  RECEDE_Z: 1.0,

  // ---- drag-to-nudge feel — radians of rotation per pixel of cursor movement ----
  DRAG_YAW: 0.009, // left/right
  DRAG_PITCH: 0.0075, // up/down
  // Clamp the up/down tilt so you can look around it but never see its underside.
  PITCH_MIN: -0.16,
  PITCH_MAX: 0.5,
  // How fast a drag-nudge eases back to the scripted pose (higher = sooner).
  DRAG_DECAY: 3,

  // Faint idle "breathing" (rotation only). Set to 0 to keep it perfectly still.
  SWAY: 0.02,

  // How quickly it follows the scroll script / your cursor (higher = snappier,
  // less laggy). This is a big part of the "make it faster" fix.
  FOLLOW: 22,
};

// Camera
export const CAMERA = { position: [0, 0, 5], fov: 40, near: 0.1, far: 100 };
