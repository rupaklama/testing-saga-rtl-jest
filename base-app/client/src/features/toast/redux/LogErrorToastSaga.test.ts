// note - we need to import all the modules that we are using in Saga file
import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ToastOptions } from '../types';
import { showToast } from './toastSlice';

// note - we have to test Worker Saga ONLY since Watcher Saga is only
// since Watcher Saga only runs takeEvery effect & it's Redux Saga job to test it, not us

// Testing Worker Saga with Redux Saga Test Plan
// expectSaga - is to do integration testing
import { expectSaga } from 'redux-saga-test-plan';
import { logErrorToast, logErrorToasts } from './LogErrorToastSaga';

// creating mock payload
const errorToastOptions: ToastOptions = {
  title: 'Time to panic!',
  status: 'error',
};

// creating mock action
const errorToastAction = {
  // type - our custom placeholder name for action type
  // note - this does not get use at all
  type: 'test',

  // action payload is what gets pass in & used
  payload: errorToastOptions,
};

test("saga calls 'logErrorToast' when it receives error alert", () => {
  // 'expectSaga' is an async method which takes in 'Worker Saga' & 'Action' as an arguments
  // Using 'return' statement since it is an Async Func & making it asynchronous code
  return (
    // passing arg - mock action
    expectSaga(logErrorToasts, errorToastAction)
      // Making assertion by chaining 'call' method onto expectSaga
      // whatever 'saga effects' that we want to assert
      // note - asserting call effect which should call 'logErrorToast' function &
      // console log an error with our action payload
      .call(logErrorToast, 'Time to panic!')
      // method to run the saga
      .run()
  );
});

// payload
const infoToastOptions: ToastOptions = {
  title: 'not an error',
  status: 'info',
};

// action
const infoToastAction = {
  type: 'test',
  payload: infoToastOptions,
};

test("saga does not calls 'logErrorToast' when it receives info alert", () => {
  // note - 'not' to negate the call effect
  // Partial Matching Assertions with 'call.fn' - since we just want to make sure we call the func
  // only & no need to pass the args strings.
  // call.fun - helper method is a short cut for not needing to pass second arguments
  return expectSaga(logErrorToasts, infoToastAction).not.call.fn(logErrorToast).run();
});
