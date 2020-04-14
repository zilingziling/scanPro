import {
  SETVALUE
} from '../constants/counter'

export const setValue = (data) => {
  return {
    type: SETVALUE,
    data:data
  }
}


