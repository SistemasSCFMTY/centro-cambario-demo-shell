import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Store } from '@ngxs/store';
import { TemaState } from '@store/tema/state/tema.state';

/** `<route title> · <tenant name>`. */
@Injectable({ providedIn: 'root' })
export class EstrategiaTitulo extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly store = inject(Store);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const negocio = this.store.selectSnapshot(TemaState.nombreNegocio);
    this.title.setTitle([this.buildTitle(snapshot), negocio].filter(Boolean).join(' · '));
  }
}
