import path from "path";
export function register(dir: string, sub:string) {
    return {
        name: 'Game Over',
        type: 'Game Effect',

        bg: path.join(sub, './assets/bg_gameover.png'),
        audio: path.resolve(dir, './assets/Game over.wav'),
        vibration: path.resolve(dir, './assets/Game over.he')
    }
}