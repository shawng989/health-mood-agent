Health & Mood Tracking Agent

A smart, AI-powered wellness companion that helps users track mood, sleep, habits, and daily triggers — while an autonomous agent analyzes trends, detects patterns, and provides personalized insights to support mental and physical well-being.
Overview

The Health & Mood Tracking Agent solves a simple but important problem:
Most people struggle to consistently track their wellness. This leads to missing patterns such as stress triggers, sleep effects, or lifestyle habits that impact mood.

This project makes tracking effortless by using agents that:

check in with the user

analyze mood logs automatically

summarize weekly insights

detect trends

send helpful reminders
Problem Statement

Tracking mental wellness requires consistency, reflection, and understanding patterns across mood, sleep, notes, and daily activities.
Most people forget to log or don’t know how to interpret their data.

✔ Why this matters

Mental health issues often show early warning signs

Poor habits build up over time

Users benefit from personalized, proactive support
Why Agents?

Agents make this solution more powerful because they are:

✔ Autonomous

They work in the background without the user doing anything.

✔ Proactive

They remind users to log mood, drink water, sleep properly, etc.

✔ Analytical

They analyze historical data and detect patterns like:
“Low sleep is reducing your mood by 30%.”

✔ Personalized

They generate weekly summaries tailored to the user.
Features
 Mood Logging

Daily mood rating

Notes

Sleep hours

Common triggers

 Smart Insights

Weekly summaries

Trend analysis

Trigger correlations

Behavior recommendations

 Reminders

Daily mood check

Sleep, water, medication reminders

 Trend Visualization

Mood timeline

Sleep charts

Trigger impact charts

 Secure Authentication

Email & password

JWT-based security

Frontend (React + Tailwind)
        |
        v
Backend (Node.js + Express)
        |
        v
Agent Layer (Analysis + Automation)
        |
        v
Database (MongoDB/PostgreSQL)

Tech Stack

Frontend: React, Tailwind CSS

Backend: Node.js, Express

Database: MongoDB / PostgreSQL

Agent Logic: Automated summarizers, schedulers

Auth: JWT

Charts: Recharts

Deployment: Vercel + Render

git clone https://github.com/shawng989/health-mood-agent.git
cd frontend
npm install
npm run dev

cd backend
npm install
npm start

Future Improvements

AI chatbot for emotional support

Predictive mood forecasting

Mobile app (React Native)

More advanced graph visualization

Push notifications

Offline mood logging
