import PubSubClass from './classes/PubSubClass'
import View from './classes/View'
import Presenter from './classes/Presenter'

const stream = new PubSubClass()
const view = new View()

new Presenter(stream, view)
