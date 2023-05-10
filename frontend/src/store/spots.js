import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SINGLE_SPOT = "spots/LOAD_SINGLE_SPOTS";
const CREATE_A_SPOT = "spots/CREATE_A_SPOT";
const GET_CURRENT_USER_SPOTS = "spots/GET_CURRENT_USER_SPOTS"
const UPDATE_A_SPOT = "spots/UPDATE_A_SPOT";
const DELETE_A_SPOT = "spots/DELETE_A_SPOT";

//ACTIONS FOR SPOTS
export const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots
  };
};

export const loadSingleSpot = (spot) => {
  return {
    type: LOAD_SINGLE_SPOT,
    spot
  };
};

export const makeASpot = (spot) => {
  return {
    type: CREATE_A_SPOT,
    spot
  };
};

export const loadUserSpots = (spots) => {
  return {
    type: GET_CURRENT_USER_SPOTS,
    spots
  }
}

export const editASpot = (spot) => {
  return {
    type: UPDATE_A_SPOT,
    spot
  }
}

export const removeASpot = (spotId) => {
  return {
    type: DELETE_A_SPOT,
    spotId
  }
}

//THUNKS FOR SPOTS
export const getAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");

  if (response.ok) {
    let spots = await response.json();
    // console.log("After fetching data", spots);
    spots = spots.Spots;
    dispatch(loadSpots(spots));
    return spots;
  }
};

export const getSingleSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);

  if (response.ok) {
    let spot = await response.json();
    // console.log("after grabbing from db", spot)
    dispatch(loadSingleSpot(spot));
    return spot;
  }
};

export const createASpot = (spot) => async (dispatch) => {
  console.log("Create a spot thunk",spot)
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot)
  });

  if (response.ok) {
    const newSpot = await response.json();
    console.log("after response", newSpot);
    dispatch(makeASpot(newSpot));
    return newSpot;
  }
};

export const getUserSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current/');
  const spots = await response.json();
  console.log("thunky", spots);
  dispatch(loadUserSpots(spots.Spots))
}

export const updateASpot = (spot, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(spot)
    });

    if(response.ok) {
      const updatedSpot = await response.json();
      dispatch(editASpot(updatedSpot))
      return updatedSpot;
    }
}

export const deleteASpot = spotId => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
      headers: {'Content-Type': 'application/json'}
    });

    if(response.ok) {
      dispatch(removeASpot(spotId));
    }
}

//SPOT REDUCER
const initialState = { allSpots: {}, singleSpot: { SpotImages: [] } };

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const spots = {};
      action.spots.forEach((spot) => (spots[spot.id] = spot));
      return { allSpots: { ...spots }, singleSpot: { ...state.singleSpot } };
    }
    case LOAD_SINGLE_SPOT: {
      const newState = { ...state, singleSpot: { ...state.singleSpot } };
      // console.log("this is the new state", newState);
      const oneSpot = {
        ...action.spot,
        SpotImages: [state.singleSpot.SpotImages],
      };
      action.spot.SpotImages.forEach((img, index) => {
        oneSpot.SpotImages[index] = img;
      });
      newState.singleSpot = oneSpot;
      return newState;
    }
    case CREATE_A_SPOT: {
      let newSpot = {};
      newSpot = {...action.spot};
      let newState = { ...state, newSpot};
      newState.allSpots[action.spot.id] = newSpot;
      return newState;
    }
    case GET_CURRENT_USER_SPOTS: {
      let newState = {allSpots: {}, singleSpot: { SpotImages: [] }};
      const newSpots = {};
      action.spots.forEach(spot => {
        newSpots[spot.id] = spot
      });
    return { allSpots: { ...newSpots }, singleSpot: { ...newState.singleSpot } };

    }
    case UPDATE_A_SPOT: {
      let newState = {...state};
      newState.singleSpot = action.spot;
      return newState;
    }
    case DELETE_A_SPOT: {
      const newState = {...state};
      delete newState[action.spotId]
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default spotReducer;
