import dat from 'dat-gui'
import THREE from 'three'
import sound from './sound/sound'
import domready from 'domready'
import Stroke from './models/stroke'
import Tween from 'gsap'

const EffectComposer = require( 'three-effectcomposer' )( THREE )
const FilmShader = require( './shaders/FilmShader')
const RGBShiftShader = require( './shaders/RGBShiftShader')

class Equalizr {
    constructor() {
        this.scene
        this.camera
        this.renderer
        this.stroke
        this.guiControls
        this.sound = sound
        this.innerWidth = window.innerWidth
        this.innerHeight = window.innerHeight
        this.container = document.getElementById( 'canvas' )

        this.init()
    }

    // CREATE THE SCENE, THE CAMERA AND THE RENDERER
    init() {
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera( 90, this.innerWidth / this.innerHeight, 1, 1000 )
        this.camera.position.set( 0, 0, 50 )
        this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) )

        this.renderer = new THREE.WebGLRenderer( { antialias: true } )
        this.renderer.setSize( this.innerWidth, this.innerHeight )
        this.renderer.setClearColor( 0x2c3e50 )
        this.renderer.clear()
        this.container.appendChild( this.renderer.domElement )

        this.initGUI()

        this.composer = new EffectComposer( this.renderer )
        this.composer.addPass( new EffectComposer.RenderPass( this.scene, this.camera ) )

        this.effect = new EffectComposer.ShaderPass( THREE.FilmShader )
        this.effect.uniforms.time.value = 0.0
        this.effect.uniforms.nIntensity.value = this.guiControls.nIntensity
        this.effect.uniforms.sIntensity.value = this.guiControls.sIntensity
        this.effect.uniforms.sCount.value = this.guiControls.sCount
        this.effect.uniforms.grayscale.value = this.guiControls.grayscale
        this.composer.addPass( this.effect )

        this.effect1 = new EffectComposer.ShaderPass( THREE.RGBShiftShader )
        this.effect1.uniforms.amount.value = 0.0015
        this.effect1.renderToScreen = true
        this.composer.addPass( this.effect1 )

        this.clock = new THREE.Clock

        this.resize()
        window.addEventListener( 'resize', this.resize.bind( this ), false )

        this.sound.load( 'assets/sound/example.mp3' )
        this.sound.on( 'start', () => {
            this.createScene( this.sound.duration )
            this.animate()
        })
    }

    createScene( duration ) {
        this.stroke = new Stroke( duration )
        this.scene.add( this.stroke )
    }

    initGUI() {
        this.guiControls = new function() {
            this.positionX = 0
            this.positionY = 0
            this.positionZ = 50

            this.nIntensity = 10.0
            this.sIntensity = 0.65
            this.sCount = 4096
            this.grayscale = 0.9
        }

        const datGUI = new dat.GUI()
        // datGUI.add( this.guiControls, 'positionX', -50, 50 )
        // datGUI.add( this.guiControls, 'positionY', -50, 50 )
        // datGUI.add( this.guiControls, 'positionZ', -50, 50 )

        datGUI.add( this.guiControls, 'nIntensity', 0.0, 10.0 )
        datGUI.add( this.guiControls, 'sIntensity', 0.0, 10.0 )
        datGUI.add( this.guiControls, 'sCount', 0, 8192 )
        datGUI.add( this.guiControls, 'grayscale', 0.0, 1.0 )
    }

    animate() {
        this.render()
    }

    render() {
        this.stroke.update()
        // this.camera.position.x = this.guiControls.positionX
        // this.camera.position.y = this.guiControls.positionY
        // this.camera.position.z = this.guiControls.positionZ

        const change = this.clock.getDelta()
        this.effect.uniforms.time.value = change * 100;
        this.effect.uniforms.nIntensity.value = this.guiControls.nIntensity
        this.effect.uniforms.sIntensity.value = this.guiControls.sIntensity
        this.effect.uniforms.sCount.value = this.guiControls.sCount
        this.effect.uniforms.grayscale.value = this.guiControls.grayscale
        this.composer.render()

        let sum = 0
        for ( let i = 0; i < this.sound.getData().time.length; i++ ) {
            sum += this.sound.getData().time[ i ]
        }

        const averageTime = sum / this.sound.getData().time.length

        Tween.to( this.stroke, 0.5,
        { wavesHeight: averageTime / 30 } )

        this.renderer.render( this.scene, this.camera )
        requestAnimationFrame( this.animate.bind( this ) )
    }

    resize() {
        this.innerWidth = window.innerWidth
        this.innerHeight = window.innerHeight

        this.camera.aspect = this.innerWidth / this.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize( this.innerWidth, this.innerHeight )
    }
}

domready( () => {
    const equalizR = new Equalizr()
} )

// function convertRange( value, r1, r2 ) {
//     return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
// }

// convertRange( 328.17, [ 300.77, 559.22 ], [ 1, 10 ] );
