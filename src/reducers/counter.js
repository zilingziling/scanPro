import { SETVALUE} from '../constants/counter'

const INITIAL_STATE = {
  imgUrl: ''
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SETVALUE:
      return {
        ...state,
        imgUrl: action.data
      }
     default:
       return state
  }
}
