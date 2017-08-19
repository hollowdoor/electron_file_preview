const EventEmitter = require('events');
let pos;

class MousePosition extends EventEmitter {
    constructor(){
        super();
        const self = this;
        this.x = 0;
        this.y = 0;
        function onMove(event){
            self.x = event.clientX;
            self.y = event.clientY;
        }

        function onDown(){
            self.down = true;
            self.up = true;
        }

        function onUp(){
            self.down = false;
            self.up = true;
        }

        window.addEventListener('mousemove', onMove, false);
        window.addEventListener('mousedown', onDown, false);
    }
    inside(element){
        let rect = element.getBoundingClientRect();
        return (this.x > rect.left && this.x < rect.right && this.y < rect.bottom && this.y > rect.top);
    }
}

module.exports = function mouseXY(){
    if(pos) return pos;
    pos = new MousePosition();
    return pos;
};
/*
module.exports = function mouseXY(){
    if(pos) return pos;

    pos = {
        x:0, y:0,
        inside(element){
            let rect = element.getBoundingClientRect();
            return (pos.x > rect.left && pos.x < rect.right && pos.y < rect.bottom && pos.y > rect.top);
        }
    };

    function onMove(event){
        pos.x = event.clientX;
        pos.y = event.clientY;
    }

    function onDown(){
        pos.down = true;
        pos.up = true;
    }

    function onUp(){
        pos.down = false;
        pos.up = true;
    }

    window.addEventListener('mousemove', onMove, false);
    window.addEventListener('mousedown', onDown, false);

    return pos;
};
*/
