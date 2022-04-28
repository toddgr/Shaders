#version 330 compatibility

// FRAGMENT SHADER

uniform sampler3D 	Noise3;
uniform float 		uNoiseAmp;		// Noise amplitude
uniform float 		uNoiseFreq;		// Noise frequency

uniform float 		uEta;			// Index of refraction
uniform float 		uMix;			// Blends the reflective and refractive versions of scene
uniform float 		uWhiteMix;		// 

uniform samplerCube	uReflectUnit;		//
uniform samplerCube	uRefractUnit;		//

in vec3 vMC;
in vec3 vNs;
in vec3 vEs;

const vec4 WHITE = vec4(1., 1., 1., 1.);


// Calculate the normals at every point
vec3 RotateNormal( float angx, float angy, vec3 n ) {
	float cx = cos( angx );
	float sx = sin( angx );
	float cy = cos( angy );
	float sy = sin( angy );

	// rotate about x:
	float yp = n.y*cx - n.z*sx;		// y'
	n.z = n.y*sx + n.z*cx;			// z'
	n.y = yp;
	// n.x = n.x;

	// rotate about y:
	float xp = n.x*cy + n.z*sy;		// x'
	n.z = -n.x*sy + n.z*cy;			// z'
	n.x = xp;
	// n.y = n.y;

	return normalize( n );
}

void main() {

	// USE PER-FRAGMENT LIGHTING, starting with the per-fragment shader we looked at in class.
	vec3 Normal = vNs;		// Need to unitize this?
	vec3 Eye = vEs;			// Need to unitize this?

	// BUMP MAPPING
	vec4 nvx = texture( Noise3, uNoiseFreq * vMC );
	vec4 nvy = texture( Noise3, uNoiseFreq * vec3(vMC.xy, vMC.z + 0.5) );

	float angx = nvx.r + nvx.g + nvx.b + nvx.a;	// 1. -> 3.
	angx = angx - 2.;				// -1. -> 1.
	angx *= uNoiseAmp;

	float angy = nvy.r + nvy.g + nvy.b + nvy.a;	// 1. -> 3.
	angy = angy - 2.;				// -1. -> 1.
	angy *= uNoiseAmp;

	Normal = RotateNormal(angx, angy, Normal);
	Normal = normalize( gl_NormalMatrix * Normal );

	vec3 reflectVector = reflect( Eye, Normal);
	vec4 reflectColor = texture(uReflectUnit, reflectVector);
	
	vec3 refractVector = refract( Eye, Normal, uEta);
	vec4 refractColor;
	vec4 color;
	
	if( all( equal( refractVector, vec3(0., 0., 0.) ) ) )
	{
		color = reflectColor;
	}
	else {
		refractColor = texture( uRefractUnit, refractVector );
		color = mix( refractColor, reflectColor, uMix );
		color = mix( color, WHITE, uWhiteMix );
	}

	gl_FragColor = vec4(color.rgb, 1.);

}