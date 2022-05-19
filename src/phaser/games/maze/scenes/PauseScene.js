import BaseScene from './BaseScene'

class PauseScene extends BaseScene {
	constructor() {
		super('PauseScene')
		this.level = 1
		this.resumeBtnPos = null
		this.restartBtnPos = null
		this.quitBtnPos = null
	}

	init({ level, resumeBtnPos, restartBtnPos, quitBtnPos }) {
		this.level = level
		this.resumeBtnPos = resumeBtnPos
		this.restartBtnPos = restartBtnPos
		this.quitBtnPos = quitBtnPos
	}

	create() {
		this.createMenu()
	}

	createMenu() {
		const scale = 1.2

		const resumeBtn = this.add
			.image(this.restartBtnPos.x, this.resumeBtnPos.y, 'playBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => resumeBtn.setScale(1.1 * scale))
			.on('pointerout', () => resumeBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop().resume('PlayScene')
			})

		const restartBtn = this.add
			.image(this.restartBtnPos.x, this.restartBtnPos.y, 'restartBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => restartBtn.setScale(1.1 * scale))
			.on('pointerout', () => restartBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.stop('PlayScene').start('PlayScene', { level: this.level, showIns: false })
			})

		const quitBtn = this.add
			.image(this.quitBtnPos.x, this.quitBtnPos.y, 'quitBtn')
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
