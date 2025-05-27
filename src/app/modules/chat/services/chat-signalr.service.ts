import { Injectable, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root',
})
export class ChatSignalRService {
  private hubConnection!: signalR.HubConnection;
  private messageReceived = new BehaviorSubject<ChatMessage | null>(null);
  public messageReceived$ = this.messageReceived.asObservable();

  constructor(
    private msalService: MsalService,
    private authService: AuthService
  ) {}

  async startConnection(): Promise<void> {
    this.authService.activeAccountReady$.subscribe(async (isReady) => {
      if (isReady) {
        const account = this.msalService.instance.getActiveAccount();
        if (!account) {
          console.error('No active user. Please login first.');
          return;
        }

        const tokenResponse =
          await this.msalService.instance.acquireTokenSilent({
            scopes: [environment.adb2c.readScopeUrl],
            account: account,
          });

        const hubConnectioBuilder = new signalR.HubConnectionBuilder()
          .withUrl(`${environment.plainApiUrl}/chatHub`, {
            accessTokenFactory: () => tokenResponse.accessToken,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
          })
          .withAutomaticReconnect();

        if (!environment.production) {
          hubConnectioBuilder.configureLogging(signalR.LogLevel.Debug);
        }

        this.hubConnection = hubConnectioBuilder.build();

        this.hubConnection.start().catch((err) => console.log(err));

        this.hubConnection.on('NewChatMessage', (chatMessage: ChatMessage) => {
          this.messageReceived.next(chatMessage);
        });
      }
    });
  }
}
