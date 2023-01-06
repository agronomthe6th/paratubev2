import  {
    COMMENT_CREATE_REQUEST,
    COMMENT_CREATE_SUCCESS,
    COMMENT_CREATE_FAILURE,
} from '../constants/commentConstatants'
 

export const commentActionsReducers = (state = {comment: {}}, action) => {
    switch (action.type) {
        case COMMENT_CREATE_REQUEST:
            // console.log(action.payload)
            return{loading: true}

        case COMMENT_CREATE_SUCCESS:
            console.log(action.payload)
            return {loading: false}

        case COMMENT_CREATE_FAILURE:
            // console.log(action.message)
            return {loading: false, error:action.payload}

        default:
            return state
    }
}

export default commentActionsReducers