import Phaser from 'phaser'
import OpeningScene from './scenes/openingScene'
import PlayScene from './scenes/playScene'

import { GLOBAL_CONFIG } from '../config'

const config = {
	...GLOBAL_CONFIG,
	scene: [OpeningScene, PlayScene]
}

export default new Phaser.Game(config)
