export interface IpcImportAudioProps {
    name: string;
    src: string;
    wav: string;
    data: Array<number>;
    rate: number;
    samples: number;
    duration: number;
}

export interface IpcImportLibProps {
    audio: IpcImportAudioProps;
    vibration: IpcHeProps;
}

export interface AudioInfoProps {
    channel: number;
    format: string;
    rate: number;
    sampleCount: number;
    duration: number;
}

export interface IpcHeProps {
    version: number;
    name: string;
    data: string;
}

export interface Library {
    name:string;
    type:string;
    bg:string;
    audio: string;
    vibration: string;
}