const storage = require('./storage.js');
const stageIndex = require('./stages/index.js');

const stages = [{
  stage: stageIndex.intents.initialStage
}, {
  stage: stageIndex.intents.opStage,
}];

function getStage({
  from
}) {
  if (storage.storage[from]) {
    return storage.storage[from].stage;
  }
  storage.storage[from] = {
    stage: 0,
    protocolo: null,
    params: {},
  };

  return storage.storage[from].stage;
}

exports.stages = stages;
module.exports.getStage = getStage;