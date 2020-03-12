import { environment } from '../../../environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ImageInfo, ImagesData } from '../data/images';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ImagesService implements ImagesData {

    protected dataUrl = environment.serverUrl;
    constructor(private http: HttpClient) {
    }

    getImages(): Observable<ImageInfo[]> {
        return this.http.get<ImageInfo[]>(this.dataUrl);
    }

    uploadImages(images: any): Observable<Object> {
        const config = new HttpRequest('POST', this.dataUrl, images, {
            reportProgress: false,
        });

        return this.http.request(config);
    }

    uploadImage(name: string, images: any): Observable<Object> {
        const config = new HttpRequest('PUT', this.dataUrl + name, images, {
            reportProgress: false,
        });

        return this.http.request(config);
    }

    getImage(name: string): Observable<Blob> {
        return this.http.get(this.dataUrl + name, {responseType: 'blob'});
    }

    deleteImage(name: string): Observable<Object> {
        return this.http.delete(this.dataUrl + name);
    }
}
