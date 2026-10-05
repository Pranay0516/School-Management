import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="glass-card help-page">
      <div class="panel-title"><div><p class="eyebrow">HELP CENTER</p><h2>How can we assist you?</h2></div></div>
      <div class="help-list">
        <section>
          <h3>Getting started</h3>
          <p>Use the profile dropdown to access your account, switch roles, or sign out securely.</p>
        </section>
        <section>
          <h3>Dashboard support</h3>
          <p>Admins can manage navigation items, teachers can create exam papers, and students can track attendance.</p>
        </section>
        <section>
          <h3>Need more help?</h3>
          <p>Contact your school administrator or use the support links inside the management help section.</p>
        </section>
      </div>
    </article>
  `
})
export class HelpComponent {}