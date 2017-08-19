import isVideo from 'is-video';
import path from 'path';
import { spawn } from 'child_process';

/**
 * Returns `true` if provided input is Element.
 * @name isElement
 * @param {*} [input]
 * @returns {boolean}
 */
var isElement = function (input) {
  return (input != null)
    && (typeof input === 'object')
    && (input.nodeType === Node.ELEMENT_NODE)
    && (typeof input.style === 'object')
    && (typeof input.ownerDocument === 'object');
};

var FilePreview = function FilePreview(info, ref){
    if ( ref === void 0 ) ref = {};
    var element = ref.element;
    var filename = ref.filename;

    this.info = info;
    this.element = element;
    this.source = filename;
    this.dest = path.join(info.cacheFolder, 'temp.mp4');

    this.save();
};
FilePreview.prototype.save = function save (){
    var ref = this;
        var filename = ref.filename;
        var dest = ref.dest;
    if(isVideo(filename)){
        var stream  = fs.createWriteStream(dest);
        var c = spawn('ffmpeg', ['-i', this.source, '-y', this.dest]);
        c.on('exit', function (){ return console.log('done'); });
        c.on('error', function (e){ return console.log(e); });
        console.log('bla');
        /*ffmpeg(filename)
        .noAudio()
        .videoCodec('libx264')
        .duration('10')
        .output(stream);*/
    }
};

function efp(element, filename, options){
    if(!isElement(element)){
        throw new TypeError(element + ' is not a DOM element');
    }

    return new FilePreview(
        Object.assign({
            element: element, filename: filename
        }, options)
    );
}

export { FilePreview, efp };
//# sourceMappingURL=bundle.es.js.map