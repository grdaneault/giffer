import { combineReducers } from 'redux'
import movies from "./Movie";
import {renderStart, renderEnd, subtitlesByIdByMovie} from "./Creator";
import {searchPage, searchQuery, searchResultsByQuery} from "./Search";

const rootReducer = combineReducers({searchPage, searchQuery, searchResultsByQuery, movies, renderStart, renderEnd, subtitlesByIdByMovie});

export default rootReducer;