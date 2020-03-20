

module.exports = function uploadImageToStorage(title, body) {
    var admin = require("firebase-admin");

    var message = {
        "data": {
            "message": "New Survey Added",
            "icon": "https://survey-cmr.cf/favicon.png"
        },
        "topic": "survey",
        "notification": {
            "title": title,
            "body": body
        },
        "webpush": {
            "fcm_options": {
              "link": "https://survey-cmr.cf"
            }
        }
    }
    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
    .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });
}