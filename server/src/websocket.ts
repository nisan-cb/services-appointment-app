import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import WebSocket from 'ws';
import queryString from "query-string";

export default class Ws {
    websocketServer: WebSocket.Server<WebSocket.WebSocket>
    expressServer: any;
    websocketConnection: WebSocket.WebSocket | undefined;

    constructor(expressServer: any) {
        this.websocketServer = new WebSocket.Server({
            noServer: true,
            path: "/websocket",
        });
        this.expressServer = expressServer;
        this.websocketConnection = undefined;

        // attachment of the websocket server to the existing expressServer
        // "Upgrade" here is saying, "we need to upgrade this request to handle websockets."
        this.expressServer.on("upgrade", (request: IncomingMessage, socket: Duplex, head: Buffer) => {
            this.updrageExperess(request, socket, head, this.websocketServer)
        });

        this.websocketServer.on("connection", this.onConnection);
    }

    updrageExperess(request: IncomingMessage, socket: Duplex, head: Buffer, websocketServer: WebSocket.Server<WebSocket.WebSocket>) {
        websocketServer.handleUpgrade(request, socket, head, (websocket) => {
            websocketServer.emit("connection", websocket, request);
        });
    }

    onConnection(websocketConnection: WebSocket.WebSocket, connectionRequest: IncomingMessage) {
        this.websocketConnection = websocketConnection;
        const [_path, params] = connectionRequest?.url?.split("?") || ['', ''];
        const connectionParams = queryString.parse(params);

        console.log('websocket connection');

        websocketConnection.on("message", (message: string) => {
            const parsedMessage = JSON.parse(message);
            console.log(parsedMessage);

            websocketConnection.send(JSON.stringify({ message: 'There be gold in them thar hills.' }));
        });
    }

    sendNewRecord(record: any) {
        if (!this.websocketConnection) return;
        this.websocketConnection.send(JSON.stringify({ newrecord: record }));

    }
}