import R from 'ramda';

const createPathValidation = (path, isInvalid, invalidMessage) =>
  R.ifElse(
    R.pathSatisfies(isInvalid, path),
    () => R.assocPath(path, invalidMessage, {}),
    () => ({}),
  );

export default createPathValidation;
