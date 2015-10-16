import dat from 'dat-gui'
import THREE from 'three'
import sound from './sound/sound'
import domready from 'domready'
import Stroke from './models/stroke'
import CustomCamera from './camera/customCamera'

const EffectComposer = require( 'three-effectcomposer' )( THREE )
const VignetteShader = require( './shaders/VignetteShader.js' )

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

        this.camera = new CustomCamera( 90, this.innerWidth / this.innerHeight, 1, 100 )
        this.camera.position.set( 0, 0, 12 )
        this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) )

        this.renderer = new THREE.WebGLRenderer( { antialias: true } )
        this.renderer.setSize( this.innerWidth, this.innerHeight )
        this.renderer.setClearColor( 0x2c3e50 )
        this.renderer.clear()
        this.container.appendChild( this.renderer.domElement )

        this.composer = new EffectComposer( this.renderer )
        this.composer.addPass( new EffectComposer.RenderPass( this.scene, this.camera ) )

        this.vignetteEffect = new EffectComposer.ShaderPass( THREE.VignetteShader )
        this.vignetteEffect.uniforms.offset.value = 0.6
        this.vignetteEffect.uniforms.darkness.value = 1
        this.vignetteEffect.renderToScreen = true
        this.composer.addPass( this.vignetteEffect )

        this.clock = new THREE.Clock

        this.resize()
        window.addEventListener( 'resize', this.resize.bind( this ), false )

        this.sound.load( 'assets/sound/piano.mp3' )
        this.sound.on( 'start', () => {
            this.createScene( this.sound.duration )
            this.animate()
        })
    }

    createScene( duration ) {
        this.stroke1 = new Stroke( 0, 7, 0.05, 5, new THREE.Vector4( 0.17, 0.59, 0.87, 0.5 ) )
        this.scene.add( this.stroke1 )
        this.to1 = this.stroke1.wavesHeight

        this.stroke2 = new Stroke( 5, 4, 0.1, 4, new THREE.Vector4( 0.91, 0.29, 0.21, 1 ) )
        this.scene.add( this.stroke2 )
        this.to2 = this.stroke2.wavesHeight

        this.stroke3 = new Stroke( 10, 3, 0.03, 6, new THREE.Vector4( 0.12, 0.29, 0.21, 1 ) )
        this.scene.add( this.stroke3 )
        this.to3 = this.stroke3.wavesHeight
    }

    animate() {
        this.render()
    }

    render() {
        const time = Date.now() - this.tick

        if ( ( time / 1000 ) > ( this.sound.duration / this.stroke1.countVertices ) ) {
            this.stroke1.update()
            this.stroke2.update()
            this.stroke3.update()

            this.camera.update( this.stroke1.vertices[ this.stroke1.counter ].x, this.stroke1.vertices[ this.stroke1.counter ].y, Math.PI / 180 * this.stroke1.counter - Math.PI / 180 * 90 )

            switch ( Math.round( this.sound._context.currentTime * 100 / this.sound.duration ) ) {
            case 0:
                this.camera.setFollowLines()
                break
            case 27:
                this.camera.setPan()
                break
            case 40:
                this.camera.setZoomOut()
                break
            case 65:
                this.camera.setTravelling()
                break
            case 100:
                // TODO : Stop request animation frame
                const endTitle = document.getElementById( 'end' )
                endTitle.style.display = 'block'
                endTitle.classList.add( 'show' )
                break
            default:
                break
            }

            this.tick = Date.now()
        }

        let sum = 0
        for ( let i = 0; i < this.sound.getData().time.length; i++ ) {
            sum += this.sound.getData().time[ i ]
        }

        const averageTime = sum / this.sound.getData().time.length

        this.to1 = averageTime / 100
        this.stroke1.soundFreq = ( this.to1 - this.stroke1.wavesHeight ) * 0.5

        this.to2 = averageTime / 50
        this.stroke2.soundFreq = ( this.to2 - this.stroke2.wavesHeight ) * 0.1

        this.to3 = averageTime / 30
        this.stroke3.soundFreq = ( this.to3 - this.stroke3.wavesHeight ) * 0.8

        this.renderer.render( this.scene, this.camera )

        this.composer.render()
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
    const homeTitle = document.getElementById( 'title' )
    homeTitle.classList.add( 'show' )

    homeTitle.addEventListener( 'click', () => {
        homeTitle.classList.remove( 'show' )

        setTimeout( () => {
            homeTitle.style.display = 'none'
            const equalizR = new Equalizr()
        }, 1500 )
    }, false )
} )
