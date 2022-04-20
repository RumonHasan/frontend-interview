import { test_items, submissions } from "./extras.js";
// selectors
const listContainerElement = document.querySelector('[data-list]');
console.log(listContainerElement);

const questions = test_items;

// urls
const SUBMISSION_URL = 'https://www.algoexpert.io/api/fe/submissions';
const QUESTIONS_URL = 'https://www.algoexpert.io/api/fe/questions';

// wrapper function
getAndAppendQuestions();

// wrapper function
function getAndAppendQuestions(){
    const main_questions = questions;
    const main_submissions = submissions;
    // const [questionsRes, submissionsRes] = fetchQuestionsAndSubmissions();
    // console.log(questionsRes);
    const questionsByCategory = getQuestionsByCategory(main_questions);
    const submissionsId = getSubmissionsById(main_submissions);

    // for iterating through objects
    for(const [category, questions] of Object.entries(questionsByCategory) ){
        const categoryDiv = createCategory(category, questions, submissionsId);
        listContainerElement.append(categoryDiv);
    }
}   

// function for creating a question object
function getQuestionsByCategory(main_questions){
    const questionObject = {};
    // need to return an object containing all the questions by their respective category
    main_questions.forEach((question)=>{
        if(questionObject.hasOwnProperty(question.category)){
            questionObject[question.category].push(question)
        }else{
            // creates a new category and injects the questions array
            questionObject[question.category] = [question];
        }
    });
    return questionObject;
};

// getting the submissions id
function getSubmissionsById(submissions){
    const submissionObject = {};
    // injecting the questions id into the object
    submissions.forEach((submission)=>{
        submissionObject[submission.questionId] = submission.status
    });
    return submissionObject;
}

// fetching questions and submission... CORS blocked
async function fetchQuestionsAndSubmissions(){
    const [questionsRes, submissionsRes] = await Promise.all([
        fetch(SUBMISSION_URL),
        fetch(QUESTIONS_URL)
    ]);
    return await Promise.all([
        questionsRes.json(),
        submissionsRes.json()
    ])
}

// creating the dom element for the category
function createCategory(category, questions, submissionsId){
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    const h2 = document.createElement('h2');
    h2.classList.add('category-header');
    categoryDiv.appendChild(h2);

    let correctCounter = 0;

    // populating the category div with questions
    questions.forEach((question)=>{
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        const status = document.createElement('div');
        status.classList.add('status');
        const statusClass = submissionsId[question.id]?.toLowerCase()?.replace('_', '-');
        status.classList.add(statusClass ?? 'unattempted');
        if(submissionsId[question.id] === 'CORRECT'){
            correctCounter++;
        }
        questionDiv.append(status);
        const h3 = document.createElement('h3');
        h3.textContent = question.name;
        questionDiv.append(h3);
        categoryDiv.append(questionDiv);
    });
    h2.textContent = `${category} - ${correctCounter}/${questions.length}`;

    return categoryDiv;
}
