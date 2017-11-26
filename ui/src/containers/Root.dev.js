import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import {Route, Redirect} from 'react-router-dom'
import SearchPage from './SearchPage'
import GifCreationPage from "./GifCreationPage";
import DevTools from "./DevTools";

const Root = ({ store }) => (
    <Provider store={store}>
        <div>
            <Route path="/" exact render={() => (<Redirect to="/search/" />)} />
            <Route path="/search/:searchQuery?/:start?"
                   exact={true}
                   component={SearchPage} />

            <Route path="/gif/:movieId/:start"
                   exact={true}
                   component={GifCreationPage} />
            <DevTools />
        </div>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root
