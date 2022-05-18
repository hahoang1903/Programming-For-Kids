import BaseScene from './BaseScene'

class PauseScene extends BaseScene {
	constructor() {
		super('PauseScene')
		this.level = 1
	}

	init({ level }) {
		this.level = level
	}

	create() {
		this.createBoard()
		this.createMenu()
	}

	createBoard() {
		this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.2)')
		this.add.image(this.center.x, this.center.y, 'woodBoard').setOrigin(0.5).setDisplaySize(250, 350)
	}

	createMenu() {
		const scale = 1.5

		const resumeBtn = this.add
			.image(this.center.x, 180, 'greenPlayBtnBig')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => resumeBtn.setScale(1.1 * scale))
			.on('pointerout', () => resumeBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop().resume('PlayScene')
			})

		const restartBtn = this.add
			.image(this.center.x, 280, 'restartBtnBig')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => restartBtn.setScale(1.1 * scale))
			.on('pointerout', () => restartBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop('PlayScene').start('PlayScene', { level: this.level, showIns: false })
			})

		const quitBtn = this.add
			.image(this.center.x, 380, 'quitBtnBig')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => quitBtn.setScale(1.1 * scale))
			.on('pointerout', () => quitBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop('PlayScene').start('MenuScene')
			})
	}
}

export default PauseScene
