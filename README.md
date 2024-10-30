# Survival Nexus Next.js Application Setup Guide

## Table of Contents
1. [Deployed Application](#deployed-application)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Additional Configuration](#additional-configuration)

---

## Deployed Application

You can find the deployed version of Survival Nexus [here](https://frontendchallenge-orcin.vercel.app/).   

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm 

Check your Node.js installation by running:
```bash
node -v
```
Check your npm  installation by running:
```bash
npm -v
```

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/awesomeufodude/frontendchallenge
cd frontendchallenge
```

2. **Install dependencies:**
```bash
npm install

```

## Running the Application

1. **Start the development server:**
```bash
npm run dev

```
2. **Open your browser and navigate to:**
```
http://localhost:3000
```
This will launch Survival Nexus's application in development mode, reloading the page as you make edits.

## Additional Configuration

- **Environment Variables:**
   - Create a `.env.local` file in the root directory.
   - Add environment variable `NEXT_PUBLIC_API_URL="https://thebackend-b69c0bd29fff.herokuapp.com/api"`
