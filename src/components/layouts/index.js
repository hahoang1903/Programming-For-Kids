import { Layout } from 'antd'
import React from 'react'
import AppFooter from './footer'
import AppHeader from './header'

const SiteLayout = ({ children }) => {
	return (
		<Layout className="layout">
			<AppHeader />
			<Layout.Content className="layout-content">{children}</Layout.Content>
			<AppFooter />
		</Layout>
	)
}

export default SiteLayout
