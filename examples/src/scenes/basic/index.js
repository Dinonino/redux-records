import React from 'react';
import { dataContainer } from 'redux-records';
const basicScreen = (props) => {
    return (<span>Basic Screen</span>);
}

export default dataContainer({ key: 'USERS', ID: 'id' })(basicScreen);