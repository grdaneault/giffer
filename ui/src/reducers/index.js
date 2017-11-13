import { combineReducers } from 'redux'
import movies from "./Movie";
import creatorReducers from "./Creator";
import searchReducers from "./Search";

const rootReducer = combineReducers({searchReducers, movies, ...creatorReducers});

export default rootReducer;