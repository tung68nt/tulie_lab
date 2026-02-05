import { Server, Socket } from 'socket.io';

export class WhiteboardGateway {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.setupHandlers();
    }

    private setupHandlers() {
        this.io.on('connection', (socket: Socket) => {
            console.log(`Whiteboard connection: ${socket.id}`);

            socket.on('join_whiteboard', (whiteboardId: string) => {
                socket.join(whiteboardId);
                console.log(`Socket ${socket.id} joined whiteboard ${whiteboardId}`);

                // Notify others
                socket.to(whiteboardId).emit('participant_joined', {
                    socketId: socket.id,
                    userId: socket.data.userId || 'guest'
                });
            });

            socket.on('cursor_move', (data: { whiteboardId: string, point: { x: number, y: number }, userName?: string }) => {
                socket.to(data.whiteboardId).emit('cursor_moved', {
                    socketId: socket.id,
                    point: data.point,
                    userName: data.userName
                });
            });

            socket.on('draw_change', (data: { whiteboardId: string, changes: any }) => {
                socket.to(data.whiteboardId).emit('draw_synced', data.changes);
            });

            socket.on('disconnecting', () => {
                for (const room of socket.rooms) {
                    if (room !== socket.id) {
                        socket.to(room).emit('participant_left', { socketId: socket.id });
                    }
                }
            });

            socket.on('disconnect', () => {
                console.log(`Whiteboard disconnected: ${socket.id}`);
            });
        });
    }
}
