import BaseScene from './BaseScene'

class MenuScene extends BaseScene {
	constructor() {
		super('MenuScene')

		this.title = null
		this.titleSpeedY = 60
		this.titleInitialPos = {
			x: this.center.x,
			y: this.config.height / 3
		}
		this.titleBounceRange = { upper: this.titleInitialPos.y - 35, lower: this.titleInitialPos.y }

		this.menu = null
		this.levelMenu = null
	}

	create() {
		this.createBackground()
		this.createTitle()
		this.createAudioBtn()
		this.createMenu()
		this.createLevelMenu()
	}

	update() {
		if (this.title.y <= this.titleBounceRange.upper) {
			this.title.body.velocity.y = this.titleSpeedY
		} else if (this.title.y >= this.titleBounceRange.lower) {
			this.title.body.velocity.y = -this.titleSpeedY
		}
	}

	createBackground() {
		this.add.image(0, 0, 'menuBg').setOrigin(0)
	}

	createAudioBtn() {
		const scale = 0.65
		const preloadScene = this.scene.get('PreloadScene')

		const audioBtn = this.add
			.image(this.config.width - 10, 10, preloadScene.isMusicPlaying() ? 'volumeBtn' : 'mutedVolumeBtn')
			.setOrigin(1, 0)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerup', () => {
				preloadScene.toggleMusic()
				if (preloadScene.isMusicPlaying()) {
					audioBtn.setTexture('volumeBtn')
				} else {
					audioBtn.setTexture('mutedVolumeBtn')
				}
			})
			.on('pointerover', () => audioBtn.setScale(1.1 * scale))
			.on('pointerout', () => audioBtn.setScale(scale))
	}

	createTitle() {
		this.title = this.physics.add.sprite(this.titleInitialPos.x, this.titleInitialPos.y, 'title')
		this.title.body.velocity.y = -this.titleSpeedY
	}

	createMenu() {
		const xDiff = 50
		const firstRowY = this.center.y + 20
		const secondRowY = firstRowY + 100

		this.menu = this.add.group()

		this.menu.add(
			this.createBtn({ x: this.center.x, y: firstRowY }, 'playBtn', () =>
				this.scene.start('PlayScene', { level: 1 })
			)
		)
		this.menu.add(
			this.createBtn({ x: this.center.x - xDiff, y: secondRowY }, 'listBtn', () => {
				this.menu.setVisible(false)
				this.levelMenu.setVisible(true)
			})
		)
		this.menu.add(
			this.createBtn({ x: this.center.x + xDiff, y: secondRowY }, 'infoBtn', () =>
				this.scene.launch('InstructionScene', { level: 0 })
			)
		)
	}

	createBtn(pos, btnName, clickHandler) {
		const btn = this.add
			.image(pos.x, pos.y, btnName)
			.setScale(1.5)
			.setOrigin(0.5, 0)
			.setInteractive({ cursor: 'pointer' })

		btn
			.on('pointerup', clickHandler)
			.on('pointerover', () => btn.setScale(1.6))
			.on('pointerout', () => btn.setScale(1.5))

		return btn
	}

	createLevelMenu() {
		this.levelMenu = this.add.group()

		this.levelMenu.add(
			this.add.image(this.center.x, this.center.y, 'woodBoard').setOrigin(0.5, 0).setDisplaySize(300, 250)
		)

		const backToMenuBtn = this.add
			.image(300, this.center.y + 120, 'backBtn')
			.setOrigin(0.5)
			.setScale(1.5)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerup', () => {
				this.levelMenu.setVisible(false)
				this.menu.setVisible(true)
			})
			.on('pointerover', () => backToMenuBtn.setScale(1.1 * 1.5))
			.on('pointerout', () => backToMenuBtn.setScale(1.5))

		this.levelMenu.add(backToMenuBtn)

		const levels = 3
		const padding = 60
		const titles = ['Con số', 'Chuỗi ký tự', 'Tổng hợp']

		for (let i = 1; i <= levels; i++) {
			this.levelMenu.addMultiple(
				this.createLevelBtn({ x: this.center.x - 80, y: this.center.y + padding * i }, i, titles[i - 1])
			)
		}

		this.levelMenu.setVisible(false)
	}

	createLevelBtn(pos, level, title) {
		const levelBtn = this.add
			.image(pos.x, pos.y, 'blankBtn')
			.setOrigin(0.5)
			.setInteractive({ cursor: 'pointer' })

		const levelText = this.add
			.text(pos.x, pos.y, level, {
				font: '20px Retron-2000',
				fill: '#7f3d10',
				align: 'center'
			})
			.setOrigin(0.5)

		const levelTitle = this.add
			.text(pos.x + 45, pos.y, title, {
				font: '22px Retron-2000',
				fill: '#7f3d10',
				align: 'center'
			})
			.setOrigin(0, 0.5)
			.setInteractive({ cursor: 'pointer' })

		levelBtn
			.on('pointerup', () => this.scene.start('PlayScene', { level }))
			.on('pointerover', highLight)
			.on('pointerout', unHighLight)

		levelTitle
			.on('pointerup', () => this.scene.start('PlayScene', { level }))
			.on('pointerover', highLight)
			.on('pointerout', unHighLight)

		function highLight() {
			levelBtn.setScale(1.1)
			levelText.setFontSize(20 * 1.1)
			levelTitle.setFontSize(22 * 1.1)
		}

		function unHighLight() {
			levelBtn.setScale(1)
			levelText.setFontSize(20)
			levelTitle.setFontSize(22)
		}

		return [levelBtn, levelText, levelTitle]
	}
}

export default MenuScene
