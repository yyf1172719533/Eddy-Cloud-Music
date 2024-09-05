export default store => {
    store.subscribe((mutation, state) => {
        console.log(mutation, state)
        localStorage.setItem('settings', JSON.stringify(state.settings))
        localStorage.setItem('data', JSON.stringify(state.data))
    })
}
