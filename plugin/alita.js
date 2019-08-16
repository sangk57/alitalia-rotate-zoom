;(function(global) {
    "use strict"
    function Alita(options) {
        console.log(options)

        var position = 'topRight'
        
        var CENTER = { x: 150, y: 150 }, BIG_RADIUS = 150, SMALL_RADIUS = 70, MAX_CHANGE_ANGLE = 300
        updateParams()
        var circleAngle = 0, mouseAngle, lastMouseAngle
        var bigCircle = document.createElement('div')
        var smallCircle = document.createElement('div')
        document.body.appendChild(bigCircle)
        document.body.appendChild(smallCircle)

        setCircleClass.apply(bigCircle, [CENTER, BIG_RADIUS, '#eee', true])
        setCircleClass.apply(smallCircle, [CENTER, SMALL_RADIUS, '#FFF', false])

        
        bigCircle.addEventListener('mouseenter', init)
        bigCircle.addEventListener('mousedown', init)
        bigCircle.addEventListener('mousemove', main)
        smallCircle.addEventListener('mousemove', function(e) {
            e.stopPropagation()
        })

        function updateParams() {
            if(options.radius && options.radius[0] && options.radius[1]) {
                SMALL_RADIUS = options.radius[0]
                BIG_RADIUS = options.radius[1]
                CENTER = { x: BIG_RADIUS, y: BIG_RADIUS }
            }
            if(options.position) {
                var posList = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
                const index = posList.findIndex(function(val) {
                    return options.position === val
                })
                if(index === -1) return console.error('position类型错误')
                position = options.position
            }
        }

        function init(e) {
            lastMouseAngle = calcAngleDegrees((e.clientX - CENTER.x), (CENTER.y - e.clientY))
        }

        function main(e) {
            if(e.buttons === 1) {
                mouseAngle = calcAngleDegrees((e.clientX - CENTER.x), (CENTER.y - e.clientY))
                var changeMouseAngle = mouseAngle - lastMouseAngle
                if(Math.abs(changeMouseAngle) > MAX_CHANGE_ANGLE){
                    return lastMouseAngle = mouseAngle
                }
                circleAngle -= changeMouseAngle
                rotate.call(this, circleAngle)

                if(options.cb) options.cb(circleAngle)
                
                lastMouseAngle = mouseAngle
            }
        }

        function setCircleClass(center, radius, bg, isMove) {
            this.style.position = 'absolute'
            if(position === 'topRight') {
                this.style.right = center.x - radius + 'px'
            } else if(position === 'topLeft') {
                this.style.left = center.x - radius + 'px'
            }
            this.style.top = center.y - radius + 'px'
            this.style.width = radius * 2 + 'px'
            this.style.height = radius * 2 + 'px'
            this.style.borderRadius = '50%'
            this.style.zIndex = 66666
            this.style.background = bg
            isMove && (this.style.transition = 'transform linear .016s')
        }

        function calcAngleDegrees(x, y) {
            return Math.atan2(y, x) * 180 / Math.PI
        }

        function rotate(deg) {
            this.style.webkitTransform = 'rotate(' + deg + 'deg)'
            this.style.mozTransform = 'rotate(' + deg + 'deg)'
            this.style.msTransform = 'rotate(' + deg + 'deg)'
            this.style.oTransform = 'rotate(' + deg + 'deg)'
            this.style.transform = 'rotate(' + deg + 'deg)'
        }
        
    }
    global.Alita = Alita
}(this))