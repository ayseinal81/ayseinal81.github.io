/* ============================================================================
   COURSE DATA — the only file you need to edit to add, change or remove
   a course. The showcase grid, its filters, and the home-page strip are all
   generated from this array automatically.

   To add a course, append one object with these fields:

     id          unique slug, used in shareable links (e.g. 'my-course')
     title       card title
     description one–two sentence summary shown on the card
     tools       array, e.g. ['Storyline', 'Rise', 'SCORM'] — drives the Tool filter
     tags        array, e.g. ['Compliance', 'Onboarding'] — drives the Category filter
     duration    short string shown on the thumbnail, e.g. '25 min'
     accent      hex colour used for the striped placeholder thumbnail
     thumbnail   OPTIONAL — path to a real preview image,
                 e.g. 'assets/thumbs/my-course.jpg'. Omit it (or leave it out
                 entirely) to show the striped placeholder instead.
     thumbAlt    OPTIONAL — alt text for the thumbnail image
     source      where the course lives. One of:
                   { type: 'local',    path: 'courses/my-course/index.html' }
                   { type: 'external', url:  'https://example.com/my-course/' }

   Local courses: publish your Rise/Storyline export into a subfolder of
   /courses so its index.html sits at courses/<slug>/index.html.
   If a course later moves to external hosting, just change its `source` —
   nothing else needs to change.
   ========================================================================== */

const COURSES = [
  {
    id: 'anti-bribery',
    title: 'Under Pressure: Anti-Bribery Decisions',
    description: 'A branching scenario that drops learners into high-stakes moments where the "right" call is rarely obvious.',
    tools: ['Storyline'],
    tags: ['Compliance', 'Scenario-based'],
    duration: '25 min',
    accent: '#e11d48',
    source: { type: 'local', path: 'courses/anti-bribery/index.html' }
  },
  {
    id: 'onboarding-90',
    title: 'Your First 90 Days',
    description: 'A warm, self-paced onboarding journey that gets new joiners productive faster — and far less overwhelmed.',
    tools: ['Rise'],
    tags: ['Onboarding'],
    duration: '40 min',
    accent: '#7c3aed',
    source: { type: 'local', path: 'courses/onboarding-90/index.html' }
  },
  {
    id: 'crm-training',
    title: 'Mastering the New CRM',
    description: 'A "show me / try me / test me" software simulation that builds real confidence before go-live day.',
    tools: ['Storyline', 'SCORM'],
    tags: ['Software training'],
    duration: '30 min',
    accent: '#f97316',
    source: { type: 'local', path: 'courses/crm-training/index.html' }
  },
  {
    id: 'phishing',
    title: 'Spot the Phish',
    description: 'A gamified challenge where learners score points for catching red flags in a realistic inbox.',
    tools: ['Storyline'],
    tags: ['Compliance', 'Gamification'],
    duration: '15 min',
    accent: '#0d9488',
    source: { type: 'external', url: 'https://learn.ayseinal.co.uk/spot-the-phish/' }
  },
  {
    id: 'inclusive-leadership',
    title: 'Inclusive Leadership Foundations',
    description: 'A blended programme pairing reflective e-learning with live practice and manager toolkits.',
    tools: ['Rise'],
    tags: ['Leadership', 'Blended'],
    duration: '45 min',
    accent: '#7c3aed',
    source: { type: 'local', path: 'courses/inclusive-leadership/index.html' }
  },
  {
    id: 'gdpr-refresher',
    title: 'GDPR Essentials Refresher',
    description: 'A punchy annual refresher that swaps dense policy for quick, real-world decisions.',
    tools: ['Rise', 'SCORM'],
    tags: ['Compliance'],
    duration: '20 min',
    accent: '#e11d48',
    source: { type: 'local', path: 'courses/gdpr-refresher/index.html' }
  }
];
