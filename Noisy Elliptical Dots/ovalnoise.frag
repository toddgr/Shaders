#version 330 compatibility


//FRAG FILE
uniform float uTol;		// width fo the blend between ellipse and non-ellipse areas
uniform float uAd;		// ellipse diameter for s
uniform float uBd;		// ellipse diameter for t

uniform float uAlpha;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler2D Noise2;

float sc;
float tc;

in vec2 vST;
in vec3 vColor;
in float vLightIntensity;

const vec3 WHITE = vec3(1., 1., 1.);


void main() {
	
	vec4 nv = texture2D( Noise2, uNoiseFreq * vST );
	
	float s = vST.s;
	float t = vST.t;

	float Ar = uAd/2;
	float Br = uBd/2;

	int numins = int(s/uAd);
	int numint = int(t/uBd);

	// give the noise a range of [-1., +1.]

	float n = nv.r + nv.g + nv.b + nv.a;		// 1. -> 3.
	n = n - 2;									// -1. -> 1.
	n = n * uNoiseAmp;

	// determine the color based on the noise-modified (s,t):
	sc = float(numins) * uAd + Ar;
	tc = float(numint) * uBd + Br;
	
	float ds = vST.s - sc;						// wrt ellipse center
	float dt = vST.t - tc;						// wrt ellipse center

	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist;			// this could be < 1., = 1., or > 1.

	
	ds = ds * scale;		// scale ds and dt, then divide both by Ar and Br
	dt = dt * scale;
	ds = ds / Ar;
	dt = dt / Br;

	float d = ds*ds + dt*dt;									// compute d using the new ds and dt

	float x = smoothstep(1.-uTol, 1.+uTol, d);

	vec3 rgb = vLightIntensity * mix(WHITE, vColor, x);			// keep
	gl_FragColor = vec4(rgb, 1.);								// keep
}