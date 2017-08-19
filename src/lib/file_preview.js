const PreviewController = require('./preview_controller.js');
const os = require('os');
const cpuMax = os.cpus().length;
const makeDir = require('make-dir');
const videoPreview = require('../previews/video');
const fs = require('fs');
const path = require('path');

class FilePreview {
    constructor({
        cacheFolder,
        create,
        volume = 0.3,
        pauseDelay = 5, //Seconds
        duration = 60
    } = {}){
        this.cacheFolder = cacheFolder;
        this.previews = [];
        this.types = [];
        this.volume = volume;
        this.pauseDelay = pauseDelay;
        this._onCreate = create;
        this.duration = duration;
        this.add(videoPreview);

        this.destroy = function(){
            this.each(p=>p.close());
            Object.keys(this).forEach(n=>this[n] = null);
        };
    }
    each(cb){
        for(let i=0; i<this.previews.length; i++){
            cb.call(this, this.previews[i], i, this.previews, this);
        }
        return this;
    }
    add(preview_type){
        this.types.push(preview_type);
    }
    createFrom(folder){
        return new Promise((resolve, reject)=>{
            fs.readdir(folder, (err, files)=>{
                if(err) return reject(err);
                let done = files.map(file=>{
                    file = path.join(folder, file);
                    return this.create(file);
                });
                Promise.all(done).then(resolve);
            });
        });
    }
    create(filepath){

        return makeDir(this.cacheFolder).then(v=>{
            let controller = new PreviewController(this, {
                cacheFolder: this.cacheFolder,
                filepath
            });

            for(let i=0; i<this.types.length; i++){
                if(this.types[i].confirm(filepath)){
                    controller.type = this.types[i].type;

                    let preview = this.types[i]
                    .create(controller);
                    this.previews.push(preview);

                    Promise.resolve(preview.activate())
                    .then(v=>this._onCreate(preview));
                }
            }

            //let preview = this.textPreview.create(this.info);
            //this.previews.push(preview);
            //return preview;
        });
    }
}

module.exports = FilePreview;
