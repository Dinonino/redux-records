import constantsFactory, * as CONSTANTS_REGEX from './constants';

const actionsFactory = (dataKey) => {
  const constants = constantsFactory(dataKey);

  const loadAction = options => ({ type: constants.LOAD, payload: options });
  const loadFailedAction = error => ({ type: constants.LOAD_FAILED, payload: error });
  const loadSucceededAction = () => ({ type: constants.LOAD_SUCCEEDED });

  const updateAction = entity => ({ type: constants.UPDATE, payload: { entity } });
  const updateSyncAction = entity => ({ type: constants.UPDATE_SYNC, payload: { entity } });
  const updateFailedAction = error => ({ type: constants.UPDATE_FAILED, payload: error });
  const updateSucceededAction = (previousId, entity) => ({ type: constants.UPDATE_SUCCEEDED, payload: { previousId, entity } });

  const deleteAction = entity => ({ type: constants.DELETE, payload: { entity } });
  const deleteSyncAction = entity => ({ type: constants.DELETE_SYNC, payload: { entity } });
  const deleteFailedAction = error => ({ type: constants.DELETE_FAILED, payload: error });
  const deleteSucceededAction = () => ({ type: constants.DELETE_SUCCEEDED });

  const undoAction = entity => ({ type: constants.UNDO, payload: { entity } });
  const redoAction = entity => ({ type: constants.REDO, payload: { entity } });
  const discardAction = entity => ({ type: constants.DISCARD, payload: { entity } });


  const syncAllAction = () => ({ type: constants.SYNC_ALL });

  const initializeStore = dataID => ({ type: constants.INITIALIZE, payload: { dataID } });
  const destructStore = () => ({ type: constants.DESTRUCT });

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
    undoAction,
    redoAction,
    discardAction,
    syncAllAction,
    initializeStore,
    destructStore,
  };
};

export default actionsFactory;

export { CONSTANTS_REGEX, constantsFactory };
