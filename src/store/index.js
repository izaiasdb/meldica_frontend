import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();
let middleware = applyMiddleware(sagaMiddleware);

const finalCreateStore = compose(middleware)(createStore);

export const configureStore = function configureStore(devTools) {
    
   const store = finalCreateStore(rootReducer, devTools);

   store.runSaga = sagaMiddleware.run;
   store.runSaga(rootSaga);

   return store;
};
