import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import WebSocket, { WebSocketServer } from 'ws';
import queryString from "query-string";

export default class Ws {
    wss: any;
    expressServer: any;
    websocketConnection: WebSocket.WebSocket | undefined;

    constructor(expressServer: any) {
        this.wss = new WebSocketServer({
            noServer: true,
            path: "/websocket",
        });
        this.expressServer = expressServer;

        this.expressServer.on("upgrade", (request: IncomingMessage, socket: Duplex, head: Buffer) => {
            this.updrageExperess(request, socket, head, this.wss)
        });

        this.wss.on("connection", this.onConnection);
    }

    // upgarde
    updrageExperess(request: IncomingMessage, socket: Duplex, head: Buffer, websocketServer: WebSocket.Server<WebSocket.WebSocket>) {
        websocketServer.handleUpgrade(request, socket, head, (websocket) => {
            websocketServer.emit("connection", websocket, request);
        });
    }

    // on connection
    onConnection(websocketConnection: WebSocket.WebSocket, connectionRequest: IncomingMessage) {
        this.websocketConnection = websocketConnection;
        const [_path, params] = connectionRequest?.url?.split("?") || ['', ''];
        const connectionParams = queryString.parse(params);

        console.log('websocket connection');
        this.websocketConnection.send(JSON.stringify({ message: 'hello from server ws' }));

        websocketConnection.on("message", (message: string) => {
            const parsedMessage = JSON.parse(message);

            websocketConnection.send(JSON.stringify({ message: 'There be gold in them thar hills.' }));
        });
    }

    // send the new record to all open connections
    sendNewREcord(newREcord: any) {
        this.wss.clients.forEach((ws: any) => {
            ws.send(JSON.stringify(newREcord))
        });
    }

}