function TableView(props) {
	return (
		<div className='f1-table-wrapper' style={{ marginTop: '20px' }}>
			<table className='f1-table' width='100%'>
				<TableHeader value={props.headData} />
				<TableBody value={props.bodyData} />
			</table>
		</div>
	);
}

function TableHeader(props) {
	return <thead>
		<tr>
			{props.value.map(function (item, i) {
				return <th key={i}>{item}</th>
			})}
		</tr>
	</thead>
}

function TableBody(props) {
	let trHtml = [];
	if (props?.value) {
		props.value.forEach((trItem, i) => {
			let tdValue = (trItem.value) ? trItem.value : trItem;
			trHtml.push(<tr key={i} className={trItem.class || ''}>
				{tdValue.map(function (tdItem, j) {
					return <td key={j}>{tdItem}</td>
				})}
			</tr>)
		});
	}

	return <tbody>
		{trHtml}
	</tbody>
}

export default TableView;