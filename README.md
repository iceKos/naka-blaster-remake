## Requirements
* install [node](https://nodejs.org/es/download/). </br>
* install [git](https://git-scm.com/downloads).
## Download & install
```console
git clone https://github.com/Koutawars/bomber-demo.git
cd bomber-demo
npm install
```
## Run
```console
node server/app.js
```
### License

[MIT](/LICENSE)

### check list
- [x] Fixed FPS to 60 frames
- [x] sound backgroud
- [x] sound when drop a bomb
- [x] sound when bomb exploration
- [x] change player avatar and block style
- [x] Add Shield System
- [x] add blackground cloud animation
- [x] add kick bomb function
- [x] fix bug when dead must be cannot drop bomb again
- [x] fix bug when reborn all player have shield again
- [x] show skill board
- [x] reset skill after dead
- [x] add killfeed
- [x] change array player list to player objects
- [x] separate room and data in room
- [ ] player AFK has other player kill but never die
- [ ] add process close area


### link player

room 1
http://localhost:8080/public/1/player-id-1
http://localhost:8080/public/1/player-id-2
http://localhost:8080/public/1/player-id-3
http://localhost:8080/public/1/player-id-4

room 2
http://localhost:8080/public/2/player-id-1
http://localhost:8080/public/2/player-id-2
http://localhost:8080/public/2/player-id-3
http://localhost:8080/public/2/player-id-4