import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ImageInfo, ImageTag } from '../../../@core/data/images';
import { ImagesService } from '../../../@core/services/images.service';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import {
  HttpResponse,
  } from '@angular/common/http';
import {
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  } from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  size: string;
  lastModified?: string;
  kind: string;
  url: string;
  items?: number;
}

@Component({
  selector: 'ngx-tree-grid',
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.scss'],
})
export class TreeGridComponent {
  customColumn = 'name';
  defaultColumns = [ 'size', 'lastModified', 'items', 'action' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  myFormData: FormData;
  files: File[];

  previewImage: any;
  isImageLoading = true;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private imagesService: ImagesService) {
    this.loadImages();
  }


  uploadFiles(files: File[]): Subscription {
    return this.imagesService.uploadImage(files[0].name, this.myFormData)
    .subscribe(event => {
      if (event instanceof HttpResponse) {
        this.files = undefined;
        this.loadImages();
      }
    },
    error => {
      alert('Upload failure:' + error.toString());
    });
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  deleteImage(name: string): void {
    this.imagesService.deleteImage(name).subscribe(() => this.loadImages());
  }

  loadImages(): void {
    this.imagesService.getImages().subscribe((images: ImageInfo[]) => {
      const data: TreeNode<FSEntry>[] = images.map((image: ImageInfo) => {
        return {
          data: { name: image.key, size: image.size.toString(),
            items: image.tags.length, lastModified: new Date(image.lastModified).toLocaleDateString(),
            kind: image.tags.length > 0 ? 'dir' : '-',
            url: environment.serverUrl + image.key },
          children: image.tags.map((tag: ImageTag) =>  {
            return { data: { name: tag.tag, kind: '', size: tag.value, url: '' } };
          }),
        };
      });

      this.dataSource = this.dataSourceBuilder.create(data);
    });
  }

  loadImage(name: string): void {
      this.isImageLoading = true;
      this.imagesService.getImage(name)
      .subscribe(data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      }, error => {
        this.isImageLoading = false;
        console.log(error);
      });
  }

  private createImageFromBlob(image: Blob): void {
   const reader = new FileReader();
   reader.addEventListener('load', () => {
      this.previewImage = reader.result;
   }, false);

   if (image) {
      reader.readAsDataURL(image);
   }
 }
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
