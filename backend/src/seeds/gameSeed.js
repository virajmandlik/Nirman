const mongoose = require('mongoose');
const { Game } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Sample game data
const games = [
  
  // Web Development Games
  {
    title: 'HTML Basics Quiz',
    description: 'Test your knowledge of HTML fundamentals with this quick quiz.',
    category: 'webDevelopment',
    subcategory: 'html',
    difficulty: 'beginner',
    imageUrl: 'html-quiz.png',
    timeLimit: 180, // 3 minutes
    tags: ['html', 'web', 'frontend'],
    status: 'published',
    questions: [
      {
        questionId: uuidv4(),
        question: 'What does HTML stand for?',
        options: [
          { id: uuidv4(), text: 'Hyper Text Markup Language' },
          { id: uuidv4(), text: 'High Tech Multi Language' },
          { id: uuidv4(), text: 'Hyper Transfer Markup Language' },
          { id: uuidv4(), text: 'Home Tool Markup Language' }
        ],
        correctOption: 0,
        explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which tag is used to define an HTML document?',
        options: [
          { id: uuidv4(), text: '<body>' },
          { id: uuidv4(), text: '<head>' },
          { id: uuidv4(), text: '<html>' },
          { id: uuidv4(), text: '<document>' }
        ],
        correctOption: 2,
        explanation: 'The <html> tag defines the root of an HTML document.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which of the following is NOT a valid HTML5 tag?',
        options: [
          { id: uuidv4(), text: '<article>' },
          { id: uuidv4(), text: '<footer>' },
          { id: uuidv4(), text: '<slider>' },
          { id: uuidv4(), text: '<section>' }
        ],
        correctOption: 2,
        explanation: '<slider> is not a valid HTML5 tag. You might be thinking of <input type="range"> or custom elements.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        questionId: uuidv4(),
        question: 'What is the correct HTML for creating a hyperlink?',
        options: [
          { id: uuidv4(), text: '<a url="http://example.com">Example</a>' },
          { id: uuidv4(), text: '<a href="http://example.com">Example</a>' },
          { id: uuidv4(), text: '<hyperlink="http://example.com">Example</hyperlink>' },
          { id: uuidv4(), text: '<link="http://example.com">Example</link>' }
        ],
        correctOption: 1,
        explanation: 'The correct HTML for creating a hyperlink is using the <a> tag with the href attribute.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which HTML attribute is used to define inline styles?',
        options: [
          { id: uuidv4(), text: 'class' },
          { id: uuidv4(), text: 'style' },
          { id: uuidv4(), text: 'font' },
          { id: uuidv4(), text: 'styles' }
        ],
        correctOption: 1,
        explanation: 'The style attribute is used to add inline CSS styles to an HTML element.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 20
      }
    ]
  },
  {
    title: 'CSS Styling Challenge',
    description: 'Test your knowledge of CSS styles and properties.',
    category: 'webDevelopment',
    subcategory: 'css',
    difficulty: 'intermediate',
    imageUrl: 'css-quiz.png',
    timeLimit: 240, // 4 minutes
    tags: ['css', 'styling', 'frontend'],
    status: 'published',
    questions: [
      {
        questionId: uuidv4(),
        question: 'Which property is used to change the background color?',
        options: [
          { id: uuidv4(), text: 'color' },
          { id: uuidv4(), text: 'bgcolor' },
          { id: uuidv4(), text: 'background-color' },
          { id: uuidv4(), text: 'background' }
        ],
        correctOption: 2,
        explanation: 'The background-color property is used to set the background color of an element.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'What does CSS stand for?',
        options: [
          { id: uuidv4(), text: 'Creative Style Sheets' },
          { id: uuidv4(), text: 'Cascading Style Sheets' },
          { id: uuidv4(), text: 'Computer Style Sheets' },
          { id: uuidv4(), text: 'Colorful Style Sheets' }
        ],
        correctOption: 1,
        explanation: 'CSS stands for Cascading Style Sheets, which is used to describe how HTML elements should be displayed.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which CSS property controls the text size?',
        options: [
          { id: uuidv4(), text: 'text-size' },
          { id: uuidv4(), text: 'font-size' },
          { id: uuidv4(), text: 'text-style' },
          { id: uuidv4(), text: 'font-style' }
        ],
        correctOption: 1,
        explanation: 'The font-size property is used to control the size of text in CSS.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'What is the correct CSS syntax for making all the <p> elements bold?',
        options: [
          { id: uuidv4(), text: 'p {text-size: bold}' },
          { id: uuidv4(), text: 'p {font-weight: bold}' },
          { id: uuidv4(), text: '<p style="font-size: bold">' },
          { id: uuidv4(), text: 'p.all {font-weight: bold}' }
        ],
        correctOption: 1,
        explanation: 'The correct CSS syntax for making all <p> elements bold is p {font-weight: bold}.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        questionId: uuidv4(),
        question: 'Which property is used to create space between elements in CSS?',
        options: [
          { id: uuidv4(), text: 'padding' },
          { id: uuidv4(), text: 'margin' },
          { id: uuidv4(), text: 'spacing' },
          { id: uuidv4(), text: 'border' }
        ],
        correctOption: 1,
        explanation: 'The margin property in CSS is used to create space around elements, outside of any defined borders.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      }
    ]
  },
  {
    title: 'JavaScript Fundamentals',
    description: 'Test your JavaScript skills with questions on variables, functions, and more.',
    category: 'webDevelopment',
    subcategory: 'javascript',
    difficulty: 'intermediate',
    imageUrl: 'js-quiz.png',
    timeLimit: 300, // 5 minutes
    tags: ['javascript', 'programming', 'frontend'],
    status: 'published',
    questions: [
      {
        questionId: uuidv4(),
        question: 'Which operator is used to assign a value to a variable?',
        options: [
          { id: uuidv4(), text: '=' },
          { id: uuidv4(), text: '*' },
          { id: uuidv4(), text: '-' },
          { id: uuidv4(), text: 'x' }
        ],
        correctOption: 0,
        explanation: 'The = operator is used to assign values to variables in JavaScript.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'How do you create a function in JavaScript?',
        options: [
          { id: uuidv4(), text: 'function:myFunction()' },
          { id: uuidv4(), text: 'function myFunction()' },
          { id: uuidv4(), text: 'function = myFunction()' },
          { id: uuidv4(), text: 'create function myFunction()' }
        ],
        correctOption: 1,
        explanation: 'In JavaScript, you define a function using the function keyword followed by the function name and parentheses.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'How do you call a function named "myFunction"?',
        options: [
          { id: uuidv4(), text: 'call myFunction()' },
          { id: uuidv4(), text: 'myFunction()' },
          { id: uuidv4(), text: 'call function myFunction()' },
          { id: uuidv4(), text: 'execute myFunction()' }
        ],
        correctOption: 1,
        explanation: 'To call a function in JavaScript, you write the function name followed by parentheses.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'What is the correct way to write a JavaScript array?',
        options: [
          { id: uuidv4(), text: 'var colors = "red", "green", "blue"' },
          { id: uuidv4(), text: 'var colors = (1:"red", 2:"green", 3:"blue")' },
          { id: uuidv4(), text: 'var colors = ["red", "green", "blue"]' },
          { id: uuidv4(), text: 'var colors = 1=("red"), 2=("green"), 3=("blue")' }
        ],
        correctOption: 2,
        explanation: 'JavaScript arrays are written with square brackets, and array items are separated by commas.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        questionId: uuidv4(),
        question: 'How do you find the number with the highest value of x and y?',
        options: [
          { id: uuidv4(), text: 'Math.ceil(x, y)' },
          { id: uuidv4(), text: 'Math.max(x, y)' },
          { id: uuidv4(), text: 'top(x, y)' },
          { id: uuidv4(), text: 'Math.highest(x, y)' }
        ],
        correctOption: 1,
        explanation: 'The Math.max() function returns the number with the highest value.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      }
    ]
  },
  
  // Database Games
  {
    title: 'MongoDB Basics',
    description: 'Learn the basics of MongoDB with this interactive quiz.',
    category: 'database',
    subcategory: 'mongodb',
    difficulty: 'beginner',
    imageUrl: 'mongodb-quiz.png',
    timeLimit: 240, // 4 minutes
    tags: ['mongodb', 'nosql', 'database'],
    status: 'published',
    questions: [
      {
        questionId: uuidv4(),
        question: 'What type of database is MongoDB?',
        options: [
          { id: uuidv4(), text: 'Relational Database' },
          { id: uuidv4(), text: 'NoSQL Database' },
          { id: uuidv4(), text: 'Graph Database' },
          { id: uuidv4(), text: 'Hierarchical Database' }
        ],
        correctOption: 1,
        explanation: 'MongoDB is a NoSQL database that stores data in JSON-like documents with dynamic schemas.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'What is the MongoDB equivalent of a table in relational databases?',
        options: [
          { id: uuidv4(), text: 'Document' },
          { id: uuidv4(), text: 'Collection' },
          { id: uuidv4(), text: 'Schema' },
          { id: uuidv4(), text: 'Database' }
        ],
        correctOption: 1,
        explanation: 'In MongoDB, a collection is the equivalent of a table in relational databases. It contains a set of documents.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'What is the MongoDB equivalent of a row in relational databases?',
        options: [
          { id: uuidv4(), text: 'Field' },
          { id: uuidv4(), text: 'Document' },
          { id: uuidv4(), text: 'Collection' },
          { id: uuidv4(), text: 'Index' }
        ],
        correctOption: 1,
        explanation: 'In MongoDB, a document is the equivalent of a row in relational databases. It contains key-value pairs.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which of the following is a valid way to query a MongoDB collection?',
        options: [
          { id: uuidv4(), text: 'db.collection.SELECT({name: "John"})' },
          { id: uuidv4(), text: 'db.collection.WHERE({name: "John"})' },
          { id: uuidv4(), text: 'db.collection.find({name: "John"})' },
          { id: uuidv4(), text: 'db.collection.query({name: "John"})' }
        ],
        correctOption: 2,
        explanation: 'The find() method is used to query documents in a MongoDB collection.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        questionId: uuidv4(),
        question: 'Which method is used to insert a document into a MongoDB collection?',
        options: [
          { id: uuidv4(), text: 'db.collection.add()' },
          { id: uuidv4(), text: 'db.collection.insert()' },
          { id: uuidv4(), text: 'db.collection.create()' },
          { id: uuidv4(), text: 'db.collection.new()' }
        ],
        correctOption: 1,
        explanation: 'The insert() method (or insertOne() and insertMany() in newer versions) is used to add documents to a collection.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      }
    ]
  },
  {
    title: 'SQL Query Challenges',
    description: 'Practice your SQL query skills with these challenges.',
    category: 'database',
    subcategory: 'sql',
    difficulty: 'intermediate',
    imageUrl: 'sql-quiz.png',
    timeLimit: 300, // 5 minutes
    tags: ['sql', 'database', 'queries'],
    status: 'published',
    questions: [
      {
        questionId: uuidv4(),
        question: 'Which SQL statement is used to extract data from a database?',
        options: [
          { id: uuidv4(), text: 'EXTRACT' },
          { id: uuidv4(), text: 'SELECT' },
          { id: uuidv4(), text: 'OPEN' },
          { id: uuidv4(), text: 'GET' }
        ],
        correctOption: 1,
        explanation: 'The SELECT statement is used to retrieve data from a database.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which SQL clause is used to filter records?',
        options: [
          { id: uuidv4(), text: 'FILTER BY' },
          { id: uuidv4(), text: 'WHERE' },
          { id: uuidv4(), text: 'LIMIT' },
          { id: uuidv4(), text: 'HAVING' }
        ],
        correctOption: 1,
        explanation: 'The WHERE clause is used to filter records based on a condition.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which SQL statement is used to insert new data into a database?',
        options: [
          { id: uuidv4(), text: 'ADD' },
          { id: uuidv4(), text: 'INSERT INTO' },
          { id: uuidv4(), text: 'UPDATE' },
          { id: uuidv4(), text: 'CREATE' }
        ],
        correctOption: 1,
        explanation: 'The INSERT INTO statement is used to add new records to a table.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which SQL statement is used to update data in a database?',
        options: [
          { id: uuidv4(), text: 'MODIFY' },
          { id: uuidv4(), text: 'UPDATE' },
          { id: uuidv4(), text: 'SAVE' },
          { id: uuidv4(), text: 'CHANGE' }
        ],
        correctOption: 1,
        explanation: 'The UPDATE statement is used to modify existing records in a table.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        questionId: uuidv4(),
        question: 'What is the correct SQL statement to join two tables?',
        options: [
          { id: uuidv4(), text: 'SELECT * FROM table1 COMBINE table2' },
          { id: uuidv4(), text: 'SELECT * FROM table1, table2' },
          { id: uuidv4(), text: 'SELECT * FROM table1 JOIN table2' },
          { id: uuidv4(), text: 'SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.id' }
        ],
        correctOption: 3,
        explanation: 'The INNER JOIN keyword selects records that have matching values in both tables based on the join condition.',
        points: 20,
        difficulty: 'hard',
        timeLimit: 30
      }
    ]
  },
  
  // Core Programming Games
  {
    title: 'Python Fundamentals',
    description: 'Test your knowledge of Python basics with this interactive quiz.',
    category: 'coreProgramming',
    subcategory: 'python',
    difficulty: 'beginner',
    imageUrl: 'python-quiz.png',
    timeLimit: 240, // 4 minutes
    tags: ['python', 'programming', 'basics'],
    status: 'published',
    questions: [
      {
        questionId: uuidv4(),
        question: 'What is the correct way to declare a variable in Python?',
        options: [
          { id: uuidv4(), text: 'var x = 5' },
          { id: uuidv4(), text: 'x = 5' },
          { id: uuidv4(), text: 'int x = 5' },
          { id: uuidv4(), text: 'declare x = 5' }
        ],
        correctOption: 1,
        explanation: 'In Python, variables are created by simply assigning a value to a name.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'How do you create a list in Python?',
        options: [
          { id: uuidv4(), text: 'list = (1, 2, 3)' },
          { id: uuidv4(), text: 'list = [1, 2, 3]' },
          { id: uuidv4(), text: 'array(1, 2, 3)' },
          { id: uuidv4(), text: 'list.create(1, 2, 3)' }
        ],
        correctOption: 1,
        explanation: 'Lists in Python are created using square brackets with comma-separated items.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which of the following is the correct way to define a function in Python?',
        options: [
          { id: uuidv4(), text: 'function myFunc():' },
          { id: uuidv4(), text: 'def myFunc():' },
          { id: uuidv4(), text: 'create myFunc():' },
          { id: uuidv4(), text: 'func myFunc():' }
        ],
        correctOption: 1,
        explanation: 'In Python, functions are defined using the def keyword followed by the function name and parentheses.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'What is the output of print(len("Hello, World!"))?',
        options: [
          { id: uuidv4(), text: '12' },
          { id: uuidv4(), text: '13' },
          { id: uuidv4(), text: '11' },
          { id: uuidv4(), text: '10' }
        ],
        correctOption: 1,
        explanation: 'The len() function returns the number of characters in a string, including spaces and punctuation.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        questionId: uuidv4(),
        question: 'What does the append() method do for lists in Python?',
        options: [
          { id: uuidv4(), text: 'Removes an item from the list' },
          { id: uuidv4(), text: 'Adds an item to the beginning of the list' },
          { id: uuidv4(), text: 'Adds an item to the end of the list' },
          { id: uuidv4(), text: 'Sorts the list' }
        ],
        correctOption: 2,
        explanation: 'The append() method adds an item to the end of a list.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      }
    ]
  },
  {
    title: 'Java Programming Challenge',
    description: 'Test your Java programming skills with these interactive questions.',
    category: 'coreProgramming',
    subcategory: 'java',
    difficulty: 'intermediate',
    imageUrl: 'java-quiz.png',
    timeLimit: 300, // 5 minutes
    tags: ['java', 'programming', 'oop'],
    status: 'published',
    questions: [
      {
        questionId: uuidv4(),
        question: 'Which of the following is a correct way to declare a variable in Java?',
        options: [
          { id: uuidv4(), text: 'var x = 5;' },
          { id: uuidv4(), text: 'int x = 5;' },
          { id: uuidv4(), text: 'x = 5;' },
          { id: uuidv4(), text: 'x: int = 5;' }
        ],
        correctOption: 1,
        explanation: 'In Java, variables must be declared with a type. The correct syntax is type variableName = value;',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'What is the entry point method for a Java application?',
        options: [
          { id: uuidv4(), text: 'start()' },
          { id: uuidv4(), text: 'run()' },
          { id: uuidv4(), text: 'main()' },
          { id: uuidv4(), text: 'execute()' }
        ],
        correctOption: 2,
        explanation: 'The main() method is the entry point for a Java application. The signature is: public static void main(String[] args)',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'What is the correct way to create an object of a class in Java?',
        options: [
          { id: uuidv4(), text: 'ClassName obj = new ClassName;' },
          { id: uuidv4(), text: 'ClassName obj = new ClassName();' },
          { id: uuidv4(), text: 'obj = new ClassName();' },
          { id: uuidv4(), text: 'new ClassName() = obj;' }
        ],
        correctOption: 1,
        explanation: 'In Java, objects are created using the new keyword followed by a call to a constructor.',
        points: 10,
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        questionId: uuidv4(),
        question: 'Which keyword is used to inherit a class in Java?',
        options: [
          { id: uuidv4(), text: 'inherits' },
          { id: uuidv4(), text: 'implements' },
          { id: uuidv4(), text: 'extends' },
          { id: uuidv4(), text: 'super' }
        ],
        correctOption: 2,
        explanation: 'The extends keyword is used to create a subclass that inherits from a superclass in Java.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      },
      {
        questionId: uuidv4(),
        question: 'Which collection type should be used if you need to ensure that elements are unique?',
        options: [
          { id: uuidv4(), text: 'ArrayList' },
          { id: uuidv4(), text: 'LinkedList' },
          { id: uuidv4(), text: 'HashMap' },
          { id: uuidv4(), text: 'HashSet' }
        ],
        correctOption: 3,
        explanation: 'HashSet is a Set implementation that ensures all elements are unique.',
        points: 15,
        difficulty: 'medium',
        timeLimit: 25
      }
    ]
  }
];

// Function to seed the database with sample games
const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing games
    await Game.deleteMany({});
    console.log('Previous games cleared');
    
    // Insert game data
    const insertedGames = await Game.insertMany(games);
    console.log(`${insertedGames.length} games inserted successfully`);
    
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Database connection closed');
    
    console.log('Game data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    
    // Disconnect from the database on error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Database connection closed due to error');
    }
    
    throw error;
  }
};

module.exports = seedDatabase; 