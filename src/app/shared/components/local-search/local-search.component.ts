import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from "../svg-icon";

@Component({
  selector: 'app-local-search',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, SvgIconComponent],
  templateUrl: './local-search.component.html',
  styleUrls: ['./local-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalSearchComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';
  @Input() isFullWidth: boolean = true;

  @Input() resetTrigger: any;

  @Output() searchChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();

  ngOnInit(): void {
    console.log('LocalSearchComponent ngOnInit, searchTerm:', this.searchTerm);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      this.clearSearch();
    }
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchChange.emit(this.searchTerm);
  }

  onSearch(): void {
    this.search.emit();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchChange.emit(this.searchTerm);
  }
}
