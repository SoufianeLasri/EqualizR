import THREE from 'three'
const glslify = require( 'glslify' )

export default class Stroke extends THREE.Object3D {
    constructor( zPosition, lineWidth, wavesHeight, wavesAmount, color ) {
        super()

        this.objectResolution = 0
        this.radius = 100
        this.color = color
        this.zPosition = zPosition
        this.wavesAmount = wavesAmount
        this.wavesHeight = wavesHeight * this.radius
        this.soundFreq = 0

        this.counter = 0
        this.speedIncrementer = this.counter
        this.smoothPourcent = 1

        this.geometry = new THREE.Geometry()

        this.countVertices = 5000
        this.vertices = []

        for ( let i = 0; i < this.countVertices; i++ ) {
            this.vertices.push( new THREE.Vector3() )
        }

        this.geometry.vertices = this.vertices
        this.geometry.verticesNeedUpdate = true
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
        const radiusAddon = ( this.wavesHeight * this.smoothPourcent * Math.sin( ( angle + this.counter / 100 ) * this.wavesAmount ) ) * this.soundFreq
        this.zPosition -= 0.001

        const x = ( this.radius + radiusAddon ) * Math.cos( angle ) * 0.1
        const y = ( this.radius + radiusAddon ) * Math.sin( angle ) * 0.1
        const z = this.zPosition

        let vertice = this.vertices[ this.counter ]
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
        }

        this.geometry.verticesNeedUpdate = true
        this.geometry.computeBoundingSphere()

        if ( this.counter < this.objectResolution ) {
            this.counter++
            this.radius -= 0.02
        }
    }

    drawLine( lineMaterial, x1, y1, z1, x2, y2, z2, thickness ) {
        for ( let i = 0; i < thickness * 2; i++ ) {
            const routerLine1Geometry = new THREE.Geometry()
            routerLine1Geometry.vertices.push( new THREE.Vector3( x1, y1 + i / 4, z1 ) )
            routerLine1Geometry.vertices.push( new THREE.Vector3( x2, y2 + i / 4, z2 ) )
            const routerLine1 = new THREE.Line( routerLine1Geometry, lineMaterial )

            this.add( routerLine1 )
        }

        for ( let i = 0; i < thickness * 2; i++ ) {
            const routerLine1Geometry = new THREE.Geometry()
            routerLine1Geometry.vertices.push( new THREE.Vector3(x1, y1 - i / 4, z1 ) )
            routerLine1Geometry.vertices.push( new THREE.Vector3(x2, y2 - i / 4, z2 ) )
            const routerLine1 = new THREE.Line( routerLine1Geometry, lineMaterial )

            this.add( routerLine1 )
        }
    }
}
