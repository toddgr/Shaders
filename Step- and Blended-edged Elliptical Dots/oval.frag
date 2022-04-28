#version 330 compatibility

// Grace Todd
// Step and Blended-edged Elliptical dots
// Fragment file

uniform float uTol;		// width fo the blend between ellipse and non-ellipse areas
uniform float uAd;		// ellipse diameter for s
uniform float uBd;		// ellipse diameter for t

float sc;
float tc;

in vec2 vST;
in vec3 vColor;
in float vLightIntensity;

const vec3 WHITE = vec3(1., 1., 1.);

void main() {
	float s = vST.s;
	float t = vST.t;

	float Ar = uAd/2;
	float Br = uBd/2;

	int numins = int(s/uAd);
	int numint = int(t/uBd);

	sc = numins * uAd + Ar;
	tc = numint * uBd + Br;
	
	float ds = ((s - sc) / Ar) * ((s - sc) / Ar);

	float dt = ((t - tc) / Br) * ((t - tc) / Br);

	float d = ds + dt;

	float x = smoothstep(1.-uTol, 1.+uTol, d);

	vec3 rgb = vLightIntensity * mix(WHITE, vColor, x);			// keep
	gl_FragColor = vec4(rgb, 1.);								// keep
}