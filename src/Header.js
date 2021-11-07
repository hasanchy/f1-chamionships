import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';

function Header() {
	return <header className='f1-header'>
		<a href='/'>
			<div className='f1-left'>
				<div className='f1-logo'>
					<FontAwesomeIcon icon={faFlagCheckered} size='2x' flip='horizontal' />
				</div>
			</div>
		</a>
		<div className='f1-title'>F1 World Chamionships</div>
	</header >
}

export default Header;