import { Injectable, signal, OnDestroy } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';

export type HelpModalType = 'shortcuts' | 'column-guide';

export interface ShortcutAction {
  key: string;
  description: string;
  action: () => void;
  category: 'Global' | 'Task Board';
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutsService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private shortcuts: ShortcutAction[] = [];

  activeHelpModal = signal<HelpModalType | null>(null);
  // Backward-compatible alias used by existing shortcuts modal checks.
  isModalOpen = () => this.activeHelpModal() === 'shortcuts';

  constructor() {
    this.setupGlobalListeners();
  }

  private setupGlobalListeners() {
    if (typeof window === 'undefined') return;
    
    fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }

        const shortcut = this.shortcuts.find(
          (s) => s.key.toLowerCase() === event.key.toLowerCase(),
        );

        if (shortcut) {
          event.preventDefault();
          this.closeHelpModal();
          shortcut.action();
        }

        if (event.key === '?') {
          this.toggleHelpModal('shortcuts');
        }
      });
  }

  registerShortcut(shortcut: ShortcutAction) {
    this.shortcuts.push(shortcut);
  }

  unregisterShortcuts(category?: 'Global' | 'Task Board') {
    if (category) {
      this.shortcuts = this.shortcuts.filter((s) => s.category !== category);
    } else {
      this.shortcuts = [];
    }
  }

  getShortcuts() {
    return this.shortcuts;
  }

  toggleHelpModal(type: HelpModalType = 'shortcuts') {
    this.activeHelpModal.update((current) => (current === type ? null : type));
  }

  closeHelpModal() {
    this.activeHelpModal.set(null);
  }

  isHelpModalOpen(type: HelpModalType) {
    return this.activeHelpModal() === type;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
