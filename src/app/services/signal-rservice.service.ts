import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRServiceService {
  private hubConnection!: signalR.HubConnection;

  constructor() {
    this.createConnection();
  }

  private createConnection(): void {
    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://backpqr.etsg.com.co/crudhub', {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();
    }
  }

  public startConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      return this.hubConnection.start()
        .then(() => console.log('SignalR connected'))
        .catch((err) => {
          console.error('Error connecting SignalR:', err);
          setTimeout(() => this.startConnection(), 5000); // Reintentar conexión
        });
    } else {
      console.log('SignalR connection already started.');
      return Promise.resolve();
    }
  }

  public stopConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return this.hubConnection.stop()
        .then(() => console.log('SignalR disconnected'))
        .catch((err) => console.error('Error stopping SignalR:', err));
    }
    return Promise.resolve();
  }

  public addCrudListener(callback: (action: string, data: any) => void): void {
    if (!this.hubConnection) {
      console.error('HubConnection not initialized');
      return;
    }

    this.hubConnection.on('ReceiveCrudNotification', (action, data) => {
      callback(action, data);
    });
  }
}
  