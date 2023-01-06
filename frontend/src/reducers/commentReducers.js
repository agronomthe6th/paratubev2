import  {
    COMMENT_LIST_REQUEST,
    COMMENT_LIST_SUCCESS,
    COMMENT_LIST_FAILURE,
} from '../constants/commentConstatants'
 

export const commentReducer = (state = {comments: []}, action) => {
    switch (action.type) {
        case COMMENT_LIST_REQUEST:
            // console.log('loading comment list request');
            return{loading: true, comments:[]}

        case COMMENT_LIST_SUCCESS:
            // console.log(action.payload);
            return {loading: false, comments:action.payload}

        case COMMENT_LIST_FAILURE:
            // console.log(action.payload);
            return {loading: false, error:action.payload}

        default:
            return state
    }
}

export default commentReducer

