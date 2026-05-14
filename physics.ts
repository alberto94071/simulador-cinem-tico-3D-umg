/**
 * Physics Calculations Library
 * Kinematics and Newton's Three Laws of Motion
 */

const GRAVITY = 9.8; // m/s²

/**
 * Kinematics: Calculate projectile motion
 * y = x*tan(θ) - (g*x²)/(2*v₀²*cos²(θ))
 */
export function calculateTrajectory(
  v0: number, // initial velocity (m/s)
  angle: number, // ramp angle (degrees)
  steps: number = 100
): Array<{ x: number; y: number; t: number }> {
  const angleRad = (angle * Math.PI) / 180;
  const trajectory = [];
  
  // Time to hit ground (when y = 0)
  const timeOfFlight = (2 * v0 * Math.sin(angleRad)) / GRAVITY;
  
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * timeOfFlight;
    const x = v0 * Math.cos(angleRad) * t;
    const y = v0 * Math.sin(angleRad) * t - 0.5 * GRAVITY * t * t;
    
    trajectory.push({ x, y, t });
  }
  
  return trajectory;
}

/**
 * Calculate maximum height of projectile
 */
export function calculateMaxHeight(v0: number, angle: number): number {
  const angleRad = (angle * Math.PI) / 180;
  return (v0 * v0 * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * GRAVITY);
}

/**
 * Calculate range (horizontal distance)
 */
export function calculateRange(v0: number, angle: number): number {
  const angleRad = (angle * Math.PI) / 180;
  return (v0 * v0 * Math.sin(2 * angleRad)) / GRAVITY;
}

/**
 * Calculate time of flight
 */
export function calculateTimeOfFlight(v0: number, angle: number): number {
  const angleRad = (angle * Math.PI) / 180;
  return (2 * v0 * Math.sin(angleRad)) / GRAVITY;
}

/**
 * Newton's First Law: Inertia
 * Object in motion stays in motion unless acted upon by force
 * If motorcycle hits obstacle, rider continues with same velocity
 */
export function calculateRiderVelocity(
  motoVelocity: number,
  angle: number
): { vx: number; vy: number } {
  const angleRad = (angle * Math.PI) / 180;
  return {
    vx: motoVelocity * Math.cos(angleRad),
    vy: motoVelocity * Math.sin(angleRad),
  };
}

/**
 * Newton's Second Law: F = m * a
 * Higher mass requires more force for same acceleration
 */
export function calculateForce(
  mass: number, // kg
  acceleration: number // m/s²
): number {
  return mass * acceleration;
}

/**
 * Newton's Third Law: Action-Reaction
 * Impact force when motorcycle lands
 * F = (m * v) / t (impulse-momentum)
 */
export function calculateImpactForce(
  mass: number, // kg
  velocity: number, // m/s
  impactTime: number = 0.1 // collision duration in seconds
): number {
  const momentum = mass * velocity;
  return momentum / impactTime;
}

/**
 * Check if motorcycle successfully lands on platform
 * Platform location and size parameters
 */
export function checkLanding(
  finalX: number, // final horizontal position
  finalY: number, // final vertical position
  platformStart: number, // platform x start
  platformEnd: number, // platform x end
  platformHeight: number, // platform y height
  tolerance: number = 0.5
): {
  success: boolean;
  message: string;
  distance: number;
} {
  const distance = platformStart - finalX;
  
  if (finalY > platformHeight + tolerance) {
    return {
      success: false,
      message: "TOO LOW - Hit the cliff!",
      distance,
    };
  }
  
  if (finalY < platformHeight - tolerance) {
    return {
      success: false,
      message: "TOO HIGH - Overshot!",
      distance,
    };
  }
  
  if (finalX < platformStart || finalX > platformEnd) {
    return {
      success: false,
      message: "MISSED PLATFORM - Out of range!",
      distance,
    };
  }
  
  return {
    success: true,
    message: "PERFECT LANDING!",
    distance,
  };
}

/**
 * Calculate kinetic energy
 * KE = 0.5 * m * v²
 */
export function calculateKineticEnergy(
  mass: number, // kg
  velocity: number // m/s
): number {
  return 0.5 * mass * velocity * velocity;
}

/**
 * Calculate potential energy at height
 * PE = m * g * h
 */
export function calculatePotentialEnergy(
  mass: number, // kg
  height: number // meters
): number {
  return mass * GRAVITY * height;
}

/**
 * Total mechanical energy
 */
export function calculateTotalEnergy(
  mass: number,
  velocity: number,
  height: number
): number {
  const ke = calculateKineticEnergy(mass, velocity);
  const pe = calculatePotentialEnergy(mass, height);
  return ke + pe;
}

/**
 * Calculate velocity needed for given range
 * Inverse of range formula: v₀ = sqrt((range * g) / sin(2θ))
 */
export function calculateRequiredVelocity(
  desiredRange: number,
  angle: number
): number {
  const angleRad = (angle * Math.PI) / 180;
  return Math.sqrt((desiredRange * GRAVITY) / Math.sin(2 * angleRad));
}

/**
 * Convert angle from degrees to radians
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert angle from radians to degrees
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}
