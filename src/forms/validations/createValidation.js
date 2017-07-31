// @flow
import R from 'ramda';

type ValidationSpecs = Array<(data: ?any) => ?any>;
type Options = {
  mergeStrategy: (errors: Array<{}>) => {},
};

const createValidation = (
  validationSpecs: ValidationSpecs,
  { mergeStrategy = R.reduce(R.mergeDeepLeft, {}) }: Options = {},
) =>
  R.compose(mergeStrategy, R.converge(R.unapply(R.identity), validationSpecs));

export default createValidation;
