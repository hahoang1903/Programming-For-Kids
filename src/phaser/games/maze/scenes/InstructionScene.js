import BaseScene from './BaseScene'

class InstructionScene extends BaseScene {
	constructor() {
		super('InstructionScene')

		this.currentLevel = 1
		this.levels = {
			0: {
				insPaths: [[]],
				insTexts: [
					[
						'Nhiệm vụ bạn: tìm lối thoát ra khỏi mê cung',
						'',
						'Trong lúc đi tìm lối thoát, bạn sẽ gặp những câu hỏi',
						'ngẫu nhiên. Nếu bạn trả lời đúng thì sẽ được',
						'tăng thời gian chơi. Nếu trả lời sai, bạn sẽ giảm bớt',
						'thời gian chơi. Nếu bạn không trả lời thì sẽ không',
						'được phép chơi tiếp.',
						'',
						'Lưu ý thời gian giải mê cung luôn đếm ngược',
						'và không dừng lại cho dù người chơi đang gặp câu hỏi'
					]
				]
			}
		}

		this.levels = Object.assign(this.levels, {
			1: {
				insPaths: this.levels[0].insPaths.concat([[]]),
				insTexts: this.levels[0].insTexts.concat([
					['Màn chơi đầu tiên là mê cung 10x10.', 'Bạn sẽ có 45 giây để thoát khỏi mê cung này']
				])
			},
			2: {
				insPaths: [[]],
				insTexts: [['Màn chơi thứ hai là mê cung 15x15.', 'Thời gian cho bạn thoát khỏi mê cung là 1 phút']]
			},
			3: {
				insPaths: [[]],
				insTexts: [
					[
						'Màn chơi cuối cùng là mê cung 20x20.',
						'Đây là màn chơi khó khăn nhất.',
						'Bạn sẽ có 2 phút để chinh phục màn chơi này'
					]
				]
			}
		})

		this.insGroups = []
		this.pages = []
		this.currentActive = -1

		this.strokeWidth = 2
		this.insImgScale = 0.5
		this.insImgWidth = 534 * this.insImgScale
		this.leftAlignX = 240
		this.bottomNavY = this.config.height - 50

		this.nextBtn = null
		this.backBtn = null
	}

	init({ level }) {
		this.currentLevel = level
	}

	create() {
		this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.2)')
		this.createInstructions()
		this.createPageStatus()
		this.createNavBtns()
		this.setActivePage(0)
	}

	createInstructions() {
		const boardPadding = 60
		this.add
			.image(this.leftAlignX - boardPadding, 10, 'woodBoard')
			.setOrigin(0)
			.setDisplaySize((this.insImgWidth + boardPadding) * 2 + 5, 560)

		const { insPaths, insTexts } = this.levels[this.currentLevel]
		this.insGroups = []

		insPaths.forEach((paths, i) => {
			const group = this.add.group()
			let maxY = 30

			paths.forEach((path, j) => {
				const insImg = this.add
					.image(this.leftAlignX + j * (this.insImgWidth + 5), 50, path)
					.setOrigin(0)
					.setScale(this.insImgScale)
				maxY = Math.max(maxY, insImg.getBounds().bottom)
				group.add(insImg)
			})

			insTexts[i].forEach((text, j) => {
				group.add(
					this.add.text(this.leftAlignX, maxY + 20 + j * 30, text, {
						font: `20px Retron-2000`,
						fill: '#fff',
						align: 'left'
					})
				)
			})

			group.setVisible(false)

			this.insGroups.push(group)
		})
	}

	createPageStatus() {
		this.pages = []

		const length = this.levels[this.currentLevel].insPaths.length
		const r = 5
		const d = r * 2
		const padding = 8
		const startX = this.center.x - (padding * (length - 1) + length * d) / 2

		for (let i = 0; i < length; i++) {
			this.pages.push(
				this.add
					.circle(startX + (d + padding) * i, this.bottomNavY, r, 0x846f37)
					.setStrokeStyle(this.strokeWidth, 0x846f37)
					.setOrigin(0, 0.5)
			)
		}
	}

	createNavBtns() {
		const scale = 0.9

		this.backBtn = this.add
			.image(this.leftAlignX, this.bottomNavY, 'backBtn')
			.setOrigin(0, 0.5)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => {
				this.backBtn.setScale(1.1 * scale)
			})
			.on('pointerout', () => {
				this.backBtn.setScale(scale)
			})
			.on('pointerup', () => {
				this.setActivePage(this.currentActive - 1)
			})

		this.nextBtn = this.add
			.image(this.leftAlignX + this.insImgWidth * 2 + 5, this.bottomNavY, 'nextBtn')
			.setOrigin(1, 0.5)
			.setInteractive({ cursor: 'pointer' })
			.on('pointerover', () => {
				this.nextBtn.setScale(1.1 * scale)
			})
			.on('pointerout', () => {
				this.nextBtn.setScale(scale)
			})
			.on('pointerup', () => {
				const { insPaths } = this.levels[this.currentLevel]

				if (this.currentActive >= insPaths.length - 1) {
					this.scene.stop()
					if (this.currentLevel > 0) {
						this.scene.resume('PlayScene')
					}
				} else {
					this.setActivePage(this.currentActive + 1)
				}
			})
	}

	setActivePage(active) {
		this.currentActive = active

		if (active == 0) {
			this.backBtn.setVisible(false)
			this.nextBtn.setVisible(true)
		} else {
			this.nextBtn.setVisible(true)
			this.backBtn.setVisible(true)
		}

		this.pages.forEach((p, i) => {
			if (i == active) {
				p.setStrokeStyle(this.strokeWidth, 0x27200e).setFillStyle(0x3c3115)
			} else {
				p.setStrokeStyle(this.strokeWidth, 0x846f37).setFillStyle(0x846f37)
			}
		})

		this.insGroups.forEach((group, i) => {
			if (i == active) {
				group.setVisible(true)
			} else {
				group.setVisible(false)
			}
		})
	}
}

export default InstructionScene
