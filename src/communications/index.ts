import { Server, Socket } from "socket.io";

export class Communications {
  public io: Server;
  public socket: Socket | null = null;

  constructor(port: number) {
    this.io = new Server(port);

    console.info(`Opened server at: ${port}`);

    this.io.on('connect', (socket) => {
      console.info(`Connected ${socket.id}`);
      socket.on('disconnect', () => {
        console.info(`Disconnected ${socket.id}`);
      })
      this.socket = socket;
    });
  }
}

export default Communications;
