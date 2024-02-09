/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ae0bxggwlln86ub")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fqovefxh",
    "name": "fk_logbook",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "psw9ki7rrjtqdn5",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ae0bxggwlln86ub")

  // remove
  collection.schema.removeField("fqovefxh")

  return dao.saveCollection(collection)
})
