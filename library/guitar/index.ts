import path from "path";
export function register(dir: string, sub:string) {
    return {
        name: 'Guitar',
        type: 'Instrument',

        bg: path.join(sub, './assets/bg_guitar.png'),
        audio: path.resolve(dir, './assets/Guitar.wav'),
        vibration: path.resolve(dir, './assets/Guitar.he')
    }
}