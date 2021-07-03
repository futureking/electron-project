import path from "path";
export function register(dir: string, sub:string) {
    return {
        name: 'Kick Drum',
        type: 'Instrument',

        bg: path.join(sub, './assets/bg_kickdrum.png'),
        audio: path.resolve(dir, './assets/Kick Drum.wav'),
        vibration: path.resolve(dir, './assets/Kick Drum.he')
    }
}