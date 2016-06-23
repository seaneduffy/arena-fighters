let settings = Object.create(null);

settings.player1 = null;
settings.player2 = null;
settings.stageWidth = 1334;
settings.stageHeight = 750;
settings.UP = 'up';
settings.LEFT = 'left';
settings.RIGHT = 'right';
settings.DOWN = 'down';
settings.UP_LEFT = 'up_left';
settings.UP_RIGHT = 'up_right';
settings.DOWN_LEFT = 'down_left';
settings.DOWN_RIGHT = 'down_right';
settings.CENTER = 'center';
settings.gameObjectsJsonUri = '/data/gameobjects.json';
settings.levelsJsonUri = '/data/levels.json';
settings.fireBtnJsonUri = '/data/fire.json';
settings.fireBtnImage = '/img/fire.png';
settings.joystickJsonUri = '/data/joystick.json';
settings.joystickImage = '/img/joystick.png';
settings.spriteJsonUri = '/data/sprites.json';
settings.spritesImage = '/img/sprites.png';

module.exports = settings;