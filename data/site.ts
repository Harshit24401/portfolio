/** Site-wide facts. Replace bracketed values when Harshit supplies them (Task 16). */
export const site = {
  name: 'Harshit Arora',
  email: 'harshit24401@gmail.com',
  availability: 'Open to 6-month internships, Jan–Jun 2027',
  marquee: [
    'Open to 6-month internships, Jan–Jun 2027',
    'Full-stack',
    'AI / ML',
    '1st in India & Ireland, Optum Shark Tank',
    'Computer Engineering, Thapar ’27',
    'LangGraph · FastAPI · WebRTC · ONNX',
    'Patiala, Punjab',
  ],
  socials: {
    github: 'https://github.com/Harshit24401',
    linkedin: 'https://www.linkedin.com/in/harshit-arora-here',
  },
  spotifyPlaylist: null as string | null,
  resumeUpdated: 'Nov 2026',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;
