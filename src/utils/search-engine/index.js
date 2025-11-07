import engGoogle from './eng-google'
import engBing from './eng-bing'
import engWikipedia from './eng-wikipedia'

const ENGINES = {
  Google: engGoogle,
  Bing: engBing,
  Wikipedia: engWikipedia,
}

function target(eng, wd) {
  return ENGINES[eng].target(wd);
}

function complete(eng, wd, callback) {
  return ENGINES[eng].complete(wd, callback);
}

export default {
  target,
  complete,
}
