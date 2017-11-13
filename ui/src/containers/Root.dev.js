import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import SearchPage from './SearchPage'
import GifCreationPage from "./GifCreationPage";

const Root = ({ store }) => (
    <Provider store={store}>
        <div>
            <Route path="/"
                   exact={true}
                   component={SearchPage} />

            <Route path="/search/:searchQuery"
                   exact={true}
                   component={SearchPage} />

            <Route path="/search/:searchQuery/:start"
                   exact={true}
                   component={SearchPage} />

            <Route path="/gif/:movieId/:start"
                   exact={true}
                   component={GifCreationPage} />
        </div>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root
