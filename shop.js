const resize = () => {
//    console.log(window.innerWidth);
    if (window.innerWidth > 500) { app.wide = true } else { app.wide = false }
}
const app = new Vue({
    name: "Shopping List",
    el: '#app',
    data: {
        today: new Date(),
        wide: false,
        fontSize: 25,
        tax: 7.75,
        todos: [],
        itemMenuDefault: ["ADD INDEX", "EDIT", "PRICE", "DELETE"],
        aisles: [],
        quantities: [0,1,2,3,4,5,6,7,8,9,10],
        retrievedData: "",
        settings: [
            "Sort by Name",
            "Font Size",
            "Tax",
            "Save", 
            "Restore", 
            "Clear", 
            "Revert"
        ],
        newItem: {
            title: '', 
            aisle: '', 
            price: '', 
            quantity: '', 
            tax: false, 
            cart: false, 
            select: false, 
            lastPurchase: '', 
            days: 0
        },
        ogTitle: '',
        newTodoText: '',
        newAisle: '',
        newPrice: '',
        total: 0,
        taxTotal: 0,
        items: 0,
        totalItems: 0,
    },
    created: function () {
        if (window.innerWidth > 500) { this.wide = true } else { this.wide = false }
        this.todos = [];
        if (!localStorage.getItem("vueTodos")) {
            localStorage.setItem("vueTodos", JSON.stringify(this.todos));
            localStorage.setItem("vueTodosRevert", JSON.stringify(this.todos));
        } else {
            this.retrievedData = localStorage.getItem("vueTodos");
            this.todos = JSON.parse(this.retrievedData);
            this.updateAisles();
            this.updatePrice();
            this.updateCart();
            this.updateQuantity();
            this.updateLastPurchase();
            this.updateSelect();
            localStorage.setItem("vueTodosRevert", JSON.stringify(this.todos));
        }
        if (!localStorage.getItem("fontSize")) {
            localStorage.setItem("fontSize", this.fontSize);
        } else {
            this.fontSize = localStorage.getItem("fontSize");
        }
        if (!localStorage.getItem("tax")) {
            localStorage.setItem("tax", this.tax);
        } else {
            if(localStorage.getItem("tax") != "null"){
                this.tax = localStorage.getItem("tax");
            } else {
                localStorage.setItem("tax", this.tax);
            }
        }
        this.toggleSettings();
        this.getTotal();
    },
    methods: {
        addTodo: function () {
            if (this.newTodoText) {
                this.newAisle = prompt("Enter aisle number:", "");
                if (this.aisles.indexOf(this.newAisle) < 0) {
                    this.aisles.push(this.newAisle);
                }
                this.newPrice = prompt("Enter price:", "");
                localStorage.setItem("vueTodosRevert", JSON.stringify(this.todos));
                this.newItem = {
                    title: this.newTodoText, 
                    aisle: this.newAisle, 
                    price: Number(this.newPrice).toFixed(2),
                    quantity: 1, 
                    tax: false, 
                    cart: true, 
                    select: true, 
                    lastPurchase: this.today, 
                    days: 0
                };
                this.todos.push(this.newItem);
                this.retrievedData = localStorage.getItem("vueTodos");
                this.retrievedData = JSON.parse(this.retrievedData);
                this.retrievedData.push(this.newItem);
                this.updateAisles();
                localStorage.setItem("vueTodos", JSON.stringify(this.retrievedData));
                if (!localStorage.getItem("vueTodosSaved")) {
                    localStorage.setItem("vueTodosSaved", JSON.stringify(this.todos));
                } else {
                    this.retrievedData = localStorage.getItem("vueTodosSaved");
                    this.retrievedData = JSON.parse(this.retrievedData);
                    this.retrievedData.push(this.newItem);
                    localStorage.setItem("vueTodosSaved", JSON.stringify(this.retrievedData));
                }
                this.newTodoText = '';
                document.getElementById("itemEntry").setAttribute("value", "");
                this.getTotal();
            }
        },
        toggleCart: function (index) {
            if (this.todos[index].cart) {
                this.todos[index].cart = false;
            } else {
                this.todos[index].cart = true;
            }
            this.updateAisles();
            this.getTotal();
        },
        toggleSettings: function () {
            const settingsMenu = document.getElementById("settingsMenu");
            const menu = document.getElementById("menu");
            if (settingsMenu.style.visibility == "hidden") {
                settingsMenu.style.visibility = "visible";
                menu.style.visibility = "hidden";
            } else {
                settingsMenu.style.visibility = "hidden";
                menu.style.visibility = "visible";
            }
        },
        reIndex: function (index, selectedAisle) {
            if (selectedAisle == "DELETE") {
                this.retrievedData = localStorage.getItem("vueTodosSaved");
                this.retrievedData = JSON.parse(this.retrievedData);
                for (x in this.retrievedData) {
                    if (this.retrievedData[x].title == this.todos[index].title) {
                        this.retrievedData.splice(x, 1);
                    }
                }
                localStorage.setItem("vueTodosSaved", JSON.stringify(this.retrievedData));
                this.todos.splice(index, 1);
            } else if (selectedAisle == "PRICE") {
                this.todos[index].price = Number(prompt("Enter price:", "")).toFixed(2);
                this.retrievedData = localStorage.getItem("vueTodosSaved");
                this.retrievedData = JSON.parse(this.retrievedData);
                for (x in this.retrievedData) {
                    if (this.retrievedData[x].title == this.todos[index].title) {
                        this.retrievedData[x].price = this.todos[index].price;
                        this.todos[index].aisle = this.retrievedData[x].aisle;
                    }
                }
                this.updateAisles();
                localStorage.setItem("vueTodosSaved", JSON.stringify(this.retrievedData));
            } else if (selectedAisle == "EDIT") {
                this.ogTitle = this.todos[index].title;
                this.todos[index].title = prompt("Enter new label:", this.todos[index].title);
                this.retrievedData = localStorage.getItem("vueTodosSaved");
                this.retrievedData = JSON.parse(this.retrievedData);
                for (x in this.retrievedData) {
                    if (this.retrievedData[x].title == this.ogTitle) {
                        this.retrievedData[x].title = this.todos[index].title;
                        selectedAisle = this.retrievedData[x].aisle;
                    }
                }
                this.todos[index].aisle = selectedAisle;
                this.updateAisles();
                localStorage.setItem("vueTodosSaved", JSON.stringify(this.retrievedData));
                this.ogTitle = "";
            } else {
                if (selectedAisle == "ADD INDEX") {
                    selectedAisle = prompt("Enter aisle number:", "");
                    if(this.aisles.indexOf(selectedAisle) < 0){
                        this.aisles.push(selectedAisle);
                    }
                }
                this.todos[index].aisle = selectedAisle;
                this.retrievedData = localStorage.getItem("vueTodosSaved");
                this.retrievedData = JSON.parse(this.retrievedData);
                for (x in this.retrievedData) {
                    if (this.retrievedData[x].title == this.todos[index].title) {
                        this.retrievedData[x].aisle = selectedAisle;  
                    }
                }
                localStorage.setItem("vueTodosSaved", JSON.stringify(this.retrievedData));
                this.updateAisles();
            }
            localStorage.setItem("vueTodos", JSON.stringify(this.todos));
            this.getTotal()
        },
        getSetting: function(index) {
            if (this.settings[index] == "Clear") {
                this.clear();
            } else if (this.settings[index] == "Sort by Name") {
                this.sortName();
                this.settings.splice(0, 1, "Sort by Index");
            } else if (this.settings[index] == "Sort by Index") {
                this.settings.splice(0, 1, "Sort by Name");
                this.updateAisles();
            } else if (this.settings[index] == "Tax") {
                this.tax = prompt("Enter sales tax", this.tax);
                localStorage.setItem("tax", this.tax);
                this.getTotal();
            } else if (this.settings[index] == "Font Size") {
                this.fontSize = prompt("Enter font size", this.fontSize);
                localStorage.setItem("fontSize", this.fontSize);
            } else if (this.settings[index] == "Revert") {
                this.revert();
            } else if (this.settings[index] == "Save") {
                this.save();
            } else if (this.settings[index] == "Restore") {
                this.restore();
            }
            this.toggleSettings();
        },
        clear: function () {
            localStorage.setItem("vueTodosRevert", JSON.stringify(this.todos));
            this.todos = [];
            this.aisles = [];
            localStorage.setItem("vueTodos", JSON.stringify(this.todos));
            this.getTotal();
        },
        sortArray: function (array) {
            let alphabetic = [];
            let numeric = [];
            let n=0;
            for (n in array){
                if (Number(array[n].substring(0,1)) > 0) {
                    numeric.push(array[n]);
                } else {
                    alphabetic.push(array[n]);
                }
            }
            alphabetic.sort();
            numeric.sort(function(a, b){return a - b});
            array = [];
            n=0;
            for (n in this.itemMenuDefault) {
                array.push(this.itemMenuDefault[n])
            }
            n=0;
            for (n in alphabetic) {
                if(array.indexOf(alphabetic[n]) < 0){
                    array.push(alphabetic[n])
                }
            }
            n=0;
            for (n in numeric) {
                array.push(numeric[n])
            }
            this.aisles = array;
        },
        updateAisles: function () {
            let aisleColor;
            let todoSort = [];
            let inactiveTodos = [];
            for (x in this.todos) {
                if(this.aisles.indexOf(this.todos[x].aisle) < 0){
                    this.aisles.push(this.todos[x].aisle);
                }
            }
            this.sortArray(this.aisles);
            for (a in this.aisles) {
                aisleColor = Math.floor(Math.random()*16777215).toString(16);
                for (t in this.todos) {
                    if (this.todos[t].aisle == this.aisles[a] && this.todos[t].cart) {
                        this.todos[t].color = "#" + aisleColor;
                        todoSort.push(this.todos[t]);
                    } else if (this.todos[t].aisle == this.aisles[a] && !this.todos[t].cart) {
                        this.todos[t].color = "#" + aisleColor;
                        inactiveTodos.push(this.todos[t]);
                    }
                }
            }
            for (i in inactiveTodos) {
                todoSort.push(inactiveTodos[i]);
            }
            if (this.settings[0] == "Sort by Name") {
                this.todos = todoSort;
            }
        },
        sortName: function () {
            let aisleColor;
            let todoSort = [];
            let inactiveTodos = [];
            this.todos.sort(function(a, b){
                let x = a.title.toLowerCase();
                let y = b.title.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
            });
        },
        updatePrice: function () {
            for (x in this.todos) {
                if (typeof this.todos[x].price === 'undefined') {
                    this.todos[x].price = Number(0).toFixed(2);
                }
            }
            this.getTotal();
        },
        updateQuantity: function () {
            for (x in this.todos) {
                if (typeof this.todos[x].quantity === 'undefined') {
                    this.todos[x].quantity = this.quantities[1];
                }
            }
        },
        updateSelect: function () {
            for (x in this.todos) {
                this.todos[x].select = false;
            }
        },
        updateLastPurchase: function () {
            for (x in this.todos) {
                if (typeof this.todos[x].lastPurchase === 'undefined') {
                    this.todos[x].lastPurchase = this.today;
                    this.todos[x].days = 0;
                } else {
                    this.todos[x].days = this.getDaysSincePurchase(x);
                }
            }
        },
        getDaysSincePurchase: function(index) {
            let lastPurchase = new Date(this.todos[index].lastPurchase);
            let todoPurchase = new Date(lastPurchase.getFullYear(), lastPurchase.getMonth(), lastPurchase.getDate()); 
            let one_day=1000*60*60*24;    // Convert both dates to milliseconds
            let date1_ms = todoPurchase.getTime();   
            let date2_ms = this.today.getTime();    // Calculate the difference in milliseconds  
            let difference_ms = date2_ms - date1_ms;        // Convert back to days and return   
            return Math.round(difference_ms/one_day);
        },
        toggleTax: function(index) {          
            this.retrievedData = localStorage.getItem("vueTodosSaved");
            this.retrievedData = JSON.parse(this.retrievedData);
            for (x in this.retrievedData) {
                if (this.retrievedData[x].title == this.todos[index].title) {
                    this.retrievedData[x].tax = this.todos[index].tax;
                }
            }
            localStorage.setItem("vueTodosSaved", JSON.stringify(this.retrievedData));
            this.getTotal();
        },
        toggleSelect: function(index) {          
            for (x in this.todos) {
                if (this.todos[x].title == this.todos[index].title) {
                    if (this.todos[index].select) {
                        this.todos[x].select = false;
                    } else {
                        this.todos[x].lastPurchase = this.today;
                        this.todos[x].days = 1;
                        this.todos[x].select = true;
                    }
                }
            }
            localStorage.setItem("vueTodos", JSON.stringify(this.todos));
            this.getTotal();     
        },
        updateTax: function () {
            for (x in this.todos) {
                if (typeof this.todos[x].tax === 'undefined') {
                    this.todos[x].tax = false;
                }
            }
        },
        updateCart: function () {
            for (x in this.todos) {
                if (typeof this.todos[x].cart === 'undefined') {
                    this.todos[x].cart = false;
                }
            }
        },
        revert: function () {
            this.retrievedData = localStorage.getItem("vueTodosRevert");
            this.todos = JSON.parse(this.retrievedData);
            for (n in this.itemMenuDefault) {
                this.aisles.push(this.itemMenuDefault[n])
            }
            this.updateAisles();
            this.getTotal();
        },
        save: function () {
            localStorage.setItem("vueTodosSaved", JSON.stringify(this.todos));
        },
        restore: function () {
            this.retrievedData = localStorage.getItem("vueTodosSaved");
            this.todos = JSON.parse(this.retrievedData);
            for (n in this.itemMenuDefault) {
                this.aisles.push(this.itemMenuDefault[n])
            }
            this.updateAisles();
            localStorage.setItem("vueTodos", JSON.stringify(this.todos));
            this.getTotal();
        },
        getTotal: function () {
            this.total = Number(0);
            let subtotal = 0;
            let tax = this.tax;
            this.taxTotal = 0;
            this.items = 0;
            this.totalItems = 0;
            for (n in this.todos) {
                if (typeof this.todos[n].price !== 'undefined' && this.todos[n].cart) {
                    this.items++;
                    this.totalItems = Number(this.totalItems) + Number(this.todos[n].quantity);
                    subtotal = parseFloat(Number(this.todos[n].price)) * Number(this.todos[n].quantity);
                    if (this.todos[n].tax) {
                        tax = subtotal * (Number(this.tax) * .01);
                        this.taxTotal = this.taxTotal + tax;
                        subtotal = subtotal + tax;
                    }
                    this.total = parseFloat(Number(this.total)) + subtotal;
                }
            }
            this.total = Math.round( this.total * 100 ) / 100;
            this.total = this.total.toFixed(2);
            this.taxTotal = this.taxTotal.toFixed(2);
            localStorage.setItem("vueTodos", JSON.stringify(this.todos));
        }
    }
})