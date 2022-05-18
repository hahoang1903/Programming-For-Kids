import Phaser from 'phaser'

class BaseScene extends Phaser.Scene {
	constructor(sceneName) {
		super(sceneName)

		this.config = {
			width: 1024,
			height: 576
		}

		this.center = {
			x: this.config.width / 2,
			y: this.config.height / 2
		}
	}
}

export default BaseScene
