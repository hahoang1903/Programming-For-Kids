import BaseScene from './BaseScene'

class FinishScene extends BaseScene {
	constructor() {
		super('FinishScene')

		this.win = false
		this.level = 1
		this.buttonY = 450
		this.contentWidth = 260
		this.imageY = 240
	}

	init({ win, level }) {
		this.win = win
		this.level = level
	}

	create() {
		this.createBoard()
		if (this.win) {
			this.createWinner()
		} else {
			this.createLoser()
		}
	}

	createBoard() {
		this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.2)')
		this.add.image(this.center.x, this.center.y, 'woodBoard').setOrigin(0.5).setDisplaySize(300, 450)
	}

	createWinner() {
		const padding = 10
		const { scale, buttonSize } = this.getConstants()

		this.add.image(this.center.x, this.imageY, 'winScr').setOrigin(0.5)

		const quitBtn = this.add
			.image(this.center.x - buttonSize - padding, this.buttonY, 'quitBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => quitBtn.setScale(1.1 * scale))
			.on('pointerout', () => quitBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop('PlayScene').start('MenuScene')
			})

		const restartBtn = this.add
			.image(this.center.x, this.buttonY, 'restartBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => restartBtn.setScale(1.1 * scale))
			.on('pointerout', () => restartBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop('PlayScene').start('PlayScene', { level: this.level, showIns: false })
			})

		const advanceBtn = this.add
			.image(this.center.x + buttonSize + padding, this.buttonY, 'playBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => advanceBtn.setScale(1.1 * scale))
			.on('pointerout', () => advanceBtn.setScale(scale))
			.on('pointerup', () => {
				if (this.level < 3) {
					this.scene.stop('PlayScene').start('PlayScene', { level: this.level + 1 })
				} else {
					this.scene.stop('PlayScene').start('MenuScene')
				}
			})
	}

	createLoser() {
		const padding = 20
		const { scale, buttonSize } = this.getConstants()

		this.add.image(this.center.x, this.imageY, 'loseScr').setOrigin(0.5)

		const quitBtn = this.add
			.image(this.center.x - (buttonSize + padding) / 2, this.buttonY, 'quitBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => quitBtn.setScale(1.1 * scale))
			.on('pointerout', () => quitBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop('PlayScene').start('MenuScene')
			})

		const restartBtn = this.add
			.image(this.center.x + (buttonSize + padding) / 2, this.buttonY, 'restartBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => restartBtn.setScale(1.1 * scale))
			.on('pointerout', () => restartBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop('PlayScene').start('PlayScene', { level: this.level, showIns: false })
			})
	}

	getConstants() {
		const buttonSize = (this.contentWidth - 2 * 10) / 3
		const scale = buttonSize / 50

		return { buttonSize, scale }
	}
}

export default FinishScene
