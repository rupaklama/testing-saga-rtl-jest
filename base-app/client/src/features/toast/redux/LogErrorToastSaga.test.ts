// note - we need to import all the modules that we are using in Saga file
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";

import { ToastOptions } from "../types";
import { showToast } from "./toastSlice";

// note - we have to test Worker Saga only since Watcher Saga is only calling Action only
// Testing Worker Saga with Redux Saga Test Plan
import { expectSaga } from "redux-saga-test-plan";
import { logErrorToast, logErrorToasts } from "./LogErrorToastSaga";

// creating mock payload
const errorToastOptions: ToastOptions = {
  title: "Time to panic!",
  status: "error",
};

// creating mock action
const errorToastAction = {
  // type - our custom placeholder name for action type
  // note - this does not get use at all
  type: "test",

  // action payload is what gets pass in & used
  payload: errorToastOptions,
};

test("saga calls 'logErrorToast' when it receives error alert", () => {
  // 'expectSaga' is an async method which takes in 'Worker Saga' & 'Action' as an arguments
  // Using 'return' statement since it is an Async Func
  return (
    // passing arg - mock action
    expectSaga(logErrorToasts, errorToastAction)
      // Making assertion by chaining method onto expectSaga
      // whatever 'saga effects' that we want to assert
      // note -  asserting call effect which should console log an error with the message
      .call(logErrorToast, "Time to panic!")
      // method to run the saga
      .run()
  );
});
