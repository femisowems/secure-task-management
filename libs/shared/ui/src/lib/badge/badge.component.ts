import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
      [ngClass]="variantClasses"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';

  get variantClasses(): string {
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      primary: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return variants[this.variant];
  }
}
