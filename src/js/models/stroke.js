import THREE from 'three'
const glslify = require( 'glslify' )

export default class Stroke extends THREE.Object3D {
    constructor( lineWidth, wavesHeight, wavesAmount, color ) {
        super()

        this.objectResolution = 0
        this.radius = 40
        this.color = color
        this.wavesAmount = wavesAmount
        this.wavesHeight = wavesHeight * this.radius

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
        this.material = new THREE.LineBasicMaterial( { color: 0xffffff } );
        this.material = new THREE.ShaderMaterial( {
            vertexShader: glslify( './shaders/vertexShader.glsl' ),
            fragmentShader: glslify( './shaders/fragmentShader.glsl' ),
            uniforms: {
                color: {
                    type: 'v4',
                    value: new THREE.Vector4( 1, 1, 1, 1 )
                }
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        } )
        this.material.side = THREE.DoubleSide
        this.material.uniforms.color.value = this.color

        this.material.linewidth = lineWidth

        this.mesh = new THREE.Line( this.geometry, this.material )

        this.add( this.mesh )
    }

    update() {
        const angle = Math.PI / 180 * this.counter
        const radiusAddon = this.wavesHeight * this.smoothPourcent * Math.sin( ( angle + this.counter / 100 ) * this.wavesAmount )

        const x = ( this.radius + radiusAddon ) * Math.cos( angle )
        const y = ( this.radius + radiusAddon ) * Math.sin( angle )
        const z = 0

        let vertice = this.vertices[ this.counter ]
        // console.log( vertice, this.counter )
        vertice.x = x
        vertice.y = y
        vertice.z = z

        for ( let i = this.objectResolution; i < this.countVertices; i++ ) {
            vertice = this.vertices[ i ]
            vertice.x = x
            vertice.y = y
            vertice.z = z
        }

        if ( this.objectResolution < this.countVertices - 1 ) {
            this.objectResolution++
        } else {
            const v = this.vertices[ 0 ]
            vertice = this.vertices[ this.countVertices - 1 ]
            vertice.x = v.x
            vertice.y = v.y
            vertice.z = v.z
        }

        this.geometry.verticesNeedUpdate = true

        if ( this.counter < this.objectResolution ) {
            this.counter++
        }
    }
}
