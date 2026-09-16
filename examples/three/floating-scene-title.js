// Source and revision: SOURCE.md. Copyright 2026 Andrew White; OFL.txt.
import * as THREE from 'three';

// A game supplies the sculpted logo; this component owns its shared choreography and safe placement.
// Keep the root directly under the scene. Decorative letter/glint motion belongs to the artwork.
export const floatingTitleProfile = Object.freeze({ id: 'floating-scene-title-v1',
  arrivalSeconds: 1, bobDistance: .025, bobFrequency: 1.4, turnDistance: .065,
  turnFrequency: .75, exitDistance: 3.5, exitDamping: 5.5 });

export class FloatingSceneTitle {
  constructor(root, { position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 } = {}) {
    this.root = root; this.position = new THREE.Vector3(...position);
    this.rotation = rotation; this.scale = scale; this.age = 0; this.exit = 0; this.wasVisible = false;
    this.fittedPosition = this.position.clone(); this.fittedScale = scale;
    root.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(root);
    this.corners = [];
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y])
      for (const z of [bounds.min.z, bounds.max.z]) this.corners.push(new THREE.Vector3(x, y, z));
  }

  fit(camera, region) {
    const root = this.root;
    root.position.copy(this.position); root.rotation.set(...this.rotation); root.scale.setScalar(this.scale);
    camera.updateMatrixWorld(true);
    // Two projection passes account for the logo's depth without flattening it to a text plane.
    for (let pass = 0; pass < 2; pass++) {
      root.updateMatrixWorld(true);
      const points = this.corners.map(p => p.clone().applyMatrix4(root.matrixWorld).project(camera));
      const bounds = new THREE.Box3().setFromPoints(points), size = bounds.getSize(new THREE.Vector3());
      const ratio = Math.min(region.width * 2 / size.x, region.height * 2 / size.y);
      root.scale.multiplyScalar(ratio * .92); // margin for authored glints and the gentle turn
      const center = bounds.getCenter(new THREE.Vector3());
      const depth = root.position.clone().project(camera).z;
      const from = new THREE.Vector3(center.x, center.y, depth).unproject(camera);
      const to = new THREE.Vector3((region.x + region.width / 2) * 2 - 1,
        1 - (region.y + region.height / 2) * 2, depth).unproject(camera);
      root.position.add(to.sub(from));
    }
    this.fittedPosition.copy(root.position); this.fittedScale = root.scale.x;
  }

  update(dt, visible, reducedMotion = false, camera = null, region = null, idleAmount = 1) {
    const p = floatingTitleProfile;
    if (visible && !this.wasVisible) this.age = 0;
    this.wasVisible = visible; this.age += dt;
    this.exit = reducedMotion ? (visible ? 0 : 1) : THREE.MathUtils.damp(this.exit, visible ? 0 : 1, p.exitDamping, dt);
    this.root.visible = this.exit < .98 && (!region || (region.width > 0 && region.height > 0));
    if (!this.root.visible) return;
    if (visible && camera && region) this.fit(camera, region);
    const t = reducedMotion ? 0 : this.age;
    const amount = Number.isFinite(idleAmount) ? Math.max(0, Math.min(1, idleAmount)) : 1;
    const arrival = reducedMotion ? 1 : THREE.MathUtils.smoothstep(this.age, 0, p.arrivalSeconds);
    this.root.position.copy(this.fittedPosition);
    this.root.position.y += Math.sin(t * p.bobFrequency) * p.bobDistance * amount + this.exit * p.exitDistance;
    this.root.rotation.set(this.rotation[0], this.rotation[1] + Math.sin(t * p.turnFrequency) * p.turnDistance * amount
      - (1 - arrival) * .65 + this.exit * .6, this.rotation[2] + Math.sin(t) * .010 * amount);
    this.root.scale.setScalar(this.fittedScale * (.82 + arrival * .18) * (1 - this.exit * .75));
  }
}
