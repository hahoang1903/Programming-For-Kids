import React from 'react'
import { Card } from 'antd'
import { Link } from 'react-router-dom'
const { Meta } = Card

const CodingGamesPage = () => {
	return (
		<div className="coding-games-page">
			<span className="coding-games-page__title">Trò chơi lập trình</span>
			<span className="coding-games-page__subtitle">
				Các trò chơi giúp phát triển tư duy và giới thiệu cơ bản về các khái niệm trong lập trình
			</span>

			<Link className="coding-games-page__section" to="/coding-games/collect-eggs">
				<Card
					hoverable
					style={{ width: 800 }}
					cover={<img alt="example" src="/assets/collect-eggs/menuBg.png" />}
				>
					<Meta
						title="Thu thập trứng gà"
						description="Các bạn sẽ được học về các kiểu biến đơn giản của lập trình thông qua việc thu thập những quả trứng gà"
					/>
				</Card>
			</Link>

			<Link className="coding-games-page__section" to="/coding-games/maze">
				<Card hoverable style={{ width: 800 }} cover={<img alt="example" src="/assets/maze/menuBg.png" />}>
					<Meta
						title="Mê cung"
						description="Trong trò chơi này, các bạn sẽ phải trả lời các câu hỏi theo dạng chọn lựa, giúp bản thân hiểu rõ hơn về khái niệm câu lệnh rẽ nhánh trong lập trình"
					/>
				</Card>
			</Link>
		</div>
	)
}

export default CodingGamesPage
