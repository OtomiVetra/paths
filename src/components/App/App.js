import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import styles from './App.module.css';
import { Form } from '../Form/Form';
import { TodoPage } from '../TodoPage/TodoPage';
import { Routes, Route, Link } from 'react-router-dom';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [filterText, setFilterText] = useState('');
	const [isSorted, setIsSorted] = useState(false);

	useEffect(() => {
		fetch('http://localhost:3005/todos')
			.then((response) => response.json())
			.then((data) => setTodos(data))
			.catch((error) => console.error('что-то пошло не так:', error));
	}, []);

	const addTodoToList = (newTodo) => {
		setTodos((prevTodos) => [...prevTodos, newTodo]);
	};

	const filteredTodos = todos.filter((todo) =>
		todo.text.toLowerCase().includes(filterText.toLowerCase()),
	);

	const sortedTodos = isSorted
		? [...filteredTodos].sort((a, b) => a.text.localeCompare(b.text))
		: filteredTodos;

	const toggleSort = () => {
		setIsSorted((prevIsSorted) => !prevIsSorted);
	};

	const debouncedSearch = useCallback(
		debounce((value) => {
			setFilterText(value);
		}, 300),
		[],
	);

	const handleSearchInputChange = (e) => {
		debouncedSearch(e.target.value);
	};

	return (
		<div className={styles.app}>
			<Routes>
				<Route
					path='/'
					element={
						<div className={styles.todoListContainer}>
							<h1 className={styles.header}>Список дел</h1>
							<Form addTodoToList={addTodoToList} />
							<input
								type='text'
								placeholder='Поиск...'
								onChange={handleSearchInputChange}
								className={styles.searchInput}
							/>
							<button className={styles.button} onClick={toggleSort}>
								{isSorted ? '🔼' : '🔽'}
							</button>
							<ul className={styles.todoList}>
								{sortedTodos.map((todo) => (
									<Link to={`/task/${todo.id}`} key={todo.id}>
										<li className={styles.todoListItem}>
											<span className={styles.todoText}>
												{todo.text.length > 30
													? `${todo.text.substring(0, 30)}...`
													: todo.text}
											</span>
										</li>
									</Link>
								))}
							</ul>
						</div>
					}
				/>
				<Route
					path='/task/:id'
					element={<TodoPage todos={todos} setTodos={setTodos} />}
				/>
				<Route path='*' element={<h1>404: Страница не найдена</h1>} />
			</Routes>
		</div>
	);
};
