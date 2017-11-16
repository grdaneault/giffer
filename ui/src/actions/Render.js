export const RENDER_GIF_START= 'RENDER_GIF_START';
export const RECEIVE_GIF_STATUS = 'RECEIVE_GIF_STATUS';


export const renderGif = (movieId, startId, endId) => ({
    type: RENDER_GIF_START,
    movieId,
    startId,
    endId
});

export const receiveGifStatus = (json) => ({
    type: RECEIVE_GIF_STATUS,
    state: json.state,
    url: json.url,
    renderId: json.renderId
});

export const updateRenderStatus = (renderId) => dispatch => {
    return fetch(`/api/v1/gif/status/${renderId}`)
        .then(response => response.json())
        .then(json => {
            dispatch(receiveGifStatus(json));
            if (json.state !== "SUCCESS") {
                setTimeout(function() {
                    console.log("delayed retry");
                    dispatch(updateRenderStatus(renderId))
                }, 1000);
            }
        });
};

export const triggerRender = (movieId, startId, endId) => dispatch => {
    console.log("triggered");
    dispatch(renderGif(movieId, startId, endId));

    return fetch(`/api/v1/movie/${movieId}/subtitle/${startId}:${endId}/gif`)
        .then(response => response.json())
        .then(json => {
            dispatch(receiveGifStatus(json));
            if (json.state !== "SUCCESS") {
                setTimeout(function () {
                    console.log("delayed retry");
                    dispatch(updateRenderStatus(json.renderId))
                }, 1000);
            }
        });
};

