import { useState, useEffect, useRef, useCallback, useReducer } from "react";

// ═══════════════════════════════════════════════════════════════
// PRO GIT — AI TEACHER
// Knowledge base: Pro Git by Scott Chacon & Ben Straub
// ═══════════════════════════════════════════════════════════════

// ── Curriculum Data ──────────────────────────────────────────
const CURRICULUM = [
  {
    id: "ch1",
    title: "Getting Started",
    icon: "🚀",
    difficulty: "beginner",
    topics: [
      { id: "ch1-1", title: "About Version Control", keywords: ["vcs", "local", "centralized", "distributed"], prereqs: [] },
      { id: "ch1-2", title: "A Short History of Git", keywords: ["linux", "linus", "bitkeeper"], prereqs: ["ch1-1"] },
      { id: "ch1-3", title: "What is Git?", keywords: ["snapshots", "integrity", "three states"], prereqs: ["ch1-1"] },
      { id: "ch1-4", title: "Installing Git", keywords: ["install", "linux", "mac", "windows"], prereqs: ["ch1-3"] },
      { id: "ch1-5", title: "First-Time Git Setup", keywords: ["config", "identity", "editor"], prereqs: ["ch1-4"] },
      { id: "ch1-6", title: "Getting Help", keywords: ["help", "man", "manual"], prereqs: ["ch1-4"] },
    ],
  },
  {
    id: "ch2",
    title: "Git Basics",
    icon: "📦",
    difficulty: "beginner",
    topics: [
      { id: "ch2-1", title: "Getting a Git Repository", keywords: ["init", "clone"], prereqs: ["ch1-5"] },
      { id: "ch2-2", title: "Recording Changes", keywords: ["add", "commit", "status", "diff", "staging"], prereqs: ["ch2-1"] },
      { id: "ch2-3", title: "Viewing Commit History", keywords: ["log", "format", "filter"], prereqs: ["ch2-2"] },
      { id: "ch2-4", title: "Undoing Things", keywords: ["amend", "reset", "restore", "checkout"], prereqs: ["ch2-2"] },
      { id: "ch2-5", title: "Working with Remotes", keywords: ["remote", "fetch", "push", "pull"], prereqs: ["ch2-2"] },
      { id: "ch2-6", title: "Tagging", keywords: ["tag", "annotated", "lightweight"], prereqs: ["ch2-3"] },
      { id: "ch2-7", title: "Git Aliases", keywords: ["alias", "shortcut"], prereqs: ["ch2-2"] },
    ],
  },
  {
    id: "ch3",
    title: "Git Branching",
    icon: "🌿",
    difficulty: "intermediate",
    topics: [
      { id: "ch3-1", title: "Branches in a Nutshell", keywords: ["branch", "pointer", "HEAD"], prereqs: ["ch2-2"] },
      { id: "ch3-2", title: "Basic Branching & Merging", keywords: ["merge", "fast-forward", "conflict"], prereqs: ["ch3-1"] },
      { id: "ch3-3", title: "Branch Management", keywords: ["list", "delete", "merged"], prereqs: ["ch3-2"] },
      { id: "ch3-4", title: "Branching Workflows", keywords: ["long-running", "topic", "feature"], prereqs: ["ch3-3"] },
      { id: "ch3-5", title: "Remote Branches", keywords: ["tracking", "upstream", "origin"], prereqs: ["ch2-5", "ch3-1"] },
      { id: "ch3-6", title: "Rebasing", keywords: ["rebase", "interactive", "squash"], prereqs: ["ch3-2"] },
    ],
  },
  {
    id: "ch4",
    title: "Git on the Server",
    icon: "🖥️",
    difficulty: "intermediate",
    topics: [
      { id: "ch4-1", title: "The Protocols", keywords: ["local", "http", "ssh", "git protocol"], prereqs: ["ch2-5"] },
      { id: "ch4-2", title: "Setting Up a Server", keywords: ["bare", "ssh", "authorized_keys"], prereqs: ["ch4-1"] },
      { id: "ch4-3", title: "GitLab & GitWeb", keywords: ["gitlab", "gitweb", "web interface"], prereqs: ["ch4-1"] },
    ],
  },
  {
    id: "ch5",
    title: "Distributed Git",
    icon: "🌐",
    difficulty: "intermediate",
    topics: [
      { id: "ch5-1", title: "Distributed Workflows", keywords: ["centralized", "integration-manager", "dictator"], prereqs: ["ch3-5"] },
      { id: "ch5-2", title: "Contributing to a Project", keywords: ["commit guidelines", "patch", "format-patch"], prereqs: ["ch5-1"] },
      { id: "ch5-3", title: "Maintaining a Project", keywords: ["apply", "cherry-pick", "release"], prereqs: ["ch5-2"] },
    ],
  },
  {
    id: "ch6",
    title: "GitHub",
    icon: "🐙",
    difficulty: "intermediate",
    topics: [
      { id: "ch6-1", title: "Account Setup", keywords: ["ssh keys", "avatar", "email"], prereqs: ["ch1-5"] },
      { id: "ch6-2", title: "Contributing (PRs)", keywords: ["fork", "pull request", "review"], prereqs: ["ch3-5", "ch6-1"] },
      { id: "ch6-3", title: "Maintaining a Project", keywords: ["issues", "labels", "milestones"], prereqs: ["ch6-2"] },
      { id: "ch6-4", title: "Organizations & Scripting", keywords: ["team", "api", "webhooks"], prereqs: ["ch6-3"] },
    ],
  },
  {
    id: "ch7",
    title: "Git Tools",
    icon: "🔧",
    difficulty: "advanced",
    topics: [
      { id: "ch7-1", title: "Revision Selection", keywords: ["reflog", "ancestry", "range"], prereqs: ["ch2-3"] },
      { id: "ch7-2", title: "Interactive Staging", keywords: ["patch", "hunk", "interactive"], prereqs: ["ch2-2"] },
      { id: "ch7-3", title: "Stashing & Cleaning", keywords: ["stash", "clean", "save"], prereqs: ["ch2-2"] },
      { id: "ch7-4", title: "Rewriting History", keywords: ["amend", "filter-branch", "interactive rebase"], prereqs: ["ch3-6"] },
      { id: "ch7-5", title: "Reset Demystified", keywords: ["soft", "mixed", "hard", "three trees"], prereqs: ["ch2-4"] },
      { id: "ch7-6", title: "Advanced Merging", keywords: ["ours", "theirs", "subtree"], prereqs: ["ch3-2"] },
      { id: "ch7-7", title: "Submodules", keywords: ["submodule", "nested", "super project"], prereqs: ["ch2-5"] },
    ],
  },
  {
    id: "ch8",
    title: "Customizing Git",
    icon: "⚙️",
    difficulty: "advanced",
    topics: [
      { id: "ch8-1", title: "Git Configuration", keywords: ["config", "core", "color", "mergetool"], prereqs: ["ch1-5"] },
      { id: "ch8-2", title: "Git Attributes", keywords: ["filter", "diff", "merge strategy", "export-ignore"], prereqs: ["ch8-1"] },
      { id: "ch8-3", title: "Git Hooks", keywords: ["pre-commit", "post-commit", "server-side"], prereqs: ["ch8-1"] },
    ],
  },
  {
    id: "ch9",
    title: "Git Internals",
    icon: "🔬",
    difficulty: "advanced",
    topics: [
      { id: "ch9-1", title: "Plumbing & Porcelain", keywords: ["plumbing", "porcelain", "low-level"], prereqs: ["ch2-2"] },
      { id: "ch9-2", title: "Git Objects", keywords: ["blob", "tree", "commit", "sha-1"], prereqs: ["ch9-1"] },
      { id: "ch9-3", title: "Git References", keywords: ["refs", "HEAD", "tags"], prereqs: ["ch9-2"] },
      { id: "ch9-4", title: "Packfiles & Transfer", keywords: ["pack", "delta", "smart http"], prereqs: ["ch9-2"] },
    ],
  },
];

// ── Question Bank ────────────────────────────────────────────
const QUESTION_BANK = {
  "ch1-1": [
    { type: "mc", q: "What type of version control system is Git?", options: ["Local", "Centralized", "Distributed", "Cloud-based"], answer: 2, explanation: "Git is a Distributed Version Control System (DVCS). Every developer has a full copy of the repository, including its complete history." },
    { type: "mc", q: "What problem does version control solve?", options: ["Making code run faster", "Tracking changes over time", "Compiling code automatically", "Hosting websites"], answer: 1, explanation: "Version control systems record changes to files over time so you can recall specific versions later." },
    { type: "open", q: "In your own words, explain the difference between centralized and distributed version control systems.", rubric: ["single server vs full copies", "network dependency", "redundancy/backup advantage"] },
    { type: "fill", q: "In a ___ version control system, every clone is a full backup of the repository.", answer: "distributed" },
  ],
  "ch1-3": [
    { type: "mc", q: "How does Git think about its data?", options: ["As a list of file-based changes (deltas)", "As a stream of snapshots", "As compressed archives", "As database entries"], answer: 1, explanation: "Git thinks of its data as a series of snapshots of a miniature filesystem. Every commit is essentially a snapshot of all your files at that moment." },
    { type: "mc", q: "What are the three main states a file can be in with Git?", options: ["Created, Modified, Deleted", "Modified, Staged, Committed", "Tracked, Untracked, Ignored", "Local, Remote, Cached"], answer: 1, explanation: "The three states are: Modified (changed but not committed), Staged (marked for the next commit), and Committed (safely stored in the database)." },
    { type: "fill", q: "Git uses a ___ checksum to ensure data integrity for every piece of stored data.", answer: "SHA-1" },
    { type: "open", q: "Explain what 'the three states' in Git mean and how they relate to the working tree, staging area, and .git directory.", rubric: ["modified/staged/committed", "working tree", "staging area (index)", ".git directory"] },
  ],
  "ch2-1": [
    { type: "mc", q: "Which command initializes a new Git repository?", options: ["git start", "git init", "git create", "git new"], answer: 1, explanation: "git init creates a new .git subdirectory in your current directory, which contains all necessary repository files." },
    { type: "mc", q: "What does `git clone` do?", options: ["Creates an empty repository", "Downloads only the latest version", "Gets a full copy of all repository data", "Creates a branch"], answer: 2, explanation: "git clone gets a full copy of nearly all data that the server has. Every version of every file is pulled down." },
    { type: "fill", q: "The command `git ___` creates a copy of an existing repository.", answer: "clone" },
  ],
  "ch2-2": [
    { type: "mc", q: "What does `git add` do?", options: ["Creates a new file", "Stages content for the next commit", "Pushes changes to remote", "Commits changes"], answer: 1, explanation: "git add is a multipurpose command — it stages new files, stages modifications, and can mark merge-conflicted files as resolved." },
    { type: "mc", q: "What does `git status` show?", options: ["Commit history", "The state of files in working directory and staging area", "Remote repository info", "Branch differences"], answer: 1, explanation: "git status shows which files are tracked, untracked, modified, or staged for commit." },
    { type: "fill", q: "To see what you've changed but not yet staged, use `git ___`.", answer: "diff" },
    { type: "open", q: "Describe the lifecycle of a file in a Git repository, from untracked to committed.", rubric: ["untracked", "tracked (unmodified)", "modified", "staged", "committed"] },
  ],
  "ch3-1": [
    { type: "mc", q: "What is a branch in Git?", options: ["A copy of the repository", "A lightweight movable pointer to a commit", "A separate working directory", "A remote connection"], answer: 1, explanation: "A branch in Git is simply a lightweight movable pointer to one of the commits. The default branch is called 'master' or 'main'." },
    { type: "mc", q: "What is HEAD in Git?", options: ["The first commit", "A pointer to the current branch", "The remote server", "The staging area"], answer: 1, explanation: "HEAD is a special pointer that indicates which branch you're currently on. It points to the local branch you're currently working on." },
    { type: "fill", q: "To create a new branch called 'testing', you run `git ___ testing`.", answer: "branch" },
  ],
  "ch3-2": [
    { type: "mc", q: "What is a fast-forward merge?", options: ["A merge that creates a new commit", "Moving the pointer forward because there's no divergent work", "A merge using rebase", "A forced push"], answer: 1, explanation: "When the commit pointed to by the branch you merge in is directly ahead of the commit you're on, Git simply moves the pointer forward. This is a fast-forward." },
    { type: "mc", q: "When do merge conflicts occur?", options: ["Every time you merge", "When two branches modify the same part of the same file", "When you merge a remote branch", "When the repository is too large"], answer: 1, explanation: "Merge conflicts happen when the same part of the same file has been modified differently in two branches being merged." },
    { type: "open", q: "Explain how you would resolve a merge conflict in Git.", rubric: ["identify conflicted files", "edit conflict markers", "git add to mark resolved", "git commit to finish"] },
  ],
  "ch3-6": [
    { type: "mc", q: "What does rebasing do?", options: ["Deletes a branch", "Replays commits on top of another base", "Merges two repositories", "Creates a tag"], answer: 1, explanation: "Rebasing takes the changes from one branch and replays them on top of another. It produces a cleaner, linear history." },
    { type: "mc", q: "What is the golden rule of rebasing?", options: ["Always rebase before merging", "Never rebase public/shared branches", "Only rebase the main branch", "Rebase after every commit"], answer: 1, explanation: "Do not rebase commits that exist outside your repository and that people may have based work on. Rebasing rewrites history." },
    { type: "fill", q: "The command `git rebase -i` enables ___ rebasing, allowing you to squash or reorder commits.", answer: "interactive" },
  ],
  "ch7-5": [
    { type: "mc", q: "What are the 'Three Trees' of Git's reset?", options: ["Branches, Tags, Remotes", "HEAD, Index, Working Directory", "Staging, Committing, Pushing", "Local, Remote, Origin"], answer: 1, explanation: "Git manages three trees: HEAD (last commit snapshot), the Index (proposed next commit / staging area), and the Working Directory (sandbox)." },
    { type: "mc", q: "What does `git reset --soft HEAD~` do?", options: ["Removes the last commit and all changes", "Moves HEAD back, keeps changes staged", "Moves HEAD back, unstages changes", "Deletes the branch"], answer: 1, explanation: "--soft moves HEAD to the specified commit but leaves Index and Working Directory unchanged. Changes remain staged." },
    { type: "fill", q: "`git reset --___` moves HEAD back and also resets the staging area but leaves working directory intact.", answer: "mixed" },
  ],
  "ch9-2": [
    { type: "mc", q: "What are the main types of Git objects?", options: ["File, Folder, Link", "Blob, Tree, Commit, Tag", "Source, Binary, Config", "Text, Image, Data"], answer: 1, explanation: "Git uses four types of objects: blobs (file content), trees (directory listings), commits (snapshots with metadata), and tags (named references)." },
    { type: "fill", q: "A Git ___ object stores the contents of a file.", answer: "blob" },
    { type: "open", q: "Explain the relationship between blob, tree, and commit objects in Git's internal storage.", rubric: ["blob stores content", "tree maps names to blobs/trees", "commit points to tree + metadata + parent"] },
  ],
};

// Add default questions for topics without specific ones
CURRICULUM.forEach((ch) => {
  ch.topics.forEach((t) => {
    if (!QUESTION_BANK[t.id]) {
      QUESTION_BANK[t.id] = [
        { type: "open", q: `Explain the key concepts of "${t.title}" in your own words.`, rubric: t.keywords },
        { type: "mc", q: `Which of the following is most closely related to "${t.title}"?`, options: [...t.keywords.slice(0, 3).map(k => k.charAt(0).toUpperCase() + k.slice(1)), "None of the above"], answer: 0, explanation: `The concept "${t.title}" is closely related to: ${t.keywords.join(", ")}.` },
      ];
    }
  });
});

// ── Lesson Content (AI-generated from knowledge base) ───────
const LESSON_CONTENT = {
  "ch1-1": {
    title: "About Version Control",
    sections: [
      {
        heading: "What is Version Control?",
        content: `Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later. Think of it like a time machine for your code — you can go back to any point in history.`,
        analogy: `Imagine writing a book. Without version control, you'd save copies like "book_v1.doc", "book_v2_final.doc", "book_v2_REALLY_final.doc". Version control automates this perfectly.`,
        code: null,
      },
      {
        heading: "Local Version Control",
        content: `The simplest form: a local database on your computer that keeps all changes to files under revision control. RCS is a classic example — it keeps patch sets (differences) on disk.`,
        analogy: `Like keeping a personal diary of every change you made — useful for you, but impossible to share.`,
        code: null,
      },
      {
        heading: "Centralized Version Control (CVCS)",
        content: `A single server contains all versioned files, and clients check out files from that central place. Examples: CVS, Subversion, Perforce. Advantage: everyone knows what others are doing. Downside: single point of failure.`,
        analogy: `Like a library with one copy of each book — great until the library burns down.`,
        code: null,
      },
      {
        heading: "Distributed Version Control (DVCS)",
        content: `Every clone is a full backup of the repository with complete history. If the server dies, any client repository can restore it. Git, Mercurial, and Bazaar are examples. This is what Git uses.`,
        analogy: `Instead of one library, every reader has a complete copy of every book. If one house burns down, the books survive everywhere else.`,
        code: null,
      },
    ],
  },
  "ch1-3": {
    title: "What is Git?",
    sections: [
      {
        heading: "Snapshots, Not Differences",
        content: `Most other VCS store information as a list of file-based changes (deltas). Git instead thinks of data as a stream of snapshots. Every time you commit, Git takes a picture of all your files and stores a reference to that snapshot. If a file hasn't changed, Git just links to the previous identical file.`,
        analogy: `Other VCS are like tracking "what changed in each chapter." Git is like taking a photo of the entire book every time you make any edit.`,
        code: null,
      },
      {
        heading: "Nearly Every Operation Is Local",
        content: `Most Git operations only need local files and resources — no information from another computer is needed. You can browse history, see diffs, and commit changes even while offline.`,
        analogy: `Like having a complete encyclopedia at home vs. needing to call the library for every question.`,
        code: null,
      },
      {
        heading: "Git Has Integrity",
        content: `Everything in Git is checksummed before it is stored and then referred to by that checksum. The mechanism Git uses is called a SHA-1 hash — a 40-character hexadecimal string. It's impossible to change the contents of any file or directory without Git knowing about it.`,
        analogy: `Every piece of data gets a unique fingerprint. If even one byte changes, the fingerprint changes completely.`,
        code: `# Example SHA-1 hash:\n24b9da6552252987aa493b52f8696cd6d3b00373`,
      },
      {
        heading: "The Three States",
        content: `Git has three main states for your files: Modified (changed but not committed), Staged (marked for the next commit), and Committed (safely stored). This gives you the working tree, staging area (index), and Git directory (.git).`,
        analogy: `Think of it as: your desk (working tree) → your outbox (staging area) → the filing cabinet (committed). You work at the desk, put finished items in the outbox, then file them permanently.`,
        code: `# See the state of your files:\ngit status\n\n# Move from modified → staged:\ngit add myfile.txt\n\n# Move from staged → committed:\ngit commit -m "Save my changes"`,
      },
    ],
  },
  "ch2-2": {
    title: "Recording Changes to the Repository",
    sections: [
      {
        heading: "The File Lifecycle",
        content: `Each file in your working directory can be in one of two states: tracked or untracked. Tracked files can be unmodified, modified, or staged. When you first clone, all files are tracked and unmodified.`,
        analogy: `Files are either "in the system" (tracked) or "strangers" (untracked). Tracked files go through a cycle: clean → edited → ready to save → saved.`,
        code: null,
      },
      {
        heading: "Checking Status & Staging",
        content: `Use 'git status' to see file states. Use 'git add' to stage files — this is a multipurpose command: track new files, stage modifications, and mark merge-conflicted files as resolved.`,
        analogy: null,
        code: `# Check what's going on:\ngit status\n\n# Stage a specific file:\ngit add README.md\n\n# Stage all changes:\ngit add .\n\n# Short status format:\ngit status -s`,
      },
      {
        heading: "Viewing Changes with Diff",
        content: `'git diff' shows exactly what you changed, not just which files. Without arguments it shows unstaged changes. 'git diff --staged' shows what's staged for the next commit.`,
        analogy: null,
        code: `# What changed but not staged:\ngit diff\n\n# What's staged for next commit:\ngit diff --staged\n\n# Diff between any two commits:\ngit diff abc123..def456`,
      },
      {
        heading: "Committing Your Changes",
        content: `When your staging area is set up, you commit with 'git commit'. Remember: anything not staged won't go into the commit. The -m flag lets you type a message inline.`,
        analogy: `Committing is like sealing an envelope and putting it in the filing cabinet. Only what you put in the envelope (staged) gets filed.`,
        code: `# Commit with a message:\ngit commit -m "Fix login bug"\n\n# Skip staging (auto-add tracked modified):\ngit commit -a -m "Quick fix"\n\n# Remove a file:\ngit rm old_file.txt\n\n# Rename/move a file:\ngit mv old_name.txt new_name.txt`,
      },
    ],
  },
  "ch3-1": {
    title: "Branches in a Nutshell",
    sections: [
      {
        heading: "What is a Branch?",
        content: `A branch in Git is simply a lightweight movable pointer to a commit. The default branch name is 'master' (or 'main'). As you make commits, the branch pointer moves forward automatically. Creating a new branch creates a new pointer for you to move around.`,
        analogy: `Branches are like bookmarks in a book. You can have many bookmarks pointing to different pages, and move them freely.`,
        code: `# Create a new branch:\ngit branch testing\n\n# This creates a new pointer to the current commit\n# HEAD still points to master`,
      },
      {
        heading: "HEAD — The Special Pointer",
        content: `HEAD is a special pointer that tells Git which branch you're currently on. When you create a branch, it doesn't automatically switch to it.`,
        analogy: `If branches are bookmarks, HEAD is "the page you're currently reading." You can have 10 bookmarks but you're only reading one page.`,
        code: `# Switch to the testing branch:\ngit checkout testing\n# or modern way:\ngit switch testing\n\n# Create AND switch in one step:\ngit checkout -b new-feature\n# or:\ngit switch -c new-feature`,
      },
      {
        heading: "Diverging Branches",
        content: `When you commit on different branches, the history diverges. Each branch has its own line of development. This is what makes branching so powerful — you can experiment freely and merge later.`,
        analogy: `Like a "choose your own adventure" book where you can explore multiple paths simultaneously and combine the best parts later.`,
        code: `# See all branches and where they point:\ngit log --oneline --decorate --graph --all`,
      },
    ],
  },
};

// ── SRS Engine ───────────────────────────────────────────────
function calculateNextReview(difficulty, repetitions) {
  // Simplified SM-2 algorithm
  const intervals = [1, 3, 7, 14, 30, 60];
  const idx = Math.min(repetitions, intervals.length - 1);
  let interval = intervals[idx];
  if (difficulty === "hard") interval = Math.max(1, Math.floor(interval * 0.5));
  if (difficulty === "easy") interval = Math.floor(interval * 1.5);
  return interval;
}

// ── Sentiment Analysis (Simple) ─────────────────────────────
function analyzeSentiment(text) {
  const lower = text.toLowerCase();
  const frustrated = ["confused", "don't understand", "makes no sense", "hate", "ugh", "frustrated", "stuck", "lost", "help", "what??", "???", "idk", "no idea"];
  const bored = ["boring", "easy", "already know", "too slow", "skip", "next", "whatever", "meh"];
  const confident = ["got it", "makes sense", "understand", "easy", "clear", "awesome", "great", "cool", "love it", "perfect"];

  if (frustrated.some((w) => lower.includes(w))) return "frustrated";
  if (bored.some((w) => lower.includes(w))) return "bored";
  if (confident.some((w) => lower.includes(w))) return "confident";
  return "neutral";
}

// ── State Reducer ────────────────────────────────────────────
const initialState = {
  screen: "welcome", // welcome, dashboard, lesson, quiz, review, settings
  studentName: "",
  experience: "beginner", // beginner, intermediate, advanced
  learningStyle: "balanced", // visual, technical, analogies, balanced
  currentTopic: null,
  currentChapter: null,
  mastery: {}, // topicId: { level: 0-100, attempts: 0, lastReview: null, nextReview: null }
  quizState: null, // { questions, currentIdx, answers, score }
  lessonProgress: {}, // topicId: { sectionIdx, completed }
  streak: 0,
  totalXP: 0,
  dailyWarmup: null,
  chatHistory: [],
  srsQueue: [],
  sentimentHistory: [],
  settings: { pace: "normal", socraticMode: false, notifications: true },
  showKnowledgeTree: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.payload };
    case "SET_STUDENT":
      return { ...state, studentName: action.payload.name, experience: action.payload.experience, learningStyle: action.payload.style, screen: "dashboard" };
    case "SET_TOPIC": {
      const ch = CURRICULUM.find((c) => c.topics.some((t) => t.id === action.payload));
      return { ...state, currentTopic: action.payload, currentChapter: ch?.id, screen: "lesson" };
    }
    case "UPDATE_MASTERY": {
      const { topicId, score, difficulty } = action.payload;
      const prev = state.mastery[topicId] || { level: 0, attempts: 0, lastReview: null, nextReview: null };
      const newLevel = Math.min(100, prev.level + score);
      const reps = prev.attempts + 1;
      const nextDays = calculateNextReview(difficulty || "normal", reps);
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + nextDays);
      return {
        ...state,
        mastery: {
          ...state.mastery,
          [topicId]: { level: newLevel, attempts: reps, lastReview: new Date().toISOString(), nextReview: nextReview.toISOString() },
        },
        totalXP: state.totalXP + Math.round(score / 2),
      };
    }
    case "COMPLETE_QUIZ": {
      const { score, total } = action.payload;
      const pct = Math.round((score / total) * 100);
      return { ...state, quizState: { ...state.quizState, completed: true, finalScore: pct }, streak: pct >= 70 ? state.streak + 1 : 0 };
    }
    case "SET_QUIZ":
      return { ...state, quizState: action.payload, screen: "quiz" };
    case "UPDATE_QUIZ":
      return { ...state, quizState: { ...state.quizState, ...action.payload } };
    case "ADD_CHAT":
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case "SET_LESSON_PROGRESS":
      return { ...state, lessonProgress: { ...state.lessonProgress, [action.payload.topicId]: action.payload } };
    case "TOGGLE_KNOWLEDGE_TREE":
      return { ...state, showKnowledgeTree: !state.showKnowledgeTree };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "ADD_SENTIMENT":
      return { ...state, sentimentHistory: [...state.sentimentHistory.slice(-20), action.payload] };
    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── Fonts & Theme ────────────────────────────────────────────
const theme = {
  bg: "#0a0e17",
  bgCard: "#111827",
  bgCardHover: "#1a2332",
  bgSurface: "#0d1321",
  accent: "#22d3ee",
  accentDim: "rgba(34,211,238,0.12)",
  accentGlow: "rgba(34,211,238,0.25)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.12)",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,0.12)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.12)",
  purple: "#a78bfa",
  purpleDim: "rgba(167,139,250,0.12)",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  border: "rgba(148,163,184,0.1)",
  borderAccent: "rgba(34,211,238,0.3)",
};

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');`;

// ── Welcome Screen ───────────────────────────────────────────
function WelcomeScreen({ dispatch }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [style, setStyle] = useState("balanced");

  const experiences = [
    { id: "beginner", label: "Complete Beginner", desc: "Never used Git before", icon: "🌱" },
    { id: "intermediate", label: "Some Experience", desc: "Used basic commands", icon: "🌿" },
    { id: "advanced", label: "Experienced", desc: "Want to master advanced topics", icon: "🌳" },
  ];

  const styles = [
    { id: "analogies", label: "Analogies & Stories", desc: "Learn through real-world comparisons", icon: "📖" },
    { id: "technical", label: "Technical & Detailed", desc: "Straight to the code and specs", icon: "⚡" },
    { id: "visual", label: "Visual & Step-by-Step", desc: "Diagrams, breakdowns, examples", icon: "🎨" },
    { id: "balanced", label: "Mix of Everything", desc: "A bit of all approaches", icon: "🎯" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(167,139,250,0.06) 0%, transparent 50%), ${theme.bg}`, padding: 20 }}>
      <div style={{ maxWidth: 560, width: "100%", animation: "fadeSlideUp 0.6s ease" }}>
        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16, filter: "drop-shadow(0 0 20px rgba(34,211,238,0.4))" }}>⚡</div>
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: 36, fontWeight: 800, color: theme.text, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Pro Git <span style={{ color: theme.accent }}>Academy</span>
            </h1>
            <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, color: theme.textDim, margin: "0 0 40px", lineHeight: 1.6 }}>
              Your AI-powered tutor for mastering Git.<br />Adaptive lessons, quizzes, spaced repetition & more.
            </p>
            <div style={{ marginBottom: 24 }}>
              <input
                type="text"
                placeholder="What's your name?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(1)}
                style={{ width: "100%", maxWidth: 320, padding: "14px 20px", borderRadius: 12, border: `1px solid ${theme.borderAccent}`, background: theme.bgCard, color: theme.text, fontSize: 16, fontFamily: "Outfit, sans-serif", outline: "none", textAlign: "center", boxSizing: "border-box" }}
              />
            </div>
            <button
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              style={{ padding: "14px 48px", borderRadius: 12, border: "none", background: name.trim() ? `linear-gradient(135deg, ${theme.accent}, #06b6d4)` : theme.bgCard, color: name.trim() ? theme.bg : theme.textMuted, fontSize: 16, fontWeight: 600, fontFamily: "Outfit, sans-serif", cursor: name.trim() ? "pointer" : "default", transition: "all 0.3s", boxShadow: name.trim() ? `0 4px 20px ${theme.accentGlow}` : "none" }}
            >
              Get Started →
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: theme.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Step 1 of 2</p>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: 26, fontWeight: 700, color: theme.text, margin: "0 0 8px" }}>
              Hey {name}! What's your Git experience?
            </h2>
            <p style={{ fontFamily: "Outfit, sans-serif", color: theme.textDim, margin: "0 0 28px", fontSize: 15 }}>This helps me tailor the curriculum to your level.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => { setExperience(exp.id); setStep(2); }}
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 14, border: `1px solid ${experience === exp.id ? theme.borderAccent : theme.border}`, background: experience === exp.id ? theme.accentDim : theme.bgCard, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                >
                  <span style={{ fontSize: 28 }}>{exp.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, color: theme.text }}>{exp.label}</div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: theme.textDim }}>{exp.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: theme.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Step 2 of 2</p>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: 26, fontWeight: 700, color: theme.text, margin: "0 0 8px" }}>How do you learn best?</h2>
            <p style={{ fontFamily: "Outfit, sans-serif", color: theme.textDim, margin: "0 0 28px", fontSize: 15 }}>I'll adapt my teaching style to match.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 14, border: `1px solid ${style === s.id ? theme.borderAccent : theme.border}`, background: style === s.id ? theme.accentDim : theme.bgCard, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                >
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, color: theme.text }}>{s.label}</div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: theme.textDim }}>{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => dispatch({ type: "SET_STUDENT", payload: { name, experience, style } })}
              style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${theme.accent}, #06b6d4)`, color: theme.bg, fontSize: 16, fontWeight: 700, fontFamily: "Outfit, sans-serif", cursor: "pointer", boxShadow: `0 4px 20px ${theme.accentGlow}` }}
            >
              Start Learning →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mastery Badge ────────────────────────────────────────────
function MasteryBadge({ level }) {
  const color = level >= 80 ? theme.green : level >= 50 ? theme.amber : level >= 20 ? theme.accent : theme.textMuted;
  const label = level >= 80 ? "Mastered" : level >= 50 ? "Proficient" : level >= 20 ? "Learning" : "New";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: "Outfit, sans-serif", color, background: `${color}18`, border: `1px solid ${color}30` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
}

// ── Knowledge Tree ───────────────────────────────────────────
function KnowledgeTree({ mastery, onSelectTopic, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div style={{ maxWidth: 800, width: "100%", maxHeight: "85vh", overflow: "auto", background: theme.bgCard, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: 24, fontWeight: 700, color: theme.text, margin: 0 }}>🌳 Knowledge Tree</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textDim, fontSize: 24, cursor: "pointer" }}>✕</button>
        </div>
        {CURRICULUM.map((ch) => {
          const avgMastery = ch.topics.reduce((sum, t) => sum + (mastery[t.id]?.level || 0), 0) / ch.topics.length;
          return (
            <div key={ch.id} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{ch.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, color: theme.text }}>{ch.title}</div>
                  <div style={{ height: 4, borderRadius: 2, background: theme.border, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, background: avgMastery >= 80 ? theme.green : avgMastery >= 40 ? theme.amber : theme.accent, width: `${avgMastery}%`, transition: "width 0.5s" }} />
                  </div>
                </div>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: theme.textDim }}>{Math.round(avgMastery)}%</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 40 }}>
                {ch.topics.map((t) => {
                  const m = mastery[t.id]?.level || 0;
                  return (
                    <button
                      key={t.id}
                      onClick={() => { onSelectTopic(t.id); onClose(); }}
                      style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${m >= 80 ? theme.green + "40" : m > 0 ? theme.accent + "30" : theme.border}`, background: m >= 80 ? theme.greenDim : m > 0 ? theme.accentDim : theme.bgSurface, color: m >= 80 ? theme.green : m > 0 ? theme.accent : theme.textMuted, fontSize: 12, fontWeight: 500, fontFamily: "Outfit, sans-serif", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {m >= 80 ? "✓ " : ""}{t.title}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────
function Dashboard({ state, dispatch }) {
  const [tab, setTab] = useState("learn"); // learn, review, progress

  const allTopics = CURRICULUM.flatMap((c) => c.topics);
  const masteredCount = allTopics.filter((t) => (state.mastery[t.id]?.level || 0) >= 80).length;
  const inProgressCount = allTopics.filter((t) => { const l = state.mastery[t.id]?.level || 0; return l > 0 && l < 80; }).length;
  const overallProgress = Math.round((allTopics.reduce((sum, t) => sum + (state.mastery[t.id]?.level || 0), 0) / (allTopics.length * 100)) * 100);

  // Determine recommended next topic
  const getNextTopic = () => {
    for (const ch of CURRICULUM) {
      for (const t of ch.topics) {
        const level = state.mastery[t.id]?.level || 0;
        if (level < 80) {
          const prereqsMet = t.prereqs.every((p) => (state.mastery[p]?.level || 0) >= 40);
          if (prereqsMet || t.prereqs.length === 0) return { topic: t, chapter: ch };
        }
      }
    }
    return null;
  };

  // SRS due items
  const getDueReviews = () => {
    const now = new Date();
    return allTopics.filter((t) => {
      const m = state.mastery[t.id];
      if (!m || m.level < 20) return false;
      if (!m.nextReview) return true;
      return new Date(m.nextReview) <= now;
    });
  };

  const nextTopic = getNextTopic();
  const dueReviews = getDueReviews();

  // Warmup question
  const getWarmup = () => {
    const learned = allTopics.filter((t) => (state.mastery[t.id]?.level || 0) >= 20);
    if (learned.length === 0) return null;
    const randomTopic = learned[Math.floor(Math.random() * learned.length)];
    const questions = QUESTION_BANK[randomTopic.id] || [];
    return questions.length > 0 ? { topic: randomTopic, question: questions[Math.floor(Math.random() * questions.length)] } : null;
  };

  const warmup = getWarmup();

  const filteredChapters = tab === "learn" ? CURRICULUM : tab === "review" ? CURRICULUM.filter((ch) => ch.topics.some((t) => dueReviews.find((d) => d.id === t.id))) : CURRICULUM;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "16px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24, filter: "drop-shadow(0 0 8px rgba(34,211,238,0.4))" }}>⚡</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>Pro Git Academy</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 600, color: state.streak > 0 ? theme.amber : theme.textMuted }}>{state.streak}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 600, color: theme.accent }}>{state.totalXP} XP</span>
            </div>
            <button onClick={() => dispatch({ type: "TOGGLE_KNOWLEDGE_TREE" })} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgSurface, color: theme.text, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
              🌳 Knowledge Tree
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px" }}>
        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Overall Progress", value: `${overallProgress}%`, color: theme.accent, icon: "📊" },
            { label: "Topics Mastered", value: `${masteredCount}/${allTopics.length}`, color: theme.green, icon: "✅" },
            { label: "In Progress", value: inProgressCount, color: theme.amber, icon: "📝" },
            { label: "Due for Review", value: dueReviews.length, color: dueReviews.length > 0 ? theme.red : theme.textMuted, icon: "🔄" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "18px 20px", borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.bgCard }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span>{s.icon}</span>
                <span style={{ fontSize: 13, color: theme.textDim }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Recommended Next + Warmup */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {nextTopic && (
            <button
              onClick={() => dispatch({ type: "SET_TOPIC", payload: nextTopic.topic.id })}
              style={{ padding: "20px 24px", borderRadius: 16, border: `1px solid ${theme.borderAccent}`, background: `linear-gradient(135deg, ${theme.accentDim}, rgba(6,182,212,0.08))`, cursor: "pointer", textAlign: "left", transition: "all 0.3s" }}
            >
              <div style={{ fontSize: 12, color: theme.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>▶ Recommended Next</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{nextTopic.topic.title}</div>
              <div style={{ fontSize: 13, color: theme.textDim }}>{nextTopic.chapter.icon} {nextTopic.chapter.title}</div>
            </button>
          )}
          {warmup && (
            <div style={{ padding: "20px 24px", borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.bgCard }}>
              <div style={{ fontSize: 12, color: theme.amber, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>☀️ Daily Warm-up</div>
              <div style={{ fontSize: 14, color: theme.text, marginBottom: 10, lineHeight: 1.5 }}>{warmup.question.q}</div>
              <button
                onClick={() => {
                  dispatch({
                    type: "SET_QUIZ",
                    payload: { questions: [warmup.question], currentIdx: 0, answers: [], score: 0, topicId: warmup.topic.id, isWarmup: true },
                  });
                }}
                style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: theme.amberDim, color: theme.amber, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}
              >
                Answer Now
              </button>
            </div>
          )}
          {!warmup && !nextTopic && (
            <div style={{ padding: "20px 24px", borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.bgCard, gridColumn: "1 / -1", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>You've explored all topics!</div>
              <div style={{ fontSize: 14, color: theme.textDim }}>Keep reviewing to maintain mastery.</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: theme.bgCard, borderRadius: 12, padding: 4, border: `1px solid ${theme.border}` }}>
          {[
            { id: "learn", label: "📚 Learn" },
            { id: "review", label: `🔄 Review ${dueReviews.length > 0 ? `(${dueReviews.length})` : ""}` },
            { id: "progress", label: "📊 Progress" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: "none", background: tab === t.id ? theme.accentDim : "transparent", color: tab === t.id ? theme.accent : theme.textDim, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.2s" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Curriculum / Review / Progress */}
        {tab === "progress" ? (
          <ProgressReport state={state} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(tab === "review" && dueReviews.length === 0) ? (
              <div style={{ textAlign: "center", padding: 40, color: theme.textDim }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: theme.text }}>All caught up!</div>
                <div style={{ fontSize: 14 }}>No topics due for review right now.</div>
              </div>
            ) : (
              filteredChapters.map((ch) => (
                <ChapterCard key={ch.id} chapter={ch} mastery={state.mastery} dispatch={dispatch} isReview={tab === "review"} dueReviews={dueReviews} />
              ))
            )}
          </div>
        )}
      </div>

      {state.showKnowledgeTree && (
        <KnowledgeTree
          mastery={state.mastery}
          onSelectTopic={(id) => dispatch({ type: "SET_TOPIC", payload: id })}
          onClose={() => dispatch({ type: "TOGGLE_KNOWLEDGE_TREE" })}
        />
      )}
    </div>
  );
}

function ChapterCard({ chapter, mastery, dispatch, isReview, dueReviews }) {
  const [expanded, setExpanded] = useState(false);
  const avgMastery = Math.round(chapter.topics.reduce((s, t) => s + (mastery[t.id]?.level || 0), 0) / chapter.topics.length);

  const topics = isReview ? chapter.topics.filter((t) => dueReviews.find((d) => d.id === t.id)) : chapter.topics;
  if (isReview && topics.length === 0) return null;

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.bgCard, overflow: "hidden" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ fontSize: 28 }}>{chapter.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 700, color: theme.text }}>{chapter.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <div style={{ flex: 1, maxWidth: 120, height: 4, borderRadius: 2, background: theme.border, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: avgMastery >= 80 ? theme.green : theme.accent, width: `${avgMastery}%`, transition: "width 0.5s" }} />
            </div>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: theme.textDim }}>{avgMastery}%</span>
            <span style={{ fontSize: 11, color: theme.textMuted, padding: "2px 8px", borderRadius: 6, background: theme.bgSurface }}>{chapter.difficulty}</span>
          </div>
        </div>
        <span style={{ color: theme.textMuted, fontSize: 14, transform: expanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>▶</span>
      </button>
      {expanded && (
        <div style={{ padding: "4px 20px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          {topics.map((t) => {
            const level = mastery[t.id]?.level || 0;
            const prereqsMet = t.prereqs.every((p) => (mastery[p]?.level || 0) >= 40);
            const locked = !prereqsMet && t.prereqs.length > 0 && level === 0;
            return (
              <button
                key={t.id}
                onClick={() => !locked && dispatch({ type: "SET_TOPIC", payload: t.id })}
                disabled={locked}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: `1px solid ${locked ? theme.border : level >= 80 ? theme.green + "30" : theme.border}`, background: locked ? theme.bgSurface : level >= 80 ? theme.greenDim : theme.bgSurface, cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.5 : 1, textAlign: "left", transition: "all 0.2s" }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: locked ? theme.border : level >= 80 ? theme.greenDim : theme.accentDim, color: locked ? theme.textMuted : level >= 80 ? theme.green : theme.accent }}>
                  {locked ? "🔒" : level >= 80 ? "✓" : "→"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 600, color: locked ? theme.textMuted : theme.text }}>{t.title}</div>
                </div>
                <MasteryBadge level={level} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Progress Report ──────────────────────────────────────────
function ProgressReport({ state }) {
  const allTopics = CURRICULUM.flatMap((c) => c.topics);
  const totalAttempts = allTopics.reduce((s, t) => s + (state.mastery[t.id]?.attempts || 0), 0);
  const avgMastery = Math.round(allTopics.reduce((s, t) => s + (state.mastery[t.id]?.level || 0), 0) / allTopics.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: 24, borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.bgCard }}>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 700, color: theme.text, margin: "0 0 16px" }}>📈 Learning Analytics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 32, fontWeight: 700, color: theme.accent }}>{avgMastery}%</div>
            <div style={{ fontSize: 13, color: theme.textDim }}>Average Mastery</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 32, fontWeight: 700, color: theme.green }}>{totalAttempts}</div>
            <div style={{ fontSize: 13, color: theme.textDim }}>Total Reviews</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 32, fontWeight: 700, color: theme.amber }}>{state.totalXP}</div>
            <div style={{ fontSize: 13, color: theme.textDim }}>XP Earned</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 24, borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.bgCard }}>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 700, color: theme.text, margin: "0 0 16px" }}>📊 Chapter Breakdown</h3>
        {CURRICULUM.map((ch) => {
          const avg = Math.round(ch.topics.reduce((s, t) => s + (state.mastery[t.id]?.level || 0), 0) / ch.topics.length);
          return (
            <div key={ch.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>{ch.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{ch.title}</span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: theme.textDim }}>{avg}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: theme.border, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${theme.accent}, ${avg >= 80 ? theme.green : theme.accent})`, width: `${avg}%`, transition: "width 0.6s ease" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strength & Weakness */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: 20, borderRadius: 16, border: `1px solid ${theme.green}30`, background: theme.greenDim }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.green, marginBottom: 12 }}>💪 Strengths</div>
          {allTopics.filter((t) => (state.mastery[t.id]?.level || 0) >= 60).slice(0, 5).map((t) => (
            <div key={t.id} style={{ fontSize: 13, color: theme.text, marginBottom: 6 }}>✓ {t.title}</div>
          ))}
          {allTopics.filter((t) => (state.mastery[t.id]?.level || 0) >= 60).length === 0 && (
            <div style={{ fontSize: 13, color: theme.textDim }}>Keep learning to build strengths!</div>
          )}
        </div>
        <div style={{ padding: 20, borderRadius: 16, border: `1px solid ${theme.red}30`, background: theme.redDim }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.red, marginBottom: 12 }}>🎯 Focus Areas</div>
          {allTopics.filter((t) => { const l = state.mastery[t.id]?.level || 0; return l > 0 && l < 50; }).slice(0, 5).map((t) => (
            <div key={t.id} style={{ fontSize: 13, color: theme.text, marginBottom: 6 }}>→ {t.title}</div>
          ))}
          {allTopics.filter((t) => { const l = state.mastery[t.id]?.level || 0; return l > 0 && l < 50; }).length === 0 && (
            <div style={{ fontSize: 13, color: theme.textDim }}>No weak areas detected yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lesson View ──────────────────────────────────────────────
function LessonView({ state, dispatch }) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const topic = CURRICULUM.flatMap((c) => c.topics).find((t) => t.id === state.currentTopic);
  const chapter = CURRICULUM.find((c) => c.topics.some((t) => t.id === state.currentTopic));
  const content = LESSON_CONTENT[state.currentTopic];

  // Generate lesson content dynamically if not pre-built
  const generateContent = () => {
    if (content) return content;
    return {
      title: topic.title,
      sections: [
        {
          heading: topic.title,
          content: `This lesson covers ${topic.title}, which is part of the ${chapter.title} chapter. Key concepts include: ${topic.keywords.join(", ")}.`,
          analogy: state.learningStyle === "technical" ? null : `Think of ${topic.keywords[0]} as a fundamental building block in Git's architecture.`,
          code: `# Relevant Git commands for ${topic.title}:\ngit help ${topic.keywords[0] || "git"}`,
        },
      ],
    };
  };

  const lessonContent = generateContent();
  const section = lessonContent.sections[sectionIdx];
  const isLast = sectionIdx === lessonContent.sections.length - 1;

  // Socratic mode chat handler
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    const sentiment = analyzeSentiment(userMsg);
    dispatch({ type: "ADD_SENTIMENT", payload: { sentiment, time: Date.now(), topic: state.currentTopic } });

    setLoading(true);

    // Simulated AI response based on sentiment and context
    setTimeout(() => {
      let response = "";
      if (sentiment === "frustrated") {
        response = `I can see this is tricky — that's completely normal! Let's break "${section.heading}" down differently.\n\n${section.analogy || "Think of it step by step:"}\n\nFirst, let's focus on just one piece: what do you think "${topic.keywords[0]}" means in this context?`;
      } else if (sentiment === "bored") {
        response = `Sounds like you've got a good handle on this! Want to jump ahead to the quiz and prove your mastery? Or shall we look at a more advanced aspect of ${topic.title}?`;
      } else if (sentiment === "confident") {
        response = `Great to hear! Let me test that understanding: Can you explain how ${topic.keywords[Math.floor(Math.random() * topic.keywords.length)]} works in the context of ${topic.title}? Try explaining it as if you were teaching someone else.`;
      } else {
        if (state.settings.socraticMode) {
          response = `Good question! Instead of giving you the answer directly, let me guide you:\n\nWhat do you already know about ${topic.keywords[0]}? And how might that relate to what we just covered about "${section.heading}"?`;
        } else {
          response = `Great question! In the context of "${section.heading}":\n\n${section.content.substring(0, 200)}...\n\nThe key thing to remember is that ${topic.keywords.join(", ")} are all connected. Would you like me to elaborate on any specific part?`;
        }
      }
      setChatMessages((prev) => [...prev, { role: "ai", text: response }]);
      setLoading(false);
    }, 800);
  };

  const startQuiz = () => {
    const questions = QUESTION_BANK[state.currentTopic] || [];
    if (questions.length === 0) return;
    dispatch({
      type: "SET_QUIZ",
      payload: { questions, currentIdx: 0, answers: [], score: 0, topicId: state.currentTopic, isWarmup: false },
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "Outfit, sans-serif" }}>
      {/* Top Bar */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "12px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => dispatch({ type: "SET_SCREEN", payload: "dashboard" })} style={{ background: "none", border: "none", color: theme.textDim, fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: theme.accent, fontWeight: 600 }}>{chapter?.icon} {chapter?.title}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{lessonContent.title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {lessonContent.sections.map((_, i) => (
              <div key={i} style={{ width: 24, height: 4, borderRadius: 2, background: i <= sectionIdx ? theme.accent : theme.border, transition: "background 0.3s" }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Section Content */}
        <div style={{ animation: "fadeSlideUp 0.4s ease" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: theme.text, margin: "0 0 20px", letterSpacing: "-0.02em" }}>{section.heading}</h2>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: theme.textDim, marginBottom: 20 }}>{section.content}</div>

          {section.analogy && (state.learningStyle !== "technical") && (
            <div style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${theme.purple}30`, background: theme.purpleDim, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.purple, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>💡 Analogy</div>
              <div style={{ fontSize: 15, color: theme.text, lineHeight: 1.7 }}>{section.analogy}</div>
            </div>
          )}

          {section.code && (
            <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${theme.border}`, marginBottom: 20 }}>
              <div style={{ padding: "8px 16px", background: theme.bgSurface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: theme.red }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: theme.amber }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: theme.green }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: theme.textMuted }}>Terminal</span>
              </div>
              <pre style={{ margin: 0, padding: "16px 20px", background: "#0d1117", fontFamily: "JetBrains Mono, monospace", fontSize: 13, lineHeight: 1.7, color: "#c9d1d9", overflow: "auto" }}>
                {section.code}
              </pre>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
          <button
            onClick={() => sectionIdx > 0 && setSectionIdx(sectionIdx - 1)}
            disabled={sectionIdx === 0}
            style={{ padding: "12px 24px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.bgCard, color: sectionIdx === 0 ? theme.textMuted : theme.text, fontSize: 14, fontWeight: 600, cursor: sectionIdx === 0 ? "default" : "pointer", fontFamily: "Outfit, sans-serif" }}
          >
            ← Previous
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowChat(!showChat)}
              style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${theme.border}`, background: showChat ? theme.accentDim : theme.bgCard, color: showChat ? theme.accent : theme.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}
            >
              💬 {state.settings.socraticMode ? "Socratic Chat" : "Ask a Question"}
            </button>
            {isLast ? (
              <button
                onClick={startQuiz}
                style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${theme.green}, #10b981)`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: `0 4px 16px rgba(52,211,153,0.3)` }}
              >
                Take Quiz →
              </button>
            ) : (
              <button
                onClick={() => setSectionIdx(sectionIdx + 1)}
                style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${theme.accent}, #06b6d4)`, color: theme.bg, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: `0 4px 16px ${theme.accentGlow}` }}
              >
                Continue →
              </button>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div style={{ borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.bgCard, overflow: "hidden", animation: "fadeSlideUp 0.3s ease" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
                {state.settings.socraticMode ? "🏛️ Socratic Tutor" : "💬 Ask Me Anything"}
              </span>
              <button
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { socraticMode: !state.settings.socraticMode } })}
                style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${state.settings.socraticMode ? theme.accent + "40" : theme.border}`, background: state.settings.socraticMode ? theme.accentDim : "transparent", color: state.settings.socraticMode ? theme.accent : theme.textDim, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}
              >
                Socratic Mode {state.settings.socraticMode ? "ON" : "OFF"}
              </button>
            </div>
            <div style={{ maxHeight: 300, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: "center", padding: 20, color: theme.textDim, fontSize: 14 }}>
                  {state.settings.socraticMode
                    ? "I won't give direct answers — I'll guide you to discover them yourself through questions."
                    : "Ask me anything about this topic! I'm here to help."}
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, background: msg.role === "user" ? theme.accentDim : theme.bgSurface, border: `1px solid ${msg.role === "user" ? theme.accent + "30" : theme.border}`, color: theme.text, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 4, padding: 10 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 8 }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder={state.settings.socraticMode ? "What do you think the answer is?" : "Type your question..."}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.bgSurface, color: theme.text, fontSize: 14, fontFamily: "Outfit, sans-serif", outline: "none" }}
              />
              <button onClick={handleChat} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: theme.accent, color: theme.bg, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                Send
              </button>
            </div>
          </div>
        )}

        {/* Quick Check (formative assessment) */}
        {sectionIdx > 0 && sectionIdx < lessonContent.sections.length - 1 && (
          <FormativeCheck topic={topic} sectionIdx={sectionIdx} />
        )}
      </div>
    </div>
  );
}

// ── Formative Assessment (mid-lesson check) ──────────────────
function FormativeCheck({ topic }) {
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const keyword = topic.keywords[Math.floor(Math.random() * topic.keywords.length)];

  return (
    <div style={{ padding: "18px 20px", borderRadius: 14, border: `1px solid ${theme.amber}25`, background: theme.amberDim }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: theme.amber, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>✋ Quick Check</div>
      <div style={{ fontSize: 14, color: theme.text, marginBottom: 12 }}>
        Can you explain what "<strong>{keyword}</strong>" means in the context of {topic.title}?
      </div>
      {!revealed ? (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgSurface, color: theme.text, fontSize: 13, fontFamily: "Outfit, sans-serif", outline: "none" }}
          />
          <button onClick={() => setRevealed(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: theme.amber, color: theme.bg, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>Check</button>
        </div>
      ) : (
        <div style={{ fontSize: 14, color: theme.green, lineHeight: 1.6 }}>
          ✓ Good effort! "{keyword}" relates to: {topic.keywords.join(", ")}. Keep building on this understanding!
        </div>
      )}
    </div>
  );
}

// ── Quiz View ────────────────────────────────────────────────
function QuizView({ state, dispatch }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [openAnswer, setOpenAnswer] = useState("");
  const [fillAnswer, setFillAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { questions, currentIdx, answers, score, topicId, isWarmup } = state.quizState;
  const question = questions[currentIdx];
  const isComplete = state.quizState.completed;

  const submitAnswer = () => {
    let correct = false;
    let fb = "";

    if (question.type === "mc") {
      correct = selectedOption === question.answer;
      fb = correct ? "Correct! " + (question.explanation || "") : `Not quite. The answer is: ${question.options[question.answer]}. ${question.explanation || ""}`;
    } else if (question.type === "fill") {
      correct = fillAnswer.trim().toLowerCase() === question.answer.toLowerCase();
      fb = correct ? "Correct!" : `The answer is: "${question.answer}".`;
    } else if (question.type === "open") {
      const matched = question.rubric.filter((r) => openAnswer.toLowerCase().includes(r.toLowerCase()));
      correct = matched.length >= Math.ceil(question.rubric.length * 0.5);
      fb = correct ? `Good answer! You covered: ${matched.join(", ")}.` : `Key points to include: ${question.rubric.join(", ")}.`;
    }

    setSubmitted(true);
    setFeedback({ correct, text: fb });

    const newScore = score + (correct ? 1 : 0);
    dispatch({ type: "UPDATE_QUIZ", payload: { score: newScore, answers: [...answers, { questionIdx: currentIdx, correct }] } });

    // Update mastery
    dispatch({ type: "UPDATE_MASTERY", payload: { topicId, score: correct ? 20 : 5, difficulty: correct ? "easy" : "hard" } });
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      dispatch({ type: "COMPLETE_QUIZ", payload: { score: state.quizState.score, total: questions.length } });
    } else {
      dispatch({ type: "UPDATE_QUIZ", payload: { currentIdx: currentIdx + 1 } });
      setSelectedOption(null);
      setOpenAnswer("");
      setFillAnswer("");
      setSubmitted(false);
      setFeedback(null);
    }
  };

  if (isComplete) {
    const pct = state.quizState.finalScore;
    const passed = pct >= 70;
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", padding: 24 }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center", animation: "fadeSlideUp 0.5s ease" }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>{passed ? "🎉" : "💪"}</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: theme.text, margin: "0 0 8px" }}>
            {passed ? "Excellent Work!" : "Keep Practicing!"}
          </h2>
          <p style={{ fontSize: 16, color: theme.textDim, margin: "0 0 28px" }}>
            {passed ? "You've demonstrated strong understanding." : "Review the material and try again to build mastery."}
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 120, height: 120, borderRadius: "50%", border: `4px solid ${passed ? theme.green : theme.amber}`, marginBottom: 28 }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 36, fontWeight: 800, color: passed ? theme.green : theme.amber }}>{pct}%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 700, color: theme.green }}>{state.quizState.score}</div>
              <div style={{ fontSize: 12, color: theme.textDim }}>Correct</div>
            </div>
            <div style={{ width: 1, background: theme.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 700, color: theme.red }}>{questions.length - state.quizState.score}</div>
              <div style={{ fontSize: 12, color: theme.textDim }}>Incorrect</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => dispatch({ type: "SET_SCREEN", payload: "dashboard" })}
              style={{ padding: "14px 28px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.bgCard, color: theme.text, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}
            >
              Dashboard
            </button>
            {!passed && (
              <button
                onClick={() => dispatch({ type: "SET_TOPIC", payload: topicId })}
                style={{ padding: "14px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${theme.accent}, #06b6d4)`, color: theme.bg, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}
              >
                Review Lesson
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "Outfit, sans-serif" }}>
      {/* Top Bar */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}`, padding: "12px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => dispatch({ type: "SET_SCREEN", payload: "dashboard" })} style={{ background: "none", border: "none", color: theme.textDim, fontSize: 20, cursor: "pointer" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: theme.accent, fontWeight: 600 }}>{isWarmup ? "☀️ Daily Warm-up" : "📝 Quiz"}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
              {questions.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < currentIdx ? (answers[i]?.correct ? theme.green : theme.red) : i === currentIdx ? theme.accent : theme.border }} />
              ))}
            </div>
          </div>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, color: theme.textDim }}>{currentIdx + 1}/{questions.length}</span>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ animation: "fadeSlideUp 0.4s ease" }}>
          {/* Question Type Badge */}
          <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: "Outfit, sans-serif", color: theme.accent, background: theme.accentDim, marginBottom: 16 }}>
            {question.type === "mc" ? "Multiple Choice" : question.type === "fill" ? "Fill in the Blank" : "Open Answer"}
          </span>

          <h3 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: "0 0 28px", lineHeight: 1.5 }}>{question.q}</h3>

          {/* MC Options */}
          {question.type === "mc" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {question.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrectAnswer = submitted && i === question.answer;
                const isWrong = submitted && isSelected && !feedback.correct;
                return (
                  <button
                    key={i}
                    onClick={() => !submitted && setSelectedOption(i)}
                    disabled={submitted}
                    style={{
                      padding: "16px 20px", borderRadius: 12, textAlign: "left", cursor: submitted ? "default" : "pointer",
                      border: `2px solid ${isCorrectAnswer ? theme.green : isWrong ? theme.red : isSelected ? theme.accent : theme.border}`,
                      background: isCorrectAnswer ? theme.greenDim : isWrong ? theme.redDim : isSelected ? theme.accentDim : theme.bgCard,
                      color: theme.text, fontSize: 15, fontFamily: "Outfit, sans-serif", fontWeight: isSelected ? 600 : 400, transition: "all 0.2s",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, marginRight: 12, fontSize: 13, fontWeight: 700, background: isCorrectAnswer ? theme.green : isWrong ? theme.red : isSelected ? theme.accent : theme.border, color: (isCorrectAnswer || isWrong || isSelected) ? "#fff" : theme.textDim }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the Blank */}
          {question.type === "fill" && (
            <input
              type="text"
              value={fillAnswer}
              onChange={(e) => setFillAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Type your answer..."
              style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `2px solid ${submitted ? (feedback?.correct ? theme.green : theme.red) : theme.border}`, background: theme.bgCard, color: theme.text, fontSize: 16, fontFamily: "JetBrains Mono, monospace", outline: "none", boxSizing: "border-box" }}
            />
          )}

          {/* Open Answer */}
          {question.type === "open" && (
            <textarea
              value={openAnswer}
              onChange={(e) => setOpenAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Explain in your own words..."
              rows={4}
              style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `2px solid ${submitted ? (feedback?.correct ? theme.green : theme.red) : theme.border}`, background: theme.bgCard, color: theme.text, fontSize: 15, fontFamily: "Outfit, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
            />
          )}

          {/* Feedback */}
          {feedback && (
            <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 14, border: `1px solid ${feedback.correct ? theme.green + "40" : theme.red + "40"}`, background: feedback.correct ? theme.greenDim : theme.redDim, animation: "fadeSlideUp 0.3s ease" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: feedback.correct ? theme.green : theme.red, marginBottom: 6 }}>
                {feedback.correct ? "✅ Correct!" : "❌ Not quite"}
              </div>
              <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.6 }}>{feedback.text}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
            {!submitted ? (
              <button
                onClick={submitAnswer}
                disabled={question.type === "mc" ? selectedOption === null : question.type === "fill" ? !fillAnswer.trim() : !openAnswer.trim()}
                style={{
                  padding: "14px 36px", borderRadius: 12, border: "none",
                  background: (question.type === "mc" ? selectedOption !== null : question.type === "fill" ? fillAnswer.trim() : openAnswer.trim()) ? `linear-gradient(135deg, ${theme.accent}, #06b6d4)` : theme.bgCard,
                  color: (question.type === "mc" ? selectedOption !== null : question.type === "fill" ? fillAnswer.trim() : openAnswer.trim()) ? theme.bg : theme.textMuted,
                  fontSize: 15, fontWeight: 700, cursor: (question.type === "mc" ? selectedOption !== null : question.type === "fill" ? fillAnswer.trim() : openAnswer.trim()) ? "pointer" : "default",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                style={{ padding: "14px 36px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${theme.accent}, #06b6d4)`, color: theme.bg, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: `0 4px 16px ${theme.accentGlow}` }}
              >
                {currentIdx + 1 >= questions.length ? "See Results" : "Next Question →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <style>{`
        ${fontImport}
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        ::selection { background: ${theme.accentGlow}; color: ${theme.text}; }
        input::placeholder, textarea::placeholder { color: ${theme.textMuted}; }
      `}</style>
      <div style={{ minHeight: "100vh", background: theme.bg }}>
        {state.screen === "welcome" && <WelcomeScreen dispatch={dispatch} />}
        {state.screen === "dashboard" && <Dashboard state={state} dispatch={dispatch} />}
        {state.screen === "lesson" && <LessonView state={state} dispatch={dispatch} />}
        {state.screen === "quiz" && <QuizView state={state} dispatch={dispatch} />}
      </div>
    </>
  );
}
