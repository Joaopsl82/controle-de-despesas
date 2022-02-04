const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransationAmount = document.querySelector('#amount')

// let duumyTransactions = [
//     { id: 1, name: 'Bolo de Brigadeiro', amount: -20},
//     { id: 2, name: 'Salário', amount: 300},
//     { id: 3, name: 'Torta de Frango', amount: -10},
//     { id: 4, name: 'Violão', amount: 150}
// ]

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
        transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            x
        </button>
    `
    transactionUl.append(li)
}

const getExpenses = transactionAmounts => Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncome = transactionAmounts => transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionAmounts => transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    const transactionAmounts = transactions.map(({amount}) => amount)
    const total = getTotal(transactionAmounts)
    const income = getIncome(transactionAmounts)
    const expense = getExpenses(transactionAmounts)
    
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionArray = (transactionName, transactionAmount) => {
    transactions.push({ 
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransationAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransationAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (isSomeInputEmpty){
        alert('Por favor preencha tanto o nome quanto o valor da transação :)')
        return
    }

    addToTransactionArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()

    
    
}

form.addEventListener('submit', handleFormSubmit)