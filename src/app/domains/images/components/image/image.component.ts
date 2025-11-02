import { Component, inject, Input, OnInit } from '@angular/core';
import { ImageSource } from '../../models/image-source.model';  // Your image model
import { ImageService } from '../../services/image.service';  // Your image service
import { CommonModule } from '@angular/common';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  standalone: true,
  imports: [
    CommonModule,
    LazyLoadImageDirective
  ],
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() src!: string | ImageSource[];  // Can be a single string or an array of ImageSource
  @Input() class: string = '';            // Custom classes for styling
  @Input() width: number | null = null;   // Default width for single images
  @Input() height: number | null = null;  // Default height for single images
  @Input() onError: string = '';          // Custom onError handler
  srcArray: ImageSource[] = [];           // Array of ImageSource for multiple images
  isArray: boolean = false;              // Flag to check if it's an array of images

  private imageService = inject(ImageService);

  ngOnInit() {
    this.isArray = Array.isArray(this.src);  // Check if src is an array
    this.srcArray = this.isArray ? (this.src as ImageSource[]) : [];
  }

  getAltText(src: string | ImageSource): string {
    if (typeof src === 'string') {
      return this.imageService.getAltText(src);  // For string src
    } else {
      return this.imageService.getAltText(src.src);  // For ImageSource object
    }
  }
}
