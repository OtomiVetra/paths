import { useState } from 'react';
import styles from './Form.module.css';

export const Form = ({ addTodoToList }) => {
	const [value, setValue] = useState('');

	const addTodo = (e) => {
		e.preventDefault();
		const newTodoItem = { text: value };
		fetch('http://localhost:3005/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(newTodoItem),
		})
			.then((response) => response.json())
			.then((response) => {
				addTodoToList(response);
				setValue('');
			});
	};

	return (
		<form className={styles.form}>
			<input
				type='text'
				placeholder='введите текст'
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			<button className={styles.button} onClick={addTodo} type='submit'>
				Добавить
			</button>
		</form>
	);
};
