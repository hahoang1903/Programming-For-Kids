import BaseScene from './BaseScene'

class InstructionScene extends BaseScene {
	constructor() {
		super('InstructionScene')

		this.currentLevel = 1
		this.levels = {
			0: {
				insPaths: [
					['ins_1-1', 'ins_1-2'],
					['ins_1-3', 'ins_1-4'],
					['ins_1-5', 'ins_1-6']
				],
				insTexts: [
					[
						'Nhiệm vụ của bạn là hứng các quả trứng có kiểu',
						'biến trùng với kiểu trên hũ, sử dụng hai nút mũi',
						'tên ← và →. Nếu hứng trượt những quả trứng này,',
						'bạn sẽ bị mất đi một mạng',
						'Khi bạn hứng đúng quả trứng cần hứng, bạn sẽ',
						'nhận được một quả trứng vàng.'
					],
					[
						'Bạn cần phải tránh các quả trứng có kiểu biến',
						'khác với kiểu trên hũ.',
						'Nếu hứng sai quả trứng, bạn sẽ nhận được một quả',
						'trứng xấu và sẽ bị mất đi một mạng'
					],
					[
						'Bạn khởi đầu màn chơi với 3 mạng, tương ứng với',
						'3 trái tim. Khi thời gian kết thúc, nếu bạn còn',
						'ít nhất 1 trái tim, bạn sẽ chiến thắng.',
						'Ngược lại, bạn sẽ thua khi không còn mạng nào.',
						'',
						'                                   <CHÚ Ý>:',
						'Kiểu biến trên hũ sẽ thay đổi trong quá',
						'trình chơi nên hãy cẩn thận để không bị mất mạng.'
					]
				]
			}
		}

		this.levels = Object.assign(this.levels, {
			1: {
				insPaths: this.levels[0].insPaths.concat([[]]),
				insTexts: this.levels[0].insTexts.concat([
					[
						'int - integer: kiểu số nguyên, các số không',
						'có phần thập phân. Ví dụ: 1, 123, 54, 956, 3749',
						'',
						'float: kiểu số thực, các số có thể có phần thập phân.',
						'Để đơn giản, các quả trứng kiểu float sẽ luôn có',
						'phần thập phân. Ví dụ: 11.31, 234.12, 1.23',
						'',
						'bool - boolean: kiểu đúng/sai. Trứng kiểu bool chỉ',
						'nhận 2 giá trị: true - đúng, false - sai.'
					]
				])
			},
			2: {
				insPaths: [[]],
				insTexts: [
					[
						'char - character: là các ký tự đơn bao gồm chữ cái',
						'và các ký tự đặc biệt. Để đơn giản, char trong',
						'trò chơi này sẽ chỉ bao gồm các chữ cái đơn.',
						'Ví dụ a, b, c',
						'',
						'string: là một chuỗi các ký tự, chuỗi các char.',
						'Ví dụ: dasjf, fdskfj',
						'Lưu ý, một ký tự cũng được coi là string với độ dài',
						'chuỗi bằng 1.'
					]
				]
			},
			3: {
				insPaths: [[]],
				insTexts: [
					[
						'Đây là màn chơi tổng hợp. Tất cả các kiểu biến',
						'đã xuất hiện trong các màn chơi trước đều sẽ',
						'xuất hiện trong màn chơi này.'
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
