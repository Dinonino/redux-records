import { STORE_PATH } from '../reducer/constants'
export const dataSelector = (state, id) => {
    const data = state[id][STORE_PATH.DATA];
}

export const stateSelector = (state, id) => {
    const data = state[id][STORE_PATH.STATE];
} 