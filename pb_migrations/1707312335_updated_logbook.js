/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("psw9ki7rrjtqdn5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1dmvla6j",
    "name": "fk_plant",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ae0bxggwlln86ub",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("psw9ki7rrjtqdn5")

  // remove
  collection.schema.removeField("1dmvla6j")

  return dao.saveCollection(collection)
})
