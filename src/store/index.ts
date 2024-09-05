import {createStore, StoreOptions} from 'vuex'
import state from './state.ts'
import actions from "./actions.ts";
import {mutations} from "./mutations.ts";

const store = createStore<StoreOptions>({
    state: state,
    mutations: mutations,
    actions: actions
})
