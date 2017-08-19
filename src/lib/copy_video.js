const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const spawn = require('child_process').spawn;
const del = require('del');
const hashFile = require('hash-file');
const os = require('os');
const cpuMax = os.cpus().length;

module.exports = function copyVideo(info, {
    source
} = {}){
    const cache = {};
    let { cacheFolder } = info;
    let { audio = true, duration = 30, commandFile } = info.video;

    if(!commandFile){
        commandFile = 'ffmpeg';
    }

    cache.copyDuration = 0;

    let now = Date.now();
    cache.type = 'video',
    cache.source = source;
    cache.hash = hashFile.sync(source);
    cache.time = Date.now();

    let storage = cache.hash + '_' + path.basename(source) +'.mp4';
    let dest = path.join(cacheFolder, storage);

    cache.dest = dest;
    cache.filename = dest;
    let statsDest;
    let modifiedDest;
    let statsSource = fs.statSync(source);
    cache.modified = new Date(statsSource.mtime).getTime();

    try{
        statsDest = fs.statSync(dest);
        modifiedDest = new Date(statsDest.mtime).getTime();
    }catch(e){}

    if(statsDest && cache.modified < modifiedDest){
        cache.copyDuration = Date.now() - cache.time;
        return Promise.resolve(cache);
    }

    let copy = audio
    ? '-c:a copy'.split(' ') : ['-an'];

    let argv = [
        '-i', source,
        '-y',
        '-filter:v', 'scale=580:-2',
        '-t', duration
    ].concat(copy).concat([
        '-movflags', 'faststart',
        dest
    ]);

    console.log('argv ', argv)

    return new Promise((resolve, reject)=>{
        let c = spawn(commandFile, argv);
        c.on('error', reject);
        c.on('exit', a=>{
            cache.copyDuration = Date.now() - cache.time;
            resolve(cache);
        });
    });
}
