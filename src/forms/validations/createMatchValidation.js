// @flow
import R from 'ramda';

const createMatchValidation = (
  path: Array<string>,
  pathToMatch: Array<string>,
  invalidMessage: string = 'no match',
) =>
  R.ifElse(
    R.converge(R.compose(R.not, R.equals), [R.path(path), R.path(pathToMatch)]),
    () => R.assocPath(path, invalidMessage, {}),
    () => ({}),
  );

export default createMatchValidation;
