import constantsFactory, * as CONSTANTS_REGEX from './constants';

const actionsFactory = (dataKey) => {
  const constants = constantsFactory(dataKey);

  const loadAction = options => ({ type: constants.LOAD, payload: options });
  const loadFailedAction = error => ({ type: constants.LOAD_FAILED, payload: error });
  const loadSucceededAction = () => ({ type: constants.LOAD_SUCCEEDED });

  const updateAction = (entity, entityId) =>
    ({ type: constants.UPDATE, payload: { entity, entityId } });
  const updateSyncAction = (entity, entityId) =>
    ({ type: constants.UPDATE_SYNC, payload: { entity, entityId } });
  const updateFailedAction = (entityId, error) =>
    ({ type: constants.UPDATE_FAILED, payload: { entityId, error } });
  const updateSucceededAction = (entity, entityId) =>
    ({ type: constants.UPDATE_SUCCEEDED, payload: { entityId, entity } });

  const deleteAction = entity => ({ type: constants.DELETE, payload: { entity } });
  const deleteSyncAction = entity => ({ type: constants.DELETE_SYNC, payload: { entity } });
  const deleteFailedAction = (entityId, error) => ({ type: constants.DELETE_FAILED, payload: { entityId, error } });
  const deleteSucceededAction = entityId =>
    ({ type: constants.DELETE_SUCCEEDED, payload: { entityId } });

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
