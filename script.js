/****************************** */
/* MODAL
/****************************** */

let listModal = document.querySelector(".list-modal");
let createListBtn = document.querySelector(".list-btn");
let closeListModalBtn = document.querySelector(".list-modal-btn");
let submitListBtn = document.querySelector(".submit-list-btn");

let itemModal = document.querySelector(".item-modal");
let createItemBtn = document.querySelector(".item-btn");
let closeItemModalBtn = document.querySelector(".item-modal-btn");
let submitItemBtn = document.querySelector(".todo-btn");


createListBtn.addEventListener("click", (e) => {
    //alert("hi")
    listModal.style = "display: block";
    listModal.animate({ top: ["-10px", "100px"] }, { duration: 300, fill: "forwards"});
});

submitListBtn.addEventListener("click", (e) => {
    listModal.style = "display: none";
});

closeListModalBtn.addEventListener("click", (e) => {
    listModal.style = "display: none";
});

createItemBtn.addEventListener("click", (e) => {
    itemModal.style = "display: block";
    itemModal.animate({ top: ["-10px", "100px"] }, { duration: 300, fill: "forwards"});
});

submitItemBtn.addEventListener("click", (e) => {
    itemModal.style = "display: none";
});

closeItemModalBtn.addEventListener("click", (e) => {
    itemModal.style = "display: none";
});

/****************************** */
/* HAMBURGER
/****************************** */

let icon = false;

let hamburgerBtn = document.querySelector(".hamburger");
let sideBar = document.querySelector(".side-bar");

const handleDropdown = (event) => {
    console.log(event.target)
    if (event.target.matches('.hamburger, .hamburger::after, .hamburger::before')) {
        if (!icon) {
            hamburgerBtn.style = "background-color: transparent;";
            hamburgerBtn.animate({ rotate: ["0deg", "140deg"] }, { duration: 300, fill: "forwards", pseudoElement: "::after" });
            hamburgerBtn.animate({ top: "-5px", rotate: ["0deg", "-140deg"] }, { duration: 300, fill: "forwards", pseudoElement: "::before" });

            sideBar.animate({left: "0px"}, { duration: 300, fill: "forwards" });
            sideBar.style = "top: 57px; height: 100vh; z-index: 100; width: 30rem;";

            icon = true;
        } else {
            hamburgerBtn.style = "background-color: white;";
            hamburgerBtn.animate({ rotate: ["135deg", "0deg"] }, { duration: 300, fill: "forwards", pseudoElement: "::after" });
            hamburgerBtn.animate({ top: "-10px", rotate: ["-135deg", "0deg"] }, { duration: 300, fill: "forwards", pseudoElement: "::before" });

            sideBar.animate({left: "-400px"}, { duration: 300, fill: "forwards" });
            // sideBar.style = "top: 57px; height: 100vh; z-index: 100; width: 30rem;";
            icon = false;
        }
    }
};

hamburgerBtn.addEventListener("click", handleDropdown);

// TODO CONTROLLER
let todoController = (function() {
    class TodoList {
        constructor(id, name) {
            this.id = id;
            this.name = name;
            this.todoItems = [];
        }   
    }

    class TodoItem {
        constructor(id, name, Listname) {
            this.id = id;
            this.name = name;
            this.Listname = Listname;
            this.status = "Ongoing";
        }
    }

    let data = {
        todoLists: []
    }

    return {
        addTodoItem(name, Listname) {
            let newItem, ID;
            let listIndex = data.todoLists.findIndex(elem => elem.name === Listname );
            if (listIndex !== -1) {
                if (data.todoLists[listIndex].todoItems.length > 0) ID = data.todoLists[listIndex].todoItems[data.todoLists[listIndex].todoItems.length - 1].id + 1;
                else ID = 0;
                //Create New Todo Item
                newItem = new TodoItem(ID, name, Listname);
                data.todoLists[listIndex].todoItems.push(newItem)
                return newItem;
            }
        },

        deleteTodoItem(id, listName) {
            let list = data.todoLists.find(elem => elem.name === listName);
            list.todoItems.splice(id, 1);
        },

        deleteTodoList(name) {
            let id = data.todoLists.findIndex(elem => elem.name === name);
            //console.log(data.todoLists[id])
            data.todoLists.splice(id, 1);
        },

        markTodoComplete(id, listName) {
            let list = data.todoLists.find(elem => elem.name === listName);
            let todo = list.todoItems.find(el => el.id === parseInt(id));
            todo.status === "Ongoing" ? todo.status = "Completed" : todo.status = "Ongoing";
            //console.log(todo)
        },

        addTodoList(name) {
            let newItem, ID;

            if (data.todoLists.length > 0) ID = data.todoLists[data.todoLists.length - 1].id + 1;
            ID = 0;

            //Create New Todo List
            newItem = new TodoList(ID, name);
            data.todoLists.push(newItem);
            return newItem;
        },

        getTodosByTodoList(name) {
            return data.todoLists.find(elem => elem.name.toLowerCase() === name);
        },

        getAllTodoLists() {
            return data.todoLists;
        },

        setInitialData(val) {
            data.todoLists = val;
        },

        testing() {
        	console.log(data);
        }
    }
})(); 


//UI CONTROLLER
let UIController = (function() {
    let DOMStrings = {
        listNameString: "name",
        todoNameString: "item-name",
        todoListNameString: "list",
        todoBtnString: ".todo-btn",
        listBtnString: ".submit-list-btn",
        todoContainer: ".todo-item-container",
        listContainer: ".list-container",
        listItem: ".list-item",
        listHeader: ".list-name"
    }

    return {
        getInput() {
            return {
                listName: document.getElementById(DOMStrings.listNameString).value,
                todoName: document.getElementById(DOMStrings.todoNameString).value,
                todoListName: document.getElementById(DOMStrings.todoListNameString).value,
            }
        },
        addTodoItem(obj, index) {
            let html, element;
            element = DOMStrings.todoContainer;
            html = `<tr class="todo-item" data-id=${obj.id} data-list=${obj.Listname}>
            <td>
                <h3>${index + 1}</h3>
            </td>
            <td>
                <h3>${obj.name}</h3>
            </td>
            <td>
                <h3>${obj.status}</h3>
            </td>
            <td>
                <div class="todo-buttons">
                    <button class="delete-btn btn"><img src="assets/delete.png" class="icon"></button>
                    <button class="complete-btn btn btn-grad">${obj.status === "Ongoing" ? "Mark Complete" : "Mark Ongoing"}</button>
                    <div class="label">Due Soon</div>
                </div>
            </td>
        </tr>`;
        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        addTodoList(obj) {
            let html, element;
            element = DOMStrings.listContainer;
            html = `<li class="list-item" data-id=${obj.name}>${obj.name} <button class="todolist-btn"><img src="assets/delete.png" class="icon"></button></li>`;
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        renderDropDwnListItems(obj) {
            let html, element
            element = DOMStrings.todoListNameString;
            html = `<option value="${obj.name}">${obj.name}</option>`
            // Insert the HTML into the DOM
            document.getElementById(element).insertAdjacentHTML('beforeend', html);
        },

        renderTodoListHeading(name) {
            document.querySelector(DOMStrings.listHeader).textContent = `${name + " List of Todo Items"}`;
        },

        clearTodos() {
            let container = document.querySelector(DOMStrings.todoContainer);
            container.innerHTML = "";
        },

        clearLists() {
            let container = document.querySelector(DOMStrings.listContainer);
            container.innerHTML = "";
        },

        clearDropdwnList() {
            let container = document.getElementById(DOMStrings.todoListNameString);
            container.innerHTML = "";
        },

        clearFields() {
            document.getElementById(DOMStrings.listNameString).value = "";
            document.getElementById(DOMStrings.todoNameString).value = "";
        },
        getDOMStrings() {
            return DOMStrings;
        }
    }
})();


// GLOBAL APP CONTROLLER
let controller = (function (todoCtrl, UICtrl) { 
    let setUpEventListeners = (function() {
        let DOM = UICtrl.getDOMStrings()
        document.querySelector(DOM.todoBtnString).addEventListener("click", ctrlAddTodoItem);
        document.querySelector(DOM.listBtnString).addEventListener("click", crtlAddListItem);

        document.querySelector(DOM.listContainer).addEventListener("click", e => {
            if (e.target.matches('.list-item')) {
                let list = e.target.dataset.id;
                renderTodoItems(list)
            } else if (e.target.matches('.todolist-btn, .todolist-btn *')) {
                let name = e.target.parentNode.dataset.id;
                deleteTodoList(String(name));
                UICtrl.clearLists();
                UICtrl.clearTodos();
                document.querySelector(DOM.listHeader).textContent = "Create a List or Click a List on the Side Bar to View"
                // Get all the remaining lists
                let lists = todoCtrl.getAllTodoLists();
                // Render to the UI
                lists.forEach(elem => UICtrl.addTodoList(elem));
                //console.log(name);
            }
        });

        window.addEventListener("load", loadInitialData);

        document.querySelector(DOM.todoContainer).addEventListener("click", editTodoItem);
    });

    const loadInitialData = () => {
        let data = localStorage.getItem("data");
        let lists = JSON.parse(data);
        if (lists) {
            // Set the app state to use the local storage data if any
            todoCtrl.setInitialData(lists);
            // Populate the dropdown for creating a todoitem
            lists.forEach(elem => UICtrl.renderDropDwnListItems(elem));
            // Populate the sidebar with todoLists
            lists.forEach(elem => UICtrl.addTodoList(elem));
        }
    }

    const formatStringIWithDash = (string) => {
        let trimmed = string.trim();
        return trimmed.replace(/\s/g, "-");
    }

    const ctrlAddTodoItem = () => {
        let input, newItem

        // Get the fiiled Input
        input = UICtrl.getInput();

        // Add it to the data structure
        if (input.todoName !== "" && input.todoListName !== "") {
            newItem = todoCtrl.addTodoItem(input.todoName, input.todoListName);
            // Store the currently viewed todoList
            localStorage.setItem("listName", input.todoListName);
            saveToStorage();
            // Clear Input fields
            UICtrl.clearFields();
            //todoCtrl.testing();
            renderTodoItems(localStorage.getItem("listName"))
        }

    };

    const saveToStorage = () => {
        let data = todoCtrl.getAllTodoLists()
        localStorage.setItem("data", JSON.stringify(data));
    }

    const editTodoItem = (event) => {
        let id = event.target.parentNode.parentNode.parentNode.dataset.id;
        let listName = event.target.parentNode.parentNode.parentNode.dataset.list;
        if (event.target.matches('.delete-btn, .delete-btn *')) {
            todoCtrl.deleteTodoItem(id, listName);
            saveToStorage();
            // Rerender
            renderTodoItems(listName);
        } else if (event.target.matches('.complete-btn, .complete-btn *')) {
            todoCtrl.markTodoComplete(id, listName);
            saveToStorage();
            // Rerender
            renderTodoItems(listName);
        }
    }

    const crtlAddListItem = () => {
        let input, newItem
        input = UICtrl.getInput();

        if (input.listName !== "") {
            newItem = todoCtrl.addTodoList(formatStringIWithDash(input.listName));
            // Clear Input fields
            UICtrl.clearFields();
            // Add to data
            UICtrl.addTodoList(newItem);
            // Change the header
            UICtrl.renderTodoListHeading(newItem.name);
            // Clear the UI
            UICtrl.clearTodos()
            // This will trigger changes to the data and render a new dropdown
            let lists = todoCtrl.getAllTodoLists();
            // Clear dropdown UI first
            UICtrl.clearDropdwnList()
            // render results
            lists.forEach(elem => UICtrl.renderDropDwnListItems(elem));
            // Save to Local Storage
            saveToStorage()
            //todoCtrl.testing();
        }
    }

    const renderTodoItems = (name) => {
       // get all todos according to the clicked todo list name
       let listItems = todoCtrl.getTodosByTodoList(name.toLowerCase());
       let items = listItems.todoItems;
       // Change the header
       UICtrl.renderTodoListHeading(name);
       // Clear the UI
       UICtrl.clearTodos()
       //Display on the UI
       items.forEach((elem, index) => UICtrl.addTodoItem(elem, index));
       //todoCtrl.testing()
    }

    const deleteTodoList = (name) => {
        todoCtrl.deleteTodoList(name);
        saveToStorage();
        todoCtrl.testing()
    }

    return {
        init() {
            setUpEventListeners();
        }
    }
})(todoController, UIController);

controller.init()