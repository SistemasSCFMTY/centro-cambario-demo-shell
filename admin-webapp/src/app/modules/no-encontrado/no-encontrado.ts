import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCompass } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideCompass })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './no-encontrado.html',
})
export class NoEncontrado {}
