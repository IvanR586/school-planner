# School Planner — Prompt Engineering Portfolio

A school deadline planner built through iterative natural-language requirements and AI-assisted implementation. This repository documents the resulting app and the prompting process; it does not claim the implementation was written entirely by hand.

This README was also written with the assistance of AI.

## Features

- Deadlines grouped by urgency: overdue, within 2 days, 3–7 days, 8–14 days, and later.
- Exam plans with daily study goals, date ranges, check-ins, and progress tracking.
- Exams automatically appear in the deadline list.
- Light/dark themes and a sound toggle.
- Separate rotating meme celebrations for assignments and study goals.
- JSON backup export and import.

## Run locally

Install Node.js, then run from this folder:

```powershell
.\start.ps1
```

On Windows, you can also double-click **Start School Planner.cmd**.

Cross-platform command:

```sh
node school-deadlines/server.cjs
```

Open http://127.0.0.1:4174/ and keep the server running. Automatic browser opening is Windows-specific; open the URL manually on other systems. No package installation or build step is required.

## Prompting workflow

The development conversation progressively refined the requirements:

| User requirement | Result |
| --- | --- |
| Classify school deadlines by proximity to their due dates | Automatic urgency grouping |
| Keep the UI clean and simple, then add dark mode | Minimal interface and a saved theme preference |
| Track a daily goal between the study start date and exam date | Inclusive study plans, check-ins, and progress bars |
| Avoid entering exams twice | Shared exam records projected into the deadline list |
| Play different celebrations for assignments and study goals | Separate shuffled meme pools and audio controls |
| Recover data after opening in a different browser | Backup export/import with duplicate protection |
| Prepare a copy without personal data | Source-only copy, isolated browser storage, and ignored backup files |

This is a summary of the conversation, not a verbatim transcript. The project demonstrates requirements refinement, iterative feedback, problem diagnosis, and review of an AI-generated implementation.

## Data and privacy

This portfolio copy starts empty. No personal assignment records, exam plans, recovery files, Git history, or hosted Site identifiers are included.

Data entered while running the app is saved in that browser's localStorage. The portfolio copy uses port 4174 and separate storage keys to avoid loading data from the original app. Different browsers keep separate lists. Clearing site data removes the browser's records; export a backup if needed.

Do not commit exported backup files or screenshots containing personal data.

## Media and limitations

Meme audio and images are loaded from Myinstants and Imgflip and require internet access. The catalog is a fixed snapshot of trending soundboard entries and anime favorites, not a live trend ranking. Images and clips are paired combinations and may come from different original memes.

Third-party media remains the property of its respective owners; this repository does not grant rights to that media. External URLs may become unavailable.

## Technology

Plain HTML, CSS, and JavaScript, with a small Node.js static server. No framework or database is required.
