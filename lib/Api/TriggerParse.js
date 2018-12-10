'use strict'

module.exports = trigger => {
  // treat trigger body
  // https://developers.e-com.plus/docs/api/#/store/triggers/triggers
  // parse trigger body to resource partial object
  const objectId = trigger.resource_id || trigger.inserted_id
  let object = { _id: objectId }

  if (!trigger.subresource) {
    // no subresource
    if (trigger.action !== 'delete') {
      // new or edited object
      // merge body to object
      Object.assign(object, trigger.body)
    }
  } else {
    // with subresource
    object = {}
    let subresourceId = trigger.subresource_id || trigger.inserted_id
    if (!subresourceId) {
      // subresource object edited
      object[trigger.subresource] = trigger.body
    } else {
      // current subresource is an array of nested objects
      let nestedObject = { _id: subresourceId }
      if (trigger.action !== 'delete') {
        // new or edited nested object
        // merge ID to object body
        Object.assign(nestedObject, trigger.body)
      }
      object[trigger.subresource] = [ nestedObject ]
    }
  }

  // returns resultant object and ID
  return {
    object,
    objectId
  }
}
