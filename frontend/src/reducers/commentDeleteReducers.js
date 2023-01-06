import  {
    COMMENT_Edit_REQUEST,
    COMMENT_Edit_SUCCESS,
    COMMENT_Edit_FAILURE,
} from '../constants/commentConstatants'
 

export const commentEditReducer = (state = {comment: {}}, action) => {
    switch (action.type) {
        case COMMENT_Edit_REQUEST:
            return{loading: true, comment}

        case COMMENT_Edit_SUCCESS:
            return {loading: false, comment:action.payload}

        case COMMENT_Edit_FAILURE:
            return {loading: false, error:action.payload}

        default:
            return state
    }
}

export default commentEditReducer