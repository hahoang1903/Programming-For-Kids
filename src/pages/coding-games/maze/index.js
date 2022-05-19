import React, { useRef } from 'react'
import MazeLoader from '../../../components/loaders/maze-loader'
import { useLoadGame } from '../../../hook/useLoadGame'
import { config } from '../../../phaser/games/maze'

const MazeGamePage = () => {
	const canvasRef = useRef()
	const loading = useLoadGame(config, canvasRef)

	return (
		<>
			{loading ? <MazeLoader /> : null}
			<div id="game-canvas" ref={canvasRef}></div>
		</>
	)
}

export default MazeGamePage
