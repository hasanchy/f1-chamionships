function TableView(props) {

	let trHtml = [];
	if (props.bodyData) {
		props.bodyData.forEach((trItem, i) => {
			let tdValue = (trItem.value) ? trItem.value : trItem;

			trHtml.push(<tr key={i} className={trItem.class || ''}>
				{tdValue.map(function (tdItem, j) {
					let tdClass = (props.headData[j].class) ? props.headData[j].class : '';
					return <td key={j} className={tdClass}>{tdItem}</td>
				})}
			</tr>)
		});
	}

	return (
		<div className='f1-table-wrapper'>
			<table className='f1-table'>
				<thead>
					<tr>
						{props.headData.map(function (item, i) {
							let value = (typeof item === 'object') ? item.value : item;
							let thClass = (props.headData[i].class) ? props.headData[i].class : '';
							return <th key={i} className={thClass}>{value}</th>
						})}
					</tr>
				</thead>
				<tbody>
					{trHtml}
				</tbody>
			</table>
		</div>
	);
}

export default TableView;