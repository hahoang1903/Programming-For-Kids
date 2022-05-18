import MenuScene from './scenes/MenuScene'
import PlayScene from './scenes/PlayScene'
import PreloadScene from './scenes/PreloadScene'
import { GLOBAL_CONFIG } from '../../config'
import InstructionScene from './scenes/InstructionScene'
import PauseScene from './scenes/PauseScene'
import FinishScene from './scenes/FinishScene'

export const config = {
	...GLOBAL_CONFIG,
	scene: [PreloadScene, MenuScene, PlayScene, InstructionScene, PauseScene, FinishScene]
}
