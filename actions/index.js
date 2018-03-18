import constantFactory from './constants';

const actionsFactory = (id) => {
  const constants = constantFactory(id);

  const loadAction = options => ({ type: constants.LOAD, payload: options });
  const loadFailedAction = error => ({ type: constants.LOAD_FAILED, payload: error });
  const loadSucceededAction = () => ({ type: constants.LOAD_SUCCEEDED });

  const updateAction = options => ({ type: constants.UPDATE, payload: options);
  const updateSyncAction = options => ({ type: constants.UPDATE_SYNC, payload: options);
  const updateFailedAction = error => ({ type: constants.UPDATE_FAILED, payload: error });
  const updateSucceededAction = () => ({ type: constants.UPDATE_SUCCEEDED });

  const deleteAction = options => ({ type: constants.DELETE, payload: options);
  const deleteSyncAction = options => ({ type: constants.DELETE_SYNC, payload: options)
  const deleteFailedAction = error => ({ type: constants.DELETE_FAILED, payload: error });
  const deleteSucceededAction = () => ({ type: constants.DELETE_SUCCEEDED });

  const syncAllAction = options => ({ type: constants.SYNC_ALL });

  return {
    loadAction,
    loadFailedAction,
    loadSucceededAction,
    updateAction,
    updateSyncAction,
    updateFailedAction,
    updateSucceededAction,
    deleteAction,
    deleteSyncAction,
    deleteFailedAction,
    deleteSucceededAction,
  };
};

export default actionsFactory;
