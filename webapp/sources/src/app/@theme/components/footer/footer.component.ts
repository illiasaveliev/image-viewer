import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ {{year}}
    </span>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
