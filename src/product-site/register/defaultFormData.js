const defaultFormData = [
    {
      "heading": "New Header",
      "id": 0,
      "imgLink": "/static/media/defaultBanner.dd0c5647a035bc1e3f3f.png",
      "imgName": "Default Banner",
      "imgPath": "",
      "subheading": false,
      "type": "header"
    },
    {
      "heading": "Directive Title",
      "id": 1,
      "required": true,
      "subheading": false,
      "type": "shorttext"
    },
    {
      "heading": "Directive Type",
      "id": 2,
      "options": [
        "Public",
        "Private"
      ],
      "required": true,
      "subheading": false,
      "type": "radio"
    },
    {
      "heading": "Sponsors",
      "id": 3,
      "max": false,
      "options": "all-delegations",
      "required": true,
      "subheading": false,
      "type": "select-multiple"
    },
    {
      "heading": "Signatories",
      "id": 4,
      "max": false,
      "options": "all-delegations",
      "required": false,
      "subheading": false,
      "type": "select-multiple"
    },
    {
      "heading": "Operative Clause & Perceived Outcome",
      "id": 5,
      "required": false,
      "subheading": false,
      "type": "longtext"
    },
    {
      "heading": "Additional Notes",
      "id": 6,
      "required": false,
      "subheading": false,
      "type": "longtext"
    }
]

export default defaultFormData;