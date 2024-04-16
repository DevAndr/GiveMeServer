import {
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets'
import { Socket } from 'node:net'
import { Inject } from "@nestjs/common";
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import { NOTIFICATION_SERVICE } from 'libs/common/constants';
@WebSocketGateway({
	cors: {
		origin: '*',
		// credentials: true
	},
	namespace: 'events',
})
export class WebSocketService implements OnGatewayConnection {
	constructor(@Inject(NOTIFICATION_SERVICE) private readonly clientNotification: ClientProxy) {
	}

	clients = new Map<string, Socket>()

	handleConnection(client: any, ...args: any[]) {
		const hashUser = client.handshake.query?.hashUser
		this.clients.set(hashUser, client)
		// this.clientNotification.emit('connections', {clientId: client.id, hashUser})
		console.log('ws connected', client.id, hashUser, this.clients.size)
	}

	handleDisconnect(client: any) {
		const hashUser = client.handshake.query?.hashUser
		if (hashUser) this.clients.delete(client.handshake.query?.hashUser)

		console.log('ws disconnected', client.id, hashUser, this.clients.size)
	}

	@SubscribeMessage('create-alert')
	createHandleEvent(client: any, data: any) {
		data.giver = Date.now().toString()
		this.clientNotification.emit('RABBIT_MQ_NOTIFICATIONS_QUEUE', {clientId: client.id, giver: data.giver})
		this.clients.get(data.hashUser).emit(`notifications/${data.hashUser}`, data)
		console.log('create alert', data)
	}

	@EventPattern('RABBIT_MQ_NOTIFICATIONS_QUEUE')
	async connectionHandle(@Payload() data: any) {
		console.log(data);
	}

}
