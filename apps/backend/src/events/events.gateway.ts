import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join-event')
  handleJoinEvent(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`event-${data.eventId}`);
    console.log(`Client ${client.id} joined event ${data.eventId}`);
    return { success: true };
  }

  @SubscribeMessage('leave-event')
  handleLeaveEvent(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`event-${data.eventId}`);
    console.log(`Client ${client.id} left event ${data.eventId}`);
    return { success: true };
  }

  // Method to broadcast RSVP updates to all clients in an event
  broadcastRsvpUpdate(eventId: string, rsvpData: any) {
    this.server.to(`event-${eventId}`).emit('rsvp-updated', rsvpData);
  }

  // Method to broadcast guest count updates
  broadcastGuestCountUpdate(eventId: string, countData: any) {
    this.server.to(`event-${eventId}`).emit('guest-count-updated', countData);
  }

  // Method to broadcast new guest additions
  broadcastNewGuest(eventId: string, guestData: any) {
    this.server.to(`event-${eventId}`).emit('new-guest', guestData);
  }

  // Method to broadcast event updates
  broadcastEventUpdate(eventId: string, eventData: any) {
    this.server.to(`event-${eventId}`).emit('event-updated', eventData);
  }
} 