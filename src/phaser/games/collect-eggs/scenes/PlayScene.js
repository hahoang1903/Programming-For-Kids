import Phaser from 'phaser'
import BaseScene from './BaseScene'

class PlayScene extends BaseScene {
	constructor() {
		super('PlayScene')

		this.currentLevel = 1
		this.levels = {
			1: {
				numberOfChickens: 4,
				chickensMoving: false,
				potSpeed: 6.5,
				eggGravity: 50,
				eggSpawnTimeGapRange: [1500, 3500],
				potVariables: ['int', 'float', 'bool'],
				potVarChangeRange: [10000, 12500],
				timeLeft: 30000
			},
			2: {
				numberOfChickens: 5,
				chickensMoving: false,
				potSpeed: 7.25,
				eggGravity: 60,
				eggSpawnTimeGapRange: [1200, 3000],
				potVariables: ['string', 'char'],
				potVarChangeRange: [8000, 9500],
				timeLeft: 45000
			},
			3: {
				numberOfChickens: 2,
				chickensMoving: true,
				chickenSpeed: 450,
				potSpeed: 7.5,
				eggGravity: 62,
				eggSpawnTimeGapRange: [850, 2500],
				potVariables: ['int', 'char', 'float', 'bool', 'string'],
				potVarChangeRange: [6500, 7800],
				timeLeft: 60000
			}
		}

		this.chickens = []
		this.chickenPosY = this.config.height / 6

		this.pot = null
		this.potVariable = null
		this.potVarChangeTimePassed = 0
		this.potVarChangeTimeGap = 0
		this.potResultDisplayTimePassed = 0
		this.potDisplayingResult = false

		this.cursorKeys = null

		this.startDelay = 5
		this.delayTextTimePassed = 0
		this.delayText = null

		this.doneDelay = false

		this.eggs = []
		this.eggSpawnTimePassed = 0
		this.eggSpawnTimeGap = 0

		this.lives = []
		this.overlaps = []

		this.timeLeft = this.levels[this.currentLevel].timeLeft
		this.timeLeftText = null

		this.showIns = true
	}

	init({ level, showIns = true }) {
		this.currentLevel = level
		this.showIns = showIns

		this.overlaps = []
		this.eggs = []
		this.eggSpawnTimePassed = 0
		this.eggSpawnTimeGap = 0
	}

	create() {
		this.createBackground()
		this.createChickens()
		this.createPot()
		this.createCursorKeys()
		this.createTimeText()
		this.createEventsHandler()
		this.createFunctionBtns()
		this.createLives()
		this.createDelayText()

		if (this.showIns) {
			this.showInstruction()
		}
	}

	update(time, delta) {
		if (this.doneDelay) {
			this.physics.resume()

			this.updateTimeText(delta)
			this.updatePot(delta)

			this.updateChickens()
			this.createEgg(delta)
			this.updateEggs(delta)
			this.removeUnusedEggs()

			this.checkGameStatus()
		} else {
			this.updateDelayText(delta)
		}
	}

	createTimeText() {
		this.timeLeft = this.levels[this.currentLevel].timeLeft

		this.timeLeftText = this.add
			.text(this.center.x, 10, this.timeLeft / 1000, {
				font: `30px Retron-2000`,
				fill: '#fff',
				align: 'center'
			})
			.setOrigin(0.5, 0)
	}

	createChickens() {
		this.chickens = []

		this.anims.create({
			key: 'fly',
			frames: this.anims.generateFrameNumbers('chicken', { start: 2, end: 7 }),
			frameRate: 6,
			repeat: -1
		})

		const { numberOfChickens } = this.levels[this.currentLevel]
		const spaceBetweenChickens = this.config.width / numberOfChickens
		const baseX = spaceBetweenChickens / 2
		for (let i = 0; i < numberOfChickens; i++) {
			this.chickens.push(
				this.physics.add.sprite(baseX + spaceBetweenChickens * i, this.chickenPosY, 'chicken').play('fly')
			)
		}
	}

	createBackground() {
		this.add.image(0, 0, 'playBg').setOrigin(0)
	}

	createFunctionBtns() {
		const origin = [1, 0]
		const scale = 0.65
		const y = 10

		const pauseBtn = this.add
			.image(this.config.width - 10, y, 'pauseBtn')
			.setOrigin(...origin)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => pauseBtn.setScale(1.1 * scale))
			.on('pointerout', () => pauseBtn.setScale(scale))
			.on('pointerup', () => {
				this.physics.pause()
				this.scene.pause().launch('PauseScene', { level: this.currentLevel })
			})

		const preloadScene = this.scene.get('PreloadScene')
		const volumeBtn = this.add
			.image(this.config.width - 50, y, preloadScene.isMusicPlaying() ? 'volumeBtn' : 'mutedVolumeBtn')
			.setOrigin(...origin)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => volumeBtn.setScale(1.1 * scale))
			.on('pointerout', () => volumeBtn.setScale(scale))
			.on('pointerup', () => {
				preloadScene.toggleMusic()
				if (preloadScene.isMusicPlaying()) {
					volumeBtn.setTexture('volumeBtn')
				} else {
					volumeBtn.setTexture('mutedVolumeBtn')
				}
			})

		const infoBtn = this.add
			.image(this.config.width - 90, y, 'infoBtn')
			.setOrigin(...origin)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => infoBtn.setScale(1.1 * scale))
			.on('pointerout', () => infoBtn.setScale(scale))
			.on('pointerup', () => {
				this.showInstruction()
			})
	}

	createPot() {
		this.potVarChangeTimePassed = 0
		this.potVarChangeTimeGap = 0
		this.potResultDisplayTimePassed = 0
		this.potDisplayingResult = false

		this.pot = this.physics.add.image(this.center.x, this.config.height - 20, 'emptyPot').setOrigin(0.5, 1)

		this.potVariable = this.add
			.text(this.pot.getBounds().centerX, this.pot.getBounds().centerY + 10, null, {
				font: '22.5px Retron-2000',
				fill: '#000',
				align: 'center'
			})
			.setOrigin(0.5)
	}

	createEgg(delta) {
		this.eggSpawnTimePassed += delta

		if (this.eggSpawnTimePassed >= this.eggSpawnTimeGap) {
			const { eggSpawnTimeGapRange, eggGravity } = this.levels[this.currentLevel]

			this.eggSpawnTimePassed = 0
			this.eggSpawnTimeGap = Phaser.Math.Between(...eggSpawnTimeGapRange)

			const randomX = this.getRandomItem(this.chickens).body.x

			const egg = this.physics.add
				.sprite(randomX, this.chickenPosY + 110, 'normalEgg')
				.setOrigin(0, 1)
				.setScale(0.7)

			egg.body.gravity.y = eggGravity

			const { content, type, size } = this.getEggValue()
			const text = this.add
				.text(egg.getCenter().x, egg.getCenter().y, content, {
					font: `${size}px Retron-2000`,
					fill: '#000',
					align: 'center'
				})
				.setOrigin(0.5)
			const eggText = { text, type }

			const currentLength = this.eggs.length
			const overlap = this.physics.add.overlap(egg, this.pot, () => {
				this.markEggForRemove(currentLength, 0, overlap)

				if (this.potVariable.text == type || (this.potVariable.text == 'string' && type == 'char')) {
					this.pot.setTexture('goldenPot').setScale(0.92)
				} else {
					this.lives.pop()?.destroy()
					this.pot.setTexture('evilPot').setScale(0.92)
				}
				this.potDisplayingResult = true
				this.potResultDisplayTimePassed = 0
				this.overlaps.forEach(ol => (ol.active = false))
			})
			this.overlaps.push(overlap)

			this.eggs.push({ egg, eggText, overlap, timePassed: 0, markedForRemove: false, timeNeedToRemove: null })
		}
	}

	createCursorKeys() {
		this.cursorKeys = this.input.keyboard.createCursorKeys()
	}

	createDelayText() {
		this.doneDelay = false
		this.startDelay = 5
		this.delayTextTimePassed = 0

		this.delayText && this.delayText.destroy()

		this.delayText = this.add
			.text(this.center.x, this.center.y, this.startDelay, {
				font: '100px Retron-2000',
				fill: '#fcf05b',
				align: 'center'
			})
			.setOrigin(0.5, 1)
	}

	createEventsHandler() {
		this.events.on('resume', () => this.createDelayText())
	}

	createLives() {
		this.lives = []

		// this.add.text(220, 10, 'Mạng:', {
		// 	font: `25px Retron-2000`,
		// 	fill: '#fff',
		// 	align: 'center'
		// })
		for (let i = 0; i < 3; i++) {
			this.lives.push(
				this.add
					.image(20 + i * 45, 15, 'heart')
					.setOrigin(0)
					.setScale(0.65)
			)
		}
	}

	updateTimeText(delta) {
		this.timeLeft -= delta

		this.timeLeftText.setText(Math.floor(Math.max(0, this.timeLeft / 1000)))
	}

	updateChickens() {
		const { chickensMoving, chickenSpeed } = this.levels[this.currentLevel]
		if (!chickensMoving) {
			return
		}

		this.chickens.forEach((chicken, i) => {
			if (chicken.body.velocity.x == 0) {
				chicken.setVelocityX(this.getRandomItem([-chickenSpeed, chickenSpeed]))
			}

			if (chicken.getBounds().left <= 0) {
				chicken.setVelocityX(chickenSpeed)
			} else if (chicken.getBounds().right >= this.config.width) {
				chicken.setVelocityX(-chickenSpeed)
			}

			chicken.setFlipX(chicken.body.velocity.x > 0)
		})
	}

	updatePot(delta) {
		this.potVarChangeTimePassed += delta
		if (this.potDisplayingResult) {
			if (this.potResultDisplayTimePassed >= 350) {
				this.pot.setTexture('emptyPot').setScale(1)
				this.potDisplayingResult = false
				this.potResultDisplayTimePassed = 0
				this.overlaps.forEach(ol => (ol.active = true))
			}
			this.potResultDisplayTimePassed += delta
		}

		const { potSpeed, potVarChangeRange, potVariables } = this.levels[this.currentLevel]
		if (this.potVarChangeTimePassed >= this.potVarChangeTimeGap) {
			this.potVariable.setText(this.getRandomItem(potVariables))
			this.potVarChangeTimeGap = Phaser.Math.Between(...potVarChangeRange)
			this.potVarChangeTimePassed = 0
		}

		if (this.cursorKeys.left.isDown && this.pot.getBounds().left > 0) {
			this.pot.x -= potSpeed
			this.potVariable.x -= potSpeed
		} else if (this.cursorKeys.right.isDown && this.pot.getBounds().right < this.config.width) {
			this.pot.x += potSpeed
			this.potVariable.x += potSpeed
		}
	}

	updateEggs(delta) {
		this.eggs.forEach(({ egg, eggText, overlap, markedForRemove }, i, eggs) => {
			eggText.text.setPosition(egg.getCenter().x, egg.getCenter().y)
			if (egg.getBounds().bottom >= this.config.height - 10) {
				if (!markedForRemove) {
					this.markEggForRemove(i, 1000, overlap)
					this.setBrokenEgg(egg)

					const { text } = this.potVariable
					if (eggText.type == text || (eggText.type == 'char' && text == 'string')) {
						this.lives.pop()?.destroy()
					}
				} else {
					eggs[i].timePassed += delta
				}
			}
		})
	}

	updateDelayText(delta) {
		if (this.startDelay >= 0) {
			this.delayTextTimePassed += delta

			if (this.delayTextTimePassed >= 1000) {
				this.startDelay--

				this.setDelayText(this.startDelay == 0 ? 'Bắt đầu' : this.startDelay)
				this.delayTextTimePassed = 0
			} else if (this.delayTextTimePassed >= 800 && this.startDelay == 0) {
				this.startDelay--
				this.delayText.destroy()
				this.doneDelay = true
			}
		}
	}

	checkGameStatus() {
		if (this.lives.length == 0) {
			this.physics.pause()
			this.scene.pause().launch('FinishScene', { win: false, level: this.currentLevel })
			// this.scene.restart({ level: this.currentLevel, showIns: false })
		} else if (this.timeLeft <= 0) {
			this.physics.pause()
			this.scene.pause().launch('FinishScene', { win: true, level: this.currentLevel })
			// this.scene.restart({ level: this.currentLevel + 1 })
		}
	}

	getEggValue() {
		const { potVariables } = this.levels[this.currentLevel]
		const type = this.getRandomItem(potVariables)
		var content
		var size = 20

		switch (type) {
			case 'int':
				content = Math.floor(Math.random() * 500) + 1
				break
			case 'bool':
				content = this.getRandomItem(['true', 'false'])
				size = 18.5
				break
			case 'float':
				content = (Math.random() * 500).toFixed(2)
				size = 16.5
				break
			case 'char':
				content = this.getRandomItem('abcdefghijklmnopqrstuvwxyz')
				size = 22.5
				break
			case 'string':
				const length = Phaser.Math.Between(2, 4)
				content = ''
				for (let i = 0; i < length; i++) {
					content += this.getRandomItem('abcdefghijklmnopqrstuvwxyz')
				}
				if (content == 'true') {
					const randI = Phaser.Math.Between(0, 3)
					content = content.slice(0, randI) + content.slice(randI + 1)
				}
				size = 19
				break
			default:
				return
		}

		return { content, type, size }
	}

	setBrokenEgg(egg) {
		egg.setTexture('brokenEgg')
		egg.body.gravity.y = 0
		egg.body.velocity.y = 0
	}

	markEggForRemove(index, timeNeedToRemove, overlap) {
		overlap.destroy()
		this.eggs[index].timeNeedToRemove = timeNeedToRemove
		this.eggs[index].markedForRemove = true
	}

	removeUnusedEggs() {
		this.eggs.filter(({ egg, eggText, timePassed, timeNeedToRemove }) => {
			if (timeNeedToRemove != null && timePassed >= timeNeedToRemove) {
				egg.destroy()
				eggText.text.destroy()
				return false
			}

			return true
		})
	}

	setDelayText(newText) {
		const gradient = ['#f00505', '#ff2c05', '#fd6104', '#fd9a01', '#ffce03', '#fef001']
		this.delayText.setText(newText)
		this.delayText.setFill(gradient[this.startDelay])
	}

	getRandomItem(arrayLike) {
		return arrayLike[Math.floor(Math.random() * arrayLike.length)]
	}

	showInstruction() {
		this.physics.pause()
		this.scene.pause().launch('InstructionScene', { level: this.currentLevel })
	}
}

export default PlayScene
