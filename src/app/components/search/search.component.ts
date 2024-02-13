import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  @Input() searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() submitSearch = new EventEmitter<void>();
  onSearchChange() {
    console.log(this.searchTerm);
    // Emit the updated search term
    this.searchTermChange.emit(this.searchTerm);
  }

  onSubmit() {
    console.log('submit');
    if (this.submitSearch)
      // Emit an event indicating that the form is submitted
      this.submitSearch.emit();
  }
}
