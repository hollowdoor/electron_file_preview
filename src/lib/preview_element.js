const mousePosition = require('./mouse_position.js')
const EventEmitter = require('events');

module.exports = class PreviewElement extends EventEmitter {
    constructor(control, type){
        super();
        const self = this;
        const el = this.element = document.createElement(type);
        this.controls = true;
        this.type = type;
        this.className = control.previewClassName;
        this.element.className = 'file-preview-element';

        let mouse = this.mouse = mousePosition();
        let entered = false;
        function onOver(event){
            if(!entered){
                entered = true;
                self.emit('enter', event);
            }
            self.emit('mouseover', event);
        }
        function onOut(event){
            entered = false;
            self.emit('exit', event);
            self.emit('mouseout', event);
        }

        let down = false;

        function onKeyDown(event){
            self.emit('keydown', event);
            if(!down){
                down = true;
                self.emit('keyed', event);
                if(event.key === ' ' || event.which === 32){
                    self.emit('space', event);
                }
            }
        }

        function onKeyUp(event){
            self.emit('keyup', event);
            down = false;
        }

        function onClick(event){
            self.emit('click', event);
        }

        let spaceDown = false;

        if(typeof this.element.play === 'function'){
            this.element.setAttribute('loop', '');
            this.on('enter', event=>{
                setTimeout(()=>{
                    if(mouse.inside(el))
                        el.play();
                }, 200);
                control.pauseAll();
            });

            this.on('exit', event=>{
                setTimeout(()=>{
                    if(!mouse.inside(el))
                        el.pause();
                }, control.pauseDelay * 1000);
            });
        }

        function keyUpVolume(){
            if(el.volume !== 0 && !mouse.inside(el))
                el.volume = 0;
        }

        if(!isNaN(this.element.volume)){
            el.volume = 0;

            this.on('space', event=>{
                if(el.volume === 0){
                    el.volume = control.volume;
                }else{
                    el.volume = 0;
                }
            });

            document.addEventListener('keyup', keyUpVolume);
        }

        this.element.addEventListener('mouseover', onOver, false);
        this.element.addEventListener('mouseout', onOut, false);
        this.element.addEventListener('click', onClick, false);
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        this.destroy = function(){
            this.element.removeEventListener('mouseover', onOver, false);
            this.element.removeEventListener('mouseout', onOut, false);
            this.element.addEventListener('click', onClick, false);
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keyup', keyUpVolume);
        };

    }
    set src(v){
        this.element.src = v;
    }
    get src(){
        return this.element.src;
    }
    set value(v){
        this.element.value = v;
    }
    get value(){
        return this.element.value;
    }
    set html(v){
        this.element.innerHTML = v;
    }
    get html(){
        return this.element.innerHTML;
    }
    appendTo(parent){
        this.parent = parent;
        parent.appendChild(this.element);
        return this;
    }
}
