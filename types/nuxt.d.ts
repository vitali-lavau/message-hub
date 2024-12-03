import { AxiosInstance } from 'axios';
import { Socket } from 'socket.io-client';

declare module '#app' {
    interface NuxtApp {
        $api: AxiosInstance;
        $socket: Socket;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $api: AxiosInstance;
        $socket: Socket;
    }
}
