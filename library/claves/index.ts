import path from "path";

export function register(dir: string, sub:string) {
    return {
        name: 'Claves',
        type: 'Instrument',
        bg: path.join(sub, './assets/bg_claves.png'),
        audio: path.resolve(dir, './assets/Claves.wav'),
        vibration: path.resolve(dir, './assets/Claves.he')
    }
}