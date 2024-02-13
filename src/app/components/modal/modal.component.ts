import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { fadeUp } from '../../animation/animation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  animations: [fadeUp],
})
export class ModalComponent {
  @Input() close!: () => void;
  @Input() isOpenModal!: boolean;
}
