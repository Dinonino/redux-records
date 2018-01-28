import constantFactory from './constants';

const actionsFactory = (id) => {
  const constants = constantFactory(id);

  const load = options => ({ type: constants.LOAD, payload: options });
  const loadFailed = error => ({ type: constants.LOAD_FAILED, payload: error });
  const loadSucceeded = () => ({ type: constants.LOAD_SUCCEEDED });
  return {
    load,
    loadFailed,
    loadSucceeded,
  };
};

export default actionsFactory;
