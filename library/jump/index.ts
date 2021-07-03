import path from "path";
export function register(dir: string, sub:string) {
    return {
        name: 'Jump',
        type: 'Game Effect',

        bg: path.join(sub, './assets/bg_jump.png'),
        audio: path.resolve(dir, './assets/Jump.wav'),
        vibration: path.resolve(dir, './assets/Jump.he')
    }
}