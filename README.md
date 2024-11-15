# GuChokiPa
This project entails the creation of a web bases application, which allows two players to play rock,paper,scissors against each other and store a score.

## Setup
1. To be able to start the application docker needs to be installed on the system.
2. After installing docker the application can be started with the following:
```bash
docker compose up -d
``` 
3. After the containers have started up both the frontend as well as the backend server needs to be started.
Frontend:
```bash
# change into the docker container
docker compose exec -it vite_docker /bin/sh

# install dependencies
npm i

# run frontend service
npm run dev
```
Backend:
```bash
# change into the docker container
docker compose exec -it express_docker /bin/sh

# install dependencies
npm i

# start the backend service
node server.js
```
4. The Webapplication is available under:
```
http://localhost:8000
``` 