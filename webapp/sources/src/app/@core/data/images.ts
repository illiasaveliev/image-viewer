import { Observable } from 'rxjs';

export interface ImageInfo {
    key: string;
    size: number;
    lastModified: Date;
    eTag: string;
    tags: ImageTag[];
}

export interface  ImageTag {
    tag: string;
    value: string;
}

export abstract class ImagesData {
    abstract getImages(): Observable<ImageInfo[]>;
    abstract uploadImages(images: any): Observable<Object>;
    abstract uploadImage(name: string, images: any): Observable<Object>;
    abstract getImage(name: string): Observable<Blob>;
    abstract deleteImage(name: string): Observable<Object>;
    abstract startUpload(image: any): Observable<Object>;
    abstract uploadToS3(url: string, image: any, images: any): Observable<Object>;
}
