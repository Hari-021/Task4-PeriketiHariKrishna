import type { InterviewCategory, Difficulty, InterviewQuestion } from '@/types';

export const categories: InterviewCategory[] = [
  'Python',
  'Java',
  'C++',
  'JavaScript',
  'React',
  'SQL',
  'Machine Learning',
  'Cybersecurity',
  'Data Structures & Algorithms',
  'System Design',
];

export const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const questionBank: Record<string, Record<string, string[]>> = {
  Python: {
    Easy: [
      'What is the difference between a list and a tuple in Python?',
      'Explain Python\'s GIL and its impact on multithreading.',
      'What are list comprehensions and why are they useful?',
      'How does Python handle memory management?',
    ],
    Medium: [
      'Explain decorators in Python with an example.',
      'What is the difference between __str__ and __repr__?',
      'How do generators work in Python and when should you use them?',
      'Explain the concept of context managers and the with statement.',
    ],
    Hard: [
      'Explain Python\'s metaclasses and when you would use them.',
      'How does Python\'s async/await work under the hood?',
      'Describe the Python descriptor protocol and its use cases.',
      'Explain memory fragmentation in CPython and mitigation strategies.',
    ],
  },
  Java: {
    Easy: [
      'What is the difference between JDK, JRE, and JVM?',
      'Explain the difference between == and .equals() in Java.',
      'What are the access modifiers in Java?',
      'Explain the concept of method overloading vs overriding.',
    ],
    Medium: [
      'What is the Java Memory Model and how does it work?',
      'Explain the difference between HashMap and ConcurrentHashMap.',
      'How does Java\'s garbage collection work?',
      'What are Java streams and how do they improve code?',
    ],
    Hard: [
      'Explain the happens-before relationship in the JMM.',
      'How would you design a custom thread pool executor?',
      'Describe the internals of the G1 garbage collector.',
      'Explain Project Loom and virtual threads in Java.',
    ],
  },
  'C++': {
    Easy: [
      'What is the difference between stack and heap memory?',
      'Explain the difference between pass-by-value and pass-by-reference.',
      'What are the basic OOP concepts in C++?',
      'What is the difference between struct and class in C++?',
    ],
    Medium: [
      'Explain RAII and its importance in C++.',
      'What are smart pointers and when should each be used?',
      'Explain move semantics and perfect forwarding.',
      'How does virtual inheritance solve the diamond problem?',
    ],
    Hard: [
      'Explain SFINAE and its use in template metaprogramming.',
      'How would you implement a custom allocator in C++?',
      'Describe the C++ object model and vtable layout.',
      'Explain CRTP and its advantages over virtual functions.',
    ],
  },
  JavaScript: {
    Easy: [
      'What is the difference between let, const, and var?',
      'Explain event delegation in JavaScript.',
      'What is the event loop and how does it work?',
      'Explain the difference between null and undefined.',
    ],
    Medium: [
      'Explain closures in JavaScript with an example.',
      'What is the difference between Promise and async/await?',
      'How does prototypal inheritance work in JavaScript?',
      'Explain the module pattern and ES modules.',
    ],
    Hard: [
      'Explain the V8 engine\'s hidden classes and inline caching.',
      'How would you implement a custom Promise polyfill?',
      'Describe the internals of JavaScript\'s memory management.',
      'Explain WeakRef and FinalizationRegistry use cases.',
    ],
  },
  React: {
    Easy: [
      'What is the virtual DOM and how does React use it?',
      'Explain the difference between props and state.',
      'What are React hooks and why were they introduced?',
      'Explain the component lifecycle in React.',
    ],
    Medium: [
      'Explain useEffect and its dependency array in detail.',
      'What is React.memo and when should you use it?',
      'Explain the Context API and its performance implications.',
      'How does React\'s reconciliation algorithm work?',
    ],
    Hard: [
      'Explain React Fiber architecture and its benefits.',
      'How would you implement a custom React renderer?',
      'Describe concurrent features and Suspense internals.',
      'Explain server components and their hydration strategy.',
    ],
  },
  SQL: {
    Easy: [
      'What is the difference between INNER JOIN and LEFT JOIN?',
      'Explain the ACID properties in databases.',
      'What is normalization and what are its normal forms?',
      'Explain the difference between WHERE and HAVING.',
    ],
    Medium: [
      'How do indexes work and when should you use them?',
      'Explain database transactions and isolation levels.',
      'What is the difference between clustered and non-clustered indexes?',
      'How would you optimize a slow query?',
    ],
    Hard: [
      'Explain MVCC and how PostgreSQL implements it.',
      'How would you design a sharding strategy for a large database?',
      'Describe query execution plans and cost-based optimization.',
      'Explain CAP theorem and its implications for distributed databases.',
    ],
  },
  'Machine Learning': {
    Easy: [
      'What is the difference between supervised and unsupervised learning?',
      'Explain overfitting and how to prevent it.',
      'What is the bias-variance tradeoff?',
      'Explain precision, recall, and F1-score.',
    ],
    Medium: [
      'Explain gradient descent and its variants.',
      'What is cross-validation and why is it important?',
      'Explain the difference between bagging and boosting.',
      'How do CNNs work and what are their key components?',
    ],
    Hard: [
      'Explain the transformer architecture and attention mechanism.',
      'How would you handle class imbalance in deep learning?',
      'Describe backpropagation through time in RNNs.',
      'Explain federated learning and its privacy guarantees.',
    ],
  },
  Cybersecurity: {
    Easy: [
      'What is the difference between symmetric and asymmetric encryption?',
      'Explain the OWASP Top 10 and common vulnerabilities.',
      'What is a man-in-the-middle attack and how to prevent it?',
      'Explain the principle of least privilege.',
    ],
    Medium: [
      'How does TLS/SSL handshake work?',
      'Explain XSS and CSRF attacks with mitigation strategies.',
      'What is a zero-knowledge proof and how does it work?',
      'Describe the difference between IDS and IPS.',
    ],
    Hard: [
      'Explain side-channel attacks and countermeasures.',
      'How would you design a secure key management system?',
      'Describe blockchain consensus mechanisms and their security.',
      'Explain homomorphic encryption and its practical applications.',
    ],
  },
  'Data Structures & Algorithms': {
    Easy: [
      'What is the time complexity of binary search?',
      'Explain the difference between an array and a linked list.',
      'What is a hash table and how does it handle collisions?',
      'Explain stack and queue data structures.',
    ],
    Medium: [
      'Explain Dijkstra\'s algorithm and when to use it.',
      'How would you detect a cycle in a linked list?',
      'Explain dynamic programming with the knapsack problem.',
      'What is a balanced binary search tree and why is it important?',
    ],
    Hard: [
      'Explain segment trees and lazy propagation.',
      'How would you solve the traveling salesman problem optimally?',
      'Describe persistent data structures and their applications.',
      'Explain suffix arrays and their construction algorithms.',
    ],
  },
  'System Design': {
    Easy: [
      'What are the key components of a REST API?',
      'Explain horizontal vs vertical scaling.',
      'What is caching and what are common caching strategies?',
      'Describe the CAP theorem in simple terms.',
    ],
    Medium: [
      'How would you design a URL shortener service?',
      'Explain load balancing algorithms and their tradeoffs.',
      'Design a real-time chat application architecture.',
      'What is eventual consistency and when is it acceptable?',
    ],
    Hard: [
      'Design a distributed consensus protocol like Raft.',
      'How would you build a globally distributed database?',
      'Design a video streaming platform like Netflix.',
      'Explain the architecture of a search engine like Elasticsearch.',
    ],
  },
};

export function getQuestions(category: InterviewCategory, difficulty: Difficulty): InterviewQuestion[] {
  const rawQuestions = questionBank[category]?.[difficulty] ?? [];
  return rawQuestions.map((q, i) => ({
    id: `${category}-${difficulty}-${i}`,
    category,
    difficulty,
    question: q,
    created_at: new Date().toISOString(),
  }));
}

export function evaluateAnswer(_question: string, answer: string) {
  const answerLength = answer.trim().length;
  let score = 50;
  let feedback = '';
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (answerLength < 20) {
    score = Math.min(score, 30);
    weaknesses.push('Answer was too brief');
    suggestions.push('Provide more detail and context in your answers');
    feedback = 'Your answer was quite brief. Try to elaborate more on the concepts.';
  } else if (answerLength < 80) {
    score = Math.min(score, 55);
    weaknesses.push('Answer could be more comprehensive');
    suggestions.push('Expand on key points with examples');
    feedback = 'Good start, but your answer could benefit from more depth and examples.';
  } else {
    score = Math.min(70 + Math.floor(answerLength / 20), 95);
    strengths.push('Answer was well-structured');
    feedback = 'Well-structured answer with good coverage of the topic.';
  }

  const technicalTerms = [
    'algorithm', 'complexity', 'optimization', 'performance', 'scalability',
    'architecture', 'design pattern', 'data structure', 'framework', 'library',
    'runtime', 'compiler', 'interpreter', 'memory', 'thread', 'process',
    'async', 'synchronous', 'callback', 'promise', 'event loop',
    'index', 'query', 'transaction', 'normalization', 'join',
    'neural network', 'gradient', 'loss function', 'overfitting', 'training',
    'encryption', 'hashing', 'authentication', 'authorization', 'token',
    'load balancer', 'cache', 'CDN', 'microservice', 'container',
  ];

  const usedTerms = technicalTerms.filter(term => answer.toLowerCase().includes(term));
  if (usedTerms.length >= 3) {
    score = Math.min(score + 5, 98);
    strengths.push('Good use of technical terminology');
  }

  if (answer.includes('for example') || answer.includes('e.g.') || answer.includes('such as')) {
    score = Math.min(score + 3, 98);
    strengths.push('Included practical examples');
  } else {
    weaknesses.push('Could benefit from concrete examples');
    suggestions.push('Include real-world examples to illustrate your points');
  }

  if (answer.includes('however') || answer.includes('but') || answer.includes('tradeoff') || answer.includes('advantage') || answer.includes('disadvantage')) {
    score = Math.min(score + 2, 98);
    strengths.push('Demonstrated balanced thinking');
  } else {
    suggestions.push('Consider discussing tradeoffs and edge cases');
  }

  if (strengths.length === 0) strengths.push('Attempted to answer the question');
  if (weaknesses.length === 0) weaknesses.push('Could provide more depth');
  if (suggestions.length === 0) suggestions.push('Practice explaining concepts out loud');

  return {
    score: Math.min(Math.max(score, 0), 100),
    feedback,
    strengths,
    weaknesses,
    improvement_suggestions: suggestions,
  };
}
