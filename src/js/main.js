import dat from 'dat-gui'
import THREE from 'three'
import sound from './sound/sound'
import domready from 'domready'

class Equalizr {
    constructor() {
        this.scene
        this.camera
        this.renderer
        this.guiControls
        this.innerWidth = window.innerWidth
        this.innerHeight = window.innerHeight
        this.container = document.getElementById( 'canvas' )

        this.init()
    }

    // CREATE THE SCENE, THE CAMERA AND THE RENDERER
    init() {

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera( 90, this.innerWidth / this.innerHeight, 1, 1000 )
        this.camera.position.set( 0, 0, 20 )
        // this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) )

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor( 0xffffff, 1 )
        this.renderer.setSize( this.innerWidth, this.innerHeight )
        this.renderer.autoClear = false
        this.container.appendChild( this.renderer.domElement )

        this.createScene()
        this.initGUI()

        this.resize()
        window.addEventListener( 'resize', this.resize.bind( this ), false )

        this.animate()
    }

    createScene() {
        let sphereGeometry = new THREE.SphereGeometry( 10, 32, 32 )
        let sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
        let sphere = new THREE.Mesh( sphereGeometry, sphereMaterial )
        this.scene.add( sphere )

        this.camera.lookAt( sphere.position )
    }

    initGUI() {
        this.guiControls = new function() {
            this.positionX = 0
            this.positionY = 0
            this.positionZ = 20
        }

        let datGUI = new dat.GUI()
        datGUI.add( this.guiControls , 'positionX', -500, 500 )
        datGUI.add( this.guiControls , 'positionY', -500, 500 )
        datGUI.add( this.guiControls , 'positionZ', -500, 500 )
    }

    animate() {
        this.render()
    }

    render() {
        this.camera.position.x = this.guiControls.positionX
        this.camera.position.y = this.guiControls.positionY
        this.camera.position.z = this.guiControls.positionZ

        this.renderer.render( this.scene, this.camera )

        requestAnimationFrame( this.animate.bind(this) )
    }

    resize() {
        this.innerWidth = window.innerWidth
        this.innerHeight = window.innerHeight

        this.camera.aspect = this.innerWidth / this.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize( this.innerWidth, this.innerHeight )
    }
}

domready(() => {
    let equalizR = new Equalizr()
});
