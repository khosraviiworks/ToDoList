const taskInput = document.querySelector('#task-input');
const dataInput = document.querySelector('#data-input');
const addTaskBtn = document.querySelector('#add-btn');
const alertMessage = document.querySelector('#alert-message');
const todosBody = document.querySelector('tbody');
const deleteAllTasks = document.querySelector('#delete-all');
const editTaskBtn = document.querySelector('#edit-btn')
const filterBtns = document.querySelectorAll('.filter-todos')
let todos = JSON.parse(localStorage.getItem('todos')) || [];
const changeEditToAdd = ()=> {
    editTaskBtn.style.display = 'none'
    addTaskBtn.style.display = 'inline-block'
    taskInput.value = ''
    dataInput.value = ''
}
const saveToLocalStorage = ()=> {
    localStorage.setItem('todos' , JSON.stringify(todos))
}
const genetareId = ()=> {
    return Math.round(Math.random() * Math.random() * Math.pow(10 , 15)).toString();    
}
const showAlert = (message,type)=> {
    alertMessage.innerHTML = '';
    const alert = document.createElement('p');
    alert.innerText = message;
    alert.classList.add('alert')
    alert.classList.add(`alert-${type}`);
    alertMessage.append(alert)
    setTimeout(()=> {
        alert.style.display = 'none'
    },2000)
}
let addHandler = ()=> {
    let task = taskInput.value;
    let date = dataInput.value;
    const todo = {
        id:genetareId(),
        task,
        date,
        completed : false ,
    }
    if (task) {
        todos.push(todo);
        saveToLocalStorage()
        displayTodos();
        taskInput.value = '';
        dataInput.value = '';
        showAlert('todo added successfuly' , 'success')
    }else {
        showAlert('please enter a todo!' , 'error')
    }
}
const displayTodos = (data)=> {
    const todoList = data||todos;
    todosBody.innerHTML = '';
    if (!todoList.length) {
        todosBody.innerHTML = '<tr><td colspan="4"> no task found !</td></tr>'
        return;  
    }
    todoList.forEach(todo => {
        todosBody.innerHTML+= `
        <tr>
        <td>${todo.task}</td>
        <td>${todo.date || 'no date'}</td>
        <td>${todo.completed ? 'completed' : 'pending'}</td>
        <td>
        <button onclick="editHandler('${todo.id}')">Edit</button>
        <button onclick="toggleHandler('${todo.id}')">${todo.completed ? 'Undo' : 'Do'}</button>
        <button id="delete-one" onclick="deleteHandler('${todo.id}')">Delete</button>
        </td>
        </tr>
        `;
    });
}
const toggleHandler = (id)=> {
const todo = todos.find((todo)=> todo.id === id);
todo.completed = !todo.completed;
    saveToLocalStorage();
    displayTodos();
    showAlert('todo status changed successfully' , 'success')
}
const editHandler = (id)=> {
        const todo = todos.find(todo => todo.id === id);
        taskInput.value = todo.task;
        dataInput.value = todo.date;
        addTaskBtn.style.display = 'none';
        editTaskBtn.style.display ='inline-block';
        editTaskBtn.dataset.id = id;
}
const deleteAllTask = ()=> {
    if (delConfirm() ==true) {
        if (todos.length) {
            todos = [];
            saveToLocalStorage();
            displayTodos();
            showAlert('all todos cleared successfuly' , 'success')
        }else {
            showAlert('no todos to clear' , 'error')
        }
    } else {

    }

};
const delConfirm = ()=> {
    return confirm('you are deleting a task. are you sure?');
}

const deleteHandler = (id)=> {
    if(delConfirm() == true) {
        changeEditToAdd()
        const newTodos = todos.filter((todo)=> todo.id !== id);
        todos = newTodos;
        saveToLocalStorage();
        displayTodos();
        showAlert('todo deleted successfuly', 'success');
    }
    else {
        
    }
}
const applyEditHandler = (event)=> {
    const id = event.target.dataset.id;
    const todo = todos.find(todo =>todo.id === id);
    todo.task = taskInput.value;
    todo.date = dataInput.value;
    taskInput.value = ''
    dataInput.value = ''

    addTaskBtn.style.display = 'inline-block';
    editTaskBtn.style.display = 'none';
    saveToLocalStorage();
    displayTodos()
    showAlert('todo edited successfully','success')
}
const filterHandler = (event)=> {
    let filterTodos = null;
    const filter = event.target.dataset.filter;
    switch (filter) {
        case 'pending':
            filterTodos = todos.filter(todo => todo.completed === false)
            break;
            case 'completed':
                filterTodos = todos.filter(todo => todo.completed === true)
                break;
        default:
            filterTodos = todos;
            break;
    }
displayTodos(filterTodos)
}
editTaskBtn.addEventListener('click' , applyEditHandler)
deleteAllTasks.addEventListener('click', deleteAllTask)
window.addEventListener('load' , ()=> displayTodos())
addTaskBtn.addEventListener('click', addHandler);
filterBtns.forEach(btn => {
    btn.addEventListener('click', filterHandler)
})