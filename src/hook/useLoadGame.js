import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'

export const useLoadGame = (config, canvasRef) => {
	const [game, setGame] = useState(null)
	const [loading, setLoading] = useState(true)
	const mountedRef = useRef(false)

	useEffect(() => {
		mountedRef.current = true
		if (!game) {
			setTimeout(() => {
				if (mountedRef.current) {
					setGame(new Phaser.Game(config))
					setLoading(false)
				}
			}, 1500)
		}

		return () => {
			mountedRef.current = false
			game?.destroy(true)
		}
	}, [config, game])

	useEffect(() => {
		if (!loading && canvasRef.current) {
			canvasRef.current.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
		}
	}, [canvasRef, loading])

	return loading
}
