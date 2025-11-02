import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutoExactHeightDirective } from '../../../../../../common/core/directives';
import { SiteHeaderComponent } from '../../../../../header';

@Component({
  selector: 'app-user-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SiteHeaderComponent, AutoExactHeightDirective],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class UserAuthLayoutComponent { }
