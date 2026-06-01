import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL } from "../lib/config";
import { asset } from "../lib/asset";

const MODEL_URL = asset(MODEL.url);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
};

const rectOf = (id) => {
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect() : null;
};
const inView = (id) => {
  const r = rectOf(id);
  if (!r) return false;
  const vh = window.innerHeight || 1;
  return r.top < vh * 0.75 && r.bottom > vh * 0.25;
};

// Only let a drag grab the figure where it actually shows (transparent sections).
function figureVisible() {
  return (
    inView("hero") ||
    inView("experience") ||
    inView("skills") ||
    inView("education") ||
    inView("contact")
  );
}

// How far a section has scrolled in: 0 = its top is at the viewport bottom,
// 1 = its top has reached the viewport top.
function enterOf(id) {
  const r = rectOf(id);
  if (!r) return 0;
  const vh = window.innerHeight || 1;
  return clamp((vh - r.top) / vh, 0, 1);
}

/**
 * Scroll-driven 3D figure (left-then-right arc).
 *
 *  hero            → centred, BACK to you, behind the quote; drag to play
 *  About rises     → slides RIGHT + turns to FACE RIGHT, sinking under About's text
 *  Experience      → rides on the RIGHT, facing right (transparent section)
 *  Projects rises  → turns its BACK to you (the long way), then the CARDS scroll over it
 *  reappears       → glides to the LEFT, turning to a clean dead-LEFT profile
 *  Skills/Education → rides on the LEFT, facing strictly left (transparent sections)
 *  Contact         → sweeps back to the RIGHT, faces you (a touch left), looking slightly down
 *
 * It only hides under two opaque things — About's text box and the Projects cards —
 * keyed to their content (their padding is transparent), and it eases back in depth
 * as they cover it so it "sinks inside" rather than being sliced. A drag adds a
 * temporary nudge that eases back to the scripted pose.
 */
export default function TorsoModel({ entered, reduced, isMobile }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef();

  useMemo(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.frustumCulled = false;
        o.castShadow = false;
        o.receiveShadow = false;
        const list = Array.isArray(o.material) ? o.material : [o.material];
        list.forEach((m) => {
          if (!m) return;
          m.transparent = false;
          m.depthWrite = true;
          if ("roughness" in m) m.roughness = Math.min(1, (m.roughness ?? 0.8) + 0.05);
          if ("envMapIntensity" in m) m.envMapIntensity = 0.7;
        });
      }
    });
  }, [scene]);

  // drag adds a TEMPORARY nudge that eases back to the scripted pose
  const dragYaw = useRef(0);
  const dragPitch = useRef(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const enteredRef = useRef(entered);
  useEffect(() => {
    enteredRef.current = entered;
  }, [entered]);

  useEffect(() => {
    const isInteractive = (t) =>
      t && t.closest && t.closest("input,textarea,button,a,select,label,[data-no-drag]");
    const onDown = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      if (!enteredRef.current || !visibleRef.current) return;
      if (isInteractive(e.target)) return;
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      dragYaw.current += dx * MODEL.DRAG_YAW;
      dragPitch.current = clamp(
        dragPitch.current + dy * MODEL.DRAG_PITCH,
        MODEL.PITCH_MIN,
        MODEL.PITCH_MAX
      );
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const cur = useRef({
    x: 0,
    z: 0,
    rotY: MODEL.BASE_ROTATION_Y,
    rotX: 0,
    rotZ: 0,
    scale: 0.0001,
  });
  const posY = isMobile ? MODEL.POS_Y_MOBILE : MODEL.POS_Y;
  const baseScale = isMobile ? MODEL.SCALE_MOBILE : MODEL.SCALE;
  const rightX = isMobile ? MODEL.RIGHT_X_MOBILE : MODEL.RIGHT_X;
  const leftX = isMobile ? MODEL.LEFT_X_MOBILE : MODEL.LEFT_X;
  const contactX = isMobile ? MODEL.CONTACT_X_MOBILE : MODEL.CONTACT_X;

  useFrame((state, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const vh = window.innerHeight || 1;
    visibleRef.current = figureVisible();

    const aR = smooth(enterOf("about")); // slide right + turn to face-right
    // The second-half turns finish a little EARLY (before the section reaches the top
    // of the screen) so the figure is fully settled by the time you read the section.
    const pB = smooth(clamp(enterOf("projects") / 0.6, 0, 1)); // turn its BACK over Projects
    const sL = smooth(clamp(enterOf("skills") / 0.6, 0, 1)); // glide left + dead-LEFT profile
    const cI = smooth(clamp(enterOf("contact") / 0.7, 0, 1)); // sweep right + face you, look down

    // scripted yaw — turned the LONG way (via the back): values keep climbing
    // back → face-right → BACK → face-left → (contact) face-you-ish
    let yaw = lerp(MODEL.BASE_ROTATION_Y, MODEL.FACE_RIGHT_YAW, aR);
    yaw = lerp(yaw, MODEL.BASE_ROTATION_Y, pB); // entering Projects: turns its back
    yaw = lerp(yaw, MODEL.FACE_LEFT_YAW, sL); // → a clean dead-left profile (3π/2)
    yaw = lerp(yaw, MODEL.CONTACT_YAW, cI); // → faces you, a touch toward the left

    // a little 3D tilt as you scroll (pitch = nod, roll = lean)
    let pitch = lerp(0, MODEL.TILT_PITCH, aR);
    pitch = lerp(pitch, MODEL.TILT_PITCH_FRONT, pB);
    pitch = lerp(pitch, MODEL.CONTACT_PITCH, cI); // looks down into your eyes at contact
    let roll = lerp(0, MODEL.TILT_ROLL, aR);
    roll = lerp(roll, MODEL.TILT_ROLL_FRONT, pB); // level afterwards (no lean on the left)
    roll = lerp(roll, 0, cI);

    // scripted x: centre → RIGHT (ride right) → LEFT (ride left) → RIGHT again (contact)
    let tx = lerp(0, rightX, aR);
    tx = lerp(tx, leftX, sL);
    tx = lerp(tx, contactX, cI);

    // ---- "sink inside" as a solid layer covers it (content-aligned) ----
    // It only hides under About's text and under the Projects CARDS; everything
    // after that is transparent so it rides on the left in full view.
    const C = vh * 0.5; // the figure's approx screen centre
    const T = vh * 0.45; // transition span
    const coverOf = (top, bot) =>
      top == null ? 0 : Math.min(clamp((C - top) / T, 0, 1), clamp((bot - C) / T, 0, 1));
    const ab = rectOf("about");
    const aboutPad = window.innerWidth >= 640 ? 144 : 112; // About keeps py-28/36
    const cards = rectOf("proj-cards"); // the project cards' opaque backing
    let cover = 0;
    if (ab) cover = Math.max(cover, coverOf(ab.top + aboutPad, ab.bottom - aboutPad));
    if (cards) cover = Math.max(cover, coverOf(cards.top, cards.bottom));
    const tz = -MODEL.RECEDE_Z * smooth(cover);

    const sway = reduced ? 0 : Math.sin(t * 0.5) * MODEL.SWAY;
    const swayX = reduced ? 0 : Math.sin(t * 0.37) * (MODEL.SWAY * 0.5);

    // ease the drag nudge back to the script when not actively dragging
    if (!dragging.current) {
      dragYaw.current = THREE.MathUtils.damp(dragYaw.current, 0, MODEL.DRAG_DECAY, dt);
      dragPitch.current = THREE.MathUtils.damp(dragPitch.current, 0, MODEL.DRAG_DECAY, dt);
    }

    const targetYaw = yaw + dragYaw.current + sway;
    const targetPitch = pitch + clamp(dragPitch.current, MODEL.PITCH_MIN, MODEL.PITCH_MAX) + swayX;
    const targetRoll = roll;
    const targetScale = entered ? baseScale : 0.0001;

    const follow = dragging.current ? MODEL.FOLLOW * 1.5 : MODEL.FOLLOW;
    cur.current.x = THREE.MathUtils.damp(cur.current.x, tx, follow, dt);
    cur.current.z = THREE.MathUtils.damp(cur.current.z, tz, follow, dt);
    cur.current.rotY = THREE.MathUtils.damp(cur.current.rotY, targetYaw, follow, dt);
    cur.current.rotX = THREE.MathUtils.damp(cur.current.rotX, targetPitch, follow, dt);
    cur.current.rotZ = THREE.MathUtils.damp(cur.current.rotZ, targetRoll, follow, dt);
    cur.current.scale = THREE.MathUtils.damp(cur.current.scale, targetScale, 7, dt);

    group.current.position.set(cur.current.x, posY, cur.current.z);
    group.current.rotation.set(cur.current.rotX, cur.current.rotY, cur.current.rotZ);
    group.current.scale.setScalar(cur.current.scale);
    group.current.visible = cur.current.scale > 0.02;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
