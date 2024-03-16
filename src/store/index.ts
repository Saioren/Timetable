import { createStore } from "easy-peasy";
import model from './models/index.ts'

const store = createStore(model)

export default store;