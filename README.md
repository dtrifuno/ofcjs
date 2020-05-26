# OFCjs

OFCjs is a web application that allows you to play [open-face Chinese poker](https://en.wikipedia.org/wiki/Open-face_Chinese_poker) against other players.

Go to [trifunovski.me/ofcjs](https://trifunovski.me/ofcjs/) to try it out!

![OFCjs](https://github.com/dtrifuno/ofcjs/raw/master/promo/game.png?raw=true)

## Built With

### Backend (JavaScript)
* [Node](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [socket.io](https://socket.io/)
* [Winston](https://www.npmjs.com/package/winston)

### Frontend (JavaScript/HTML/CSS)
* [React](https://reactjs.org/)
* [unstated](https://github.com/jamiebuilds/unstated)
* [socket.io-client](https://socket.io/)

## Installation
This project uses the Node package manager (npm) for managing its JavaScript dependencies. Make sure that it is installed on your system, and then:

- Clone the repo.
```
$ git clone git@github.com:dtrifuno/ofcjs.git
```
- Install the server and client dependencies.
```
$ cd ofcjs
$ npm install
$ cd client
$ npm install
```
## Usage

### Development

Run `npm run dev` in the root directory to start the Node server and `npm run build` in `client` to build the client files. By default, the node server is going to accept connections at port 3001, but this can be changed by using the `OFCJS_PORT` environment variable. Using the React dev server is not supported at this time, due to the difficulty of getting it to work with socket.io.

### Deployment

Set the `homepage` key in `client/package.json` to the path from which you intend to serve OFCjs (this will ensure that the client gets built with the correct %PUBLIC_URL%). Then run `npm run build` inside client directory and copy the content of the newly created `build` directory to the directory from which you will serve the static content. Create a systemd service to run the node server and setup your web server as a reverse proxy for socket.io connections (see sample `ofcjs.service` and nginx config files below). 

```
# ofcjs.service
[Unit]
Description=Node instance to serve ofcjs
After=network.target

StartLimitIntervalSec=500
StartLimitBurst=5

[Service]
User=dtrifuno
Group=www-data
WorkingDirectory=/home/dtrifuno/projects/ofcjs
Environment=PATH=/home/dtrifuno/projects/ofcjs
Environment=OFCJS_PORT=3005
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /home/dtrifuno/projects/ofcjs/server

Restart=on-failure
RestartSec=5s


[Install]
WantedBy=multi-user.target
```

```
# nginx config 
server {
    listen 80;
    server_name trifunovski.me www.trifunovski.me;

    location /socket.io/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
        
    location / {
        try_files $uri $uri/ =404;
    }
}
```


## TODO
* **AI Players** Add support for playing against AI players.
* **Testing** Write unit and functional tests.
* **Containerize** Package the application as a Docker container.

## License
[MIT](https://choosealicense.com/licenses/mit/)