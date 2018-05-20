const set = () => {

};

const get = (state, path) => path.reduce((obj, key) =>
  ((obj && obj[key] !== 'undefined') ? obj[key] : undefined), state);

export default { get, set };
