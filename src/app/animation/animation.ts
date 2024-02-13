import { animate, style, transition, trigger } from '@angular/animations';

export const fadeUp = trigger('fadeUp', [
  transition(':enter', [
    style({ opacity: 0, marginTop: '20px' }),
    animate('300ms', style({ opacity: 1, marginTop: '0px' })),
  ]),
  transition(':leave', [
    animate('300ms', style({ opacity: 0, marginTop: '20px' })),
  ]),
]);

export const scaleUp = trigger('scaleUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.5)' }),
    animate('300ms', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    animate('300ms', style({ opacity: 0, transform: 'scale(0.5)' })),
  ]),
]);
