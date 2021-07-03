import path from "path";

export function register(dir: string, sub: string) {
    return {
        name: 'Bell',
        type: 'Instrument',
        bg: path.join(sub, './assets/bg_bell.png'),
        audio: path.resolve(dir, './assets/bell.wav'),
        vibration: path.resolve(dir, './assets/bell.he')
    }
}