import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, NgIf, TitleCasePipe } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { Router, RouterLink } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ChatSidebarComponent } from '../chat/chat-sidebar/chat-sidebar.component';
import { ChatService } from '../chat/services/chat.service';
import { ModelsAutocompleteComponent } from '../models/models-autocomplete/models-autocomplete.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ModelType } from '../models/models/model.model';
import { SaleOfferService } from '../offers/sale-offers/services/sale-offer.service';
import type { OfferQueryParameters } from '../offers/sale-offers/models/sale-offers-query-parameters.model';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TitleCasePipe,
    RouterLink,
    NgIf,
    ChatSidebarComponent,
    CommonModule,
    ModelsAutocompleteComponent,
    ReactiveFormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  showChatSidebar = signal(false);
  private readonly _destroying$ = new Subject<void>();
  private valueSub!: Subscription;

  searchModelControl = new FormControl<ModelType | string | null>('');

  protected readonly themeService = inject(ThemeService);
  protected readonly authService = inject(AuthService);
  protected readonly chatService = inject(ChatService);
  private readonly router = inject(Router);
  private readonly saleOfferService = inject(SaleOfferService);

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.authService.loginDisplay$
      .pipe(takeUntil(this._destroying$))
      .subscribe((isLoggedIn) => {
        this.loginDisplay = isLoggedIn;
      });

    this.valueSub = this.searchModelControl.valueChanges
      .subscribe((value) => {
        if (value && typeof value === 'object' && 'id' in value) {
          this.onModelSelected(value as ModelType);
        }
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
    this.authService.destroy();
    if (this.valueSub) {
      this.valueSub.unsubscribe();
    }
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleChatSidebar(): void {
    this.chatService.sidebarOpened.set(!this.chatService.sidebarOpened());
    if (!this.chatService.sidebarOpened()) {
      this.chatService.closeAllChats();
    }
  }

  onModelSelected(option: ModelType): void {
    const current = this.saleOfferService.offersQueryParameters() as any as OfferQueryParameters;
    this.saleOfferService.offersQueryParameters.set({
      ...current,
      modelId: option.id
    });

    this.router.navigate(['/sale-offers']);
    this.searchModelControl.reset();
  }
}
