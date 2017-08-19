const EventEmitter = require('events');
/*
<video src="videofile.mp4" autoplay poster="posterimage.jpg">
Sorry, your browser doesn't support embedded videos,
but don't worry, you can <a href="videofile.webm">download it</a>
and watch it with your favorite video player!
</video>
*/
let pos;
function mousePosition(){
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

    window.addEventListener('mousemove', onMove, false);

    return pos;
}

module.exports = class VideoElement extends EventEmitter {
    constructor(src, {
        width,
        height,
        volume = 0.4,
        className,
        pauseDelay = 5000
    } = {}){
        super();
        let self = this;
        let video = document.createElement('video');

        this.video = video;
        this.volume = 0;
        this.pauseDelay = pauseDelay;

        if(width){
            this.width = width;
        }
        if(height){
            this.height = height;
        }

        video.setAttribute('loop', '');

        let pos = mousePosition();
        this.mouseInside = function(){
            return pos.inside();
        };

        function onOver(event){
            self.play();
            video.focus();
            event.preventDefault();
            self.emit('mouseover', this);
        }
        function onOut(event){
            setTimeout(()=>{
                if(!pos.inside(video)){
                    self.pause();
                }
            }, self.pauseDelay);
            self.emit('mouseout', this);
        }

        let down = false;

        function onKeyDown(event){
            if(!down){
                down = true;
                if(event.which === 32){
                    if(video.volume === 0 && pos.inside(video)){
                        self.volume = volume;
                    }else{
                        self.volume = 0;
                    }

                }
            }
        }

        function onKeyUp(event){
            down = false;
        }

        video.addEventListener('mouseover', onOver, false);
        video.addEventListener('mouseout', onOut, false);
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        this.src = src;

        if(className){
            this.className = className;
        }

        this.destroy = function(){
            video.removeEventListener('mouseover', onOver, false);
            video.removeEventListener('mouseout', onOut, false);
        };
    }
    appendTo(parent){
        this.parent = parent;
        parent.appendChild(this.video);
        return this;
    }
    play(delay){
        this.video.play();
        this.emit('play');
        return this;
    }
    pause(){
        this.video.pause();
        this.emit('pause');
        return this;
    }
    set className(c){
        this.video.className = c;
    }
    set src(s){
        this._src = s;
        this.video.setAttribute('src', s);
    }
    get src(){
        return this._src;
    }
    set volume(v){
        this.video.volume = v;
    }
    get volume(){
        return this.video.volume;
    }
    set width(w){
        this._width = w;
        this.video.style.width = w + 'px';
    }
    get width(){
        return this._width;
    }
    set height(h){
        this._height = h;
        this.video.style.height = h + 'px';
    }

}
