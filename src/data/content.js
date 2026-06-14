// ============================================================================
//  CONTENT  — all copy lives here so components stay clean.
// ============================================================================

export const PROFILE = {
  name: "Yeshwant Singh",
  pronouns: "He/Him",
  headline: "AI Project Coordinator | AI | ML | Data Science",
  location: "Melbourne, Victoria, Australia",
  company: "Translated",
  university: "RMIT University",
  connections: "500+ connections",
  topSkills: [
    "Machine Learning",
    "Artificial Intelligence",
    "Deep Learning",
    "Data Science",
    "Automation",
  ],
  aboutPreview:
    "I’m an AI Project Coordinator at Translated, where I run 8+ multilingual data projects at once across 25+ languages each. I build systems that make messy AI operations easier to track, cleaner to manage, and faster to deliver.",
  workRights:
    "Full-time work rights in Australia · Subclass 485 until 1 May 2028",
};

export const HERO = {
  quote: "You can’t see the whole picture until you step outside it.",
  quoteBackup: "A Bigger Picture.",
  kicker: "The Bigger Picture",
};

export const ABOUT = {
  title: "Built Between AI and Operations",
  lead: "I keep complex AI work moving — measurable, clean, and on time.",
  paragraphs: [
    "I’m an AI Project Coordinator at Translated, working across multilingual AI data projects — annotation, transcription, validation, review, and audio/video evaluation.",
    "I run 8+ projects at once, often across 25+ languages, building automation in Google Sheets, Docs, and Apps Script to track resources, pending work, follow-ups, and project readiness.",
    "Before this I worked closer to the data — 1000+ AI training tasks at Translated, plus 500+ coding-model evaluations as an AI Trainer at Scale AI across Python, C++, JavaScript, and C.",
    "My background spans AI operations, machine learning, data science, automation, and cloud. I build practical systems that make hard work easier to move, measure, and deliver.",
  ],
  stats: [
    { value: "8+", label: "Live projects, in parallel" },
    { value: "25+", label: "Languages per project" },
    { value: "1000+", label: "AI training tasks processed" },
    { value: "~55%", label: "Completion rate, lifted" },
  ],
};

export const EXPERIENCE = [
  {
    role: "AI Project Coordinator",
    company: "Translated",
    location: "Melbourne, VIC, Australia",
    date: "10/2025 — Present",
    current: true,
    clients: ["Uber", "NVIDIA"],
    points: [
      "Managed 8+ multilingual AI data projects at once across annotation, transcription, validation, review, audio and video evaluation.",
      "Owned resource onboarding, eligibility, availability checks, task updates and follow-ups across 25+ languages.",
      "Built Google Sheets, Docs and Apps Script systems for resource tracking, pending volumes, follow-ups and kick-off comms.",
      "Designed workflows that made pending work easy to track and lifted project completion to an estimated 50–55%.",
      "Aligned internal and client stakeholders on scope, languages, AHT, guidelines, volumes, start dates and blockers before rollout.",
    ],
  },
  {
    role: "AI/ML Engineer Intern",
    company: "InflaMed",
    location: "Melbourne, VIC, Australia",
    date: "06/2024 — 11/2024",
    points: [
      "Built an AI-powered patient triage system using 1000+ patient summaries.",
      "Created keyword identification and scoring logic to detect medical red flags.",
      "Ranked patient cases by urgency for faster doctor review.",
      "Reduced manual report scanning by ~97% through earlier flagging of critical cases.",
    ],
  },
  {
    role: "Data Processor",
    company: "Translated",
    location: "Melbourne, VIC, Australia",
    date: "06/2024 — 10/2025",
    points: [
      "Reviewed and processed 1000+ AI training tasks across annotation, validation and quality review.",
      "Assessed model outputs for accuracy, instruction match and language quality.",
      "Raised confusing guidelines and recurring issues early to cut repeated problems.",
      "Worked on training-data workflows including SFT, RLHF, validation and review.",
    ],
  },
  {
    role: "AI Trainer",
    company: "Scale AI",
    location: "Melbourne, VIC, Australia",
    date: "12/2023 — 05/2024",
    points: [
      "Evaluated 500+ AI coding-model responses across explanation, debugging and generation.",
      "Worked across Python, C++, JavaScript and C tasks.",
      "Reviewed faulty fixes, generated solutions and explanation quality.",
    ],
  },
  {
    role: "Operations Support Assistant",
    company: "Citi",
    location: "Chennai, Tamil Nadu, India",
    date: "10/2020 — 02/2023",
    points: [
      "Processed 100+ daily banking operation records.",
      "Managed data checks, case updates and pending operational items.",
      "Worked with internal teams to reduce delays and hold turnaround targets.",
    ],
  },
];

export const PROJECTS = [
  {
    feat: true,
    render: "assistant",
    tag: "Generative AI · Live",
    metric: "Ask anything",
    name: "Portfolio AI Assistant",
    desc: "A conversational AI assistant embedded in this portfolio that answers visitors' questions about my work, projects, skills and experience in real time. Built on an LLM API with a secure serverless proxy (Cloudflare Worker) holding the key, a streaming token-by-token chat UI, and a guardrailed system prompt that keeps answers professional. Hosted on GitHub Pages.",
    stack: ["LLM API", "Cloudflare Workers", "Streaming", "Prompt Engineering", "JavaScript"],
    link: { href: "https://singhyeshwant.github.io/assistant/", label: "Chat with my assistant", hot: true },
  },
  {
    feat: true,
    render: "conveyor",
    tag: "Automation · Latest build",
    metric: "100% hands-off",
    name: "Autonomous Job Application Engine",
    desc: "A Google Apps Script system wired to a Google Sheet that scrapes job listings with Apify, then calls the Claude API to generate tailored cover letters and follow-up emails. It fills a Slides template, exports branded PDFs, auto-fits overflowing layouts, and drafts personalised follow-up emails in Gmail with the resume and cover letter attached. Strict prompt engineering keeps the voice human and on-brand across every run.",
    stack: ["Apps Script", "Apify", "Claude API", "Prompt Engineering", "Gmail API", "Slides API"],
    link: null,
  },
  {
    feat: false,
    render: "gauge",
    tag: "AI Safety · Live",
    metric: "94.9% AUC",
    name: "Prism",
    desc: "An AI-safety scanner that flags harmful content in human–AI conversations in real time. Built on DeBERTa-v3-large (434M params) with a multi-task head set — harm, stereotyping, demeaning output, human bias, AI agreement and a recommendation score. Augmenting FairPrism with 15k benign conversations (BeaverTails + Anthropic HH-RLHF) lifted harm-detection AUC from 93.1% to 94.9% and AI-agreement macro-F1 from 0.599 to 0.760. FastAPI on Hugging Face Spaces (Docker); frontend on Vercel.",
    stack: ["Python", "DeBERTa-v3", "FastAPI", "Hugging Face", "Docker", "Vercel"],
    link: { href: "https://prism-pink-one.vercel.app/", label: "Try Prism live", hot: true },
  },
  {
    feat: false,
    render: "triage",
    tag: "Healthcare AI",
    metric: "97% \u2193",
    name: "AI Patient Triage System",
    desc: "Built at InflaMed to sort 1000+ patient summaries by urgency. Keyword detection and scoring logic surface medical red flags, cutting manual report scanning by roughly 97% so clinicians reach critical cases sooner.",
    stack: ["Python", "NLP", "Scoring Logic", "Data Viz"],
    link: null,
  },
  {
    feat: false,
    render: "classify",
    tag: "NLP · Live",
    metric: "88.1%",
    name: "JobLens",
    desc: "A full-stack NLP pipeline and Flask web app (hosted on Hugging Face) that auto-classifies job ads into industry categories. It preprocesses 776 real ads with regex tokenisation, stopword removal and vocabulary pruning, then encodes them as TF-IDF–weighted Word2Vec embeddings (skip-gram, 100-dim). A Logistic Regression classifier reaches 88.1% accuracy via 5-fold stratified cross-validation across four categories — wrapped in a glassmorphism UI with live prediction, full-text search and a submission portal.",
    stack: ["Python", "Flask", "Word2Vec", "scikit-learn", "Gensim", "TF-IDF"],
    link: { href: "https://huggingface.co/spaces/2singhyeshwant/joblens", label: "Try JobLens live", hot: true },
  },
  {
    feat: false,
    render: "cloud",
    tag: "Cloud · Serverless",
    metric: "AWS",
    name: "Cloud Music Subscription Service",
    desc: "A fully serverless music subscription site on AWS. S3 for media, DynamoDB for user and track data, Python Lambdas behind API Gateway, hosted live on GitHub Pages.",
    stack: ["AWS Lambda", "DynamoDB", "S3", "API Gateway"],
    link: { href: "https://singhyeshwant.github.io/music.subscriptions/", label: "View live site" },
  },
  {
    feat: false,
    render: "aus",
    tag: "Data Viz · R Shiny",
    metric: "Interactive",
    name: "Life in Australia Dashboard",
    desc: "An interactive R Shiny dashboard layering health, education, jobs and justice data across Australia, with filters, downloadable data and a focus on outcomes for Indigenous communities.",
    stack: ["R", "Shiny", "Data Viz", "Storytelling"],
    link: { href: "https://yeshwant.shinyapps.io/3994442YeshwantSingh/", label: "Open dashboard" },
  },
  {
    feat: false,
    render: "er",
    tag: "Data Engineering",
    metric: "SQL",
    name: "COVID-19 Database Design",
    desc: "Designed a normalised relational database for the WHO COVID-19 vaccination dataset. ER modeling, schema-conflict resolution, SQL import scripts and query-driven visualisations.",
    stack: ["SQL", "ER Modeling", "Normalisation", "DBMS"],
    link: { href: "https://github.com/singhyeshwant/DBMS", label: "View on GitHub" },
  },
  {
    feat: false,
    render: "climate",
    tag: "Data Storytelling",
    metric: "Vodcast",
    name: "Unveiling Earth's Climate Crisis",
    desc: "A storytelling vodcast pinpointing climate-change facts through publicly available visualisations, paired with a separate study linking fast-food density and warming impact across cities.",
    stack: ["Data Viz", "Analysis", "Narrative"],
    link: { href: "https://rmit-arc.instructuremedia.com/embed/37d41bf7-03d7-43a0-ae9a-c8dd7464a40e", label: "Watch the vodcast" },
  },
];

export const SKILLS = [
  {
    group: "Programming",
    items: ["Python", "SQL", "R", "JavaScript", "HTML", "CSS", "Apps Script"],
  },
  {
    group: "Machine Learning",
    items: [
      "Scikit-learn",
      "XGBoost",
      "Regression Tree",
      "Feature Engineering",
      "Model Evaluation",
      "NLP",
    ],
  },
  {
    group: "Deep Learning",
    items: ["TensorFlow", "Keras", "CNNs", "Transfer Learning", "Neural Networks"],
  },
  {
    group: "Generative AI",
    items: [
      "LangChain",
      "RAG Pipelines",
      "Vector DBs",
      "Pinecone",
      "FAISS",
      "LLM APIs",
      "Prompt Engineering",
      "SFT",
      "RLHF",
    ],
  },
  {
    group: "Data Analysis",
    items: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "ER Modeling",
      "Data Wrangling",
      "Visualization",
    ],
  },
  {
    group: "Cloud",
    items: [
      "AWS S3",
      "EC2",
      "Lambda",
      "DynamoDB",
      "API Gateway",
      "SageMaker",
      "Glue",
      "Redshift",
      "BigQuery",
      "Vertex AI",
      "Azure Data Factory",
      "Databricks",
    ],
  },
  {
    group: "Tools",
    items: [
      "Git",
      "n8n",
      "Hugging Face",
      "Jupyter",
      "RStudio",
      "FastAPI",
      "Streamlit",
      "Anaconda",
      "VS Code",
      "PyCharm",
      "Tableau",
      "Power BI",
    ],
  },
  {
    group: "Professional",
    items: [
      "Project Coordination",
      "Project Management",
      "Automation",
      "Stakeholder Management",
      "Resource Tracking",
      "Quality Review",
      "Communication",
    ],
  },
];

export const EDUCATION = [
  {
    school: "RMIT University",
    degree: "Master of Data Science",
    location: "Melbourne, VIC, Australia",
    date: "02/2023 — 02/2025",
    transcript:
      "https://www.myequals.net/sharelink/a8b290d7-6971-4075-8e7b-ecc60659aaf5/49f0ad15-925f-44d0-88df-e74b7284280d",
    highlights: [
      "High Distinction in Machine Learning, Big Data Management and Advanced Programming.",
      "Selected among the top 36 groups to deliver a live stakeholder presentation for an ML prototype.",
    ],
  },
  {
    school: "University of Madras",
    degree: "BSc Mathematics & Computer Science",
    location: "Chennai, Tamil Nadu, India",
    date: "05/2019 — 07/2022",
    gpa: "3.6 / 4.0 (90%)",
    highlights: ['Named “Best Innovator” of the department by the MRF Innovation Club.'],
  },
];

export const NAV = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Tech Stack" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
