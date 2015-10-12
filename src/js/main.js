var dat = require( 'dat-gui' )
var THREE = require( 'three' )

require( './vendors/DeviceOrientationControls' )
require( './vendors/StereoEffect' )
require( './vendors/OrbitControls' )

var scene, camera, renderer

// CREATE THE SCENE, THE CAMERA AND THE RENDERER
function init() {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 )
    camera.position.set( 0, 0, -1 )
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) )

    renderer = new THREE.WebGLRenderer()
    renderer.setClearColor( 0xffffff, 1 )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.autoClear = false
    document.getElementById( 'canvas' ).appendChild( renderer.domElement )

    // createScene()

    resize()
    window.addEventListener( 'resize', resize, false )
}

function createScene() {
    var sphereGeometry = new THREE.SphereGeometry( 100, 32, 32 )
    var sphereMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/images/photospheres/photosphere.jpg' ) } )
    sphereMaterial.minFilter = THREE.LinearFilter
    var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial )
    sphere.scale.x = -1
    scene.add( sphere )
}

function animate() {
    requestAnimationFrame( animate )
    render()
}

function render() {
    renderer.render( scene, camera )
}

function resize() {
    screenWidth = window.innerWidth
    screenHeight = window.innerHeight

    camera.aspect = screenWidth / screenHeight
    camera.updateProjectionMatrix()

    renderer.setSize( screenWidth, screenHeight )
}

window.onload = function () {
    init()
    animate()
}
