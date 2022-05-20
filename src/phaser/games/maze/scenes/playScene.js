import BaseScene from './BaseScene'
import generate from 'generate-maze'

class PlayScene extends BaseScene {
	constructor() {
		super('PlayScene')

		this.currentLevel = 1
		this.levels = {
			1: {
				size: 10,
				wallSize: { length: 40, width: 8 },
				popUpQuestionRage: [6200, 7000],
				timeLeft: 45000
			},
			2: {
				size: 15,
				wallSize: { length: 30, width: 5 },
				popUpQuestionRage: [7500, 9000],
				timeLeft: 60000
			},
			3: {
				size: 20,
				wallSize: { length: 22, width: 3 },
				popUpQuestionRage: [11500, 14500],
				timeLeft: 120000
			}
		}

		this.cursorKeys = null

		this.startDelay = 5
		this.delayTextTimePassed = 0
		this.delayText = null
		this.doneDelay = false

		this.lives = []

		this.timeLeft = this.levels[this.currentLevel].timeLeft
		this.timeLeftText = null

		this.showIns = true

		this.player = null

		const { length, width } = this.levels[this.currentLevel].wallSize
		this.playerSize = length - width - 4

		this.maze = null

		this.pauseBtn = null
		this.restartBtn = null
		this.quitBtn = null
		this.menuExpandWidth = 100

		this.questions = [
			{
				text: [
					'Một Cửa hàng có chương trình khuyến mãi',
					'mua 1 tặng 1 chai nước hoa đối với khách hàng',
					'mua nhiều hơn hoặc bằng 10 sản phẩm.',
					'Hùng mua 2 chai nước, 1 thùng coca, 1 gói bim bim,',
					'3 cuộn giấy ăn. Hùng sẽ nhận được gì?'
				],
				options: ['A. Thêm 1 chai nước hoa.', 'B. Không nhận được gì cả', 'C. Nhận được thêm tiền'],
				answer: 1
			},
			{
				text: [
					'Có 3 loại đồ vật đặt được phân biệt theo 3 màu ',
					'đỏ là đồ dùng cho công việc',
					'trắng là đồ nhà bếp',
					'đen là đồ dùng để quét dọn',
					'Có một cái chổi trong đó. Vậy nó màu gì ?'
				],
				options: ['A. Đỏ', 'B. Trắng', 'C. Đen'],
				answer: 2
			},
			{
				text: [
					'Động vật đẻ con thì là động vật có vú',
					'nếu không sẽ là động vật không có vú',
					'Gà là động vật gì ?'
				],
				options: ['A. Động vật có vú', 'B. Động vật không có vú', 'C. Không phải 2 loại trên'],
				answer: 1
			},
			{
				text: [
					'Trong rừng có nhiều loại nấm',
					'Nấm có nhiều hơn hoặc bằng 3 màu thì sẽ là nấm độc',
					'Nấm có 2 màu thì là nấm mốc',
					'Nấm có 1 màu thì sẽ là ăn được',
					'Một cây nấm có màu đen và trắng. Đó là loại nấm gì ?'
				],
				options: ['A. Độc', 'B. Mốc', 'C. Ăn được'],
				answer: 1
			},
			{
				text: [
					'Ở một khu vui chơi giải trí thể thao mạo hiểm',
					'không cho phép người khuyết tật được vào để đảm',
					'bảo an toàn. Phi bị cận, Phi sẽ được?'
				],
				options: ['A. Cho vào', 'B. Không cho vào', 'C. Đuổi về'],
				answer: 0
			},
			{
				text: [
					'Động vật ăn động vật khác gọi là động vật ăn thịt',
					'còn nếu ăn thực vật thì sẽ là ăn cỏ',
					'ăn cả hai thì sẽ là động vật ăn tạp',
					'Con người là động vật ăn ?'
				],
				options: ['A. Ăn thịt', 'B. Ăn cỏ', 'C. Ăn tạp'],
				answer: 2
			},
			{
				text: [
					'Ở năm 2008, Iron Man là bộ phim C13',
					'nghĩa là chỉ dành cho những người trên 13 tuổi',
					'Quốc sinh năm 1995',
					'Quốc có được xem bộ phim đó không ?'
				],
				options: [
					'A. Có',
					'B. Không, Quốc phải đợi thêm 1 năm nữa',
					'C. Không, Quốc phải đợi thêm 3 năm nữa'
				],
				answer: 2
			},
			{
				text: [
					'Nhà nước quy định ai nhiều hơn hoặc bằng 80 tuổi',
					'thì sẽ được tham gia vào hội những người cao tuổi',
					'của đất nước. Ông Quý sinh năm 1967, năm nay',
					'là năm 2022. Vậy ông Quý có được phép tham gia',
					'vào hội người cao tuổi không?'
				],
				options: ['A. Không', 'B. Có', 'C. Ông Quý quá già để tham gia hội người cao tuổi'],
				answer: 0
			},
			{
				text: [
					'Sinh ra từ năm 1997 đến 2012 sẽ được gọi là gen Z',
					'Sinh ra từ năm 1981 đến 1996 thì được gọi là gen Y',
					'Sinh ra từ năm 1965 đến 1980 được gọi là gen X',
					'Năm nay là 2022, Phi đã 35 tuổi, Phi sẽ được gọi là?'
				],
				options: ['A. Gen Z', 'B. Gen Y', 'C. Gen X'],
				answer: 1
			}
		]
		this.questionTimePassed = 0
		this.questionTimeGap = 0
		this.answering = false
	}

	init({ level, showIns = true }) {
		this.currentLevel = level
		this.showIns = showIns

		this.questionTimeGap = Phaser.Math.Between(...this.levels[this.currentLevel].popUpQuestionRage)
		this.questionTimePassed = 0
		this.answering = false
	}

	create() {
		this.createBackground()
		this.createCursorKeys()
		this.createMaze()
		this.createPlayer()
		this.createCollider()
		this.createTimeText()
		this.createEventsHandler()
		this.createFunctionBtns()
		this.createMenu()
		this.createDelayText()

		if (this.showIns) {
			this.showInstruction()
		}
	}

	update(time, delta) {
		if (this.doneDelay) {
			if (!this.answering) {
				this.physics.resume()
			}

			this.updateTimeText(delta)
			this.updatePlayer()
			this.checkOpenMenu()
			this.createQuestion(delta)
			this.checkGameStatus()
		} else {
			this.updateDelayText(delta)
		}
	}

	createQuestion(delta) {
		if (this.answering) {
			return
		}

		this.questionTimePassed += delta

		if (this.questionTimePassed >= this.questionTimeGap) {
			const { popUpQuestionRage } = this.levels[this.currentLevel]

			this.questionTimePassed = 0
			this.questionTimeGap = Phaser.Math.Between(...popUpQuestionRage)

			this.answering = true
			this.physics.pause()

			const leftAlignX = 240
			const question = this.getRandomItem(this.questions)

			const questionBoard = this.add.group()

			questionBoard.add(
				this.add
					.image(leftAlignX - 60, 10, 'woodBoard')
					.setOrigin(0)
					.setDisplaySize(630, 400)
			)

			question.text.forEach((line, i) => {
				questionBoard.add(
					this.add.text(leftAlignX, 50 + i * 30, line, {
						font: `20px Retron-2000`,
						fill: '#fff',
						align: 'left'
					})
				)
			})

			question.options.forEach((option, i) => {
				const optionText = this.add
					.text(leftAlignX, 50 + (question.text.length - 1) * 30 + 100 + i * 30, option, {
						font: `20px Retron-2000`,
						fill: '#fff',
						align: 'left'
					})
					.setInteractive({ cursor: 'pointer' })
					.on('pointerup', () => {
						if (i == question.answer) {
							this.timeLeft += 5000
						} else {
							this.timeLeft -= 10000
						}

						questionBoard.setVisible(false)
						this.answering = false
					})
					.on('pointerover', () => optionText.setColor('#f7ec6e'))
					.on('pointerout', () => optionText.setColor('#fff'))
				questionBoard.add(optionText)
			})
		}
	}

	createMaze() {
		const { size, wallSize } = this.levels[this.currentLevel]

		const cells = generate(size, size, true, Phaser.Math.Between(0, 1000000000))
		cells[size - 1][Math.floor(size / 2)].bottom = false

		const totalWidth = wallSize.length * size + wallSize.width
		const marginLeft = (this.config.width - totalWidth) / 2
		const marginTop = (this.config.height - totalWidth) / 2

		this.maze = this.add.group()
		cells.forEach(row => {
			row.forEach(cell => {
				if (cell.top) {
					const line = this.add
						.rectangle(
							marginLeft + cell.x * wallSize.length,
							marginTop + cell.y * wallSize.length,
							wallSize.length + wallSize.width,
							wallSize.width,
							0xffffff
						)
						.setOrigin(0)
					this.maze.add(line)
					this.physics.add.existing(line)
					line.body.setImmovable(true)
				}

				if (cell.bottom) {
					const line = this.add
						.rectangle(
							marginLeft + cell.x * wallSize.length,
							marginTop + (cell.y + 1) * wallSize.length,
							wallSize.length + wallSize.width,
							wallSize.width,
							0xffffff
						)
						.setOrigin(0)
					this.maze.add(line)
					this.physics.add.existing(line)
					line.body.setImmovable(true)
				}

				if (cell.left) {
					const line = this.add
						.rectangle(
							marginLeft + cell.x * wallSize.length,
							marginTop + cell.y * wallSize.length,
							wallSize.width,
							wallSize.length + wallSize.width,
							0xffffff
						)
						.setOrigin(0)
					this.maze.add(line)
					this.physics.add.existing(line)
					line.body.setImmovable(true)
				}

				if (cell.right) {
					const line = this.add
						.rectangle(
							marginLeft + (cell.x + 1) * wallSize.length,
							marginTop + cell.y * wallSize.length,
							wallSize.width,
							wallSize.length + wallSize.width,
							0xffffff
						)
						.setOrigin(0)
					this.maze.add(line)
					this.physics.add.existing(line)
					line.body.setImmovable(true)
				}
			})
		})
	}

	createPlayer() {
		const { size, wallSize } = this.levels[this.currentLevel]
		this.playerSize = wallSize.length - wallSize.width - 4

		const totalWidth = wallSize.length * size + wallSize.width
		const marginLeft = (this.config.width - totalWidth) / 2
		const marginTop = (this.config.height - totalWidth) / 2

		const playerOri = 40

		this.anims.create({
			key: 'eat',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
			frameRate: 6,
			repeat: -1
		})

		this.player = this.physics.add
			.sprite(
				marginLeft + wallSize.length * Math.floor(size / 2) + wallSize.width + this.playerSize / 2,
				marginTop + wallSize.width + this.playerSize / 2,
				'player'
			)
			.setOrigin(0.5)
			.setScale(this.playerSize / playerOri)
			.play('eat')
	}

	createCollider() {
		this.physics.add.collider(this.maze, this.player)
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

	createBackground() {
		this.add.image(0, 0, `mazeBg${this.currentLevel}`).setOrigin(0)
	}

	createFunctionBtns() {
		const origin = [1, 0]
		const scale = 0.65
		const y = 10

		const preloadScene = this.scene.get('PreloadScene')
		const volumeBtn = this.add
			.image(this.config.width - 10, y, preloadScene.isMusicPlaying() ? 'volumeBtn' : 'mutedVolumeBtn')
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
			.image(this.config.width - 50, y, 'infoBtn')
			.setOrigin(...origin)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => infoBtn.setScale(1.1 * scale))
			.on('pointerout', () => infoBtn.setScale(scale))
			.on('pointerup', () => {
				this.showInstruction()
			})
	}

	createMenu() {
		const scale = 1.2

		this.pauseBtn = this.physics.add
			.image(this.config.width, 180, 'pauseBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => this.pauseBtn.setScale(1.1 * scale))
			.on('pointerout', () => this.pauseBtn.setScale(scale))
			.on('pointerup', () => {
				this.physics.pause()
				this.scene.pause().launch('PauseScene', {
					level: this.currentLevel,
					resumeBtnPos: { x: this.pauseBtn.getBounds().centerX, y: this.pauseBtn.getBounds().centerY },
					restartBtnPos: { x: this.restartBtn.getBounds().centerX, y: this.restartBtn.getBounds().centerY },
					quitBtnPos: { x: this.quitBtn.getBounds().centerX, y: this.quitBtn.getBounds().centerY }
				})
			})

		this.restartBtn = this.physics.add
			.image(this.config.width, 280, 'restartBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => this.restartBtn.setScale(1.1 * scale))
			.on('pointerout', () => this.restartBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.restart({ level: this.currentLevel, showIns: false })
			})

		this.quitBtn = this.physics.add
			.image(this.config.width, 380, 'quitBtn')
			.setOrigin(0.5)
			.setScale(scale)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => this.quitBtn.setScale(1.1 * scale))
			.on('pointerout', () => this.quitBtn.setScale(scale))
			.on('pointerup', () => {
				this.scene.start('MenuScene')
			})
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

	updatePlayer() {
		const playerSpeed = 100
		this.player.setVelocity(0)

		if (this.cursorKeys.left.isDown) {
			this.player.setVelocityX(-playerSpeed)
			this.player.setFlipX(true)
			this.player.rotation = 0
		} else if (this.cursorKeys.right.isDown) {
			this.player.setVelocityX(playerSpeed)
			this.player.setFlipX(false)
			this.player.rotation = 0
		}

		if (this.cursorKeys.up.isDown) {
			this.player.setVelocityY(-playerSpeed)
			this.player.rotation = -Math.PI / 2
			this.player.setFlipX(false)
		} else if (this.cursorKeys.down.isDown) {
			this.player.rotation = Math.PI / 2
			this.player.setVelocityY(playerSpeed)
			this.player.setFlipX(false)
		}
	}

	updateTimeText(delta) {
		this.timeLeft -= delta

		this.timeLeftText.setText(Math.floor(Math.max(0, this.timeLeft / 1000)))
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

	checkOpenMenu() {
		const acce = 200
		const speed = 250
		const { x, y } = this.input.mousePointer
		const isInMenu =
			x > this.config.width - this.menuExpandWidth - 50 &&
			x < this.config.width &&
			y > 100 &&
			y < this.config.height

		if (isInMenu) {
			this.pauseBtn.setVelocityX(-speed).setAccelerationX(acce)
			this.restartBtn.setVelocityX(-speed).setAccelerationX(acce)
			this.quitBtn.setVelocityX(-speed).setAccelerationX(acce)
		} else {
			this.pauseBtn.setVelocityX(speed).setAccelerationX(-acce)
			this.restartBtn.setVelocityX(speed).setAccelerationX(-acce)
			this.quitBtn.setVelocityX(speed).setAccelerationX(-acce)
		}

		if (
			(this.pauseBtn.getBounds().centerX <= this.config.width - this.menuExpandWidth && isInMenu) ||
			(this.pauseBtn.getBounds().centerX >= this.config.width && !isInMenu)
		) {
			this.pauseBtn.setVelocityX(0).setAccelerationX(0)
			this.restartBtn.setVelocityX(0).setAccelerationX(0)
			this.quitBtn.setVelocityX(0).setAccelerationX(0)
		}
	}

	checkGameStatus() {
		const { size, wallSize } = this.levels[this.currentLevel]

		const totalWidth = wallSize.length * size + wallSize.width
		const marginTop = (this.config.height - totalWidth) / 2

		if (this.player.getBounds().bottom > this.config.height - marginTop + 20) {
			this.physics.pause()
			this.scene.pause().launch('FinishScene', { win: true, level: this.currentLevel })
		} else if (this.timeLeft <= 0) {
			this.physics.pause()
			this.scene.pause().launch('FinishScene', { win: false, level: this.currentLevel })
		}
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
