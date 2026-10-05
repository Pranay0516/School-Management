import { Component, inject } from '@angular/core';
import { DashboardAccessService } from '../../core/dashboard-access.service';

@Component({
  selector: 'app-dashboard-access',
  standalone: true,
  template: `
    <section class="access-page">
      <header class="page-heading">
        <div>
          <p class="eyebrow">SCHOOL PORTAL CONFIGURATION</p>
          <h2>Dashboard card access</h2>
          <p class="muted">Choose which dashboard cards are enabled for school administrators.</p>
        </div>
        <div class="bulk-actions">
          <button type="button" (click)="access.setAll(true)">Enable all</button>
          <button type="button" (click)="access.setAll(false)">Disable all</button>
        </div>
      </header>

      <div class="access-list glass-card">
        @for (widget of access.widgets(); track widget.id) {
          <label class="access-row">
            <span class="widget-icon" [class.off-icon]="!widget.enabled">{{ widget.enabled ? '▦' : '⊘' }}</span>
            <span class="widget-copy">
              <b>{{ widget.label }}</b>
              <small>{{ widget.enabled ? 'Available on the school dashboard' : 'Shown as disabled on the school dashboard' }}</small>
            </span>
            <span class="state-label" [class.off-state]="!widget.enabled">{{ widget.enabled ? 'Enabled' : 'Disabled' }}</span>
            <input
              type="checkbox"
              [checked]="widget.enabled"
              [attr.aria-label]="'Enable ' + widget.label"
              (change)="access.toggle(widget.id)" />
          </label>
        }
      </div>
      <p class="footnote">Settings are saved in this browser and apply immediately to the School Portal dashboard.</p>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .access-page { display: grid; gap: 18px; }
    .page-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; }
    h2 { margin: 5px 0; font-size: 1.5rem; }
    .muted, .footnote { color: var(--muted); margin: 0; font-size: 13px; }
    .bulk-actions { display: flex; gap: 8px; }
    button { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 9px; padding: 9px 13px; font: 700 12px var(--font-body); cursor: pointer; }
    button:hover { border-color: var(--primary); color: var(--primary); }
    .access-list { padding: 4px 20px; }
    .access-row { display: flex; align-items: center; gap: 14px; min-height: 68px; border-bottom: 1px solid var(--border); cursor: pointer; }
    .access-row:last-child { border-bottom: 0; }
    .widget-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px; color: var(--primary); background: color-mix(in srgb, var(--primary) 10%, transparent); font-size: 18px; }
    .off-icon { color: var(--muted); background: var(--surface-strong); }
    .widget-copy { display: grid; gap: 3px; flex: 1; }
    .widget-copy b { font-size: 13px; }
    .widget-copy small { color: var(--muted); font-size: 11px; }
    .state-label { color: #139b58; background: #eaf8ef; border-radius: 20px; padding: 5px 10px; font-size: 11px; font-weight: 800; }
    .off-state { color: #8b8792; background: #f0eff3; }
    input { width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer; }
    .footnote { font-size: 11px; }
    @media (max-width: 650px) { .page-heading { align-items: flex-start; flex-direction: column; } .access-list { padding: 4px 12px; } .access-row { gap: 9px; } .widget-copy small { max-width: 170px; } }
  `],
})
export class DashboardAccessComponent {
  readonly access = inject(DashboardAccessService);
}
