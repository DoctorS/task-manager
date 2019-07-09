import React, {Component} from 'react';


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: [],
            title: '',
            description: '',
            ok: '',
            error: '',
            editId: null,
            isEdit: false
        }
    }

    getDB() {
        try {
            if (localStorage && localStorage.tasks) this.setState({tasks: JSON.parse(localStorage.tasks)})
        } catch (e) {
            console.log(e)
        }
    }

    setDB() {
        try {
            if (localStorage) localStorage.tasks = JSON.stringify(this.state.tasks)
            this.setState({
                title: '',
                description: '',
                isEdit: false,
                editId: null
            })
        } catch (e) {
            console.log(e)
        }
    }

    componentDidMount() {
        this.getDB()
    }

    addTask() {
        this.setState({ok: '', error: ''}, () => {
            let title = this.state.title.trim()
            let description = this.state.description.trim()
            if (!title || !description) return this.setState({error: 'Fill in all fields'})
            let tasks = this.state.tasks
            if (!this.state.isEdit) {
                tasks.push({title, description, status: false})
            } else {
                for (let i = 0, n = tasks.length; i < n; i++) {
                    if (i === this.state.editId) {
                        tasks[i].title = title
                        tasks[i].description = description
                        break
                    }
                }
            }
            tasks = tasks.sort((a, b) => a.title < b.title ? 1 : -1)
            this.setState({
                tasks,
                ok: 'Task ' + (this.state.isEdit ? 'updated' : 'added'),
            }, () => this.setDB())
        })
    }

    setField(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    completeTask(e, id) {
        e.preventDefault()
        this.setState({ok: '', error: ''}, () => {
            let tasks = this.state.tasks
            for (let i = 0, n = tasks.length; i < n; i++) {
                if (i === id) {
                    tasks[i].status = !tasks[i].status
                    break
                }
            }
            this.setState({tasks}, () => this.setDB())
        })
    }

    deleteTask(e, id) {
        e.preventDefault()
        this.setState({ok: '', error: ''}, () => {
            let tasks = this.state.tasks
            tasks = tasks.filter((e, i) => i !== id)
            this.setState({tasks}, () => this.setDB())
        })
    }

    editTask(e, id) {
        e.preventDefault()
        this.setState({ok: '', error: ''}, () => {
            let currentTask = this.state.tasks.find((e, i) => i === id)
            if (currentTask) {
                this.setState({
                    title: currentTask.title,
                    description: currentTask.description,
                    editId: id,
                    isEdit: true
                })
            }
        })
    }

    render() {
        console.log(this.state)
        return (
            <div className="App">
                <h1>Task Manager</h1>
                <div className="block">
                    <h2>{(this.state.isEdit ? 'Edit' : 'Create')} Task</h2>
                    <form action="/" method="post">
                        <p>
                            <label>Title</label>
                            <input type="text" name="title" value={this.state.title}
                                   onChange={(e) => this.setField(e, 'title')}/>
                        </p>
                        <p>
                            <label>Description</label>
                            <textarea name="description" value={this.state.description}
                                      onChange={(e) => this.setField(e, 'description')}/>
                        </p>
                        <p>
                            <button type="button"
                                    onClick={() => this.addTask()}>{(this.state.isEdit ? 'Save' : 'Add')}</button>
                        </p>
                    </form>
                    <p className="ok">
                        {this.state.ok}
                    </p>
                    <p className="error">
                        {this.state.error}
                    </p>
                </div>
                <div className="block">
                    <h2>Task List</h2>
                    <div className="items">
                        {this.state.tasks.map((e, i) => (<div key={i} className="item">
                            <div className="title">Title: {e.title}</div>
                            <div className="description">Description: {e.description}</div>
                            <div className="status">
                                <span>{e.status ? 'Completed' : 'In work'}</span>
                                <a href='#' type="button" onClick={(ev) => this.completeTask(ev, i)}>
                                    {e.status ? 'Return to work' : 'Complete'}
                                </a>
                                <a href='#' type="button" onClick={(ev) => this.editTask(ev, i)}>
                                    Edit
                                </a>
                            </div>
                            <div className="del">
                                <a href='#' type="button" className="error"
                                   onClick={(ev) => this.deleteTask(ev, i)}>Delete</a>
                            </div>
                        </div>))}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
