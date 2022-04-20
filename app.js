const URL = 'https://www.algoexpert.io/api/fe/questions';

// fetching the data
async function fetchQuestions(){
    const response = await fetch(URL);
    const questions = await response.json();
    return questions;
}

console.log(fetchQuestions());