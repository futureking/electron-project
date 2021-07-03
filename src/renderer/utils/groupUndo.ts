import { undoManager } from '@/stores';
import { useRef } from 'react'


export function useUndoGroup<T extends any[], R>(id, callback: (...args: T) => R) {
    const group = useRef<typeof callback>();
    return {
        start: function (...args: T): R {
            if (!group.current) {
                group.current = undoManager.get(id).startGroup(() => callback);
            }
            return group.current!(...args);
        },
        stop: () => {
            if (group.current) {
                undoManager.get(id).stopGroup();
                group.current = undefined;
            }
        }
    };
}