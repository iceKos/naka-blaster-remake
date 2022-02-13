
var soundSetting = 1;

var music = {
  overworld: new Howl({
    src: ['/music/BG_SOUND.mp3'],
    volume: 0.15,
    loop: true,
    onload() {
      music.overworld.play();
    }
  })
}



var place = new Howl({
  src: ['/music/DROP_BOMB.mp3'],
  loop: false,
  volume: 0.2,
});


var explode = new Howl({
  src: ['/music/BOMB_EXPLOSION.mp3'],
  loop: false,
  volume: 0.2,
});

var sound_alert = new Howl({
  src: ['/music/alert_sound_version2.mp3'],
  loop: true,
  volume: 0.1,
})

var shieldHit = new Howl({
  src: ['/music/sound_shield_hit.m4a'],
  loop: false,
  volume: 0.2,
})


