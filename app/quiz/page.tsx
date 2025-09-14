"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Clock,
  Trophy,
  Target,
  Brain,
  Code,
  Calculator,
  Lightbulb,
  Database,
  Globe,
  Shield,
  Smartphone,
  BarChart,
  Users,
  Briefcase,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: string
  questions: QuizQuestion[]
  timeLimit: number
}

const quizCategories: QuizCategory[] = [
  {
    id: "coding",
    title: "Coding & Programming",
    description: "Test your programming knowledge and problem-solving skills",
    icon: <Code className="h-6 w-6" />,
    difficulty: "Medium",
    timeLimit: 1800, // 30 minutes
    questions: [
      {
        id: 1,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        explanation:
          "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      },
      {
        id: 2,
        question: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
      },
      {
        id: 3,
        question: "What does REST stand for in web development?",
        options: [
          "Representational State Transfer",
          "Remote State Transfer",
          "Relational State Transfer",
          "Responsive State Transfer",
        ],
        correctAnswer: 0,
        explanation: "REST stands for Representational State Transfer, an architectural style for web services.",
      },
      {
        id: 4,
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
        correctAnswer: 1,
        explanation:
          "Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting.",
      },
      {
        id: 5,
        question: "What is the purpose of a hash table?",
        options: [
          "Store data in sorted order",
          "Provide O(1) average lookup time",
          "Implement recursion",
          "Handle memory allocation",
        ],
        correctAnswer: 1,
        explanation:
          "Hash tables provide O(1) average-case lookup, insertion, and deletion operations using hash functions.",
      },
      {
        id: 6,
        question: "Which design pattern ensures a class has only one instance?",
        options: ["Factory", "Observer", "Singleton", "Strategy"],
        correctAnswer: 2,
        explanation:
          "The Singleton pattern ensures that a class has only one instance and provides global access to it.",
      },
      {
        id: 7,
        question: "What is the difference between '==' and '===' in JavaScript?",
        options: [
          "No difference",
          "=== checks type and value, == only checks value",
          "== is faster",
          "=== is deprecated",
        ],
        correctAnswer: 1,
        explanation:
          "=== performs strict equality comparison (type and value), while == performs loose equality with type coercion.",
      },
      {
        id: 8,
        question: "Which HTTP method is idempotent?",
        options: ["POST", "PUT", "PATCH", "All of the above"],
        correctAnswer: 1,
        explanation: "PUT is idempotent, meaning multiple identical requests have the same effect as a single request.",
      },
      {
        id: 9,
        question: "What is Big O notation used for?",
        options: ["Memory usage only", "Time complexity only", "Both time and space complexity", "Code readability"],
        correctAnswer: 2,
        explanation:
          "Big O notation describes both time and space complexity, showing how algorithms scale with input size.",
      },
      {
        id: 10,
        question: "Which data structure is best for implementing a priority queue?",
        options: ["Array", "Linked List", "Heap", "Stack"],
        correctAnswer: 2,
        explanation:
          "Heap is the most efficient data structure for priority queues, providing O(log n) insertion and extraction.",
      },
    ],
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Architecture and system design concepts",
    icon: <Brain className="h-6 w-6" />,
    difficulty: "Hard",
    timeLimit: 2400, // 40 minutes
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of a load balancer?",
        options: ["Data storage", "Distribute incoming requests", "User authentication", "Data encryption"],
        correctAnswer: 1,
        explanation:
          "A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.",
      },
      {
        id: 2,
        question: "Which database type is best for handling complex relationships?",
        options: ["NoSQL", "Relational (SQL)", "Key-Value", "Document"],
        correctAnswer: 1,
        explanation:
          "Relational databases are designed to handle complex relationships between data entities using foreign keys and joins.",
      },
      {
        id: 3,
        question: "What is horizontal scaling?",
        options: [
          "Adding more power to existing servers",
          "Adding more servers",
          "Optimizing code",
          "Reducing server load",
        ],
        correctAnswer: 1,
        explanation:
          "Horizontal scaling means adding more servers to handle increased load, rather than upgrading existing hardware.",
      },
      {
        id: 4,
        question: "What is the CAP theorem?",
        options: [
          "Consistency, Availability, Partition tolerance",
          "Cache, API, Performance",
          "Create, Access, Process",
          "Client, Application, Protocol",
        ],
        correctAnswer: 0,
        explanation:
          "CAP theorem states that distributed systems can only guarantee two of three: Consistency, Availability, and Partition tolerance.",
      },
      {
        id: 5,
        question: "Which caching strategy updates cache when data is modified?",
        options: ["Cache-aside", "Write-through", "Write-behind", "Refresh-ahead"],
        correctAnswer: 1,
        explanation: "Write-through caching updates both the cache and database simultaneously when data is modified.",
      },
      {
        id: 6,
        question: "What is microservices architecture?",
        options: [
          "Single large application",
          "Multiple small, independent services",
          "Client-server model",
          "Peer-to-peer network",
        ],
        correctAnswer: 1,
        explanation:
          "Microservices architecture breaks down applications into small, independent services that communicate over APIs.",
      },
      {
        id: 7,
        question: "What is the purpose of a CDN?",
        options: ["Database replication", "Content delivery optimization", "User authentication", "Load balancing"],
        correctAnswer: 1,
        explanation:
          "CDN (Content Delivery Network) optimizes content delivery by serving content from geographically distributed servers.",
      },
      {
        id: 8,
        question: "Which consistency model provides the strongest guarantees?",
        options: ["Eventual consistency", "Strong consistency", "Weak consistency", "Causal consistency"],
        correctAnswer: 1,
        explanation:
          "Strong consistency ensures all nodes see the same data at the same time, providing the strongest guarantees.",
      },
      {
        id: 9,
        question: "What is database sharding?",
        options: ["Data backup", "Horizontal partitioning", "Vertical partitioning", "Data compression"],
        correctAnswer: 1,
        explanation:
          "Database sharding is horizontal partitioning where data is distributed across multiple database instances.",
      },
      {
        id: 10,
        question: "What is the purpose of an API gateway?",
        options: ["Data storage", "Single entry point for APIs", "User interface", "Database connection"],
        correctAnswer: 1,
        explanation:
          "API gateway serves as a single entry point for all client requests, handling routing, authentication, and rate limiting.",
      },
    ],
  },
  {
    id: "aptitude",
    title: "Aptitude & Reasoning",
    description: "Logical reasoning and quantitative aptitude questions",
    icon: <Calculator className="h-6 w-6" />,
    difficulty: "Easy",
    timeLimit: 1200, // 20 minutes
    questions: [
      {
        id: 1,
        question:
          "If 5 machines can produce 5 widgets in 5 minutes, how long would it take 100 machines to produce 100 widgets?",
        options: ["5 minutes", "20 minutes", "100 minutes", "500 minutes"],
        correctAnswer: 0,
        explanation:
          "Each machine produces 1 widget in 5 minutes, so 100 machines would produce 100 widgets in 5 minutes.",
      },
      {
        id: 2,
        question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
        options: ["40", "42", "44", "46"],
        correctAnswer: 1,
        explanation: "The differences are 4, 6, 8, 10, so the next difference is 12, making the answer 30 + 12 = 42.",
      },
      {
        id: 3,
        question: "A train travels 60 km in 40 minutes. What is its speed in km/h?",
        options: ["90 km/h", "100 km/h", "80 km/h", "120 km/h"],
        correctAnswer: 0,
        explanation: "Speed = Distance/Time = 60 km / (40/60) hours = 60 / (2/3) = 90 km/h.",
      },
      {
        id: 4,
        question: "If A is twice as old as B, and B is 15 years old, how old will A be in 5 years?",
        options: ["30", "35", "40", "25"],
        correctAnswer: 1,
        explanation: "A is currently 2 × 15 = 30 years old. In 5 years, A will be 30 + 5 = 35 years old.",
      },
      {
        id: 5,
        question: "What is 25% of 80?",
        options: ["15", "20", "25", "30"],
        correctAnswer: 1,
        explanation: "25% of 80 = (25/100) × 80 = 0.25 × 80 = 20.",
      },
      {
        id: 6,
        question: "If 3x + 7 = 22, what is the value of x?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2,
        explanation: "3x + 7 = 22, so 3x = 15, therefore x = 5.",
      },
      {
        id: 7,
        question: "A rectangle has length 12 cm and width 8 cm. What is its area?",
        options: ["96 cm²", "40 cm²", "20 cm²", "48 cm²"],
        correctAnswer: 0,
        explanation: "Area of rectangle = length × width = 12 × 8 = 96 cm².",
      },
      {
        id: 8,
        question: "What is the next number in the series: 1, 4, 9, 16, 25, ?",
        options: ["30", "35", "36", "49"],
        correctAnswer: 2,
        explanation: "These are perfect squares: 1², 2², 3², 4², 5², so next is 6² = 36.",
      },
      {
        id: 9,
        question: "If a book costs $15 and is discounted by 20%, what is the final price?",
        options: ["$10", "$12", "$13", "$11"],
        correctAnswer: 1,
        explanation: "20% discount = $15 × 0.20 = $3. Final price = $15 - $3 = $12.",
      },
      {
        id: 10,
        question: "How many minutes are there in 2.5 hours?",
        options: ["120", "130", "140", "150"],
        correctAnswer: 3,
        explanation: "2.5 hours = 2.5 × 60 minutes = 150 minutes.",
      },
    ],
  },
  {
    id: "database",
    title: "Database Management",
    description: "SQL, NoSQL, and database design concepts",
    icon: <Database className="h-6 w-6" />,
    difficulty: "Medium",
    timeLimit: 1800, // 30 minutes
    questions: [
      {
        id: 1,
        question: "What does ACID stand for in database transactions?",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Access, Control, Integration, Data",
          "Automatic, Consistent, Independent, Distributed",
          "Advanced, Centralized, Integrated, Dynamic",
        ],
        correctAnswer: 0,
        explanation:
          "ACID represents the four key properties of database transactions: Atomicity, Consistency, Isolation, and Durability.",
      },
      {
        id: 2,
        question: "Which SQL command is used to retrieve data from a database?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        correctAnswer: 2,
        explanation: "SELECT is the SQL command used to retrieve data from one or more tables in a database.",
      },
      {
        id: 3,
        question: "What is a primary key?",
        options: [
          "A key that opens the database",
          "A unique identifier for each record",
          "The first column in a table",
          "A password for database access",
        ],
        correctAnswer: 1,
        explanation:
          "A primary key is a unique identifier for each record in a database table, ensuring no duplicate rows.",
      },
      {
        id: 4,
        question: "What is database normalization?",
        options: ["Making data normal", "Organizing data to reduce redundancy", "Backing up data", "Encrypting data"],
        correctAnswer: 1,
        explanation: "Database normalization is the process of organizing data to minimize redundancy and dependency.",
      },
      {
        id: 5,
        question: "Which type of JOIN returns all records from both tables?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
        correctAnswer: 3,
        explanation:
          "FULL OUTER JOIN returns all records from both tables, including unmatched records from both sides.",
      },
      {
        id: 6,
        question: "What is an index in a database?",
        options: [
          "A table of contents",
          "A data structure that improves query performance",
          "A backup copy",
          "A user permission",
        ],
        correctAnswer: 1,
        explanation:
          "An index is a data structure that improves the speed of data retrieval operations on a database table.",
      },
      {
        id: 7,
        question: "What is the difference between DELETE and TRUNCATE?",
        options: [
          "No difference",
          "DELETE removes specific rows, TRUNCATE removes all rows",
          "TRUNCATE is slower",
          "DELETE is permanent",
        ],
        correctAnswer: 1,
        explanation:
          "DELETE removes specific rows based on conditions, while TRUNCATE removes all rows from a table quickly.",
      },
      {
        id: 8,
        question: "What is a foreign key?",
        options: [
          "A key from another country",
          "A reference to a primary key in another table",
          "An encrypted key",
          "A backup key",
        ],
        correctAnswer: 1,
        explanation:
          "A foreign key is a field that references the primary key of another table, establishing relationships between tables.",
      },
      {
        id: 9,
        question: "Which NoSQL database type stores data as key-value pairs?",
        options: ["Document", "Column-family", "Key-value", "Graph"],
        correctAnswer: 2,
        explanation: "Key-value databases store data as simple key-value pairs, like Redis or DynamoDB.",
      },
      {
        id: 10,
        question: "What is a stored procedure?",
        options: ["A backup process", "A precompiled SQL code block", "A data type", "A table structure"],
        correctAnswer: 1,
        explanation:
          "A stored procedure is a precompiled collection of SQL statements that can be executed as a single unit.",
      },
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Frontend, backend, and full-stack web development",
    icon: <Globe className="h-6 w-6" />,
    difficulty: "Medium",
    timeLimit: 1800, // 30 minutes
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language",
        ],
        correctAnswer: 0,
        explanation: "HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.",
      },
      {
        id: 2,
        question: "Which CSS property is used to change the text color?",
        options: ["font-color", "text-color", "color", "foreground-color"],
        correctAnswer: 2,
        explanation: "The 'color' property in CSS is used to set the color of text content.",
      },
      {
        id: 3,
        question: "What is the purpose of the DOCTYPE declaration?",
        options: ["Define document type", "Import stylesheets", "Create variables", "Handle events"],
        correctAnswer: 0,
        explanation: "DOCTYPE declaration tells the browser which version of HTML the document is written in.",
      },
      {
        id: 4,
        question: "Which JavaScript method adds an element to the end of an array?",
        options: ["append()", "push()", "add()", "insert()"],
        correctAnswer: 1,
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
      },
      {
        id: 5,
        question: "What is responsive web design?",
        options: [
          "Fast loading websites",
          "Websites that respond to user input",
          "Websites that adapt to different screen sizes",
          "Interactive websites",
        ],
        correctAnswer: 2,
        explanation:
          "Responsive web design creates websites that adapt and display properly on various devices and screen sizes.",
      },
      {
        id: 6,
        question: "Which HTTP status code indicates 'Not Found'?",
        options: ["200", "301", "404", "500"],
        correctAnswer: 2,
        explanation: "HTTP status code 404 indicates that the requested resource could not be found on the server.",
      },
      {
        id: 7,
        question: "What is AJAX?",
        options: ["A programming language", "Asynchronous JavaScript and XML", "A web server", "A database"],
        correctAnswer: 1,
        explanation:
          "AJAX stands for Asynchronous JavaScript and XML, allowing web pages to update content without reloading.",
      },
      {
        id: 8,
        question: "Which CSS framework is known for utility-first approach?",
        options: ["Bootstrap", "Foundation", "Tailwind CSS", "Bulma"],
        correctAnswer: 2,
        explanation:
          "Tailwind CSS is a utility-first CSS framework that provides low-level utility classes for building designs.",
      },
      {
        id: 9,
        question: "What is the Virtual DOM in React?",
        options: ["A real DOM element", "A JavaScript representation of the real DOM", "A CSS framework", "A database"],
        correctAnswer: 1,
        explanation:
          "Virtual DOM is a JavaScript representation of the real DOM that React uses to optimize rendering performance.",
      },
      {
        id: 10,
        question: "Which tool is commonly used for version control?",
        options: ["Git", "NPM", "Webpack", "Babel"],
        correctAnswer: 0,
        explanation:
          "Git is the most widely used distributed version control system for tracking changes in source code.",
      },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description: "Security principles, threats, and protection measures",
    icon: <Shield className="h-6 w-6" />,
    difficulty: "Hard",
    timeLimit: 2100, // 35 minutes
    questions: [
      {
        id: 1,
        question: "What is the CIA triad in cybersecurity?",
        options: [
          "Central Intelligence Agency",
          "Confidentiality, Integrity, Availability",
          "Computer, Internet, Access",
          "Cyber, Information, Analysis",
        ],
        correctAnswer: 1,
        explanation:
          "The CIA triad represents the three core principles of information security: Confidentiality, Integrity, and Availability.",
      },
      {
        id: 2,
        question: "What is a SQL injection attack?",
        options: [
          "Injecting SQL into databases",
          "Malicious SQL code inserted into application queries",
          "A database backup method",
          "A SQL optimization technique",
        ],
        correctAnswer: 1,
        explanation:
          "SQL injection is a code injection technique where malicious SQL statements are inserted into application entry points.",
      },
      {
        id: 3,
        question: "What does HTTPS provide that HTTP doesn't?",
        options: ["Faster loading", "Better SEO", "Encryption and authentication", "More features"],
        correctAnswer: 2,
        explanation:
          "HTTPS provides encryption and authentication through SSL/TLS, securing data transmission between client and server.",
      },
      {
        id: 4,
        question: "What is two-factor authentication (2FA)?",
        options: [
          "Using two passwords",
          "Authentication using two different factors",
          "Logging in twice",
          "Two-step verification",
        ],
        correctAnswer: 1,
        explanation:
          "2FA requires two different authentication factors (something you know, have, or are) for enhanced security.",
      },
      {
        id: 5,
        question: "What is a firewall?",
        options: [
          "A wall that prevents fires",
          "Network security system that monitors traffic",
          "Antivirus software",
          "Password manager",
        ],
        correctAnswer: 1,
        explanation:
          "A firewall is a network security system that monitors and controls incoming and outgoing network traffic.",
      },
      {
        id: 6,
        question: "What is phishing?",
        options: [
          "Catching fish online",
          "Fraudulent attempt to obtain sensitive information",
          "Network monitoring",
          "Data backup",
        ],
        correctAnswer: 1,
        explanation:
          "Phishing is a fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity.",
      },
      {
        id: 7,
        question: "What is encryption?",
        options: ["Data compression", "Converting data into coded form", "Data backup", "Network optimization"],
        correctAnswer: 1,
        explanation:
          "Encryption is the process of converting information into a coded form to prevent unauthorized access.",
      },
      {
        id: 8,
        question: "What is a DDoS attack?",
        options: ["Data theft", "Distributed Denial of Service", "Database corruption", "Device malfunction"],
        correctAnswer: 1,
        explanation:
          "DDoS (Distributed Denial of Service) attack overwhelms a target with traffic from multiple sources.",
      },
      {
        id: 9,
        question: "What is malware?",
        options: ["Bad software design", "Malicious software", "Software bugs", "Outdated software"],
        correctAnswer: 1,
        explanation:
          "Malware is malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.",
      },
      {
        id: 10,
        question: "What is the principle of least privilege?",
        options: [
          "Giving minimum necessary access rights",
          "Using the cheapest security solution",
          "Having few administrators",
          "Minimal software installation",
        ],
        correctAnswer: 0,
        explanation:
          "Principle of least privilege means giving users only the minimum access rights necessary to perform their job functions.",
      },
    ],
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    description: "iOS, Android, and cross-platform mobile development",
    icon: <Smartphone className="h-6 w-6" />,
    difficulty: "Medium",
    timeLimit: 1800, // 30 minutes
    questions: [
      {
        id: 1,
        question: "Which programming language is primarily used for iOS development?",
        options: ["Java", "Swift", "Kotlin", "C#"],
        correctAnswer: 1,
        explanation:
          "Swift is Apple's programming language designed specifically for iOS, macOS, watchOS, and tvOS development.",
      },
      {
        id: 2,
        question: "What is React Native?",
        options: [
          "A native iOS framework",
          "A cross-platform mobile development framework",
          "An Android library",
          "A web framework",
        ],
        correctAnswer: 1,
        explanation:
          "React Native is a cross-platform framework that allows developers to build mobile apps using React and JavaScript.",
      },
      {
        id: 3,
        question: "Which file format is used for Android app packages?",
        options: [".ipa", ".apk", ".exe", ".dmg"],
        correctAnswer: 1,
        explanation:
          "APK (Android Package Kit) is the file format used for distributing and installing Android applications.",
      },
      {
        id: 4,
        question: "What is the main programming language for Android development?",
        options: ["Swift", "Objective-C", "Kotlin", "C++"],
        correctAnswer: 2,
        explanation:
          "Kotlin is Google's preferred programming language for Android development, though Java is also supported.",
      },
      {
        id: 5,
        question: "What is an Activity in Android?",
        options: [
          "A background service",
          "A single screen with user interface",
          "A database operation",
          "A network request",
        ],
        correctAnswer: 1,
        explanation: "An Activity represents a single screen with a user interface in an Android application.",
      },
      {
        id: 6,
        question: "Which tool is used to design iOS user interfaces?",
        options: ["Android Studio", "Xcode Interface Builder", "Visual Studio", "Eclipse"],
        correctAnswer: 1,
        explanation:
          "Xcode Interface Builder is Apple's visual tool for designing iOS user interfaces using storyboards and XIB files.",
      },
      {
        id: 7,
        question: "What is Flutter?",
        options: [
          "An iOS framework",
          "Google's UI toolkit for cross-platform development",
          "A testing tool",
          "A database",
        ],
        correctAnswer: 1,
        explanation:
          "Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.",
      },
      {
        id: 8,
        question: "What is the purpose of AndroidManifest.xml?",
        options: [
          "Store app data",
          "Define app components and permissions",
          "Handle user interface",
          "Manage databases",
        ],
        correctAnswer: 1,
        explanation:
          "AndroidManifest.xml declares app components, permissions, and other essential information about the Android app.",
      },
      {
        id: 9,
        question: "Which design pattern is commonly used in iOS development?",
        options: ["MVC", "MVP", "MVVM", "All of the above"],
        correctAnswer: 3,
        explanation: "iOS development commonly uses MVC (Model-View-Controller), MVP, and MVVM architectural patterns.",
      },
      {
        id: 10,
        question: "What is Core Data in iOS?",
        options: [
          "A networking framework",
          "Apple's object graph and persistence framework",
          "A UI component",
          "A testing framework",
        ],
        correctAnswer: 1,
        explanation:
          "Core Data is Apple's framework for managing object graphs and persisting data in iOS applications.",
      },
    ],
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    description: "Statistics, machine learning, and data analysis",
    icon: <BarChart className="h-6 w-6" />,
    difficulty: "Hard",
    timeLimit: 2400, // 40 minutes
    questions: [
      {
        id: 1,
        question: "What is the difference between supervised and unsupervised learning?",
        options: [
          "No difference",
          "Supervised uses labeled data, unsupervised doesn't",
          "Supervised is faster",
          "Unsupervised is more accurate",
        ],
        correctAnswer: 1,
        explanation:
          "Supervised learning uses labeled training data, while unsupervised learning finds patterns in data without labels.",
      },
      {
        id: 2,
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "Standard Query Language",
          "Sequential Query Language",
        ],
        correctAnswer: 0,
        explanation: "SQL stands for Structured Query Language, used for managing and querying relational databases.",
      },
      {
        id: 3,
        question: "What is overfitting in machine learning?",
        options: [
          "Model is too simple",
          "Model performs well on training but poorly on new data",
          "Model is too fast",
          "Model uses too much memory",
        ],
        correctAnswer: 1,
        explanation:
          "Overfitting occurs when a model learns training data too well, including noise, leading to poor generalization.",
      },
      {
        id: 4,
        question: "Which Python library is commonly used for data manipulation?",
        options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
        correctAnswer: 1,
        explanation:
          "Pandas is the primary Python library for data manipulation and analysis, providing data structures like DataFrames.",
      },
      {
        id: 5,
        question: "What is a p-value in statistics?",
        options: ["Probability value", "Performance value", "Prediction value", "Population value"],
        correctAnswer: 0,
        explanation:
          "P-value is the probability of obtaining test results at least as extreme as observed, assuming the null hypothesis is true.",
      },
      {
        id: 6,
        question: "What is cross-validation?",
        options: [
          "Validating data twice",
          "Technique to assess model performance",
          "Data cleaning method",
          "Feature selection technique",
        ],
        correctAnswer: 1,
        explanation:
          "Cross-validation is a technique to assess how well a model generalizes to unseen data by splitting data into training and validation sets.",
      },
      {
        id: 7,
        question: "What is the purpose of feature scaling?",
        options: ["Reduce dataset size", "Normalize feature ranges", "Remove features", "Add new features"],
        correctAnswer: 1,
        explanation:
          "Feature scaling normalizes the range of features so that no single feature dominates due to its scale.",
      },
      {
        id: 8,
        question: "What is a confusion matrix?",
        options: [
          "A confusing table",
          "Table showing classification performance",
          "Data visualization tool",
          "Statistical test",
        ],
        correctAnswer: 1,
        explanation:
          "A confusion matrix is a table showing the performance of a classification model, displaying true vs predicted classifications.",
      },
      {
        id: 9,
        question: "What is the difference between correlation and causation?",
        options: [
          "No difference",
          "Correlation implies relationship, causation implies cause-effect",
          "Causation is stronger",
          "Correlation is more important",
        ],
        correctAnswer: 1,
        explanation:
          "Correlation indicates a statistical relationship between variables, while causation means one variable directly causes changes in another.",
      },
      {
        id: 10,
        question: "What is ensemble learning?",
        options: ["Learning in groups", "Combining multiple models", "Fast learning technique", "Deep learning method"],
        correctAnswer: 1,
        explanation:
          "Ensemble learning combines multiple models to create a stronger predictor than any individual model alone.",
      },
    ],
  },
  {
    id: "product-management",
    title: "Product Management",
    description: "Product strategy, development, and management principles",
    icon: <Users className="h-6 w-6" />,
    difficulty: "Medium",
    timeLimit: 1800, // 30 minutes
    questions: [
      {
        id: 1,
        question: "What is a Minimum Viable Product (MVP)?",
        options: [
          "Most Valuable Product",
          "Minimum Viable Product with basic features",
          "Maximum Value Proposition",
          "Most Visited Page",
        ],
        correctAnswer: 1,
        explanation:
          "MVP is a product with minimum features that provides value to early customers and validates product assumptions.",
      },
      {
        id: 2,
        question: "What is the purpose of user personas?",
        options: [
          "Decorate presentations",
          "Represent target user segments",
          "Track user behavior",
          "Measure performance",
        ],
        correctAnswer: 1,
        explanation:
          "User personas are fictional characters representing different user segments to guide product decisions and design.",
      },
      {
        id: 3,
        question: "What is A/B testing?",
        options: [
          "Testing two products",
          "Comparing two versions to see which performs better",
          "Alphabetical testing",
          "Advanced/Basic testing",
        ],
        correctAnswer: 1,
        explanation:
          "A/B testing compares two versions of a product feature to determine which performs better with users.",
      },
      {
        id: 4,
        question: "What does KPI stand for?",
        options: [
          "Key Performance Indicator",
          "Key Product Information",
          "Key Process Integration",
          "Key Personnel Index",
        ],
        correctAnswer: 0,
        explanation:
          "KPI stands for Key Performance Indicator, metrics used to evaluate success in achieving objectives.",
      },
      {
        id: 5,
        question: "What is a product roadmap?",
        options: [
          "Map of product locations",
          "Strategic plan showing product direction",
          "User journey map",
          "Technical architecture",
        ],
        correctAnswer: 1,
        explanation:
          "A product roadmap is a strategic document outlining the vision, direction, and progress of a product over time.",
      },
      {
        id: 6,
        question: "What is user story mapping?",
        options: [
          "Mapping user locations",
          "Visualizing user journey and features",
          "Creating user profiles",
          "Tracking user behavior",
        ],
        correctAnswer: 1,
        explanation:
          "User story mapping visualizes the user journey and organizes features to understand the user experience flow.",
      },
      {
        id: 7,
        question: "What is the difference between features and benefits?",
        options: [
          "No difference",
          "Features are what product does, benefits are value to users",
          "Benefits are more important",
          "Features are technical",
        ],
        correctAnswer: 1,
        explanation:
          "Features describe what a product does, while benefits explain the value and outcomes users receive from those features.",
      },
      {
        id: 8,
        question: "What is product-market fit?",
        options: [
          "Product fits in market",
          "Product satisfies strong market demand",
          "Product pricing strategy",
          "Market research method",
        ],
        correctAnswer: 1,
        explanation:
          "Product-market fit occurs when a product satisfies strong market demand and customers are willing to pay for it.",
      },
      {
        id: 9,
        question: "What is the RICE framework used for?",
        options: [
          "Cooking recipes",
          "Prioritizing features (Reach, Impact, Confidence, Effort)",
          "Risk assessment",
          "Revenue calculation",
        ],
        correctAnswer: 1,
        explanation:
          "RICE framework helps prioritize features based on Reach, Impact, Confidence, and Effort required.",
      },
      {
        id: 10,
        question: "What is customer lifetime value (CLV)?",
        options: [
          "How long customers live",
          "Total value a customer brings over their relationship",
          "Customer satisfaction score",
          "Customer acquisition cost",
        ],
        correctAnswer: 1,
        explanation:
          "CLV is the total monetary value a customer brings to a business over the entire duration of their relationship.",
      },
    ],
  },
  {
    id: "business-strategy",
    title: "Business Strategy",
    description: "Strategic thinking, business models, and market analysis",
    icon: <Briefcase className="h-6 w-6" />,
    difficulty: "Hard",
    timeLimit: 2100, // 35 minutes
    questions: [
      {
        id: 1,
        question: "What is Porter's Five Forces framework used for?",
        options: [
          "Military strategy",
          "Analyzing industry competitiveness",
          "Financial planning",
          "Marketing strategy",
        ],
        correctAnswer: 1,
        explanation:
          "Porter's Five Forces analyzes industry competitiveness by examining five key forces that shape competition.",
      },
      {
        id: 2,
        question: "What does SWOT analysis stand for?",
        options: [
          "Strengths, Weaknesses, Opportunities, Threats",
          "Strategy, Work, Operations, Technology",
          "Sales, Workforce, Operations, Targets",
          "Systems, Workflows, Objectives, Tactics",
        ],
        correctAnswer: 0,
        explanation:
          "SWOT analysis evaluates Strengths, Weaknesses, Opportunities, and Threats to inform strategic planning.",
      },
      {
        id: 3,
        question: "What is a blue ocean strategy?",
        options: [
          "Ocean-based business",
          "Creating uncontested market space",
          "Environmental strategy",
          "Pricing strategy",
        ],
        correctAnswer: 1,
        explanation:
          "Blue ocean strategy focuses on creating uncontested market space rather than competing in existing markets.",
      },
      {
        id: 4,
        question: "What is the difference between strategy and tactics?",
        options: [
          "No difference",
          "Strategy is long-term plan, tactics are short-term actions",
          "Tactics are more important",
          "Strategy is for executives only",
        ],
        correctAnswer: 1,
        explanation:
          "Strategy is the overall long-term plan to achieve goals, while tactics are specific short-term actions to execute strategy.",
      },
      {
        id: 5,
        question: "What is market segmentation?",
        options: [
          "Dividing market into distinct groups",
          "Market research method",
          "Pricing strategy",
          "Distribution strategy",
        ],
        correctAnswer: 0,
        explanation:
          "Market segmentation divides a market into distinct groups of consumers with similar needs or characteristics.",
      },
      {
        id: 6,
        question: "What is a value proposition?",
        options: ["Product price", "Unique value offered to customers", "Business proposal", "Investment opportunity"],
        correctAnswer: 1,
        explanation:
          "A value proposition is a clear statement of the unique value a product or service provides to customers.",
      },
      {
        id: 7,
        question: "What is the BCG Growth-Share Matrix used for?",
        options: [
          "Employee evaluation",
          "Portfolio analysis of business units",
          "Financial planning",
          "Market research",
        ],
        correctAnswer: 1,
        explanation:
          "BCG Matrix analyzes business units based on market growth rate and relative market share to guide resource allocation.",
      },
      {
        id: 8,
        question: "What is competitive advantage?",
        options: [
          "Being competitive",
          "Attributes that allow outperforming competitors",
          "Aggressive marketing",
          "Lower prices",
        ],
        correctAnswer: 1,
        explanation:
          "Competitive advantage refers to attributes that allow a company to outperform its competitors consistently.",
      },
      {
        id: 9,
        question: "What is the purpose of scenario planning?",
        options: [
          "Planning events",
          "Preparing for different future possibilities",
          "Project management",
          "Risk assessment",
        ],
        correctAnswer: 1,
        explanation:
          "Scenario planning helps organizations prepare for different possible future situations and their implications.",
      },
      {
        id: 10,
        question: "What is customer acquisition cost (CAC)?",
        options: [
          "Cost to satisfy customers",
          "Cost to acquire new customers",
          "Customer service cost",
          "Customer retention cost",
        ],
        correctAnswer: 1,
        explanation: "CAC is the total cost of sales and marketing efforts needed to acquire a new customer.",
      },
    ],
  },
]

export default function QuizPage() {
  const { user } = useUser()
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizStarted && timeRemaining > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleQuizComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizStarted, timeRemaining, quizCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startQuiz = (category: QuizCategory) => {
    setSelectedCategory(category)
    setTimeRemaining(category.timeLimit)
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    setSelectedAnswers(new Array(category.questions.length).fill(-1))
    setQuizCompleted(false)
    setScore(0)
    setShowExplanation(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (selectedCategory && currentQuestionIndex < selectedCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowExplanation(false)
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = async () => {
    if (!selectedCategory || !user) return

    let correctAnswers = 0
    selectedCategory.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / selectedCategory.questions.length) * 100)
    setScore(finalScore)
    setQuizCompleted(true)

    // Save quiz results to database
    try {
      await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          category: selectedCategory.id,
          title: selectedCategory.title,
          totalQuestions: selectedCategory.questions.length,
          correctAnswers,
          score: finalScore,
          timeTaken: selectedCategory.timeLimit - timeRemaining,
        }),
      })
    } catch (error) {
      console.error("Error saving quiz results:", error)
    }
  }

  const resetQuiz = () => {
    setSelectedCategory(null)
    setQuizStarted(false)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setTimeRemaining(0)
    setScore(0)
    setShowExplanation(false)
  }

  if (!selectedCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz & Assessment</h1>
          <p className="text-muted-foreground">Test your knowledge and skills across different domains</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">{category.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {category.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    {category.questions.length} Questions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {Math.floor(category.timeLimit / 60)} Minutes
                  </div>
                </div>
                <Button onClick={() => startQuiz(category)} className="w-full">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>Here are your results for {selectedCategory.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
              <p className="text-muted-foreground">
                You got {selectedCategory.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length} out
                of {selectedCategory.questions.length} questions correct
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Question Review:</h3>
              {selectedCategory.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        selectedAnswers[index] === question.correctAnswer
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your answer: {question.options[selectedAnswers[index]] || "Not answered"}
                      </p>
                      {selectedAnswers[index] !== question.correctAnswer && (
                        <p className="text-sm text-green-600 mb-2">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={resetQuiz} variant="outline" className="flex-1 bg-transparent">
                Take Another Quiz
              </Button>
              <Button onClick={() => (window.location.href = "/dashboard")} className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = selectedCategory.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / selectedCategory.questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedCategory.title}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {selectedCategory.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex]?.toString()}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {showExplanation && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {!showExplanation && selectedAnswers[currentQuestionIndex] !== -1 && (
                <Button variant="outline" onClick={() => setShowExplanation(true)}>
                  Show Explanation
                </Button>
              )}
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="ml-auto"
              >
                {currentQuestionIndex === selectedCategory.questions.length - 1 ? "Complete Quiz" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
