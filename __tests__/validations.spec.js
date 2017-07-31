// @flow
import R from 'ramda';

import createValidation from 'modules/forms/validations/createValidation';
import createRequiredValidations from 'modules/forms/validations/createRequiredValidations';
import createPathValidation from 'modules/forms/validations/createPathValidation';
import createMatchValidation from 'modules/forms/validations/createMatchValidation';

describe('compose validations', () => {
  test('compose validations', () => {
    const validation = createValidation([
      createRequiredValidations([['username'], ['password']]),
      createMatchValidation(['confirmPassword'], ['password']),
      createPathValidation(
        ['password'],
        R.compose(R.lte(R.__, 5), R.length),
        "password length shouldn't be less or equal to 5",
      ),
    ]);
    expect(validation({ confirmPassword: 'wrong password' })).toEqual({
      username: 'required',
      password: 'required',
      confirmPassword: 'no match',
    });
    expect(validation({ password: 'test' })).toEqual({
      username: 'required',
      password: "password length shouldn't be less or equal to 5",
      confirmPassword: 'no match',
    });
    expect(validation({ password: 'password' })).toEqual({
      username: 'required',
      confirmPassword: 'no match',
    });
    expect(
      validation({
        username: 'username',
        password: 'password',
        confirmPassword: 'password',
      }),
    ).toEqual({});
  });

  test('simple validations', () => {
    const validation = createValidation([
      createRequiredValidations([['username'], ['password']]),
      createMatchValidation(['confirmPassword'], ['password']),
      createPathValidation(
        ['password'],
        R.compose(R.lte(R.__, 5), R.length),
        "password length shouldn't be less or equal to 5",
      ),
      data => {
        if (data.password && data.password.length > 10) {
          return { password: 'should be less than 10' };
        }
        return {};
      },
    ]);
    expect(
      validation({
        username: 'username',
        password: 'passwordpasswordpassword',
        confirmPassword: 'passwordpasswordpassword',
      }),
    ).toEqual({
      password: 'should be less than 10',
    });
  });
});

describe('required validations', () => {
  test('required validations', () => {
    const validation = createValidation([
      createRequiredValidations([['username'], ['password']]),
    ]);
    expect(validation({})).toEqual({
      username: 'required',
      password: 'required',
    });
    expect(
      validation({
        username: 'username',
      }),
    ).toEqual({
      password: 'required',
    });
    expect(
      validation({
        username: '',
      }),
    ).toEqual({
      username: 'required',
      password: 'required',
    });
  });

  test('required validations with invalidMessage', () => {
    const validation = createValidation([
      createRequiredValidations(
        [['username'], ['password']],
        'This is a required field',
      ),
    ]);
    expect(validation({})).toEqual({
      username: 'This is a required field',
      password: 'This is a required field',
    });
  });

  test('required validations with nested fields', () => {
    const validation = createValidation([
      createRequiredValidations([
        ['username'],
        ['password'],
        ['user', 'phone'],
      ]),
    ]);
    expect(validation({})).toEqual({
      username: 'required',
      password: 'required',
      user: {
        phone: 'required',
      },
    });
    expect(validation({ username: 'username', user: {} })).toEqual({
      password: 'required',
      user: {
        phone: 'required',
      },
    });
  });
});

describe('path validations', () => {
  test('path validations', () => {
    const validation = createValidation([
      createRequiredValidations([['username'], ['password']]),
      createPathValidation(
        ['user', 'phone'],
        R.compose(R.not, R.is(Number)),
        'should contains numbers only',
      ),
    ]);
    expect(validation({})).toEqual({
      username: 'required',
      password: 'required',
      user: {
        phone: 'should contains numbers only',
      },
    });
    expect(validation({ user: { phone: 'hello world' } })).toEqual({
      username: 'required',
      password: 'required',
      user: {
        phone: 'should contains numbers only',
      },
    });
    expect(validation({ user: { phone: 12345 } })).toEqual({
      username: 'required',
      password: 'required',
    });
  });
});

describe('match validation', () => {
  test('match validation', () => {
    const validation = createValidation([
      createMatchValidation(['confirmPassword'], ['password']),
    ]);
    expect(
      validation({ password: 'password', confirmPassword: 'typo' }),
    ).toEqual({
      confirmPassword: 'no match',
    });
  });
});
