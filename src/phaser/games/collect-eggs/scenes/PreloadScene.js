import Phaser from 'phaser'

class PreloadScene extends Phaser.Scene {
	constructor() {
		super('PreloadScene')

		this.music = null
	}

	preload() {
		this.load.spritesheet('chicken', '/assets/collect-eggs/chickens.png', {
			frameWidth: 85,
			frameHeight: 100
		})
		this.load.image('playBg', '/assets/collect-eggs/playBg.png')
		this.load.image('menuBg', '/assets/collect-eggs/menuBg.png')
		this.load.image('title', '/assets/collect-eggs/title.png')
		this.load.image('playBtn', '/assets/collect-eggs/playButton.png')
		this.load.image('listBtn', '/assets/collect-eggs/listBtn.png')
		this.load.image('volumeBtn', '/assets/collect-eggs/volumeBtn.png')
		this.load.image('mutedVolumeBtn', '/assets/collect-eggs/mutedVolumeBtn.png')
		this.load.image('pauseBtn', '/assets/collect-eggs/pauseBtn.png')
		this.load.image('infoBtn', '/assets/collect-eggs/infoBtn.png')
		this.load.image('emptyPot', '/assets/collect-eggs/emptyPot.png')
		this.load.image('evilPot', '/assets/collect-eggs/evilPot.png')
		this.load.image('goldenPot', '/assets/collect-eggs/goldenPot.png')
		this.load.image('brokenEgg', '/assets/collect-eggs/brokenEgg.png')
		this.load.image('normalEgg', '/assets/collect-eggs/normalEgg.png')
		this.load.image('blankBtn', '/assets/collect-eggs/blankBtn.png')
		this.load.image('backBtn', '/assets/collect-eggs/backBtn.png')
		this.load.image('nextBtn', '/assets/collect-eggs/nextBtn.png')
		this.load.image('restartBtn', '/assets/collect-eggs/restartBtn.png')
		this.load.image('restartBtnBig', '/assets/collect-eggs/restartBtnBig.png')
		this.load.image('greenPlayBtn', '/assets/collect-eggs/greenPlayBtn.png')
		this.load.image('greenPlayBtnBig', '/assets/collect-eggs/greenPlayBtnBig.png')
		this.load.image('quitBtn', '/assets/collect-eggs/quitBtn.png')
		this.load.image('quitBtnBig', '/assets/collect-eggs/quitBtnBig.png')
		this.load.image('winScr', '/assets/collect-eggs/winScr.png')
		this.load.image('loseScr', '/assets/collect-eggs/loseScr.png')
		this.load.image('ins_1-1', '/assets/collect-eggs/ins_1-1.png')
		this.load.image('ins_1-2', '/assets/collect-eggs/ins_1-2.png')
		this.load.image('ins_1-3', '/assets/collect-eggs/ins_1-3.png')
		this.load.image('ins_1-4', '/assets/collect-eggs/ins_1-4.png')
		this.load.image('ins_1-5', '/assets/collect-eggs/ins_1-5.png')
		this.load.image('ins_1-6', '/assets/collect-eggs/ins_1-6.png')
		this.load.image('heart', '/assets/collect-eggs/heart.png')

		this.load.image('woodBoard', '/assets/general/woodBoard.png')

		this.load.audio('chicken-music', '/assets/collect-eggs/chicken-music.mp3')
	}

	create() {
		this.music = this.sound.add('chicken-music', { loop: true })
		this.music.play()

		this.scene.launch('MenuScene')
	}

	isMusicPlaying() {
		return this.music.isPlaying
	}

	toggleMusic() {
		if (this.music.isPlaying) {
			this.music.stop()
		} else {
			this.music.play()
		}
	}
}

export default PreloadScene
