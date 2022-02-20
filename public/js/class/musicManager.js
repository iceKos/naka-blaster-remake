
var soundSetting = 1;

var music = {
  overworld: new Howl({
    src: ['/music/BG_SOUND.mp3'],
    volume: 0.15,
    loop: true,
    onload() {
      music.overworld.play();
    }
  }),
  place: new Howl({
    src: ['/music/DROP_BOMB.mp3'],
    loop: false,
    volume: 0.2,
  }),
  explode: new Howl({
    src: ['/music/BOMB_EXPLOSION.mp3'],
    loop: false,
    volume: 0.2,
  }),
  sound_alert: new Howl({
    src: ['/music/alert_sound_version2.mp3'],
    loop: true,
    volume: 0.1,
  }),
  shieldHit: new Howl({
    src: ['/music/sound_shield_hit.m4a'],
    loop: false,
    volume: 0.2,
  }),
  soundKickBomb: new Howl({
    src: ['/music/kick_bomb_sound.m4a'],
    loop: false,
    volume: 0.3,
  }),
  soundLevelUp: new Howl({
    src: ['/music/pick-item.wav'],
    loop: false,
    volume: 0.1,
  }),
  soundDead: new Howl({
    src: ['/music/play-when-die.wav'],
    loop: false,
    volume: 0.1
  }),
  sound_alert: new Howl({
    src: ['/music/alert_sound_version2.mp3'],
    loop: true,
    volume: 0.1,
  })
}

