import { createStore, compose, applyMiddleware } from "redux";
import reduxThunk, { ThunkMiddleware } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducers, RootActions, RootState } from "../reducers";
function saveToStorage(state :RootState){
    try{
        const serlizedState = JSON.stringify(state);
        window.localStorage.setItem('state',serlizedState);
        sessionStorage.setItem('state',serlizedState);
    }
    catch(e){
        console.log(e)
    }
}
function loadFromStorage(){
    const serlizedState =  window.localStorage.getItem('state');
    if(serlizedState === null){
        return undefined;
    }
    return JSON.parse(serlizedState);
}
const presistedState = loadFromStorage();
export const store = createStore(
    rootReducers,
    presistedState,
    compose(
        composeWithDevTools(applyMiddleware(reduxThunk as ThunkMiddleware<RootState,RootActions>))
    )
);
store.subscribe(() => saveToStorage(store.getState()));