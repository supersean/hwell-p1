# hwell-p1

Project setup:

.env

    MONGO_PASSWORD=password



line 14 in app.js

    let dev_db_url = `mongodb+srv://p1_user:${password}@p1-4jwuj.mongodb.net/p1?retryWrites=true&w=majority`;

change url to a mongo connection string. You can spin up a free mongo cluster at: https://www.mongodb.com/cloud/atlas/register

