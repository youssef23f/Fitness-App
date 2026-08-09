<div align="center">

# 🏋️‍♂️ FITNESS.AI — Next-Gen AI Health & Nutrition Platform

  <p align="center">
    An end-to-end AI-powered health assistant featuring automated nutrition tracking, computer vision meal analysis, and a real-time fitness coach.
    <br />
    <a href="https://fitness-app-ctzm.vercel.app"><strong>View Live Demo »</strong></a>
  </p>

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_Llama_3.3-F05032?style=for-the-badge&logo=git&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📌 Project Overview

**FITNESS.AI** is a modern full-stack web application designed to help users track their daily fitness goals and dietary intake with high precision. Powered by cutting-edge Large Language Models (LLMs) and Computer Vision via Groq Cloud APIs, the platform offers real-time meal scanning, personalized macro calculation, and interactive AI coaching.

---

## 🏗️ System Architecture

```mermaid
graph TD;
    A[📱 Next.js 16 App Router Client] -->|Auth & User Context| B[🔐 Supabase Auth];
    A -->|Fetch Profiles & Daily Logs| C[(🗄️ Supabase DB - PostgreSQL)];
    A -->|Image Payload| D[⚡ API Route: /api/scan-food];
    A -->|User Prompts| E[⚡ API Route: /api/chat];
    
    D -->|Client-Side Compressed Base64| F[🤖 Groq Vision API - Llama 3.2];
    E -->|Context & Chat History| G[🤖 Groq LLM API - Llama 3.3 70B];
    
    F -->|Parsed JSON Macro Breakdown| A;
    G -->|Real-time Conversational Response| A;

🌟 Key Features📸 AI Food Scanner: Leverages computer vision (llama-3.2-11b-vision-preview) to estimate calories, protein, carbs, and fats directly from meal photos into strict JSON data.🤖 Interactive AI Coach: Conversational fitness assistant driven by llama-3.3-70b-versatile providing tailored nutrition and training advice.📊 Real-time Dashboard: Tracks caloric surplus/deficit, macronutrients, and micronutrients against dynamic target goals stored in PostgreSQL.🔒 Secure Authentication & User State: Integrates Supabase Database & Auth for user session management and protected Row Level Security (RLS).⚡ Client-Side Image Compression: Utilizes HTML5 Canvas image optimization before network dispatch to ensure low-latency API execution and prevent serverless payload overflows.🛠️ Tech StackLayerTechnologyFrameworkNext.js 16 (App Router / Turbopack)Styling & UITailwind CSS / Lucide React IconsDatabase & AuthSupabase (PostgreSQL & Client Authentication)AI InfrastructureGroq SDK (llama-3.2-11b-vision-preview, llama-3.3-70b-versatile)DeploymentVercel (CI/CD Automated Deployments)

📊 Database Schema Design
erDiagram
    profiles ||--o{ daily_logs : "tracks"
    profiles {
        uuid id PK
        string full_name
        int age
        string gender
        numeric height
        numeric weight
        string activity_level
        string goal
        int target_calories
        int target_protein
        int target_carbs
        int target_fats
        timestamp updated_at
    }
    daily_logs {
        bigint id PK
        uuid user_id FK
        date date
        int calories
        int protein
        int carbs
        int fats
        int fiber
        int sodium
        int potassium
    }
    🚀 Local Installation & Setup
Clone the repository:

Bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO.git](https://github.com/YOUR_USERNAME/YOUR_REPO.git)
cd my-ai-fitness
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.local file in the root directory and add your credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
Launch the Development Server:

Bash
npm run dev
Navigate to http://localhost:3000 in your browser to view the app.