import { HoldReservation } from '../../../../../shared/types';
import { showToast } from '../../toast/redux/toastSlice';
import { ToastOptions } from '../../toast/types';
import { cancelPurchaseServerCall, releaseServerCall, reserveTicketServerCall } from '../api';
import { TicketAction } from '../types';
import {
  endTransaction,
  holdTickets,
  PurchasePayload,
  ReleasePayload,
  resetTransaction,
  selectors,
  startTicketAbort,
  startTicketPurchase,
  startTicketRelease,
} from './ticketSlice';

import * as matchers from 'redux-saga-test-plan/matchers';

// expectSaga - is to do integration testing with redux saga test plan
import { expectSaga } from 'redux-saga-test-plan';

// sagas
import { generateErrorToastOptions, cancelTransaction, purchaseTickets, ticketFlow } from './ticketSaga';

// mock data for payload
import { holdReservation } from './../../../test-utils/fake-data';

// mock action
const holdAction = {
  // type - our custom placeholder name for action type
  // note - this does not get use at all
  type: 'test',

  // action payload is what gets pass in & used
  payload: holdReservation,
};

describe('common to all flows', () => {
  test('starts with hold call to server', () => {
    // 'expectSaga' is an async method which takes in 'Worker Saga' & 'Action' as an arguments
    // Using 'return' statement since it is an Async Func & making it asynchronous code
    // note - we can also use async await instead of 'return' statement also
    return (
      // note - test passes without 'return' statement even though there's failing assertions
      expectSaga(ticketFlow, holdAction)
        // NOTE - To stop making actual network request so that we don’t get Cross Origin Error thrown
        // Static Providers is an array of tuples, each tuples starts with a matcher &
        // that matches an effect that we want to mock. The second element is the value that gets return for
        // the effect that matches the matcher of the first element.
        // call.fn is a partial matcher since we don't care about the return value
        .provide([[matchers.call.fn(reserveTicketServerCall), null]]) // null - don't care about the value
        // note - asserting call effect & making assertion by chaining 'call' method onto expectSaga
        // whatever 'saga effects' that we want to assert
        .call(reserveTicketServerCall, holdReservation)
        // method to run the saga
        .run()
    );
  });
});
