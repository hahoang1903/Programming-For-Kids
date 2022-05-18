import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CodingGamesPage from './pages/coding-games'
import CollectEggsGamePage from './pages/coding-games/collect-eggs'
import PlaygroundPage from './pages/playground'
import ErrorPage from './pages/error'
import HomePage from './pages/home'
import SiteLayout from './components/layouts'
import MazeGamePage from './pages/coding-games/maze'

const App = () => {
	return (
		<BrowserRouter>
			<SiteLayout>
				<Routes>
					<Route path="*" element={<ErrorPage />} />
					<Route path="/" element={<HomePage />} />
					<Route path="/coding-games" element={<CodingGamesPage />} />
					<Route path="/coding-games/collect-eggs" element={<CollectEggsGamePage />} />
					<Route path="/coding-games/maze" element={<MazeGamePage />} />
					<Route path="/playground" element={<PlaygroundPage />} />
				</Routes>
			</SiteLayout>
		</BrowserRouter>
	)
}

export default App
