import { Server } from 'socket.io';
import { clientConfigs, serverConfigs } from './configs/app.js';
import { AppEvents } from './configs/eventTypes.js';

const io = new Server(serverConfigs.port, {
  cors: {
    origin: [clientConfigs.url],
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  socket.on(AppEvents.SEND_CHANGES, (delta) => {
    socket.broadcast.emit(AppEvents.RECEIVE_CHANGES, delta);
  });
});