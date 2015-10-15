import THREE from 'three'
const glslify = require( 'glslify' )

export default class Stroke extends THREE.Object3D {
    constructor( duration ) {
        super()
        // this.width = width
        // this.position = position
        this.duration = duration
        this.objectResolution = 0
        this.radius = 40
        this.wavesAmount = 9
        this.wavesHeight = 0.1 * this.radius

        this.counter = 0
        this.speedIncrementer = this.counter
        this.smoothPourcent = 1

        this.geometry = new THREE.Geometry()

        this.countVertices = 360
        this.vertices = []
        for( let i = 0; i < this.countVertices; i++ ) {
            this.vertices.push( new THREE.Vector3() )
        }
        this.geometry.vertices = this.vertices
        this.geometry.verticesNeedUpdate = true
        // this.material = new THREE.LineBasicMaterial( { color: 0xffffff } );
        this.material = new THREE.ShaderMaterial( {
            vertexShader: glslify( './shaders/vertexShader.glsl' ),
            fragmentShader: glslify( './shaders/fragmentShader.glsl' ),
                transparent: true,
                blending: THREE.AdditiveBlending
        } )

        this.material.linewidth = 10

        this.mesh = new THREE.Line( this.geometry, this.material )

        this.add( this.mesh )
    }

    update() {

        let newPositions = []
        let radiusAddon = 0

        let x = 0
        let y = 0
        let z = 0

        let vertice = null
        for ( let i = 0; i <= this.objectResolution; i++ ) {
            const angle = Math.PI / 180 * i
            radiusAddon = this.wavesHeight * this.smoothPourcent * Math.sin( ( angle + this.counter / 100 ) * this.wavesAmount )

            x = ( this.radius + radiusAddon ) * Math.cos( angle )
            y = ( this.radius + radiusAddon ) * Math.sin( angle )
            z = 0

            vertice = this.vertices[ i ]
            vertice.x = x
            vertice.y = y
            vertice.z = z
        }

        for( let i = this.objectResolution; i < this.countVertices; i++ ) {
            vertice = this.vertices[ i ]
            vertice.x = x
            vertice.y = y
            vertice.z = z
        }

        if( this.objectResolution < this.countVertices - 1 ) {
            this.objectResolution++
        } else {
            const v = this.vertices[ 0 ]
            vertice = this.vertices[ this.countVertices - 1 ]
            vertice.x = v.x
            vertice.y = v.y
            vertice.z = v.z
        }
        // console.log( this.objectResolution )

        // this.geometry.vertices = newPositions
        this.geometry.verticesNeedUpdate = true
        this.counter++
    }
}
