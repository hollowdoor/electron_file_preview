const path = require('path');
const hashFile = require('hash-file');
const uniqueString = require('unique-string');
const fs = require('fs');
const PreviewElement = require('./preview_element.js');
const spawn = require('child_process').spawn;
const mousePosition = require('./mouse_position.js');

module.exports = class PreviewController {
    constructor(previewer, {
        filepath
    } = {}){
        this.cacheFolder = previewer.cacheFolder;
        this.filepath = filepath + '';
        this.id = uniqueString();
        this.stats = fs.statSync(filepath);
        this.cache = {};
        this.mouse = mousePosition();
        Object.defineProperties(this, {
            volume: {
                get(){
                    return previewer.volume;
                }
            },
            pauseDelay: {
                get(){
                    return previewer.pauseDelay;
                }
            }
        });

        this.pauseAll = function(){
            previewer.each(pre=>{
                console.log('pre.player ', pre.player)
                if(pre.player && !this.mouse.inside(pre.player)){
                    console.log('pausing')
                    pre.player.pause();
                }
            });
        };
    }
    cachePath(ext){
        let basename = path.basename(this.filepath)
        .replace(/[ ]*/, '_') + '.' + ext;
        this.hashed = hashFile.sync(this.filepath);
        this.cache = path.join(
            this.cacheFolder,
            this.hashed + '_' + basename
        );
        try{
            this.cacheStats = fs.statSync(this.cache);
        }catch(e){}

        return this.cache;
    }
    oldCache(){
        if(!this.cacheStats){
            return true;
        }
        let cacheModified = new Date(this.cacheStats.mtime).getTime();
        let modified = new Date(this.stats.mtime).getTime();
        if(this.cacheStats && cacheModified > modified){
            return false;
        }
        return true;
    }
    createElement(preview, type){
        let el = new PreviewElement(this, type);
        if(typeof el.element.play === 'function'){
            Object.defineProperty(preview, 'player', {
                value: el.element
            });
        }
        return el;
    }
    spawn(command, argv, options = {}){
        return new Promise((resolve, reject)=>{
            let c = spawn('ffmpeg', argv, options);
            const killNice = ()=>process.exit();
            process.on('SIGINT', killNice);
            process.on('SIGTERM', killNice);
            c.on('error', reject);
            c.on('exit', a=>{
                resolve();
            });
        });
    }
}
