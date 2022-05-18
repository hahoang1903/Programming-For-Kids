import Phaser from 'phaser'

export const GLOBAL_CONFIG = {
	width: 1024,
	height: 576,
	type: Phaser.AUTO,
	parent: 'game-canvas',
	physics: {
		default: 'arcade'
	}
}
