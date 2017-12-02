import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Provider} from 'react-redux'
import {Route, Redirect} from 'react-router-dom'
import SearchPage from './SearchPage'
import GifCreationPage from "./GifCreationPage";
import DevTools from "./DevTools";

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import AppSearch from "../components/SubtitleSearchBox";

import JssProvider from 'react-jss/lib/JssProvider';
import {withStyles, MuiThemeProvider} from 'material-ui/styles';
import wrapDisplayName from 'recompose/wrapDisplayName';
import createContext from '../theme';

// Apply some reset
const styles = theme => ({
    '@global': {
        html: {
            background: theme.palette.background.default,
            WebkitFontSmoothing: 'antialiased', // Antialiasing.
            MozOsxFontSmoothing: 'grayscale', // Antialiasing.
        },
        body: {
            margin: 0,
        },
    },
    root: {
        marginTop: theme.spacing.unit * 3,
        width: '100%',
    },
    flex: {
        flex: 1,
    }
});

let AppWrapper = props => props.children;

AppWrapper = withStyles(styles)(AppWrapper);

const context = createContext();


const showDevTools = process.env.NODE_ENV === 'production';


class Root extends Component {
    render() {
        const {classes, store} = this.props;

        return (
            <Provider store={store}>
                <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
                    <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager}>
                        <AppWrapper>
                            <div>
                                <AppBar position="static">
                                    <Toolbar>
                                        <Typography type="title" color="inherit" className={classes.flex}>
                                            Giffer
                                        </Typography>
                                        <AppSearch/>
                                    </Toolbar>
                                </AppBar>

                                <div>
                                    <Route path="/" exact render={() => (<Redirect to="/search/"/>)}/>
                                    <Route path="/search/:searchQuery?/:start?"
                                           exact={true}
                                           component={SearchPage}/>

                                    <Route path="/gif/:movieId/:start"
                                           exact={true}
                                           component={GifCreationPage}/>
                                    {showDevTools && <DevTools/>}
                                </div>
                            </div>
                        </AppWrapper>
                    </MuiThemeProvider>
                </JssProvider>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Root);
