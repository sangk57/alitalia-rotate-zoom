// 1封装
;(function(global) {
    "use strict"
    function Alita(options) {

        var OPTIONS = initOptions(options)

        console.log(OPTIONS)

        var circleAngle = 0, mouseAngle, lastMouseAngle
        var bigCircle = document.createElement('div')
        var smallCircle = document.createElement('div')
        document.body.appendChild(bigCircle)
        document.body.appendChild(smallCircle)

        setCircleClass.apply(bigCircle, [OPTIONS.CENTER, OPTIONS.RADIUS[1], OPTIONS.BG_COLOR, true])
        setCircleClass.apply(smallCircle, [OPTIONS.CENTER, OPTIONS.RADIUS[0], '#FFF', false])



        var bigCircleStyle = getComputedStyle(bigCircle)
        var centerX = Number(bigCircleStyle.left.split('px')[0]) + OPTIONS.RADIUS[1]
        var centerY = Number(bigCircleStyle.top.split('px')[0]) + OPTIONS.RADIUS[1]

        
        bigCircle.addEventListener('mouseenter', initAngle)
        bigCircle.addEventListener('mousedown', initAngle)
        bigCircle.addEventListener('mousemove', main)
        smallCircle.addEventListener('mousemove', function(e) {
            e.stopPropagation()
        })


        // 2.传参
        function initOptions(options) {
            var RADIUS = [70, 150], POSITION = 'topRight', BG_COLOR = 'linear-gradient(skyblue, darkorange)'
            // 2.1 半径
            if(options.radius) {
                if(options.radius[0] === undefined || options.radius[1] === undefined) return console.error('radius缺少参数')
                var smallRadius = options.radius[0], bigRadius = options.radius[1]
                if(typeof smallRadius !== 'number' || typeof bigRadius !== 'number')  return console.error('radius必须为数字')
                if(bigRadius < smallRadius) RADIUS = [bigRadius, smallRadius]
                else RADIUS = [smallRadius, bigRadius]
            }
            // 2.2位置（调整逻辑，否则角度凉凉）
            if(options.position) {
                var posList = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
                const index = posList.findIndex(function(val) {
                    return options.position === val
                })
                if(index === -1) return console.error('position值错误')
                POSITION = options.position
            }
            // 2.3背景
            if(options.bgColor) BG_COLOR = options.bgColor
            

            return {
                RADIUS,
                CENTER: { x: RADIUS[1], y: RADIUS[1] },
                POSITION,
                BG_COLOR,
                MAX_CHANGE_ANGLE: 300,
                CB: options.callback  // 2.4回调
            }
        }

        function initAngle(e) {
            lastMouseAngle = calcAngleDegrees((e.clientX - centerX), (centerY - e.clientY))
        }

        function main(e) {
            if(e.buttons === 1) {
                
                // 获取现在center正确的坐标，否则有问题，同时监听resize事件（防抖）
                mouseAngle = calcAngleDegrees((e.clientX - centerX), (centerY - e.clientY))
                var changeMouseAngle = mouseAngle - lastMouseAngle
                if(Math.abs(changeMouseAngle) > OPTIONS.MAX_CHANGE_ANGLE){
                    return lastMouseAngle = mouseAngle
                }
                circleAngle -= changeMouseAngle
                rotate.call(this, circleAngle)

                if(OPTIONS.CB) OPTIONS.CB(circleAngle)
                
                lastMouseAngle = mouseAngle
            }
        }

        function setCircleClass(center, radius, bg, isMove) {
            this.style.position = 'absolute'
            if(OPTIONS.POSITION === 'topRight' || OPTIONS.POSITION === 'bottomRight') {
                this.style.right = center.x - radius + 'px'
            } else {
                this.style.left = center.x - radius + 'px'
            }
            if(OPTIONS.POSITION === 'topRight' || OPTIONS.POSITION === 'topLeft') {
                this.style.top = center.y - radius + 'px'
            } else {
                this.style.bottom = center.y - radius + 'px'
            }
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