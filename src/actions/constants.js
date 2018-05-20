export const ID = '$$RRECORDS';

const escapeRegExp = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

export const LOAD = new RegExp(`${escapeRegExp(ID)}/(\\w+)/LOAD`);
export const LOAD_FAILED = new RegExp(`${escapeRegExp(ID)}/(\\w+)/LOAD_FAILED`);
export const LOAD_SUCCEEDED = new RegExp(`${escapeRegExp(ID)}/(\\w+)/LOAD_SUCCEEDED`);
export const UPDATE = new RegExp(`${escapeRegExp(ID)}/(\\w+)/UPDATE`);
export const UPDATE_SYNC = new RegExp(`${escapeRegExp(ID)}/(\\w+)/UPDATE_SYNC`);
export const UPDATE_FAILED = new RegExp(`${escapeRegExp(ID)}/(\\w+)/UPDATE_FAILED`);
export const UPDATE_SUCCEEDED = new RegExp(`${escapeRegExp(ID)}/(\\w+)/UPDATE_SUCCEEDED`);
export const DELETE = new RegExp(`${escapeRegExp(ID)}/(\\w+)/DELETE`);
export const DELETE_SYNC = new RegExp(`${escapeRegExp(ID)}/(\\w+)/DELETE`);
export const DELETE_FAILED = new RegExp(`${escapeRegExp(ID)}/(\\w+)/DELETE_FAILED`);
export const DELETE_SUCCEEDED = new RegExp(`${escapeRegExp(ID)}/(\\w+)/DELETE_SUCCEEDED`);
export const SYNC_ALL = new RegExp(`${escapeRegExp(ID)}/(\\w+)/SYNC_ALL`);
export const UNDO = new RegExp(`${escapeRegExp(ID)}/(\\w+)/UNDO`);
export const REDO = new RegExp(`${escapeRegExp(ID)}/(\\w+)/REDO`);
export const DISCARD = new RegExp(`${escapeRegExp(ID)}/(\\w+)/DISCARD`);
export const INITIALIZE = new RegExp(`${escapeRegExp(ID)}/(\\w+)/INITIALIZE`);
export const DESTRUCT = new RegExp(`${escapeRegExp(ID)}/(\\w+)/DESTRUCT`);

export const DATA_ID_EXP = new RegExp(`${escapeRegExp(ID)}/(\\w+)/`);

const constantsFactory = DATA_ID => ({
  LOAD: `${ID}/${DATA_ID}/LOAD`,
  LOAD_FAILED: `${ID}/${DATA_ID}/LOAD_FAILED`,
  LOAD_SUCCEEDED: `${ID}/${DATA_ID}/LOAD_SUCCEEDED`,
  UPDATE: `${ID}/${DATA_ID}/UPDATE`,
  UPDATE_SYNC: `${ID}/${DATA_ID}/UPDATE_SYNC`,
  UPDATE_FAILED: `${ID}/${DATA_ID}/UPDATE_FAILED`,
  UPDATE_SUCCEEDED: `${ID}/${DATA_ID}/UPDATE_SUCCEEDED`,
  DELETE: `${ID}/${DATA_ID}/DELETE`,
  DELETE_SYNC: `${ID}/${DATA_ID}/DELETE_SYNC`,
  DELETE_FAILED: `${ID}/${DATA_ID}/DELETE_FAILED`,
  DELETE_SUCCEEDED: `${ID}/${DATA_ID}/DELETE_SUCCEEDED`,
  SYNC_ALL: `${ID}/${DATA_ID}/SYNC_ALL`,
  UNDO: `${ID}/${DATA_ID}/UNDO`,
  REDO: `${ID}/${DATA_ID}/REDO`,
  DISCARD: `${ID}/${DATA_ID}/DISCARD`,
  INITIALIZE: `${ID}/${DATA_ID}/INITIALIZE`,
  DESTRUCT: `${ID}/${DATA_ID}/DESTRUCT`,
});

export default constantsFactory;
