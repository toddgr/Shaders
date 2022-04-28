#version 330 compatibility

// Grace Todd
// Step and Blended-edged Elliptical dots
// Vertex file

out vec3 vColor;
out vec2 vST;
out float vLightIntensity;

const vec3 LIGHTPOS = vec3(0., 0., 10.);

void main() {
	vST = gl_MultiTexCoord0.st;

	vec3 tnorm = normalize(gl_NormalMatrix * gl_Normal);
	vec3 ECposition = (gl_ModelViewMatrix * gl_Vertex).xyz;
	vLightIntensity = abs(dot(normalize(LIGHTPOS - ECposition), tnorm));

	vColor = gl_Color.rgb;
	vec3 MCposition = gl_Vertex.xyz;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}