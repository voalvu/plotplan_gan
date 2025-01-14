//import * as THREE from 'three';
import gsap from "https://unpkg.com/gsap@3.12.5/index.js";
import CameraControls from 'https://unpkg.com/camera-controls@2.3.4/dist/camera-controls.module.js';
CameraControls.install( { THREE: THREE } );

const width = window.innerWidth;
const height = window.innerHeight;
const clock = new THREE.Clock();
//const scene = new THREE.Scene();
 camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 100 );
camera.position.set( 0, 0, 5 );
const renderer = new THREE.WebGLRenderer();
//renderer.setSize( width, height );
//document.body.appendChild( renderer.domElement );

const cameraControls = new CameraControls( camera, renderer.domElement );

const gridHelper = new THREE.GridHelper( 50, 50 );
gridHelper.rotation.x = - Math.PI / 2;
gridHelper.position.z = 0.5;
scene.add( gridHelper );

const axesHelper = new THREE.AxesHelper();
axesHelper.material.depthTest = false;
scene.add( axesHelper );


let mesh = boundingBox

renderer.render( scene, camera );

( function anim () {

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    const updated = cameraControls.update( delta );

    // if ( elapsed > 30 ) { return; }

    requestAnimationFrame( anim );

    if ( updated ) {

        renderer.render( scene, camera );
        console.log( 'rendered' );

    }

} )();

const DEG90 = Math.PI * 0.5;
const DEG180 = Math.PI;

function rotateTo( side ) {

    switch ( side ) {

        case 'front':
            cameraControls.rotateTo( 0, DEG90, true );
            gsap.to( gridHelper.position, { duration: 0.8, x: 0, y: 0, z:  0.5 } );
            gsap.to( gridHelper.rotation, { duration: 0.8, x: - DEG90, y: 0, z: 0 } );
            break;

        case 'back':
            cameraControls.rotateTo( DEG180, DEG90, true );
            gsap.to( gridHelper.position, { duration: 0.8, x: 0, y: 0, z:  - 0.5 } );
            gsap.to( gridHelper.rotation, { duration: 0.8, x: - DEG90, y: 0, z: 0 } );
            break;

        case 'up':
            cameraControls.rotateTo( 0, 0, true );
            gsap.to( gridHelper.position, { duration: 0.8, x: 0, y: 1, z: 0 } );
            gsap.to( gridHelper.rotation, { duration: 0.8, x: 0, y: 0, z: 0 } );
            break;

        case 'down':
            cameraControls.rotateTo( 0, DEG180, true );
            gsap.to( gridHelper.position, { duration: 0.8, x: 0, y: - 1, z: 0 } );
            gsap.to( gridHelper.rotation, { duration: 0.8, x: 0, y: 0, z: 0 } );
            break;

        case 'right':
            cameraControls.rotateTo( DEG90, DEG90, true );
            gsap.to( gridHelper.position, { duration: 0.8, x: 1, y: 0, z: 0 } );
            gsap.to( gridHelper.rotation, { duration: 0.8, x: - DEG90, y: 0, z: DEG90 } );
            break;

        case 'left':
            cameraControls.rotateTo( - DEG90, DEG90, true );
            gsap.to( gridHelper.position, { duration: 0.8, x: - 1, y: 0, z: 0 } );
            gsap.to( gridHelper.rotation, { duration: 0.8, x: - DEG90, y: 0, z: DEG90 } );
            break;

    }

}

function paddingInCssPixel( top, right, bottom, left ) {

    const fov = camera.fov * THREE.MathUtils.DEG2RAD;
    const rendererHeight = renderer.getSize( new THREE.Vector2() ).height;

    const boundingBox = new THREE.Box3();
/*         scene.traverse((object) => {
            console.log(object)
        if (object instanceof THREE.Mesh) {
            boundingBox.expandByObject(object);
        }
        }); */
    const size = boundingBox.getSize( new THREE.Vector3() );
    const boundingWidth  = size.x;
    const boundingHeight = size.y;
    const boundingDepth  = size.z;

    var distanceToFit = cameraControls.getDistanceToFitBox( boundingWidth, boundingHeight, boundingDepth );
    var paddingTop = 0;
    var paddingBottom = 0;
    var paddingLeft = 0;
    var paddingRight = 0;

    // loop to find almost convergence points
    for ( var i = 0; i < 10; i ++ ) {

        const depthAt = distanceToFit - boundingDepth * 0.5;
        const cssPixelToUnit = ( 2 * Math.tan( fov * 0.5 ) * Math.abs( depthAt ) ) / rendererHeight;
        paddingTop = top * cssPixelToUnit;
        paddingBottom = bottom * cssPixelToUnit;
        paddingLeft = left * cssPixelToUnit;
        paddingRight = right * cssPixelToUnit;

        distanceToFit = cameraControls.getDistanceToFitBox(
            boundingWidth + paddingLeft + paddingRight,
            boundingHeight + paddingTop + paddingBottom,
            boundingDepth
        );

    }

    cameraControls.fitToBox( mesh, true, { paddingLeft: paddingLeft, paddingRight: paddingRight, paddingBottom: paddingBottom, paddingTop: paddingTop } );

}

// make variable available to browser console
globalThis.cameraControls = cameraControls;
globalThis.mesh = mesh;
globalThis.rotateTo = rotateTo;
globalThis.paddingInCssPixel = paddingInCssPixel;