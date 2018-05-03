import { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { STORE_KEY } from '../reducer/constants';
import { actionsSelector, dataSelector } from '../selectors';
import actionsFactory from '../actions/index';
const dataContainer = ({ dataKey = STORE_KEY, key, ID, destroyOnUnmount = false }) =>
    compose(
        connect(state => ({
            data: ID ?
                state[dataKey][key][STORE_PATH.DATA][ID] :
                state[dataKey][key][STORE_PATH.DATA],
            sate: ID ?
                state[dataKey][key][STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE][ID] :
                state[dataKey][key][STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE]
        }),
            actionsFactory(key)
        ),
        DataContainerHOC({ ID, key, destroyOnUnmount }),
    )
const DataContainerHOC = ({ destroyOnUnmount, ID, key }) => WrappedComponent => {
    return class DataContainer extends Component {
        componentWillMount() {
            const { initializeStore } = this.props;
            initializeStore(key);
        }

        componentWillUnmount() {
            const { destructStore } = this.props;
            if (destroyOnUnmount) {
                destructStore();
            }
        }

        render() {
            return (<WrappedComponent
                {...this.props}
            />);
        }
    }

};
export default dataContainer;

