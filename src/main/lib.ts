import { Library } from "src/share/define/ipc";
import fs from "fs";
const log = require('electron-log');
const path = require('path');

class LibraryManager {
    librarys: Map<string, Library>;
    static instance: LibraryManager;
    constructor() {
        this.librarys = new Map<string, Library>();
        // log.info("__dirname", __dirname);
        let libraryDir;
        if (process.env.NODE_ENV !== 'development') {
            libraryDir = path.resolve(__dirname, '../library');
        } else {
            libraryDir = path.resolve(__dirname, '../../library');
        }
        log.info("libraryDir", libraryDir);
        const array = fs.readdirSync(libraryDir);
        array.forEach((subdir) => {
            const sub = path.join(libraryDir, subdir);
            // log.info('sub', sub);
            const lib = require('../../library/' + subdir + '/index.ts').register(sub, subdir);
            // log.info(lib);
            this.librarys.set(lib.name, lib);
        })
    }

    // 构造一个广为人知的接口，供用户对该类进行实例化
    static getInstance() {
        if (!LibraryManager.instance) {
            LibraryManager.instance = new LibraryManager();
        }
        return LibraryManager.instance;
    }

    listTypeLibrarys(type: string): Array<string> {
        const ret = new Array<string>();
        for (let value of this.librarys.values()) {
            if (value.type === type)
                ret.push(value.name);
        }
        return ret;
    }

    listLibrarys(): Array<string> {
        return Array.from(this.librarys.keys());
    }

    listTypes(): Array<string> {
        const ret = new Set<string>();
        for (let value of this.librarys.values()) {
            ret.add(value.type);
        }
        return [...ret];
    }

    hasLib(name: string): boolean {
        return this.librarys.has(name);
    }

    getLib(name: string) {
        return this.librarys.get(name);
    }
}

export { LibraryManager }