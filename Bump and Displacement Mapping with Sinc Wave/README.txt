This project implements displacement mapping, bump mapping, and lighting. Displacement mapping uses the "sinc wave", which is a 3D sine-ish wave that decreases in height as you go away from the origin. As seen in the video, the user is able to adjust the frequency and amplitude of the wave. When the wave's values are altered, the fragment shader re-computes its surface normals and lights the scene based on the direction of the normals. The results of this get more interesting when the user alters bump mapping.

In contrast to the displacement map, the bump mapping function only affects the way that the light reacts on the surface of the object. When the user increases the bump mapping frequency and moves the plane to the side, you can see that the bumps aren't really there. In other words, bump mapping is the illusion of texture. For this project, I used noise to create a sort of randomness to the texture.

When the two are combined, the sinc wave looks more wrinkly and the normals are re-computed in terms of both maps. That is why the lighting interacts differently than it would if the texture only had one or the other. 

The user is also able to change the lighting conditions, which includes ambient, specular, and diffuse lighting, as well as the position of the point light itself.

Normal Rotation function and noise TEX files provided by Professor Mike Bailey of Oregon State University.

Link to YouTube demonstration: https://www.youtube.com/watch?v=lil1NUMdix8&t=25s