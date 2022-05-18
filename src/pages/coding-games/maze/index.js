import React, { useRef } from 'react'
import ChickenLoader from '../../../components/loaders/chicken-loader'
import { useLoadGame } from '../../../hook/useLoadGame'
import { config } from '../../../phaser/games/maze'

const MazeGamePage = () => {
	const canvasRef = useRef()
	const loading = useLoadGame(config, canvasRef)

	return (
		<>
			{loading ? <ChickenLoader /> : null}
			<div id="game-canvas" ref={canvasRef}></div>
		</>
	)
}

export default MazeGamePage
