import constantFactory from './constants';

const actionsFactory = (id) => {
  const constants = constantFactory(id);

  const loadAction = options => ({ type: constants.LOAD, payload: options });
  const loadFailedAction = error => ({ type: constants.LOAD_FAILED, payload: error });
  const loadSucceededAction = () => ({ type: constants.LOAD_SUCCEEDED });

  const updateAction = entity => ({ type: constants.UPDATE, payload: { entity } });
  const updateSyncAction = entity => ({ type: constants.UPDATE_SYNC, payload: { entity } });
  const updateFailedAction = error => ({ type: constants.UPDATE_FAILED, payload: error });
  const updateSucceededAction = (previousId, entity) => ({ type: constants.UPDATE_SUCCEEDED, payload: { previousId, entity } });

  const deleteAction = entity => ({ type: constants.DELETE, payload: { entity } });
  const deleteSyncAction = entity => ({ type: constants.DELETE_SYNC, payload: { entity } })
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
