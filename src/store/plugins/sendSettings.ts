export const getSendSettingPlugin = () => {
    const electron = window.require('electron');
    const ipcRenderer = electron.ipcRenderer;
    return store => {
        store.subscribe((mutation, state) => {
            console.log(mutation, state)
            if (mutation.type !== 'updateSettings') {
                return
            }
            ipcRenderer.send('settings', state.settings)
        })
    }
}
