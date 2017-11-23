import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {CircularProgress, Avatar} from "material-ui";
import {fetchMovieIfNecessary} from "../actions/Movie";
import {connect} from "react-redux";


class MovieAvatar extends Component {
    static propTypes = {
        movieMap: PropTypes.object.isRequired,
        movieId: PropTypes.number.isRequired
    };

    componentWillMount() {
        const {dispatch, movieId, movieMap} = this.props;
        if (!movieMap.has(movieId)) {
            dispatch(fetchMovieIfNecessary(movieId));
        }
    }

    render() {
        const {movieId, movieMap} = this.props;
        const isLoading = !movieMap.has(movieId) || movieMap.getIn([movieId, 'isLoading']);
        return (isLoading ?
                <Avatar>
                    <CircularProgress/>
                </Avatar> :

                <Avatar src={movieMap.getIn([movieId, 'cover_image'])}/>
        );
    }
}

const mapStateToProps = state => {
    const {movies} = state;

    return {
        movieMap: movies.get('movieMap')
    };
};

export default connect(mapStateToProps)(MovieAvatar);