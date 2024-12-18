import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


/**
 * Component representing a tooltip.
 */
@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <div
        class="cursor-pointer"
        (mouseenter)="showTooltip = true"
        (mouseleave)="showTooltip = false"
      >
        <ng-content></ng-content>
      </div>
      <div
        *ngIf="showTooltip"
        class="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700"
        [class]="position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'"
        [style.left]="'-10px'"
        [style.min-width]="'120px'"
      >
        {{ text }}
        <div
          class="tooltip-arrow"
          [class]="position === 'top' ? 'bottom-arrow' : 'top-arrow'"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .tooltip-arrow {
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
    }
    .top-arrow {
      top: -4px;
      left: 16px;
      border-width: 0 4px 4px 4px;
      border-color: transparent transparent #111827 transparent;
    }
    .bottom-arrow {
      bottom: -4px;
      left: 16px;
      border-width: 4px 4px 0 4px;
      border-color: #111827 transparent transparent transparent;
    }
  `]
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() position: 'top' | 'bottom' = 'bottom';
  showTooltip = false;
}