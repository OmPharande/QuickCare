# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## About QuickCare
QuickCare is a full-stack web application that streamlines doctor appointment scheduling and management for both patients and healthcare professionals.

### Key Features
- Browse a curated list of doctors with specialization details
- Secure patient sign-up / sign-in with JWT authentication
- Real-time appointment booking with conflict avoidance
- Doctors can define and update their availability using an intuitive schedule builder
- Patients can view, reschedule, or cancel their appointments in **My Appointments**
- Responsive, mobile-first UI built with React and TypeScript

### Tech Stack
| Layer | Technology |
|-------|------------|
| Front-end | React 18, TypeScript, Vite |
| State Management | React Context API |
| Back-end | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose ODM |
| Build / Dev | Vite, ESLint, Prettier |

### Folder Structure (excerpt)
```text
e:/QuickCare
├── App.tsx
├── components/
│   ├── Alert.tsx
│   ├── AuthModal.tsx
│   ├── BookingModal.tsx
│   ├── DoctorCard.tsx
│   ├── DoctorLoginModal.tsx
│   ├── DoctorSchedule.tsx
│   ├── Header.tsx
│   ├── IconComponents.tsx
│   ├── MyAppointmentsModal.tsx
│   └── Spinner.tsx
├── contexts/
│   └── AuthContext.tsx
├── server/
│   ├── models/ (CommonJS)
│   │   └── Patient.js
│   ├── routes/ (CommonJS)
│   │   ├── auth.js
│   │   └── health.js
│   └── src/ (TypeScript)
│       ├── app.ts
│       ├── index.ts
│       ├── models/
│       │   ├── Appointment.ts
│       │   └── Patient.ts
│       └── routes/
│           ├── appointments.ts
│           ├── auth.ts
│           └── health.ts
├── constants.ts
├── index.html
├── index.tsx
├── types.ts
└── vite.config.ts
```

Feel free to explore each directory for further details about implementation.
