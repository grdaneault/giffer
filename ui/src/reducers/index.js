import { combineReducers } from 'redux'
import movies from "./Movie";
import gifCreator from "./GifCreator";
import search from "./Search";

const rootReducer = combineReducers({search, movies, gifCreator});

export default rootReducer;