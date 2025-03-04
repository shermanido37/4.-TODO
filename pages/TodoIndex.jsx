import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo } from "../store/actions/todo.actions.js"
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js"

const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

export function TodoIndex() {

    // const [todos, setTodos] = useState(null)
    const todos = useSelector((storeState) => storeState.todoModule.todos)
    const filterBy = useSelector((storeState) => storeState.todoModule.filterBy)
    const isLoading = useSelector((storeState) => storeState.todoModule.isLoading)

    const dispatch = useDispatch()

    // Special hook for accessing search-params:
    // const [searchParams, setSearchParams] = useSearchParams()
    // const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
    

    useEffect(() => {
        // setSearchParams(filterBy)
        loadTodos(filterBy)
            .catch(err => {
                console.log("err: " + err)
                showErrorMsg("Cannot load todos")
            })
        // try{
        //     loadTodos(filterBy)
        // }
        // catch(err){
        //     console.log("err: " + err)
        //     showErrorMsg("Cannot load todos")
        // }
        // todoService.query(filterBy)
        //     .then(todos => setTodos(todos))
        //     .catch(err => {
        //         console.eror('err:', err)
        //         showErrorMsg('Cannot load todos')
        //     })
    }, [filterBy])

    function onSetFilter(filterBy) {
        dispatch({ type: SET_FILTER_BY, filterBy })
    }

    function onRemoveTodo(todoId) {
        try{
            removeTodo(todoId)
            showSuccessMsg("Todo removed")
        }
        catch(err){
            console.log("err: " + err)
            showErrorMsg("Cannot remove todo")
        }

        // todoService.remove(todoId)
        //     .then(() => {
        //         setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId))
        //         showSuccessMsg(`Todo removed`)
        //     })
        //     .catch(err => {
        //         console.log('err:', err)
        //         showErrorMsg('Cannot remove todo ' + todoId)
        //     })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        try{
            saveTodo(todoToSave)
            showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
        }
        catch(err){
            console.log("err: " + err)
            showErrorMsg("Cannot toggle todo")
        }
        // todoService.save(todoToSave)
        //     .then((savedTodo) => {
        //         setTodos(prevTodos => prevTodos.map(currTodo => (currTodo._id !== todo._id) ? currTodo : { ...savedTodo }))
        //         showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
        //     })
        //     .catch(err => {
        //         console.log('err:', err)
        //         showErrorMsg('Cannot toggle todo ' + todoId)
        //     })
    }

    if (isLoading || !todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilter} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}