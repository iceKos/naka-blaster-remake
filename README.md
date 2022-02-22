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
- [x] Check Duplicate Player
- [x] player AFK has other player kill but never die
- [x] add process close area
- [x] Record screen vdo when play game
- [x] add buttom record screen
- [x] add buttom mute sound
- [ ] show dialog winner
- [ ] save game play data
### link player

### bug
- [ ] duplicate kill feed
- [ ] cannot count kill score 

dev

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


prod



room 1
http://139.59.98.105:8080/public/1/player-id-1
http://139.59.98.105:8080/public/1/player-id-2
http://139.59.98.105:8080/public/1/player-id-3
http://139.59.98.105:8080/public/1/player-id-4

room 2
http://139.59.98.105:8080/public/2/player-id-1
http://139.59.98.105:8080/public/2/player-id-2
http://139.59.98.105:8080/public/2/player-id-3
http://139.59.98.105:8080/public/2/player-id-4