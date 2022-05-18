import React, { useRef } from 'react'
import ChickenLoader from '../../../components/loaders/chicken-loader'
import { useLoadGame } from '../../../hook/useLoadGame'
import { config } from '../../../phaser/games/collect-eggs'

const CollectEggsGamePage = () => {
	const canvasRef = useRef()
	const loading = useLoadGame(config, canvasRef)

	return (
		<>
			{loading ? <ChickenLoader /> : null}
			<div id="game-canvas" ref={canvasRef}></div>
		</>
	)
}

export default CollectEggsGamePage
