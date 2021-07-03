import { useEffect } from 'react'

const { ipcRenderer } = window;

const useIpcRenderer = (keyCallbackMap) => {
    useEffect(() => {
        Object.keys(keyCallbackMap).forEach(key => {
            // if (typeof window !== 'undefined' && typeof (window)['electron'] !== 'undefined') {
            //   (window)['electron'].ipcRenderer.on(key, keyCallbackMap[key]);
            // }
            // ipcRenderer.on(key, keyCallbackMap[key])
        })
        return () => {
            Object.keys(keyCallbackMap).forEach(key => {
                ipcRenderer.removeListener(key, keyCallbackMap[key])
                    // if (typeof window !== 'undefined' && typeof (window)['electron'] !== 'undefined') {
                    //   (window)['electron'].ipcRenderer.removeListener(key, keyCallbackMap[key]);
                    // }
            })
        }
    }, [])
}

export default useIpcRenderer;