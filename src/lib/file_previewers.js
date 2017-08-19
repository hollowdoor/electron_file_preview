import FilePreview from './file_preview.js';

class FilePreviewers {
    constructor({
        width = 100,
        height = 200,
        cacheFolder,
    }){
        this._width = width;
        this._height = height;
        this.cacheFolder = chacheFolder;
        this.previews = [];
    }
    create(options){
        let fp = new FilePreview(this, options);
        this.previews.push(fp);
        return fp;
    }
    set width(width){
        this._width = width;
    }
    get width(){
        return this._width;
    }
    set height(height){
        this._height = height;
    }
    get height(){
        return this._height;
    }
}
