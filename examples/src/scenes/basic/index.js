import React from 'react';
import { dataContainer } from 'redux-records';

const basicScreen = () => (<span>Basic Screen</span>);

export default dataContainer({ dataKey: 'USERS', dataID: 'id' })(basicScreen);
