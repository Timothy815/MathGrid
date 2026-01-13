import { Operation, WorksheetConfig } from '../types';
import { generateProblems } from './mathUtils';

const templates = {
  [Operation.ADDITION]: [
    "There are {top} apples in a large basket. The farmer adds {bottom} more apples. How many apples are there in total?",
    "Sarah read {top} pages of her book last week and {bottom} pages this week. How many pages did she read altogether?",
    "A library has {top} fiction books and {bottom} non-fiction books on a shelf. What is the total number of books?",
    "In a video game, Tom scored {top} points in Level 1 and {bottom} points in Level 2. What is his total score?"
  ],
  [Operation.SUBTRACTION]: [
    "A warehouse had {top} boxes. A truck loaded {bottom} boxes to deliver. How many boxes are left in the warehouse?",
    "The school cafeteria made {top} sandwiches. The students ate {bottom} of them. How many sandwiches are remaining?",
    "A puzzle has {top} pieces. You have already connected {bottom} pieces. How many pieces are left to finish?",
    "Farmer Joe grew {top} pumpkins. He sold {bottom} at the market. How many pumpkins does he have left?"
  ],
  [Operation.MULTIPLICATION]: [
    "There are {top} rows of seats in the theater. Each row has {bottom} seats. How many seats are there in total?",
    "A factory packs {top} crayons in a box. If they ship {bottom} boxes, how many crayons are shipped in total?",
    "A building has {bottom} floors. There are {top} windows on each floor. How many windows does the building have?",
    "If a car travels {top} miles per hour, how many miles will it travel in {bottom} hours?"
  ],
  [Operation.DIVISION]: [
    "A factory produced {top} toys. They need to be packed equally into {bottom} boxes. How many toys go in each box?",
    "There are {top} students going on a field trip. They are split into {bottom} equal groups. How many students are in each group?",
    "A gardener has {top} seeds to plant in {bottom} rows. If she plants the same number in each row, how many seeds are in a row?",
    "You have {top} tickets to give to {bottom} friends. If you share them equally, how many tickets does each friend get?"
  ]
};

export const generateLocalWordProblem = (config: WorksheetConfig): string => {
    // Generate a single math problem using the current config to ensure numbers match settings
    // We temporarily override count to 1
    const singleProblemConfig = { ...config, count: 1 };
    const problems = generateProblems(singleProblemConfig);
    
    if (problems.length === 0) return "Could not generate problem.";
    
    const { top, bottom, type } = problems[0];
    
    // Select a random template for the operation
    const operationTemplates = templates[type];
    const template = operationTemplates[Math.floor(Math.random() * operationTemplates.length)];
    
    // Replace placeholders
    return template
        .replace('{top}', top.toLocaleString())
        .replace('{bottom}', bottom.toLocaleString());
};