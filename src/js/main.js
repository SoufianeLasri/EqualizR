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
        this.stroke1
        this.stroke3
        this.stroke2
        this.guiControls
        this.tick = Date.now()
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
        this.camera.position.set( 0, 0, 100 )
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
        // this.effect.renderToScreen = true
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
        this.stroke1 = new Stroke( 7, 0.05, 7, new THREE.Vector4( 0.17, 0.59, 0.87, 1 ) )
        this.scene.add( this.stroke1 )
        this.to1 = this.stroke1.wavesHeight

        this.stroke2 = new Stroke( 4, 0.1, 4, new THREE.Vector4( 0.91, 0.29, 0.21, 1 ) )
        this.scene.add( this.stroke2 )
        this.to2 = this.stroke2.wavesHeight

        this.stroke3 = new Stroke( 2, 0.03, 6, new THREE.Vector4( 0.12, 0.29, 0.21, 1 ) )
        this.scene.add( this.stroke3 )
        this.to3 = this.stroke3.wavesHeight
    }

    initGUI() {
        this.guiControls = {
            // positionX: 0,
            // positionY: 0,
            positionZ: 100,

            nIntensity: 10.0,
            sIntensity: 0.65,
            sCount: 4096,
            grayscale: 0
        }

        const datGUI = new dat.GUI()
        // datGUI.add( this.guiControls, 'positionX', -50, 50 ).step( 1 )
        // datGUI.add( this.guiControls, 'positionY', -50, 50 ).step( 1 )
        datGUI.add( this.guiControls, 'positionZ', 1, 100 ).step( 1 )

        datGUI.add( this.guiControls, 'nIntensity', 0.0, 10.0).step( 1 )
        datGUI.add( this.guiControls, 'sIntensity', 0.0, 10.0 ).step( 1 )
        datGUI.add( this.guiControls, 'sCount', 0, 8192 ).step( 1 )
        datGUI.add( this.guiControls, 'grayscale', 0.0, 1.0 ).step( 1 )
    }

    animate() {
        this.render()
    }

    render() {
        const time = Date.now() - this.tick

        if ( ( time / 1000 ) > ( this.sound.duration / 5000 ) ) {
            this.stroke1.update()
            this.stroke2.update()
            this.stroke3.update()
            this.camera.rotation.z = Math.PI / 180 * this.stroke1.counter - Math.PI / 180 * 90

            this.tick = Date.now()
        }

        this.camera.position.x = this.stroke1.vertices[ this.stroke1.counter ].x
        this.camera.position.y = this.stroke1.vertices[ this.stroke1.counter ].y
        this.camera.position.z = this.guiControls.positionZ

        // this.camera.lookAt( this.stroke1.vertices[ this.stroke1.counter ] )

        let sum = 0
        for ( let i = 0; i < this.sound.getData().time.length; i++ ) {
            sum += this.sound.getData().time[ i ]
        }

        const averageTime = sum / this.sound.getData().time.length

        this.to1 = averageTime / 100
        this.stroke1.wavesHeight += ( this.to1 - this.stroke1.wavesHeight ) * .4

        this.to2 = averageTime / 50
        this.stroke2.wavesHeight += ( this.to2 - this.stroke2.wavesHeight ) * .4

        this.to3 = averageTime / 30
        this.stroke3.wavesHeight += ( this.to3 - this.stroke3.wavesHeight ) * .4

        // Tween.to( this.stroke1, 0.5,
        // { wavesHeight: averageTime / 30 } )

        this.renderer.render( this.scene, this.camera )

        const change = this.clock.getDelta()
        this.effect.uniforms.time.value = change * 100
        this.effect.uniforms.nIntensity.value = this.guiControls.nIntensity
        this.effect.uniforms.sIntensity.value = this.guiControls.sIntensity
        this.effect.uniforms.sCount.value = this.guiControls.sCount
        this.effect.uniforms.grayscale.value = this.guiControls.grayscale
        // this.composer.render()
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
