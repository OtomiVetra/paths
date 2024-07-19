import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './TodoPage.module.css';

export const TodoPage = ({ todos, setTodos }) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [todo, setTodo] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [currentText, setCurrentText] = useState('');

	useEffect(() => {
		const foundTodo = todos.find((t) => t.id === parseInt(id));
		if (foundTodo) {
			setTodo(foundTodo);
			setCurrentText(foundTodo.text);
		}
	}, [id, todos]);

	const handleEditInputChange = (e) => {
		setCurrentText(e.target.value);
	};

	const saveTodo = (e) => {
		e.preventDefault();
		fetch(`http://localhost:3005/todos/${todo.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({ ...todo, text: currentText }),
		})
			.then((response) => response.json())
			.then((updatedTodo) => {
				setTodos((prevTodos) =>
					prevTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)),
				);
				setIsEditing(false);
			})
			.catch((error) => console.error('что-то пошло не так:', error));
	};

	const deleteTodo = () => {
		fetch(`http://localhost:3005/todos/${todo.id}`, {
			method: 'DELETE',
		})
			.then((response) => {
				if (response.ok) {
					setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
					navigate('/');
				} else {
					console.error('Не удалось удалить дело');
				}
			})
			.catch((error) => console.error('что-то пошло не так:', error));
	};

	if (!todo) {
		return <h1>404: Задача не найдена</h1>;
	}

	return (
		<div className={styles.todoPage}>
			<button className={styles.backButton} onClick={() => navigate(-1)}>
				⬅️ Назад
			</button>
			{isEditing ? (
				<form className={styles.editForm} onSubmit={saveTodo}>
					<input type='text' value={currentText} onChange={handleEditInputChange} />
					<button type='submit'>✔️ Сохранить</button>
				</form>
			) : (
				<div>
					<h1 className={styles.todoText}>{todo.text}</h1>
					<button className={styles.button} onClick={() => setIsEditing(true)}>
						✏️ Редактировать
					</button>
					<button className={styles.button} onClick={deleteTodo}>
						❌ Удалить
					</button>
				</div>
			)}
		</div>
	);
};
