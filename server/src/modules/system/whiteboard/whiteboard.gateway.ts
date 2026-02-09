import { Server, Socket } from 'socket.io';
import prisma from '../../../config/prisma';

export class WhiteboardGateway {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.setupHandlers();
    }

    private setupHandlers() {
        this.io.on('connection', (socket: Socket) => {
            console.log(`Whiteboard connection: ${socket.id}`);

            socket.on('join_whiteboard', async (whiteboardId: string) => {
                try {
                    const userId = socket.data.userId;
                    if (!userId) {
                        return socket.emit('error', { message: 'Authentication required' });
                    }

                    // Ownership check (BOLA prevention)
                    const whiteboard = await prisma.whiteboard.findUnique({
                        where: { id: whiteboardId }
                    });

                    if (!whiteboard || whiteboard.creatorId !== userId) {
                        return socket.emit('error', { message: 'Access denied: You do not own this whiteboard.' });
                    }

                    socket.join(whiteboardId);
                    console.log(`Socket ${socket.id} (User: ${userId}) joined whiteboard ${whiteboardId}`);

                    // Notify others
                    socket.to(whiteboardId).emit('participant_joined', {
                        socketId: socket.id,
                        userId: userId
                    });
                } catch (error) {
                    console.error('Socket join_whiteboard error:', error);
                    socket.emit('error', { message: 'Internal server error' });
                }
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
