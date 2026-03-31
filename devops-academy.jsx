import { useState, useEffect, useRef, useCallback, useReducer } from "react";

// ═══════════════════════════════════════════════════════════════
// DEVOPS ACADEMY — AI TEACHER
// Two Knowledge Bases with Explicit Source Attribution
// ═══════════════════════════════════════════════════════════════

// ── Source Definitions ────────────────────────────────────────
const SOURCES = {
  progit: {
    id: "progit",
    title: "Pro Git",
    shortTitle: "Pro Git",
    authors: "Scott Chacon & Ben Straub",
    edition: "2nd Edition, v2.1.449",
    color: "#f97316",
    colorDim: "rgba(249,115,22,0.12)",
    colorGlow: "rgba(249,115,22,0.25)",
    icon: "📙",
    tag: "GIT",
  },
  k8s_up: {
    id: "k8s_up",
    title: "Kubernetes: Up & Running",
    shortTitle: "K8s Up & Running",
    authors: "Burns, Beda & Hightower",
    edition: "2nd Edition, 2019",
    color: "#3b82f6",
    colorDim: "rgba(59,130,246,0.12)",
    colorGlow: "rgba(59,130,246,0.25)",
    icon: "📘",
    tag: "K8S",
  },
  k8s_devops: {
    id: "k8s_devops",
    title: "Cloud Native DevOps with Kubernetes",
    shortTitle: "CN DevOps",
    authors: "Arundel & Domingus",
    edition: "1st Edition, 2019",
    color: "#8b5cf6",
    colorDim: "rgba(139,92,246,0.12)",
    colorGlow: "rgba(139,92,246,0.25)",
    icon: "📕",
    tag: "DEVOPS",
  },
};

// ── Curriculum Data ──────────────────────────────────────────
const CURRICULUM = [
  // ─── GIT TRACK ───
  {
    id: "git-ch1", title: "Getting Started with Git", icon: "🚀", difficulty: "beginner", source: "progit",
    topics: [
      { id: "g1-1", title: "About Version Control", keywords: ["vcs", "local", "centralized", "distributed"], prereqs: [], source: "progit" },
      { id: "g1-2", title: "What is Git?", keywords: ["snapshots", "integrity", "three states"], prereqs: ["g1-1"], source: "progit" },
      { id: "g1-3", title: "Installing & Configuring Git", keywords: ["install", "config", "identity"], prereqs: ["g1-2"], source: "progit" },
    ],
  },
  {
    id: "git-ch2", title: "Git Basics", icon: "📦", difficulty: "beginner", source: "progit",
    topics: [
      { id: "g2-1", title: "Repositories: Init & Clone", keywords: ["init", "clone", "repository"], prereqs: ["g1-3"], source: "progit" },
      { id: "g2-2", title: "Recording Changes", keywords: ["add", "commit", "status", "diff", "staging"], prereqs: ["g2-1"], source: "progit" },
      { id: "g2-3", title: "Viewing History & Undoing", keywords: ["log", "amend", "reset", "restore"], prereqs: ["g2-2"], source: "progit" },
      { id: "g2-4", title: "Remotes & Tagging", keywords: ["remote", "fetch", "push", "pull", "tag"], prereqs: ["g2-2"], source: "progit" },
    ],
  },
  {
    id: "git-ch3", title: "Git Branching", icon: "🌿", difficulty: "intermediate", source: "progit",
    topics: [
      { id: "g3-1", title: "Branches in a Nutshell", keywords: ["branch", "pointer", "HEAD"], prereqs: ["g2-2"], source: "progit" },
      { id: "g3-2", title: "Merging & Conflict Resolution", keywords: ["merge", "fast-forward", "conflict"], prereqs: ["g3-1"], source: "progit" },
      { id: "g3-3", title: "Remote Branches & Workflows", keywords: ["tracking", "upstream", "feature branch"], prereqs: ["g2-4", "g3-1"], source: "progit" },
      { id: "g3-4", title: "Rebasing", keywords: ["rebase", "interactive", "squash"], prereqs: ["g3-2"], source: "progit" },
    ],
  },
  {
    id: "git-ch4", title: "Git on the Server & GitHub", icon: "🐙", difficulty: "intermediate", source: "progit",
    topics: [
      { id: "g4-1", title: "Protocols & Server Setup", keywords: ["ssh", "http", "bare repo", "daemon"], prereqs: ["g2-4"], source: "progit" },
      { id: "g4-2", title: "GitHub: Forking & Pull Requests", keywords: ["fork", "pull request", "review", "issues"], prereqs: ["g3-3"], source: "progit" },
    ],
  },
  {
    id: "git-ch5", title: "Advanced Git Tools", icon: "🔧", difficulty: "advanced", source: "progit",
    topics: [
      { id: "g5-1", title: "Stashing, Cleaning & Interactive Staging", keywords: ["stash", "clean", "patch"], prereqs: ["g2-2"], source: "progit" },
      { id: "g5-2", title: "Reset Demystified", keywords: ["soft", "mixed", "hard", "three trees"], prereqs: ["g2-3"], source: "progit" },
      { id: "g5-3", title: "Rewriting History", keywords: ["filter-branch", "interactive rebase", "amend"], prereqs: ["g3-4"], source: "progit" },
      { id: "g5-4", title: "Submodules & Hooks", keywords: ["submodule", "pre-commit", "server-side hooks"], prereqs: ["g2-4"], source: "progit" },
    ],
  },
  {
    id: "git-ch6", title: "Git Internals", icon: "🔬", difficulty: "advanced", source: "progit",
    topics: [
      { id: "g6-1", title: "Git Objects & References", keywords: ["blob", "tree", "commit", "sha-1", "refs"], prereqs: ["g2-2"], source: "progit" },
      { id: "g6-2", title: "Packfiles & Transfer Protocols", keywords: ["pack", "delta", "smart http"], prereqs: ["g6-1"], source: "progit" },
    ],
  },
  // ─── KUBERNETES TRACK ───
  {
    id: "k8s-ch1", title: "Introduction to Kubernetes", icon: "☸️", difficulty: "beginner", source: "k8s_up",
    topics: [
      { id: "k1-1", title: "Why Kubernetes? Velocity & Immutability", keywords: ["velocity", "immutability", "declarative", "self-healing"], prereqs: [], source: "k8s_up" },
      { id: "k1-2", title: "Scaling & Microservices", keywords: ["scaling", "microservices", "decoupling", "abstraction"], prereqs: ["k1-1"], source: "k8s_up" },
    ],
  },
  {
    id: "k8s-ch2", title: "Containers & Cluster Setup", icon: "🐳", difficulty: "beginner", source: "k8s_up",
    topics: [
      { id: "k2-1", title: "Container Images & Docker", keywords: ["docker", "dockerfile", "image", "registry"], prereqs: ["k1-1"], source: "k8s_up" },
      { id: "k2-2", title: "Deploying a Kubernetes Cluster", keywords: ["minikube", "GKE", "AKS", "EKS", "kubectl"], prereqs: ["k2-1"], source: "k8s_up" },
      { id: "k2-3", title: "Common kubectl Commands", keywords: ["kubectl", "get", "describe", "apply", "delete"], prereqs: ["k2-2"], source: "k8s_up" },
    ],
  },
  {
    id: "k8s-ch3", title: "Core Kubernetes Objects", icon: "🧩", difficulty: "intermediate", source: "k8s_up",
    topics: [
      { id: "k3-1", title: "Pods", keywords: ["pod", "container", "manifest", "health checks", "resources"], prereqs: ["k2-3"], source: "k8s_up" },
      { id: "k3-2", title: "Labels & Annotations", keywords: ["labels", "selectors", "annotations", "metadata"], prereqs: ["k3-1"], source: "k8s_up" },
      { id: "k3-3", title: "Service Discovery", keywords: ["service", "ClusterIP", "NodePort", "endpoints"], prereqs: ["k3-2"], source: "k8s_up" },
      { id: "k3-4", title: "Ingress & Load Balancing", keywords: ["ingress", "load balancer", "TLS", "routing"], prereqs: ["k3-3"], source: "k8s_up" },
    ],
  },
  {
    id: "k8s-ch4", title: "Workload Controllers", icon: "⚙️", difficulty: "intermediate", source: "k8s_up",
    topics: [
      { id: "k4-1", title: "ReplicaSets", keywords: ["replicaset", "desired state", "reconciliation"], prereqs: ["k3-1"], source: "k8s_up" },
      { id: "k4-2", title: "Deployments & Rollouts", keywords: ["deployment", "rollout", "rollback", "strategy"], prereqs: ["k4-1"], source: "k8s_up" },
      { id: "k4-3", title: "DaemonSets & Jobs", keywords: ["daemonset", "job", "cronjob", "node-level"], prereqs: ["k4-1"], source: "k8s_up" },
    ],
  },
  {
    id: "k8s-ch5", title: "Configuration & Security", icon: "🔒", difficulty: "advanced", source: "k8s_up",
    topics: [
      { id: "k5-1", title: "ConfigMaps & Secrets", keywords: ["configmap", "secret", "environment", "volume mount"], prereqs: ["k3-1"], source: "k8s_up" },
      { id: "k5-2", title: "RBAC", keywords: ["role", "rolebinding", "clusterrole", "service account"], prereqs: ["k5-1"], source: "k8s_up" },
      { id: "k5-3", title: "Storage & Volumes", keywords: ["persistentvolume", "PVC", "storageclass", "emptyDir"], prereqs: ["k3-1"], source: "k8s_up" },
    ],
  },
  // ─── CLOUD NATIVE DEVOPS TRACK ───
  {
    id: "cnd-ch1", title: "Revolution in the Cloud", icon: "☁️", difficulty: "beginner", source: "k8s_devops",
    topics: [
      { id: "d1-1", title: "The Dawn of DevOps & Cloud", keywords: ["devops", "IaaS", "infrastructure as code"], prereqs: [], source: "k8s_devops" },
      { id: "d1-2", title: "Containers & Orchestration", keywords: ["containers", "orchestration", "cloud native"], prereqs: ["d1-1"], source: "k8s_devops" },
    ],
  },
  {
    id: "cnd-ch2", title: "First Steps & Getting Kubernetes", icon: "👣", difficulty: "beginner", source: "k8s_devops",
    topics: [
      { id: "d2-1", title: "Running Your First Container", keywords: ["docker desktop", "demo app", "port forwarding"], prereqs: ["d1-2"], source: "k8s_devops" },
      { id: "d2-2", title: "Getting Kubernetes: Managed vs Self-hosted", keywords: ["GKE", "EKS", "AKS", "managed", "self-hosted"], prereqs: ["d2-1"], source: "k8s_devops" },
    ],
  },
  {
    id: "cnd-ch3", title: "Kubernetes Objects & Resources", icon: "📋", difficulty: "intermediate", source: "k8s_devops",
    topics: [
      { id: "d3-1", title: "Deployments, Pods & ReplicaSets", keywords: ["deployment", "pod", "replicaset", "YAML"], prereqs: ["d2-2"], source: "k8s_devops" },
      { id: "d3-2", title: "Services, Ingress & Helm Charts", keywords: ["service", "ingress", "helm", "chart"], prereqs: ["d3-1"], source: "k8s_devops" },
    ],
  },
  {
    id: "cnd-ch4", title: "Operating Kubernetes in Production", icon: "🏭", difficulty: "advanced", source: "k8s_devops",
    topics: [
      { id: "d4-1", title: "Configuration & Secrets Management", keywords: ["configmap", "secret", "Vault", "SOPS"], prereqs: ["d3-1"], source: "k8s_devops" },
      { id: "d4-2", title: "Continuous Deployment & GitOps", keywords: ["CI/CD", "GitOps", "Cloud Build", "Helm"], prereqs: ["d4-1"], source: "k8s_devops" },
      { id: "d4-3", title: "Observability: Monitoring & Logging", keywords: ["Prometheus", "Grafana", "logging", "tracing", "metrics"], prereqs: ["d3-1"], source: "k8s_devops" },
    ],
  },
];

// ── Question Bank ────────────────────────────────────────────
const QUESTION_BANK = {
  // GIT questions
  "g1-1": [
    { type: "mc", q: "What type of version control system is Git?", options: ["Local", "Centralized", "Distributed", "Cloud-based"], answer: 2, explanation: "Git is a Distributed VCS. Every developer has a full copy of the repository including its complete history. (Pro Git, Ch.1)", source: "progit" },
    { type: "open", q: "Explain the difference between centralized and distributed version control systems.", rubric: ["single server vs full copies", "network dependency", "redundancy advantage"], source: "progit" },
    { type: "fill", q: "In a ___ version control system, every clone is a full backup of the repository.", answer: "distributed", source: "progit" },
  ],
  "g1-2": [
    { type: "mc", q: "How does Git think about its data?", options: ["As file-based deltas", "As a stream of snapshots", "As compressed archives", "As database entries"], answer: 1, explanation: "Git thinks of data as a series of snapshots of a miniature filesystem. (Pro Git, Ch.1 — 'What is Git?')", source: "progit" },
    { type: "mc", q: "What are the three main states a file can be in with Git?", options: ["Created, Modified, Deleted", "Modified, Staged, Committed", "Tracked, Untracked, Ignored", "Local, Remote, Cached"], answer: 1, explanation: "The three states are Modified, Staged, and Committed. (Pro Git, Ch.1)", source: "progit" },
    { type: "fill", q: "Git uses a ___ checksum to ensure data integrity.", answer: "SHA-1", source: "progit" },
  ],
  "g2-2": [
    { type: "mc", q: "What does `git add` do?", options: ["Creates a new file", "Stages content for the next commit", "Pushes changes to remote", "Commits changes"], answer: 1, explanation: "git add stages content for the next commit. (Pro Git, Ch.2 — 'Recording Changes')", source: "progit" },
    { type: "fill", q: "To see unstaged changes, use `git ___`.", answer: "diff", source: "progit" },
    { type: "open", q: "Describe the lifecycle of a file in a Git repository, from untracked to committed.", rubric: ["untracked", "tracked/unmodified", "modified", "staged", "committed"], source: "progit" },
  ],
  "g3-1": [
    { type: "mc", q: "What is a branch in Git?", options: ["A copy of the repository", "A lightweight movable pointer to a commit", "A separate working directory", "A remote connection"], answer: 1, explanation: "A branch is simply a lightweight movable pointer to a commit. (Pro Git, Ch.3)", source: "progit" },
    { type: "fill", q: "To create a new branch called 'feature', run `git ___ feature`.", answer: "branch", source: "progit" },
  ],
  "g3-4": [
    { type: "mc", q: "What is the golden rule of rebasing?", options: ["Always rebase before merging", "Never rebase public/shared branches", "Only rebase main", "Rebase after every commit"], answer: 1, explanation: "Do not rebase commits that exist outside your repository and that people may have based work on. (Pro Git, Ch.3)", source: "progit" },
  ],
  "g6-1": [
    { type: "mc", q: "What are the main types of Git objects?", options: ["File, Folder, Link", "Blob, Tree, Commit, Tag", "Source, Binary, Config", "Text, Image, Data"], answer: 1, explanation: "Git uses four object types: blobs, trees, commits, and tags. (Pro Git, Ch.10 — 'Git Internals')", source: "progit" },
    { type: "fill", q: "A Git ___ object stores the contents of a file.", answer: "blob", source: "progit" },
  ],
  // KUBERNETES questions
  "k1-1": [
    { type: "mc", q: "Which of these is NOT a benefit of Kubernetes listed in the book?", options: ["Velocity", "Immutability", "Self-healing", "Automatic code generation"], answer: 3, explanation: "Kubernetes provides velocity, immutability, declarative config, and self-healing — not automatic code generation. (K8s: Up & Running, Ch.1)", source: "k8s_up" },
    { type: "open", q: "Explain what 'declarative configuration' means in Kubernetes and why it matters.", rubric: ["desired state", "YAML/manifest", "reconciliation", "version control"], source: "k8s_up" },
  ],
  "k2-1": [
    { type: "mc", q: "What is a container image?", options: ["A running process", "A binary package encapsulating an application and its dependencies", "A virtual machine snapshot", "A network configuration"], answer: 1, explanation: "A container image bundles a program and its dependencies into a single artifact. (K8s: Up & Running, Ch.2)", source: "k8s_up" },
    { type: "fill", q: "A ___ describes the steps to build a container image, layer by layer.", answer: "Dockerfile", source: "k8s_up" },
  ],
  "k3-1": [
    { type: "mc", q: "What is the smallest deployable unit in Kubernetes?", options: ["Container", "Pod", "ReplicaSet", "Deployment"], answer: 1, explanation: "A Pod is the smallest deployable unit. It represents a collection of co-located containers. (K8s: Up & Running, Ch.5)", source: "k8s_up" },
    { type: "open", q: "Why would you run multiple containers in a single Pod?", rubric: ["sidecar pattern", "shared network namespace", "shared volumes", "tightly coupled"], source: "k8s_up" },
  ],
  "k4-2": [
    { type: "mc", q: "What does a Deployment manage?", options: ["Network policies", "Storage volumes", "ReplicaSets and rollout strategies", "Node scheduling"], answer: 2, explanation: "A Deployment manages ReplicaSets and provides rollout/rollback capabilities. (K8s: Up & Running, Ch.10)", source: "k8s_up" },
  ],
  // CLOUD NATIVE DEVOPS questions
  "d1-1": [
    { type: "mc", q: "According to the book, what does 'Infrastructure as Code' mean?", options: ["Writing code that runs on any infrastructure", "Managing infrastructure through machine-readable files", "Using code editors for server management", "Building physical data centers programmatically"], answer: 1, explanation: "Infrastructure as Code means managing infrastructure through machine-readable definition files. (Cloud Native DevOps, Ch.1)", source: "k8s_devops" },
    { type: "open", q: "What is 'DevOps' and why does the book say 'Nobody Understands DevOps'?", rubric: ["culture", "collaboration", "automation", "misunderstood as just tools"], source: "k8s_devops" },
  ],
  "d2-2": [
    { type: "mc", q: "What is the book's primary recommendation for getting Kubernetes?", options: ["Build from source", "Use managed services like GKE/EKS/AKS", "Run on bare metal", "Use Docker Swarm instead"], answer: 1, explanation: "The book recommends using managed Kubernetes services to reduce operational overhead. (Cloud Native DevOps, Ch.3)", source: "k8s_devops" },
  ],
  "d4-2": [
    { type: "mc", q: "What is GitOps?", options: ["Using Git for code only", "Managing infrastructure through Git repositories as source of truth", "A GitHub-specific feature", "Git-based container builds"], answer: 1, explanation: "GitOps uses Git repos as the source of truth for infrastructure and application configuration. (Cloud Native DevOps, Ch.14)", source: "k8s_devops" },
    { type: "fill", q: "In ___, the Git repository serves as the single source of truth for infrastructure configuration.", answer: "GitOps", source: "k8s_devops" },
  ],
};

// Fill defaults for topics without specific questions
CURRICULUM.forEach((ch) => ch.topics.forEach((t) => {
  if (!QUESTION_BANK[t.id]) {
    const s = SOURCES[t.source];
    QUESTION_BANK[t.id] = [
      { type: "open", q: `Explain the key concepts of "${t.title}" in your own words.`, rubric: t.keywords, source: t.source },
      { type: "mc", q: `Which concept is most closely related to "${t.title}"?`, options: [...t.keywords.slice(0, 3).map(k => k.charAt(0).toUpperCase() + k.slice(1)), "None of the above"], answer: 0, explanation: `${t.title} relates to: ${t.keywords.join(", ")}. (${s.shortTitle})`, source: t.source },
    ];
  }
}));

// ── Lesson Content (with explicit source attribution) ────────
const LESSON_CONTENT = {
  "g1-1": {
    title: "About Version Control", source: "progit", sourceRef: "Pro Git — Chapter 1: Getting Started",
    sections: [
      { heading: "What is Version Control?", content: "Version control records changes to files over time so you can recall specific versions later. It's a time machine for your code.", analogy: "Imagine writing a book. Without VCS, you'd save copies like 'book_v1.doc', 'book_v2_final.doc', 'book_v2_REALLY_final.doc'. Version control automates this perfectly.", code: null },
      { heading: "Local → Centralized → Distributed", content: "VCS evolved from local databases (RCS), to centralized servers (SVN, CVS), to distributed systems (Git, Mercurial). Each step solved problems of the previous approach.", analogy: "Local = your personal diary. Centralized = one library with all the books. Distributed = every reader has a complete copy of every book.", code: null },
      { heading: "Why Distributed Wins", content: "In a DVCS, every clone is a full backup. If the server dies, any client can restore it. You can work offline and collaborate in flexible ways that centralized systems can't support.", analogy: null, code: null },
    ],
  },
  "g1-2": {
    title: "What is Git?", source: "progit", sourceRef: "Pro Git — Chapter 1: What is Git?",
    sections: [
      { heading: "Snapshots, Not Deltas", content: "Most VCS store file-based changes (deltas). Git instead takes snapshots. Every commit is a picture of all files. Unchanged files are linked, not re-stored.", analogy: "Other VCS track 'what changed per chapter.' Git photographs the entire book every time you make any edit.", code: null },
      { heading: "Integrity Through SHA-1", content: "Everything is checksummed with SHA-1 before storage. It's impossible to change any file without Git knowing about it.", analogy: "Every piece of data gets a unique fingerprint. If even one byte changes, the fingerprint changes completely.", code: "# Example SHA-1 hash:\n24b9da6552252987aa493b52f8696cd6d3b00373" },
      { heading: "The Three States", content: "Files exist in three states: Modified (changed but not committed), Staged (marked for next commit), Committed (safely stored). This maps to: Working Tree → Staging Area (Index) → .git Directory.", analogy: "Your desk (working tree) → your outbox (staging area) → the filing cabinet (committed).", code: "git status          # See state of files\ngit add myfile.txt  # Modified → Staged\ngit commit -m \"msg\" # Staged → Committed" },
    ],
  },
  "g2-2": {
    title: "Recording Changes", source: "progit", sourceRef: "Pro Git — Chapter 2: Recording Changes to the Repository",
    sections: [
      { heading: "The File Lifecycle", content: "Files are either tracked or untracked. Tracked files cycle through: unmodified → modified → staged → committed.", analogy: "Files are either 'in the system' (tracked) or 'strangers' (untracked). Tracked files go through a cycle: clean → edited → ready to save → saved.", code: "git status      # Check file states\ngit status -s   # Short format" },
      { heading: "Staging & Committing", content: "Use 'git add' to stage — it's multipurpose: tracks new files, stages modifications, marks conflicts resolved. 'git commit' saves staged changes.", analogy: "Committing is like sealing an envelope and filing it. Only what you put in the envelope (staged) gets filed.", code: "git add README.md        # Stage specific file\ngit add .                # Stage all\ngit commit -m \"Fix bug\"  # Commit staged\ngit commit -a -m \"Quick\" # Stage+commit tracked" },
      { heading: "Viewing Changes", content: "'git diff' shows exact changes. Without args: unstaged changes. With --staged: what's queued for commit.", analogy: null, code: "git diff          # Unstaged changes\ngit diff --staged # Staged changes\ngit diff abc..def # Between commits" },
    ],
  },
  "k1-1": {
    title: "Why Kubernetes?", source: "k8s_up", sourceRef: "Kubernetes: Up & Running — Chapter 1: Introduction",
    sections: [
      { heading: "Velocity", content: "Kubernetes is built for velocity — the speed at which you can ship features while maintaining a highly available service. It provides immutability, declarative configuration, and self-healing to achieve this.", analogy: "Think of Kubernetes as an air traffic control system. You tell it where planes (containers) should go, and it handles routing, conflicts, and emergencies automatically.", code: null },
      { heading: "The Value of Immutability", content: "Instead of logging into servers and making changes (mutable infrastructure), you build new container images with changes baked in. The running image is never modified — only replaced.", analogy: "It's like replacing a broken light bulb instead of trying to repair it. Each deployment is a fresh, tested copy.", code: null },
      { heading: "Declarative Configuration & Self-Healing", content: "You declare the desired state (e.g., 'run 3 replicas') and Kubernetes continuously ensures reality matches your declaration. If a container crashes, it's automatically restarted.", analogy: "You set a thermostat to 72°F. You don't manually turn the heater on and off — the system maintains the temperature for you.", code: "# Example: Desired state declaration\napiVersion: apps/v1\nkind: Deployment\nspec:\n  replicas: 3    # Kubernetes ensures 3 always run" },
    ],
  },
  "k2-1": {
    title: "Container Images & Docker", source: "k8s_up", sourceRef: "K8s: Up & Running — Chapter 2: Creating and Running Containers",
    sections: [
      { heading: "What Are Container Images?", content: "A container image is a binary package that encapsulates all files needed to run a program inside an OS container. It bundles the application, dependencies, and a minimal OS filesystem into a single artifact.", analogy: "Think of a shipping container: everything needed for transport is sealed inside. It works the same way everywhere — on any ship (host).", code: null },
      { heading: "Dockerfiles & Building Images", content: "A Dockerfile describes each layer of the image. Each command creates a new layer. Layers are cached and shared between images, making builds efficient.", analogy: null, code: "FROM node:14-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]" },
      { heading: "Optimizing & Storing Images", content: "Keep images small by using multistage builds, minimal base images, and ordering Dockerfile commands so frequently-changing steps come last. Push images to registries (Docker Hub, GCR, ECR) for deployment.", analogy: null, code: "docker build -t myapp:v1 .\ndocker push myregistry/myapp:v1" },
    ],
  },
  "d1-1": {
    title: "The Dawn of DevOps & Cloud", source: "k8s_devops", sourceRef: "Cloud Native DevOps — Chapter 1: Revolution in the Cloud",
    sections: [
      { heading: "From Data Centers to the Cloud", content: "Computing evolved from buying physical servers, to renting virtual machines (IaaS), to running containers on orchestrated platforms. Each step reduced undifferentiated heavy lifting.", analogy: "Owning a server is like owning a car. IaaS is like leasing. Containers on Kubernetes are like ride-sharing — you only pay for what you use and someone else handles maintenance.", code: null },
      { heading: "What Is DevOps?", content: "DevOps is a cultural and technical movement that breaks down silos between development and operations teams. It emphasizes collaboration, automation, continuous delivery, and infrastructure as code. The book notes: nobody fully agrees on what DevOps means, and that's part of the challenge.", analogy: null, code: null },
      { heading: "Infrastructure as Code", content: "Instead of clicking through UIs or running manual commands, you define your infrastructure in version-controlled files. This means your infrastructure is repeatable, reviewable, and testable — just like application code.", analogy: "It's the difference between a chef cooking from memory each time vs. following a precise, tested recipe that any chef can reproduce.", code: "# Example Terraform (infrastructure as code):\nresource \"aws_instance\" \"web\" {\n  ami           = \"ami-12345\"\n  instance_type = \"t2.micro\"\n}" },
    ],
  },
  "d1-2": {
    title: "Containers & Orchestration", source: "k8s_devops", sourceRef: "Cloud Native DevOps — Chapter 1: The Coming of Containers",
    sections: [
      { heading: "Why Containers?", content: "Containers package an application with everything it needs to run. They're lightweight, fast to start, and guarantee consistency across environments. Unlike VMs, they share the host OS kernel.", analogy: "VMs are like houses — each with its own plumbing, electricity, and foundation. Containers are like apartments — they share building infrastructure but each is self-contained inside.", code: null },
      { heading: "Conducting the Container Orchestra", content: "Running one container is simple. Running hundreds across multiple servers, handling failures, scaling, and networking — that's orchestration. Kubernetes emerged from Google's internal Borg system to solve exactly this.", analogy: null, code: null },
      { heading: "Cloud Native", content: "Being 'cloud native' means designing applications specifically for cloud environments: microservices, containers, dynamic orchestration, and continuous delivery. It's not just about running in the cloud — it's about leveraging the cloud's unique properties.", analogy: null, code: null },
    ],
  },
};

// ── Utility Functions ────────────────────────────────────────
function calculateNextReview(difficulty, repetitions) {
  const intervals = [1, 3, 7, 14, 30, 60];
  const idx = Math.min(repetitions, intervals.length - 1);
  let interval = intervals[idx];
  if (difficulty === "hard") interval = Math.max(1, Math.floor(interval * 0.5));
  if (difficulty === "easy") interval = Math.floor(interval * 1.5);
  return interval;
}

function analyzeSentiment(text) {
  const lower = text.toLowerCase();
  const frustrated = ["confused", "don't understand", "makes no sense", "hate", "ugh", "frustrated", "stuck", "lost", "help", "???", "idk"];
  const bored = ["boring", "easy", "already know", "too slow", "skip", "next", "whatever"];
  const confident = ["got it", "makes sense", "understand", "clear", "awesome", "great", "cool", "perfect"];
  if (frustrated.some(w => lower.includes(w))) return "frustrated";
  if (bored.some(w => lower.includes(w))) return "bored";
  if (confident.some(w => lower.includes(w))) return "confident";
  return "neutral";
}

// ── Theme ────────────────────────────────────────────────────
const T = {
  bg: "#06090f", bgCard: "#0f1419", bgHover: "#161d27", bgSurface: "#0b1018",
  accent: "#22d3ee", accentDim: "rgba(34,211,238,0.1)", accentGlow: "rgba(34,211,238,0.25)",
  green: "#34d399", greenDim: "rgba(52,211,153,0.1)",
  amber: "#fbbf24", amberDim: "rgba(251,191,36,0.1)",
  red: "#f87171", redDim: "rgba(248,113,113,0.1)",
  text: "#e2e8f0", textDim: "#94a3b8", textMuted: "#475569",
  border: "rgba(148,163,184,0.08)", borderLite: "rgba(148,163,184,0.15)",
};

// ── Source Badge Component ───────────────────────────────────
function SourceBadge({ sourceId, size = "sm" }) {
  const s = SOURCES[sourceId];
  if (!s) return null;
  const sizes = { xs: { pad: "2px 7px", font: 9, gap: 3 }, sm: { pad: "3px 10px", font: 10, gap: 4 }, md: { pad: "5px 14px", font: 12, gap: 6 } };
  const sz = sizes[size];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: sz.gap, padding: sz.pad, borderRadius: 6, fontSize: sz.font, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: s.color, background: s.colorDim, border: `1px solid ${s.color}25`, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      {s.icon} {s.tag}
    </span>
  );
}

function SourceAttribution({ sourceId, detail }) {
  const s = SOURCES[sourceId];
  if (!s) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, background: s.colorDim, border: `1px solid ${s.color}20`, marginBottom: 16 }}>
      <span style={{ fontSize: 18 }}>{s.icon}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: "'Outfit', sans-serif" }}>{s.title}</div>
        <div style={{ fontSize: 11, color: T.textDim, fontFamily: "'Outfit', sans-serif" }}>{detail || `${s.authors} — ${s.edition}`}</div>
      </div>
    </div>
  );
}

// ── State ────────────────────────────────────────────────────
const initialState = {
  screen: "welcome", studentName: "", experience: "beginner", learningStyle: "balanced",
  currentTopic: null, currentChapter: null, mastery: {}, quizState: null,
  streak: 0, totalXP: 0, chatHistory: [], sentimentHistory: [],
  settings: { socraticMode: false, activeTrack: "all" }, showKnowledgeTree: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SCREEN": return { ...state, screen: action.payload };
    case "SET_STUDENT": return { ...state, ...action.payload, screen: "dashboard" };
    case "SET_TOPIC": {
      const ch = CURRICULUM.find(c => c.topics.some(t => t.id === action.payload));
      return { ...state, currentTopic: action.payload, currentChapter: ch?.id, screen: "lesson" };
    }
    case "UPDATE_MASTERY": {
      const { topicId, score, difficulty } = action.payload;
      const prev = state.mastery[topicId] || { level: 0, attempts: 0 };
      const nextDays = calculateNextReview(difficulty || "normal", prev.attempts + 1);
      const nr = new Date(); nr.setDate(nr.getDate() + nextDays);
      return { ...state, mastery: { ...state.mastery, [topicId]: { level: Math.min(100, prev.level + score), attempts: prev.attempts + 1, lastReview: new Date().toISOString(), nextReview: nr.toISOString() } }, totalXP: state.totalXP + Math.round(score / 2) };
    }
    case "COMPLETE_QUIZ": { const pct = Math.round((action.payload.score / action.payload.total) * 100); return { ...state, quizState: { ...state.quizState, completed: true, finalScore: pct }, streak: pct >= 70 ? state.streak + 1 : 0 }; }
    case "SET_QUIZ": return { ...state, quizState: action.payload, screen: "quiz" };
    case "UPDATE_QUIZ": return { ...state, quizState: { ...state.quizState, ...action.payload } };
    case "TOGGLE_KNOWLEDGE_TREE": return { ...state, showKnowledgeTree: !state.showKnowledgeTree };
    case "UPDATE_SETTINGS": return { ...state, settings: { ...state.settings, ...action.payload } };
    case "ADD_SENTIMENT": return { ...state, sentimentHistory: [...state.sentimentHistory.slice(-20), action.payload] };
    default: return state;
  }
}

// ═══════════════════════════════════════════════════════════════
// WELCOME SCREEN
// ═══════════════════════════════════════════════════════════════
function WelcomeScreen({ dispatch }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [exp, setExp] = useState("beginner");
  const [style, setStyle] = useState("balanced");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 20% 20%, rgba(249,115,22,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.06) 0%, transparent 50%), ${T.bg}`, padding: 20 }}>
      <div style={{ maxWidth: 560, width: "100%", animation: "fadeUp .6s ease" }}>
        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              {Object.values(SOURCES).map(s => <span key={s.id} style={{ fontSize: 36, filter: `drop-shadow(0 0 12px ${s.colorGlow})` }}>{s.icon}</span>)}
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, color: T.text, margin: "0 0 6px", letterSpacing: "-.02em" }}>
              DevOps <span style={{ background: "linear-gradient(135deg, #f97316, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Academy</span>
            </h1>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: T.textDim, margin: "0 0 12px" }}>AI-powered tutor for Git, Kubernetes & Cloud Native DevOps</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
              {Object.values(SOURCES).map(s => (
                <span key={s.id} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, color: s.color, background: s.colorDim, border: `1px solid ${s.color}20`, fontFamily: "'JetBrains Mono', monospace" }}>{s.icon} {s.shortTitle}</span>
              ))}
            </div>
            <input type="text" placeholder="What's your name?" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && name.trim() && setStep(1)}
              style={{ width: "100%", maxWidth: 320, padding: "14px 20px", borderRadius: 12, border: `1px solid ${T.borderLite}`, background: T.bgCard, color: T.text, fontSize: 16, fontFamily: "'Outfit', sans-serif", outline: "none", textAlign: "center", boxSizing: "border-box", marginBottom: 16 }} />
            <br />
            <button onClick={() => name.trim() && setStep(1)} disabled={!name.trim()}
              style={{ padding: "14px 48px", borderRadius: 12, border: "none", background: name.trim() ? "linear-gradient(135deg, #f97316, #3b82f6)" : T.bgCard, color: name.trim() ? "#fff" : T.textMuted, fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: name.trim() ? "pointer" : "default", boxShadow: name.trim() ? "0 4px 20px rgba(249,115,22,0.3)" : "none" }}>
              Get Started →
            </button>
          </div>
        )}
        {step === 1 && (
          <div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: T.accent, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".1em" }}>Step 1 of 2</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, color: T.text, margin: "0 0 24px" }}>Hey {name}! What's your experience level?</h2>
            {[
              { id: "beginner", label: "Beginner", desc: "New to Git and/or Kubernetes", icon: "🌱" },
              { id: "intermediate", label: "Intermediate", desc: "Know the basics, want to go deeper", icon: "🌿" },
              { id: "advanced", label: "Advanced", desc: "Want to master internals & production ops", icon: "🌳" },
            ].map(e => (
              <button key={e.id} onClick={() => { setExp(e.id); setStep(2); }}
                style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px 18px", borderRadius: 14, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left", marginBottom: 10 }}>
                <span style={{ fontSize: 26 }}>{e.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: T.text }}>{e.label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: T.textDim }}>{e.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: T.accent, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".1em" }}>Step 2 of 2</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, color: T.text, margin: "0 0 24px" }}>How do you learn best?</h2>
            {[
              { id: "analogies", label: "Analogies & Stories", icon: "📖" },
              { id: "technical", label: "Technical & Code-First", icon: "⚡" },
              { id: "visual", label: "Step-by-Step Breakdowns", icon: "🎨" },
              { id: "balanced", label: "Mix of Everything", icon: "🎯" },
            ].map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "14px 18px", borderRadius: 14, border: `1px solid ${style === s.id ? T.accent + "40" : T.border}`, background: style === s.id ? T.accentDim : T.bgCard, cursor: "pointer", textAlign: "left", marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: T.text }}>{s.label}</span>
              </button>
            ))}
            <button onClick={() => dispatch({ type: "SET_STUDENT", payload: { studentName: name, experience: exp, learningStyle: style } })}
              style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f97316, #3b82f6)", color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", marginTop: 16, boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}>
              Start Learning →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Dashboard({ state, dispatch }) {
  const [tab, setTab] = useState("learn");
  const [trackFilter, setTrackFilter] = useState("all");

  const filteredCurriculum = trackFilter === "all" ? CURRICULUM : CURRICULUM.filter(c => c.source === trackFilter);
  const filteredTopics = filteredCurriculum.flatMap(c => c.topics);
  const allTopics = CURRICULUM.flatMap(c => c.topics);

  const masteredCount = filteredTopics.filter(t => (state.mastery[t.id]?.level || 0) >= 80).length;
  const overallPct = filteredTopics.length > 0 ? Math.round(filteredTopics.reduce((s, t) => s + (state.mastery[t.id]?.level || 0), 0) / (filteredTopics.length * 100) * 100) : 0;

  const getNextTopic = () => {
    for (const ch of filteredCurriculum) {
      for (const t of ch.topics) {
        if ((state.mastery[t.id]?.level || 0) < 80) {
          if (t.prereqs.length === 0 || t.prereqs.every(p => (state.mastery[p]?.level || 0) >= 40)) return { topic: t, chapter: ch };
        }
      }
    }
    return null;
  };

  const getDueReviews = () => {
    const now = new Date();
    return filteredTopics.filter(t => { const m = state.mastery[t.id]; return m && m.level >= 20 && (!m.nextReview || new Date(m.nextReview) <= now); });
  };

  const nextTopic = getNextTopic();
  const dueReviews = getDueReviews();

  const getWarmup = () => {
    const learned = allTopics.filter(t => (state.mastery[t.id]?.level || 0) >= 20);
    if (!learned.length) return null;
    const rt = learned[Math.floor(Math.random() * learned.length)];
    const qs = QUESTION_BANK[rt.id] || [];
    return qs.length ? { topic: rt, question: qs[Math.floor(Math.random() * qs.length)] } : null;
  };
  const warmup = getWarmup();

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ background: T.bgCard, borderBottom: `1px solid ${T.border}`, padding: "14px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>📙📘📕</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: T.text }}>DevOps Academy</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: T.amber }}>🔥 {state.streak}</span>
            <span style={{ fontSize: 13, color: T.accent }}>✨ {state.totalXP} XP</span>
            <button onClick={() => dispatch({ type: "TOGGLE_KNOWLEDGE_TREE" })} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSurface, color: T.text, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>🌳 Knowledge Tree</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Source Filter */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={() => setTrackFilter("all")}
            style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${trackFilter === "all" ? T.accent + "40" : T.border}`, background: trackFilter === "all" ? T.accentDim : "transparent", color: trackFilter === "all" ? T.accent : T.textDim, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>All Sources</button>
          {Object.values(SOURCES).map(s => (
            <button key={s.id} onClick={() => setTrackFilter(s.id)}
              style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${trackFilter === s.id ? s.color + "40" : T.border}`, background: trackFilter === s.id ? s.colorDim : "transparent", color: trackFilter === s.id ? s.color : T.textDim, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: 5 }}>
              {s.icon} {s.tag}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Progress", value: `${overallPct}%`, color: T.accent, icon: "📊" },
            { label: "Mastered", value: `${masteredCount}/${filteredTopics.length}`, color: T.green, icon: "✅" },
            { label: "Due Review", value: dueReviews.length, color: dueReviews.length > 0 ? T.red : T.textMuted, icon: "🔄" },
            { label: "Streak", value: state.streak, color: T.amber, icon: "🔥" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "16px 18px", borderRadius: 14, border: `1px solid ${T.border}`, background: T.bgCard }}>
              <div style={{ fontSize: 12, color: T.textDim, marginBottom: 6 }}>{s.icon} {s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Recommended + Warmup */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {nextTopic && (
            <button onClick={() => dispatch({ type: "SET_TOPIC", payload: nextTopic.topic.id })}
              style={{ padding: "18px 20px", borderRadius: 14, border: `1px solid ${SOURCES[nextTopic.topic.source].color}30`, background: SOURCES[nextTopic.topic.source].colorDim, cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: T.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>▶ Up Next</span>
                <SourceBadge sourceId={nextTopic.topic.source} size="xs" />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{nextTopic.topic.title}</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{nextTopic.chapter.icon} {nextTopic.chapter.title}</div>
            </button>
          )}
          {warmup && (
            <div style={{ padding: "18px 20px", borderRadius: 14, border: `1px solid ${T.border}`, background: T.bgCard }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: T.amber, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>☀️ Daily Warm-up</span>
                <SourceBadge sourceId={warmup.topic.source} size="xs" />
              </div>
              <div style={{ fontSize: 13, color: T.text, marginBottom: 10, lineHeight: 1.5 }}>{warmup.question.q}</div>
              <button onClick={() => dispatch({ type: "SET_QUIZ", payload: { questions: [warmup.question], currentIdx: 0, answers: [], score: 0, topicId: warmup.topic.id, isWarmup: true } })}
                style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: T.amberDim, color: T.amber, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Answer Now</button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18, background: T.bgCard, borderRadius: 10, padding: 3, border: `1px solid ${T.border}` }}>
          {[{ id: "learn", label: "📚 Learn" }, { id: "review", label: `🔄 Review${dueReviews.length ? ` (${dueReviews.length})` : ""}` }, { id: "progress", label: "📊 Progress" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: "9px 14px", borderRadius: 8, border: "none", background: tab === t.id ? T.accentDim : "transparent", color: tab === t.id ? T.accent : T.textDim, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.label}</button>
          ))}
        </div>

        {tab === "progress" ? <ProgressReport state={state} filter={trackFilter} /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(tab === "review" && !dueReviews.length) ? (
              <div style={{ textAlign: "center", padding: 40, color: T.textDim }}><div style={{ fontSize: 44, marginBottom: 10 }}>✨</div><div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>All caught up!</div></div>
            ) : filteredCurriculum.map(ch => <ChapterCard key={ch.id} chapter={ch} mastery={state.mastery} dispatch={dispatch} isReview={tab === "review"} dueReviews={dueReviews} />)}
          </div>
        )}
      </div>

      {state.showKnowledgeTree && <KnowledgeTree mastery={state.mastery} onSelect={id => dispatch({ type: "SET_TOPIC", payload: id })} onClose={() => dispatch({ type: "TOGGLE_KNOWLEDGE_TREE" })} />}
    </div>
  );
}

function ChapterCard({ chapter, mastery, dispatch, isReview, dueReviews }) {
  const [open, setOpen] = useState(false);
  const src = SOURCES[chapter.source];
  const topics = isReview ? chapter.topics.filter(t => dueReviews.find(d => d.id === t.id)) : chapter.topics;
  if (isReview && !topics.length) return null;
  const avg = Math.round(chapter.topics.reduce((s, t) => s + (mastery[t.id]?.level || 0), 0) / chapter.topics.length);

  return (
    <div style={{ borderRadius: 14, border: `1px solid ${T.border}`, background: T.bgCard, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: 26 }}>{chapter.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, color: T.text }}>{chapter.title}</span>
            <SourceBadge sourceId={chapter.source} size="xs" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, maxWidth: 100, height: 4, borderRadius: 2, background: T.border, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: src.color, width: `${avg}%`, transition: "width .5s" }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.textDim }}>{avg}%</span>
          </div>
        </div>
        <span style={{ color: T.textMuted, fontSize: 12, transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform .2s" }}>▶</span>
      </button>
      {open && (
        <div style={{ padding: "2px 18px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          {topics.map(t => {
            const level = mastery[t.id]?.level || 0;
            const locked = t.prereqs.length > 0 && !t.prereqs.every(p => (mastery[p]?.level || 0) >= 40) && level === 0;
            return (
              <button key={t.id} onClick={() => !locked && dispatch({ type: "SET_TOPIC", payload: t.id })} disabled={locked}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, border: `1px solid ${locked ? T.border : level >= 80 ? T.green + "30" : T.border}`, background: locked ? T.bgSurface : level >= 80 ? T.greenDim : T.bgSurface, cursor: locked ? "not-allowed" : "pointer", opacity: locked ? .5 : 1, textAlign: "left" }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, background: locked ? T.border : level >= 80 ? T.greenDim : T.accentDim, color: locked ? T.textMuted : level >= 80 ? T.green : T.accent }}>
                  {locked ? "🔒" : level >= 80 ? "✓" : "→"}
                </div>
                <span style={{ flex: 1, fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: locked ? T.textMuted : T.text }}>{t.title}</span>
                <SourceBadge sourceId={t.source} size="xs" />
                <MasteryBadge level={level} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MasteryBadge({ level }) {
  const c = level >= 80 ? T.green : level >= 50 ? T.amber : level >= 20 ? T.accent : T.textMuted;
  const l = level >= 80 ? "Mastered" : level >= 50 ? "Proficient" : level >= 20 ? "Learning" : "New";
  return <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, color: c, background: `${c}18`, fontFamily: "'Outfit', sans-serif" }}>{l}</span>;
}

function KnowledgeTree({ mastery, onSelect, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div style={{ maxWidth: 820, width: "100%", maxHeight: "85vh", overflow: "auto", background: T.bgCard, borderRadius: 18, border: `1px solid ${T.border}`, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>🌳 Knowledge Tree</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textDim, fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {Object.values(SOURCES).map(src => {
          const chapters = CURRICULUM.filter(c => c.source === src.id);
          if (!chapters.length) return null;
          return (
            <div key={src.id} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>{src.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: src.color, fontFamily: "'Outfit', sans-serif" }}>{src.title}</div>
                  <div style={{ fontSize: 11, color: T.textDim }}>{src.authors}</div>
                </div>
              </div>
              {chapters.map(ch => {
                const avg = Math.round(ch.topics.reduce((s, t) => s + (mastery[t.id]?.level || 0), 0) / ch.topics.length);
                return (
                  <div key={ch.id} style={{ marginBottom: 14, paddingLeft: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span>{ch.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text, flex: 1 }}>{ch.title}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.textDim }}>{avg}%</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 24 }}>
                      {ch.topics.map(t => {
                        const m = mastery[t.id]?.level || 0;
                        return (
                          <button key={t.id} onClick={() => { onSelect(t.id); onClose(); }}
                            style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${m >= 80 ? T.green + "40" : m > 0 ? src.color + "30" : T.border}`, background: m >= 80 ? T.greenDim : m > 0 ? src.colorDim : T.bgSurface, color: m >= 80 ? T.green : m > 0 ? src.color : T.textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                            {m >= 80 ? "✓ " : ""}{t.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressReport({ state, filter }) {
  const chapters = filter === "all" ? CURRICULUM : CURRICULUM.filter(c => c.source === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {Object.values(SOURCES).map(src => {
        const chs = chapters.filter(c => c.source === src.id);
        if (!chs.length) return null;
        const topics = chs.flatMap(c => c.topics);
        const avg = topics.length ? Math.round(topics.reduce((s, t) => s + (state.mastery[t.id]?.level || 0), 0) / (topics.length * 100) * 100) : 0;
        return (
          <div key={src.id} style={{ padding: 20, borderRadius: 14, border: `1px solid ${src.color}20`, background: T.bgCard }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>{src.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: src.color }}>{src.title}</div>
                <div style={{ fontSize: 11, color: T.textDim }}>{src.authors}</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: src.color }}>{avg}%</span>
            </div>
            {chs.map(ch => {
              const chAvg = Math.round(ch.topics.reduce((s, t) => s + (state.mastery[t.id]?.level || 0), 0) / ch.topics.length);
              return (
                <div key={ch.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>{ch.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{ch.title}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.textDim }}>{chAvg}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: T.border, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, background: src.color, width: `${chAvg}%`, transition: "width .6s" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LESSON VIEW
// ═══════════════════════════════════════════════════════════════
function LessonView({ state, dispatch }) {
  const [secIdx, setSecIdx] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const topic = CURRICULUM.flatMap(c => c.topics).find(t => t.id === state.currentTopic);
  const chapter = CURRICULUM.find(c => c.topics.some(t => t.id === state.currentTopic));
  const src = SOURCES[topic?.source];

  const content = LESSON_CONTENT[state.currentTopic] || {
    title: topic?.title, source: topic?.source, sourceRef: `${src?.shortTitle}`,
    sections: [{ heading: topic?.title, content: `This lesson covers ${topic?.title}. Key concepts: ${topic?.keywords.join(", ")}.`, analogy: state.learningStyle !== "technical" ? `Think of ${topic?.keywords[0]} as a foundational building block.` : null, code: null }],
  };

  const section = content.sections[secIdx];
  const isLast = secIdx === content.sections.length - 1;

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMsgs(prev => [...prev, { role: "user", text: msg }]);
    const sentiment = analyzeSentiment(msg);
    dispatch({ type: "ADD_SENTIMENT", payload: { sentiment, time: Date.now(), topic: state.currentTopic } });
    setLoading(true);
    setTimeout(() => {
      let resp = "";
      const srcLabel = `[Source: ${src?.shortTitle}]`;
      if (sentiment === "frustrated") resp = `I can see this is tricky — totally normal! Let's break "${section.heading}" down differently.\n\n${section.analogy || "Let's take it step by step."}\n\nWhat part specifically feels unclear? ${srcLabel}`;
      else if (sentiment === "bored") resp = `Sounds like you're ready for more! Want to jump to the quiz to test your mastery, or move to a more advanced topic? ${srcLabel}`;
      else if (sentiment === "confident") resp = `Great! Quick check: can you explain how ${topic.keywords[Math.floor(Math.random() * topic.keywords.length)]} works here? Try explaining it as if teaching someone else. ${srcLabel}`;
      else if (state.settings.socraticMode) resp = `Good question! Instead of answering directly, let me guide you: What do you already know about ${topic.keywords[0]}? How might it relate to "${section.heading}"? ${srcLabel}`;
      else resp = `In the context of "${section.heading}" (from ${src?.title}):\n\n${section.content.substring(0, 200)}...\n\nKey concepts: ${topic.keywords.join(", ")}. ${srcLabel}`;
      setChatMsgs(prev => [...prev, { role: "ai", text: resp, source: topic.source }]);
      setLoading(false);
    }, 700);
  };

  const startQuiz = () => {
    const qs = QUESTION_BANK[state.currentTopic] || [];
    if (qs.length) dispatch({ type: "SET_QUIZ", payload: { questions: qs, currentIdx: 0, answers: [], score: 0, topicId: state.currentTopic } });
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ background: T.bgCard, borderBottom: `1px solid ${T.border}`, padding: "10px 20px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => dispatch({ type: "SET_SCREEN", payload: "dashboard" })} style={{ background: "none", border: "none", color: T.textDim, fontSize: 20, cursor: "pointer" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 12, color: src?.color, fontWeight: 600 }}>{chapter?.icon} {chapter?.title}</span>
              <SourceBadge sourceId={topic?.source} size="xs" />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{content.title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {content.sections.map((_, i) => <div key={i} style={{ width: 20, height: 3, borderRadius: 2, background: i <= secIdx ? src?.color : T.border }} />)}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
        <SourceAttribution sourceId={content.source} detail={content.sourceRef} />

        <div style={{ animation: "fadeUp .4s ease" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: T.text, margin: "0 0 18px", letterSpacing: "-.02em" }}>{section.heading}</h2>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: T.textDim, marginBottom: 18 }}>{section.content}</div>

          {section.analogy && state.learningStyle !== "technical" && (
            <div style={{ padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.08)", marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>💡 Analogy</div>
              <div style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>{section.analogy}</div>
            </div>
          )}

          {section.code && (
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, marginBottom: 18 }}>
              <div style={{ padding: "6px 14px", background: T.bgSurface, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.red }} />
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.amber }} />
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }} />
                <span style={{ marginLeft: 8, fontSize: 11, color: T.textMuted }}>Terminal</span>
                <span style={{ marginLeft: "auto" }}><SourceBadge sourceId={content.source} size="xs" /></span>
              </div>
              <pre style={{ margin: 0, padding: "14px 18px", background: "#0d1117", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.7, color: "#c9d1d9", overflow: "auto" }}>{section.code}</pre>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
          <button onClick={() => secIdx > 0 && setSecIdx(secIdx - 1)} disabled={secIdx === 0}
            style={{ padding: "11px 22px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgCard, color: secIdx === 0 ? T.textMuted : T.text, fontSize: 13, fontWeight: 600, cursor: secIdx === 0 ? "default" : "pointer", fontFamily: "'Outfit', sans-serif" }}>← Previous</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowChat(!showChat)}
              style={{ padding: "11px 18px", borderRadius: 10, border: `1px solid ${T.border}`, background: showChat ? T.accentDim : T.bgCard, color: showChat ? T.accent : T.text, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
              💬 {state.settings.socraticMode ? "Socratic" : "Ask"}
            </button>
            {isLast ? (
              <button onClick={startQuiz} style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${T.green}, #10b981)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Take Quiz →</button>
            ) : (
              <button onClick={() => setSecIdx(secIdx + 1)} style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${src?.color || T.accent}, ${T.accent})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Continue →</button>
            )}
          </div>
        </div>

        {showChat && (
          <div style={{ borderRadius: 14, border: `1px solid ${T.border}`, background: T.bgCard, overflow: "hidden", animation: "fadeUp .3s ease" }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{state.settings.socraticMode ? "🏛️ Socratic Mode" : "💬 Ask About This Topic"}</span>
              <button onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { socraticMode: !state.settings.socraticMode } })}
                style={{ padding: "3px 10px", borderRadius: 6, border: `1px solid ${state.settings.socraticMode ? T.accent + "40" : T.border}`, background: state.settings.socraticMode ? T.accentDim : "transparent", color: state.settings.socraticMode ? T.accent : T.textDim, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                Socratic {state.settings.socraticMode ? "ON" : "OFF"}
              </button>
            </div>
            <div style={{ maxHeight: 280, overflow: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {!chatMsgs.length && <div style={{ textAlign: "center", padding: 16, color: T.textDim, fontSize: 13 }}>Ask me anything about this topic. Responses will cite their source book.</div>}
              {chatMsgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "80%", padding: "9px 13px", borderRadius: 10, background: m.role === "user" ? T.accentDim : T.bgSurface, border: `1px solid ${m.role === "user" ? T.accent + "30" : T.border}`, color: T.text, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {m.role === "ai" && m.source && <div style={{ marginBottom: 4 }}><SourceBadge sourceId={m.source} size="xs" /></div>}
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <div style={{ display: "flex", gap: 4, padding: 8 }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, animation: `pulse 1.2s ease-in-out ${i*.2}s infinite` }} />)}</div>}
            </div>
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleChat()} placeholder="Type your question..."
                style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSurface, color: T.text, fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none" }} />
              <button onClick={handleChat} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: T.accent, color: T.bg, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Send</button>
            </div>
          </div>
        )}

        {secIdx > 0 && secIdx < content.sections.length - 1 && <FormativeCheck topic={topic} src={src} />}
      </div>
    </div>
  );
}

function FormativeCheck({ topic, src }) {
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const kw = topic.keywords[Math.floor(Math.random() * topic.keywords.length)];
  return (
    <div style={{ padding: "14px 18px", borderRadius: 12, border: `1px solid ${T.amber}20`, background: T.amberDim }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.amber, textTransform: "uppercase", letterSpacing: ".06em" }}>✋ Quick Check</span>
        <SourceBadge sourceId={topic.source} size="xs" />
      </div>
      <div style={{ fontSize: 13, color: T.text, marginBottom: 10 }}>What does "<strong>{kw}</strong>" mean in the context of {topic.title}?</div>
      {!revealed ? (
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Your answer..."
            style={{ flex: 1, padding: "7px 10px", borderRadius: 7, border: `1px solid ${T.border}`, background: T.bgSurface, color: T.text, fontSize: 12, fontFamily: "'Outfit', sans-serif", outline: "none" }} />
          <button onClick={() => setRevealed(true)} style={{ padding: "7px 14px", borderRadius: 7, border: "none", background: T.amber, color: T.bg, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Check</button>
        </div>
      ) : (
        <div style={{ fontSize: 13, color: T.green, lineHeight: 1.5 }}>✓ "{kw}" relates to: {topic.keywords.join(", ")}. (Source: {src?.shortTitle})</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUIZ VIEW
// ═══════════════════════════════════════════════════════════════
function QuizView({ state, dispatch }) {
  const [selOpt, setSelOpt] = useState(null);
  const [openAns, setOpenAns] = useState("");
  const [fillAns, setFillAns] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fb, setFb] = useState(null);

  const { questions, currentIdx, answers, score, topicId } = state.quizState;
  const q = questions[currentIdx];
  const isComplete = state.quizState.completed;
  const topic = CURRICULUM.flatMap(c => c.topics).find(t => t.id === topicId);
  const src = SOURCES[q?.source || topic?.source];

  const submit = () => {
    let correct = false, text = "";
    if (q.type === "mc") { correct = selOpt === q.answer; text = correct ? "Correct! " + (q.explanation || "") : `Not quite. Answer: ${q.options[q.answer]}. ${q.explanation || ""}`; }
    else if (q.type === "fill") { correct = fillAns.trim().toLowerCase() === q.answer.toLowerCase(); text = correct ? "Correct!" : `Answer: "${q.answer}".`; }
    else { const matched = q.rubric.filter(r => openAns.toLowerCase().includes(r.toLowerCase())); correct = matched.length >= Math.ceil(q.rubric.length * .5); text = correct ? `Good! Covered: ${matched.join(", ")}.` : `Key points: ${q.rubric.join(", ")}.`; }
    setSubmitted(true); setFb({ correct, text });
    dispatch({ type: "UPDATE_QUIZ", payload: { score: score + (correct ? 1 : 0), answers: [...answers, { questionIdx: currentIdx, correct }] } });
    dispatch({ type: "UPDATE_MASTERY", payload: { topicId, score: correct ? 20 : 5, difficulty: correct ? "easy" : "hard" } });
  };

  const next = () => {
    if (currentIdx + 1 >= questions.length) dispatch({ type: "COMPLETE_QUIZ", payload: { score: state.quizState.score, total: questions.length } });
    else { dispatch({ type: "UPDATE_QUIZ", payload: { currentIdx: currentIdx + 1 } }); setSelOpt(null); setOpenAns(""); setFillAns(""); setSubmitted(false); setFb(null); }
  };

  if (isComplete) {
    const pct = state.quizState.finalScore;
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", padding: 24 }}>
        <div style={{ maxWidth: 460, width: "100%", textAlign: "center", animation: "fadeUp .5s ease" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{pct >= 70 ? "🎉" : "💪"}</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: "0 0 10px" }}>{pct >= 70 ? "Excellent!" : "Keep Practicing!"}</h2>
          <div style={{ marginBottom: 20 }}><SourceBadge sourceId={topic?.source} size="md" /></div>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: "50%", border: `4px solid ${pct >= 70 ? T.green : T.amber}`, margin: "0 0 24px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 30, fontWeight: 800, color: pct >= 70 ? T.green : T.amber }}>{pct}%</span>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => dispatch({ type: "SET_SCREEN", payload: "dashboard" })}
              style={{ padding: "12px 24px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgCard, color: T.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Dashboard</button>
            {pct < 70 && <button onClick={() => dispatch({ type: "SET_TOPIC", payload: topicId })}
              style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${src?.color || T.accent}, ${T.accent})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Review Lesson</button>}
          </div>
        </div>
      </div>
    );
  }

  const canSubmit = q.type === "mc" ? selOpt !== null : q.type === "fill" ? fillAns.trim() : openAns.trim();

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ background: T.bgCard, borderBottom: `1px solid ${T.border}`, padding: "10px 20px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => dispatch({ type: "SET_SCREEN", payload: "dashboard" })} style={{ background: "none", border: "none", color: T.textDim, fontSize: 20, cursor: "pointer" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>📝 Quiz</span>
              <SourceBadge sourceId={topic?.source} size="xs" />
            </div>
            <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
              {questions.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < currentIdx ? (answers[i]?.correct ? T.green : T.red) : i === currentIdx ? T.accent : T.border }} />)}
            </div>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: T.textDim }}>{currentIdx + 1}/{questions.length}</span>
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "36px 20px" }}>
        <div style={{ animation: "fadeUp .4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, color: T.accent, background: T.accentDim }}>
              {q.type === "mc" ? "Multiple Choice" : q.type === "fill" ? "Fill in the Blank" : "Open Answer"}
            </span>
            <SourceBadge sourceId={q.source || topic?.source} size="xs" />
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 24px", lineHeight: 1.5 }}>{q.q}</h3>

          {q.type === "mc" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map((opt, i) => {
                const isSel = selOpt === i, isCorrect = submitted && i === q.answer, isWrong = submitted && isSel && !fb.correct;
                return (
                  <button key={i} onClick={() => !submitted && setSelOpt(i)} disabled={submitted}
                    style={{ padding: "14px 18px", borderRadius: 10, textAlign: "left", cursor: submitted ? "default" : "pointer",
                      border: `2px solid ${isCorrect ? T.green : isWrong ? T.red : isSel ? T.accent : T.border}`,
                      background: isCorrect ? T.greenDim : isWrong ? T.redDim : isSel ? T.accentDim : T.bgCard,
                      color: T.text, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 7, marginRight: 10, fontSize: 12, fontWeight: 700, background: isCorrect ? T.green : isWrong ? T.red : isSel ? T.accent : T.border, color: (isCorrect || isWrong || isSel) ? "#fff" : T.textDim }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "fill" && (
            <input type="text" value={fillAns} onChange={e => setFillAns(e.target.value)} disabled={submitted} placeholder="Type your answer..."
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `2px solid ${submitted ? (fb?.correct ? T.green : T.red) : T.border}`, background: T.bgCard, color: T.text, fontSize: 15, fontFamily: "'JetBrains Mono', monospace", outline: "none", boxSizing: "border-box" }} />
          )}

          {q.type === "open" && (
            <textarea value={openAns} onChange={e => setOpenAns(e.target.value)} disabled={submitted} placeholder="Explain in your own words..." rows={4}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `2px solid ${submitted ? (fb?.correct ? T.green : T.red) : T.border}`, background: T.bgCard, color: T.text, fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
          )}

          {fb && (
            <div style={{ marginTop: 18, padding: "14px 18px", borderRadius: 12, border: `1px solid ${fb.correct ? T.green + "40" : T.red + "40"}`, background: fb.correct ? T.greenDim : T.redDim, animation: "fadeUp .3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: fb.correct ? T.green : T.red }}>{fb.correct ? "✅ Correct!" : "❌ Not quite"}</span>
                <SourceBadge sourceId={q.source || topic?.source} size="xs" />
              </div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{fb.text}</div>
            </div>
          )}

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            {!submitted ? (
              <button onClick={submit} disabled={!canSubmit}
                style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: canSubmit ? `linear-gradient(135deg, ${src?.color || T.accent}, ${T.accent})` : T.bgCard, color: canSubmit ? "#fff" : T.textMuted, fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "default", fontFamily: "'Outfit', sans-serif" }}>Submit</button>
            ) : (
              <button onClick={next}
                style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${src?.color || T.accent}, ${T.accent})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                {currentIdx + 1 >= questions.length ? "See Results" : "Next →"}
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
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100% { opacity:.3; transform:scale(.8) } 50% { opacity:1; transform:scale(1) } }
        * { box-sizing:border-box; margin:0; padding:0 }
        ::-webkit-scrollbar { width:5px } ::-webkit-scrollbar-track { background:transparent } ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:3px }
        ::selection { background:${T.accentGlow}; color:${T.text} }
        input::placeholder, textarea::placeholder { color:${T.textMuted} }
      `}</style>
      <div style={{ minHeight: "100vh", background: T.bg }}>
        {state.screen === "welcome" && <WelcomeScreen dispatch={dispatch} />}
        {state.screen === "dashboard" && <Dashboard state={state} dispatch={dispatch} />}
        {state.screen === "lesson" && <LessonView state={state} dispatch={dispatch} />}
        {state.screen === "quiz" && <QuizView state={state} dispatch={dispatch} />}
      </div>
    </>
  );
}
