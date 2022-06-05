const dev = {
  webSocket: {
    endPoint: 'ws://sknmx4.colyseus.in:2567',
  },
};
const prod = {
  webSocket: {
    endPoint: 'ws://sknmx4.colyseus.in:2567',
  },
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
