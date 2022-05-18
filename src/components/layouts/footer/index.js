import React from 'react'
import { Layout, Row, Col } from 'antd'
import { Link } from 'react-router-dom'

const AppFooter = () => {
	return (
		<Layout.Footer className="footer">
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col xs={24} md={12} className="footer-section">
					<Link to="/convert"></Link>
				</Col>
				<Col xs={24} md={7} className="footer-section">
					<div className="footer-link">
						<Link to="/convert/audio"></Link>
					</div>
					<div className="footer-link">
						<Link to="/convert/image"></Link>
					</div>
					<div className="footer-link">
						<Link to="/convert/document"></Link>
					</div>
				</Col>
			</Row>
		</Layout.Footer>
	)
}

export default AppFooter
