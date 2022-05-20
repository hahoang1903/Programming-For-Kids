import Phaser from 'phaser'

class PreloadScene extends Phaser.Scene {
	constructor() {
		super('PreloadScene')

		// this.music = null
	}

	preload() {
		this.load.spritesheet('player', '/assets/maze/playerSprite.png', {
			frameWidth: 40,
			frameHeight: 40
		})
		this.load.image('mazeBg1', '/assets/maze/mazeBg1.png')
		this.load.image('mazeBg2', '/assets/maze/mazeBg2.png')
		this.load.image('mazeBg3', '/assets/maze/mazeBg3.png')
		this.load.image('menuBg', '/assets/maze/menuBg.png')
		this.load.image('playBtn', '/assets/maze/playBtn.png')
		this.load.image('listBtn', '/assets/maze/listBtn.png')
		this.load.image('volumeBtn', '/assets/maze/volumeBtn.png')
		this.load.image('mutedVolumeBtn', '/assets/maze/mutedVolumeBtn.png')
		this.load.image('pauseBtn', '/assets/maze/pauseBtn.png')
		this.load.image('infoBtn', '/assets/maze/infoBtn.png')
		this.load.image('blankBtn', '/assets/maze/blankBtn.png')
		this.load.image('backBtn', '/assets/maze/backBtn.png')
		this.load.image('nextBtn', '/assets/maze/nextBtn.png')
		this.load.image('restartBtn', '/assets/maze/restartBtn.png')
		this.load.image('quitBtn', '/assets/maze/quitBtn.png')
		this.load.image('winScr', '/assets/maze/winScr.png')
		this.load.image('loseScr', '/assets/maze/loseScr.png')

		this.load.image('woodBoard', '/assets/general/woodBoard.png')

		this.load.audio('maze-music', '/assets/maze/maze-music.mp3')
	}

	create() {
		this.music = this.sound.add('maze-music', { loop: true })
		this.music.play()
		this.scene.start('MenuScene')
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
