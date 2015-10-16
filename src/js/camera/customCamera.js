import THREE from 'three'

export default class CustomCamera extends THREE.PerspectiveCamera {
    constructor() {
        super()

        this.mode = 'followLines'
    }

    setZoomOut() {
        this.mode = 'zoomOut'
        this.position.set( 0, 0, 9 )
        this.rotation.set( 0, 0, 0 )
    }

    setFlyOver() {
        this.mode = 'flyOver'
        this.position.set( 0, 0, 25)
    }

    setFollowLines() {
        this.mode = 'followLines'
        this.position.set( 0, 0, 20 )
        this.rotation.set( 0, 0, 0 )
    }

    setPan() {
        this.mode = 'pan'
        this.position.set( 0, 0, 30 )
        this.rotation.set( 0, Math.PI / 6, 0 )
    }

    setTravelling() {
        this.mode = 'travelling'
        this.position.set( 0, 20, 20 )
        this.rotation.set( 0, 0, 0 )
    }

    update( linesPositionX, linesPositionY, linesRotationZ ) {
        switch ( this.mode ) {
        case 'zoomOut':
            this.position.z += 0.03
            this.rotation.z -= Math.PI / 180 * 0.5
            break
        case 'flyOver':
            this.position.x = linesPositionX
            this.position.y = linesPositionY
            this.rotation.y = Math.PI / 6
            this.rotation.z = linesRotationZ + Math.PI / 2.5
            break
        case 'followLines':
            this.position.x = linesPositionX
            this.position.y = linesPositionY
            this.rotation.z = linesRotationZ
            break
        case 'pan':
            this.rotation.y -= Math.PI / 180 * 0.05
            break
        case 'travelling':
            this.position.y -= 0.035
            break
        default:
            return
        }
    }
}
