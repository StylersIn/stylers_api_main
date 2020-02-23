const OneSignal = require('onesignal-node');

const client = new OneSignal.Client('a3fc8c03-722d-4260-a759-a31c24f44010', 'M2MzZjk0ODMtMzY4Yy00OGE1LWE1MTktNzc0NmMxZWIxZjcy');

const notification = {
    contents: {
        'tr': 'Yeni bildirim',
        'en': 'New notification',
    },
    included_segments: ['Subscribed Users'],
    filters: [
        { field: 'tag', key: 'level', relation: '>', value: 10 }
    ]
};

client.createNotification(notification)
    .then(response => { console.log(response.body) })
    .catch(e => { });