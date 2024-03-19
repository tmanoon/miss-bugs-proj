const { useState, useEffect } = React

export function BugFilter( { onSetFilter, filterBy }) {
	const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

	useEffect(() => {
		onSetFilter(filterByToEdit)
	}, [filterByToEdit])

	function onFilter(ev) {
		ev.preventDefault()
		onSetFilter(filterByToEdit)
        console.log(filterByToEdit)
	}

	function handleChange({ target }) {
		let { value, name: field, type } = target
		if (type === 'number') value = +value
        if (type === 'checkbox') value = target.checked ? -1 : 1
		setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
	}
	

	return <section className="bug-filter">
		<h2>Filter our bugs</h2>

		<form onSubmit={onFilter}>
			<label htmlFor="txt">Text: </label>
			<input type="text"
				id="txt"
				name="txt"
				value={filterByToEdit.txt}
				onChange={handleChange}
				placeholder="By text" />

			<label htmlFor="minSeverity">Min Severity</label>
			<input type="number"
				id="minSeverity"
				name="minSeverity"
				value={filterByToEdit.minSeverity || ''}
				onChange={handleChange}
				placeholder="By min severity" />

            <label htmlFor="sort-by">Sort by: </label>
            <select id="sort-by" name="sortBy" onChange={handleChange}>
                <option value="">Choose a sort method</option>
                <option value="title">By title</option>
                <option value="severity">By severity</option>
                <option value="createdAt">By date</option>
            </select>

            <label htmlFor="descending">Descending: </label>
            <input type="checkbox" id="descending" name="sortDir" onChange={handleChange}/>

			<button>Filter</button>
		</form>
	</section>
}
