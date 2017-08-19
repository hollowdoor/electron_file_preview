module.exports = function copyVideo(control, preview){
    let { cache, audio, filepath } = control;
    let { duration } = preview;

    if(!control.oldCache()){
        return Promise.resolve();
    }

    let copy = audio
    ? '-c:a copy'.split(' ') : ['-an'];

    let argv = [
        '-i', filepath,
        '-y',
        '-filter:v', 'scale=580:-2',
        '-t', duration,
        '-c:a', 'copy'
    ].concat([
        '-movflags', 'faststart',
        cache
    ]);

    console.log('argv ', argv)
    return control.spawn('ffmpeg', argv);
}
