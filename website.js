const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");

// Load the private settings in .env (Gmail address and app password), if the file exists
try {
  process.loadEnvFile();
} catch {
  // no .env file: the contact form still works, it just doesn't send email
}

// Email sender for the contact form. It is only switched on when both Gmail settings are filled in.
const mailer =
  process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, "") },
      })
    : null;

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// ---------- My details (shown in the footer and on the Contact page) ----------
app.locals.site = {
  name: "Thet Mon Linn",
  tagline: "Full Stack Development student at Republic Polytechnic.",
  email: "25036698@myrp.edu.sg",
  linkedin: "https://www.linkedin.com/in/thet-mon-linn-2392b9377",
  github: "https://github.com/THETMONLINN654",
  location: "Singapore",
};
app.locals.page = "";
app.locals.year = new Date().getFullYear();

// ---------- My projects (edit these to update the whole site) ----------
const projects = [
  {
    number: 1,
    slug: "glow-up-planner",
    category: "Web",
    title: "Glow-Up Planner",
    summary: "My first Node.js web app: a self-improvement planner for tracking daily habits, logging moods and setting goals, deployed live on Render.",
    tags: ["Node.js", "Express", "EJS", "CSS", "Render"],
    image: "/images/glow-up.png",
    overview: "Glow-Up Planner is a simple self-improvement planner for students who want to build better routines. A dashboard shows today's progress and a motivational quote, and three pages let you check off daily habits, log how you're feeling with an emoji and a short note, and set personal goals that move from Not Started to In Progress to Completed.",
    role: "I built the whole app myself as my very first Node.js project: the Express server and all of its routes, the EJS page templates, the styling, and the deployment to Render so it runs at a live URL.",
    process: "I started by planning the four pages and the data each one needed, then wrote the Express routes: GET routes that render each page with EJS, and POST routes that add, update and delete habits, moods and goals before redirecting back. Shared header and footer partials keep every page consistent, and the dashboard calculates live counts such as habits completed and active goals. Finally, I deployed the app to Render so anyone can try it.",
    learned: "This project taught me how a request travels from a form to an Express route and back to a rendered page. Because the data is stored in arrays in the server's memory, it resets whenever the server restarts and every visitor shares the same list. Next, I want to add a database and user accounts so each person's progress is saved and private.",
    type: "Personal project",
    timeline: "2026",
    team: "Solo",
    demoUrl: "https://glow-up-planner.onrender.com/",
    githubUrl: "https://github.com/THETMONLINN654/glow-version1",
  },
  {
    number: 2,
    slug: "findback",
    category: "Team Web",
    title: "FindBack — Campus Lost & Found",
    summary: "A team-built lost & found web app for our campus: report items you've found, browse reports, and help reunite them with their owners.",
    tags: ["Node.js", "Express", "EJS", "MySQL", "Multer", "Render"],
    image: "/images/findback.png",
    overview: "FindBack is a lost & found platform for a campus community, built around three steps: report an item you've found, search the reports for a match, and reunite the item with its owner. Users register with a User or Admin role, and item reports are only visible after logging in. Reports are stored in a MySQL database and can include an uploaded photo of the item.",
    role: "I was responsible for the item reports feature, the core CRUD of the app: the Express routes and MySQL queries that let users create, view, edit and delete found-item reports. I also worked on the front end, building EJS pages and styling the interface, including the landing page.",
    process: "Our team split the app into features and each built their part on a shared codebase. For the item reports, I connected each form to an Express route that reads or writes the MySQL database, then rendered the results with EJS. The app uses express-session and connect-flash to keep users logged in and show messages, and Multer to handle photo uploads. We then deployed it to Render.",
    learned: "Building a feature on a shared codebase meant my routes and pages had to fit with my teammates' work on login and sessions, so clear communication mattered as much as the code. Working with a MySQL database taught me how to structure queries for create, read, update and delete, and how stored data stays safe when the server restarts.",
    type: "School project (C237)",
    timeline: "2026",
    team: "Team project",
    demoUrl: "https://c237-team-4.onrender.com",
    githubUrl: "",
  },
  {
    number: 3,
    slug: "green-economy",
    category: "Design",
    title: "SG Green Plan 2030 — Green Economy",
    summary: "A digital brand and 4-page website design for the Green Economy pillar of the SG Green Plan 2030: clean, minimalist and nature-inspired.",
    tags: ["Illustrator", "Photoshop", "Web Design", "Branding"],
    image: "/images/homepage.png",
    overview: "This project designs a digital brand and website for the Green Economy pillar of the SG Green Plan 2030. It shows how clean energy, green innovation, green business and green jobs work together to build a more sustainable Singapore. It is aimed at professionals, business owners and policymakers aged 25 to 50 who want credible, easy-to-navigate information and clear ways to get involved, such as events and contact channels.",
    role: "This was an individual assignment, so I designed everything myself: the mood board, colour palette and typography, a custom logo developed from three concept sketches, a set of five original icons (one for each Green Economy pillar plus a contact icon), and the four web pages shown below: Home, About, Events and Contact.",
    process: "I started with the target audience and a mood board, then set the brand system: a green monochromatic palette with neutral tones, Franklin Gothic Heavy for bold headings and Ebrima for body text. I sketched three logo concepts before refining the final mark in Illustrator, then designed matching line icons for each pillar. I used AI-assisted tools along the way, such as Illustrator's Remove Background feature to isolate leaf illustrations, and wrote AI image prompts for Singapore-themed scenes, choosing the results that best matched the palette. Finally, I laid out the four pages on a consistent grid with generous white space, so the site feels calm and trustworthy.",
    learned: "Designing for this pillar showed me how a calm, consistent colour and type system can make a sustainability topic feel approachable rather than preachy. The biggest challenge was balancing enough green to feel eco-friendly without the palette becoming repetitive, and fitting detailed pillar information into small icon and card formats.",
    type: "School project (C257 Fundamentals of Design)",
    timeline: "2026",
    team: "Solo",
    demoUrl: "",
    githubUrl: "",
    gallery: [
      { src: "/images/homepage.png", caption: "Home" },
      { src: "/images/aboutpage.png", caption: "About" },
      { src: "/images/event.png", caption: "Events" },
      { src: "/images/contact%20page.png", caption: "Contact" },
    ],
  },
];

// ---------- My certificates (files are in public/certificates/, newest first) ----------
const certificates = [
  { title: "CSS (Basic)", issuer: "HackerRank", date: "Nov 2026", file: "css certificate.pdf", image: "css-basic.jpg" },
  { title: "JavaScript (Basic)", issuer: "HackerRank", date: "Nov 2026", file: "javascript_basic certificate.pdf", image: "javascript-basic.jpg" },
  { title: "Building a Website with Node.js and Express.js", issuer: "LinkedIn Learning", date: "Aug 2026", file: "CertificateOfCompletion_Building a Website with Node.js and Express.js.pdf", image: "building-a-website-with-node-js-and-express-js.jpg" },
  { title: "JavaScript: Web Form Programming", issuer: "LinkedIn Learning", date: "Jul 2026", file: "CertificateOfCompletion_JavaScript Web Form Programming.pdf", image: "javascript-web-form-programming.jpg" },
  { title: "Programming Foundations: APIs and Web Services", issuer: "LinkedIn Learning", date: "Jul 2026", file: "CertificateOfCompletion_Programming Foundations APIs and Web Services 2019.pdf", image: "programming-foundations-apis-and-web-services-2019.jpg" },
  { title: "Create a Quick, Clean, and Cheap Website with Bootstrap Templates", issuer: "LinkedIn Learning", date: "Jun 2026", file: "CertificateOfCompletion_Create a Quick Clean and Cheap Website with Bootstrap Templates.pdf", image: "create-a-quick-clean-and-cheap-website-with-bootstrap-templates.jpg" },
  { title: "JavaScript: Enhancing the DOM", issuer: "LinkedIn Learning", date: "Jun 2026", file: "CertificateOfCompletion_JavaScript Enhancing the DOM.pdf", image: "javascript-enhancing-the-dom.jpg" },
  { title: "Illustrator 2023 Quick Start", issuer: "LinkedIn Learning", date: "May 2026", file: "CertificateOfCompletion_Illustrator 2023 Quick Start.pdf", image: "illustrator-2023-quick-start.jpg" },
  { title: "Python Object-Oriented Programming", issuer: "LinkedIn Learning", date: "Feb 2026", file: "CertificateOfCompletion_Python ObjectOriented Programming.pdf", image: "python-objectoriented-programming.jpg" },
  { title: "Python for Data Visualization", issuer: "LinkedIn Learning", date: "Dec 2025", file: "CertificateOfCompletion_Python for Data Visualization.pdf", image: "python-for-data-visualization.jpg" },
];

// ---------- Page routes ----------
app.get("/", (req, res) => {
  res.render("opening", { title: "Thet Mon Linn | Full Stack Developer" });
});

app.get("/home", (req, res) => {
  res.render("home", { title: "Home | Thet Mon Linn", page: "home", projects });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About | Thet Mon Linn", page: "about", certificates });
});

app.get("/portfolio", (req, res) => {
  res.render("portfolio", { title: "Portfolio | Thet Mon Linn", page: "portfolio", projects });
});

// Second layer of navigation: /portfolio/web, /portfolio/mobile, ...
app.get("/portfolio/:slug", (req, res, next) => {
  const index = projects.findIndex((p) => p.slug === req.params.slug);
  if (index === -1) return next(); // no such project, so show the 404 page

  res.render("project", {
    title: projects[index].title + " | Thet Mon Linn",
    page: "portfolio",
    project: projects[index],
    prev: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  });
});

// ---------- Contact page ----------
const reasons = [
  "Internship / job opportunity",
  "Way to RP",
  "Part time job during school",
  "School project / collaboration",
  "Something else",
];

function renderContact(res, status, { sent = false, values = {}, errors = {}, formError = "" }) {
  res.status(status).render("contact", {
    title: "Contact | Thet Mon Linn",
    page: "contact",
    hasResume: fs.existsSync("public/files/TM_Linn_Resume.pdf"),
    reasons,
    sent,
    values,
    errors,
    formError,
  });
}

app.get("/contact", (req, res) => {
  renderContact(res, 200, { sent: req.query.sent === "1" });
});

app.post("/contact", async (req, res) => {
  const body = req.body || {};
  const clean = (value) => (typeof value === "string" ? value.trim() : "");
  const values = {
    name: clean(body.name),
    email: clean(body.email),
    reason: clean(body.reason),
    message: clean(body.message),
  };

  // The "website" field is hidden from people, so only spam bots fill it in
  if (clean(body.website)) return res.redirect(303, "/contact?sent=1#message");

  const errors = {};
  if (!values.name || values.name.length > 100) errors.name = "Please enter your name (up to 100 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254) errors.email = "Please enter a valid email address.";
  if (!reasons.includes(values.reason)) errors.reason = "Please choose one of the options.";
  if (!values.message || values.message.length > 2000) errors.message = "Please enter a message (up to 2000 characters).";
  if (Object.keys(errors).length > 0) return renderContact(res, 400, { values, errors });

  try {
    const entry = { ...values, receivedAt: new Date().toISOString() };
    fs.appendFileSync("messages.jsonl", JSON.stringify(entry) + "\n");
  } catch (err) {
    console.error("Could not save contact message:", err);
    return renderContact(res, 500, {
      values,
      formError: "Sorry, your message couldn't be saved. Please try again or email me directly.",
    });
  }

  // Email the message to me. If sending fails, it is still saved in messages.jsonl above.
  if (mailer) {
    try {
      await mailer.sendMail({
        from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
        to: process.env.MAIL_TO || app.locals.site.email,
        replyTo: `"${values.name.replace(/"/g, "")}" <${values.email}>`, // pressing Reply answers the visitor
        subject: `Portfolio message from ${values.name}: ${values.reason}`,
        text:
          `Name: ${values.name}\n` +
          `Email: ${values.email}\n` +
          `About: ${values.reason}\n\n` +
          `${values.message}\n`,
      });
    } catch (err) {
      console.error("Could not email contact message (it is saved in messages.jsonl):", err.message);
    }
  }

  // Redirect so refreshing the page doesn't send the message twice
  res.redirect(303, "/contact?sent=1#message");
});

// ---------- Error pages ----------
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page not found",
    heading: "Page not found",
    text: "Sorry, the page you're looking for doesn't exist.",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render("error", {
    title: "Something went wrong",
    heading: "Something went wrong",
    text: "Sorry, please try again in a moment.",
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
  if (!mailer) {
    console.log("Contact form email is OFF: fill in GMAIL_USER and GMAIL_APP_PASSWORD in .env to turn it on.");
    return;
  }
  // Check the Gmail login once at start-up, so a wrong password shows up here straight away
  mailer
    .verify()
    .then(() => console.log(`Contact form email is ON: messages go to ${process.env.MAIL_TO || app.locals.site.email}`))
    .catch((err) => console.error("Contact form email login FAILED, check .env:", err.message));
});
