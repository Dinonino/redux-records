import { connect } from 'react-redux';
import { STORE_KEY } from '../reducer/constants';
import { actionsSelector, dataSelector } from '../selectors';
import actionsFactory from '../actions/index';
const dataContainer = ({ dataKey = STORE_KEY, entityKey, entityId }) =>
    connect(state => ({
        data: entityId ?
            state[dataKey][entityKey][STORE_PATH.DATA][entityId] :
            state[dataKey][entityKey][STORE_PATH.DATA],
        sate: entityId ?
            state[dataKey][entityKey][STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE][entityId] :
            state[dataKey][entityKey][STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE]
    }),
        actionsFactory(entityKey)
    );

export default dataContainer;

