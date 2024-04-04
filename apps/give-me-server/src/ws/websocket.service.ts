import {
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets'
import { Socket } from 'node:net'
@WebSocketGateway({
	cors: {
		origin: '*',
		// credentials: true
	},
	namespace: 'events',
})
export class WebSocketService implements OnGatewayConnection {
	clients = new Map<string, Socket>()

	handleConnection(client: any, ...args: any[]) {
		const hashUser = client.handshake.query?.hashUser
		this.clients.set(hashUser, client)
		console.log('ws connected', client.id, hashUser, this.clients.size)
	}

	handleDisconnect(client: any) {
		const hashUser = client.handshake.query?.hashUser
		if (hashUser) this.clients.delete(client.handshake.query?.hashUser)

		console.log('ws disconnected', client.id, hashUser, this.clients.size)
	}

	@SubscribeMessage('create-alert')
	createHandleEvent(client: Socket, data: any) {
		data.giver = Date.now().toString()
		this.clients.get(data.hashUser).emit(`notifications/${data.hashUser}`, data)
		console.log('create alert', data)
	}
}
