import React from 'react'
import { Button, Layout, Menu, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import { DownOutlined } from '@ant-design/icons'

const AppHeader = () => {
	const codingGamesMenuItems = [
		{
			label: (
				<Link to="/coding-games/collect-eggs">
					<Button type="link">
						<span>Thu thập trứng</span>
					</Button>
				</Link>
			)
		},
		{
			label: (
				<Link to="/coding-games/maze">
					<Button type="link">
						<span>Mê cung</span>
					</Button>
				</Link>
			)
		},
		{
			label: (
				<Link to="/convert/document">
					<Button type="link">
						<span>TODO</span>
					</Button>
				</Link>
			)
		}
	]

	return (
		<Layout.Header className="header">
			<div className="header-logo-container">
				<Link to="/"></Link>
			</div>
			<div className="header-links">
				<Dropdown overlay={<Menu items={codingGamesMenuItems} className="header-links-menu" />}>
					<Link to="/coding-games">
						<Button type="link">
							Trò chơi lập trình <DownOutlined />
						</Button>
					</Link>
				</Dropdown>

				<Link to="/playground">
					<Button type="link">Playground</Button>
				</Link>
			</div>
		</Layout.Header>
	)
}

export default AppHeader
