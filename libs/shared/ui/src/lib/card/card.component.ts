import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300"
      [ngClass]="[customClass]"
    >
      <div *ngIf="title || subtitle" class="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
        <h3 *ngIf="title" class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h3>
        <p *ngIf="subtitle" class="text-sm text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
      </div>
      <div class="p-6">
        <ng-content></ng-content>
      </div>
      <div *ngIf="hasFooter" class="px-6 py-4 bg-slate-50/50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700/50 rounded-b-3xl">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() customClass = '';
  @Input() hasFooter = false;
}
