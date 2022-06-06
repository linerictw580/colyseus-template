export const config = {
  dev: {
    webSocket: {
      endPoint: 'ws://localhost:2567',
    },
  },
  prod: {
    webSocket: {
      endPoint: 'wss://sknmx4.colyseus.in',
    },
  },
}[`${process.env.NODE_ENV}`];
