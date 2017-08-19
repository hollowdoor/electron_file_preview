const isVideo = require('is-video');
const path = require('path');
const copyVideo = require('./copy_video.js');
const VideoElement = require('./video_element.js');


class VideoPreview {
    constructor(control, {
        audio = true,
        pauseDelay = 5,
        volume = 0.5
    } = {}){
        this.control = control;
        this.cache = control.cachePath('mp4');
        this.filepath = control.filepath;
        this.audio = audio;
        this.element = control.createElement(this, 'video');
    }
    activate(){
        return copyVideo(this.control, this).then(info=>{
            this.element.src = this.cache;
        });
    }
    deactivate(){
        this.element.destroy();
    }
}

module.exports = {
    type: 'video',
    dependencies: ['ffmpeg'],
    confirm(filename){
        return isVideo(filename);
    },
    create(control){
        return new VideoPreview(control);
    }
};
