#version 330 compatibility

// VERTEX SHADER

uniform float uA;		// constant that controls the amplitude of the surface
uniform float uK;		// frequency constant

out vec3 	vNs;		// Surface normal
out vec3 	vEs;		// Eye position
out vec3 	vMC;		// Modelview coordinates


// Sincwave function
float
Sinc( float r, float k )
{
	if( r == 0. )
		return 1.;
	return sin(r*k) / (r*k);
}


// Helper function to derive the sincwave
float
DerivSinc( float r, float k )
{
	if( r == 0. )
		return 0;
	return ( r*k*cos(r*k) - sin(r*k) ) / ( r*k*r*k );
}


void main() {
	
	vMC = gl_Vertex.xyz;

	// THE SINC FUNCTION
	vec4 newVertex = gl_Vertex;
	float r = sqrt( newVertex.x*newVertex.x + newVertex.y*newVertex.y );
	// more efficient: float r = length( newVertex.xy );
	newVertex.z = uA * Sinc( r, uK );
	
	// GETTING THE NORMAL
	vec4 ECposition = gl_ModelViewMatrix * newVertex;

	// Each tangent is determined by taking calculus derivatives
	float dzdr = uA * DerivSinc( r, uK );
	float drdx = newVertex.x / r;
	float drdy = newVertex.y / r;
	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;

	// Form the tangent vectors
	vec3 xtangent = vec3(1., 0., dzdx );
	vec3 ytangent = vec3(0., 1., dzdy );

	// This is the new normal that gets multiplied by gl_NormalMatrix.
	vec3 newNormal = normalize( cross( xtangent, ytangent ) );		
	vNs = gl_NormalMatrix * newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. );
		// vector from the eye position to the point


	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}