/**
 * ==========================================================================
 * DATA: BEGINNER-FRIENDLY FRONTEND PROJECTS
 * Simple, practical web applications for learning and portfolio practice.
 * ==========================================================================
 */

export const PROJECTS_DATA = [
  {
    id: 'weather-app',
    title: 'Simple Weather App',
    category: 'Frontend / API Integration',
    year: '2026',
    role: 'Frontend Developer',
    shortDesc: 'A clean web app that fetches and displays current weather conditions and 5-day forecasts for any city using a public weather API.',
    fullDesc: 'This beginner-friendly project demonstrates how to work with client-side fetch requests and simple UI states. Users can search for any city, view current weather details like temperature and conditions, and browse a clear 5-day forecast. It focuses on readable JavaScript, responsive layout, and integrating a public weather API into a polished frontend.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Fetch API'],
    image: './assets/images/projects/project-1.svg',
    liveUrl: 'https://github.com/aavashregmi',
    repoUrl: 'https://github.com/aavashregmi',
    highlights: [
      'Fetches live weather data for any user-entered city',
      'Displays current conditions and a simple 5-day forecast layout',
      'Uses readable, beginner-friendly JavaScript for API calls and UI updates'
    ]
  },
  {
    id: 'todo-list-manager',
    title: 'Todo List & Task Manager',
    category: 'Frontend / Productivity',
    year: '2026',
    role: 'Frontend Developer',
    shortDesc: 'A responsive local-storage-powered task manager allowing users to add, complete, filter, and delete daily tasks.',
    fullDesc: 'This project is a practical exercise in browser state management and DOM updates. Tasks are stored in localStorage so they persist after refresh, and users can add new items, mark them complete, filter by status, and remove tasks when finished. The interface is intentionally simple and responsive to make the logic easy to understand and build on.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    image: './assets/images/projects/project-2.svg',
    liveUrl: 'https://github.com/aavashregmi',
    repoUrl: 'https://github.com/aavashregmi',
    highlights: [
      'Stores tasks locally so data persists across browser refreshes',
      'Supports add, complete, filter, and delete task actions',
      'Responsive layout built with simple HTML, CSS, and JavaScript patterns'
    ]
  },
  {
    id: 'learn-nepali-vibe',
    title: 'Learn Nepali with a Local Vibe',
    category: 'Frontend / Fun & Education',
    year: '2026',
    role: 'Frontend Developer',
    shortDesc: 'An interactive, humorous web app teaching practical Nepali slang and conversational phrases with built-in free browser audio speech.',
    fullDesc: 'A 100% free, zero-dependency language-learning web app built for beginners. It avoids corporate AI robot vibes by offering real-life conversational phrases, humorous contextual tips, and native browser text-to-speech audio pronunciation so users can learn Nepali smoothly and naturally.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Web Speech API'],
    image: './assets/images/projects/project-3.svg',
    liveUrl: 'https://github.com/aavashregmi',
    repoUrl: 'https://github.com/aavashregmi',
    highlights: [
      'Delivers practical Nepali phrases combined with funny, real-life context',
      'Uses the 100% free browser Web Speech API for native audio pronunciation',
      'Clean interactive UI designed to fit right into your modular portfolio framework'
    ]
  }
];