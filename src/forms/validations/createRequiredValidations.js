import R from 'ramda';

import createValidation from './createValidation';
import createPathValidation from './createPathValidation';

type Paths = Array<Array<string>>;

const createRequiredValidations = (
  paths: Paths,
  invalidMessage: string = 'required',
) => {
  const validationSpecs = R.map(path =>
    createPathValidation(path, R.anyPass([R.isEmpty, R.isNil]), invalidMessage),
  )(paths);
  return createValidation(validationSpecs);
};

export default createRequiredValidations;
