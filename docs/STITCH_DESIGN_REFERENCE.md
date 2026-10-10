# Google Stitch Design System Reference

> **Document:** `docs/STITCH_DESIGN_REFERENCE.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Mapping of Stitch Assets, Screenshots, and Specs to React Code

---

## 1. Stitch Assets Directory Overview

The project includes the original exported Stitch design specifications and asset directory located at:
`stitch_nextcampus_design_system/` (and its source archive `stitch_nextcampus_design_system.zip`).

### Key Directory Inventory

```text
stitch_nextcampus_design_system/
├── nextcampus_design_system_spec.md                     # Master Brand Identity & Tokens Spec
├── nextcampus_official_logo/                            # Official SVG brand mark and isometric "N"
├── nextcampus_college_landing_page/                     # Page 1: Landing Page layout & assets
├── nextcampus_student_dashboard_your_college_name/      # Page 2: Student Dashboard layout
├── nextcampus_interactive_campus_map_your_college_name/ # Page 3: Campus Map layout
├── nextcampus_campus_directory_your_college_name/       # Page 4: Directory layout
├── nextcampus_smartrooms_your_college_name/             # Page 5: SmartRooms layout
├── nextcampus_nextcampus_care_complaint_management/     # Page 6: Complaints layout
├── nextcampus_nextcampus_ai_assistant_your_college_name/# Page 7: AI Assistant layout
├── nextcampus_ecocampus_sustainability_your_college_name/# Page 8: EcoCampus layout
├── nextcampus_skillcampus_student_collaboration/        # Page 9: SkillCampus layout
├── nextcampus_admin_dashboard_your_college_name/        # Page 10: Admin Dashboard layout
├── nextcampus_campus_management_your_college_name/      # Page 11: Campus Management layout
├── nextcampus_complaint_administration_your_college_name/# Page 12: Complaint Admin layout
├── nextcampus_login_registration_your_college_name/     # Page 13: Auth Page layout
├── nextcampus_student_profile_settings_your_college_name/# Page 14: Profile Settings layout
└── cinematic_wide_angle_shot_of_a_prestigious_modern... # Hero photography assets
```

---

## 2. Page-to-Stitch Asset Mapping

| Application Page | React Source File | Stitch Directory Reference | Key Assets Used |
| :--- | :--- | :--- | :--- |
| **Landing Page** (`/`) | `src/pages/LandingPage.jsx` | `nextcampus_college_landing_page/` | Hero photo, isometric campus preview, badge lockups |
| **Student Dashboard** (`/dashboard`) | `src/pages/StudentDashboard.jsx`| `nextcampus_student_dashboard_...` | Active lecture card, deadlines list, timeline cards |
| **Interactive Map** (`/campus-map`) | `src/pages/CampusMap.jsx` | `nextcampus_interactive_campus_map_...`| Vector campus layout, drawer specs, route pins |
| **Campus Directory** (`/directory`) | `src/pages/CampusDirectory.jsx` | `nextcampus_campus_directory_...` | Department filter tabs, faculty contact cards |
| **SmartRooms** (`/smartroom`) | `src/pages/SmartRooms.jsx` | `nextcampus_smartrooms_...` | Floor-plan layouts, occupancy meters, smart locks |
| **Care Complaints** (`/complaints`) | `src/pages/CareComplaints.jsx` | `nextcampus_nextcampus_care_...` | Ticket submission form, SLA badge counters |
| **AI Assistant** (`/ai-assistant`) | `src/pages/AiAssistant.jsx` | `nextcampus_nextcampus_ai_...` | Multi-pane chat layout, prompt chips, action cards |
| **EcoCampus** (`/ecocampus`) | `src/pages/EcoCampus.jsx` | `nextcampus_ecocampus_...` | Microgrid solar meters, SmartBin diversion cards |
| **SkillCampus** (`/skillcampus`) | `src/pages/SkillCampus.jsx` | `nextcampus_skillcampus_...` | Project cards, skill tag filters, role openings |
| **Admin Dashboard** (`/admin`) | `src/pages/AdminDashboard.jsx` | `nextcampus_admin_dashboard_...` | Population metrics, ticket queues, building loads |
| **Campus Management** (`/admin/campus-management`) | `src/pages/CampusManagement.jsx` | `nextcampus_campus_management_...` | Facility tables, CAD schema tags, room editors |
| **Complaint Admin** (`/admin/complaints`) | `src/pages/ComplaintAdmin.jsx` | `nextcampus_complaint_administration_...`| Triage table, staff assign drawer, internal note tabs |
| **Login & Register** (`/auth`) | `src/pages/AuthPage.jsx` | `nextcampus_login_registration_...` | Split marketing/form panel, password strength bar |
| **Student Profile** (`/profile`) | `src/pages/ProfileSettings.jsx`| `nextcampus_student_profile_...` | Profile header, society badges, password rotation |

---

## 3. Discrepancies & Intentional Refinements

1. **Admin Map Editor Addition**:
   * *Stitch Design*: Showed read-only map exploration.
   * *Implementation*: Enhanced with an interactive **Admin Map Mode** allowing administrators to reposition markers and update GIS coordinates directly from the web client.
2. **Dual-Prefix API Routing**:
   * *Implementation*: Added automatic `/api/v1` and `/api` fallback resolution to prevent browser shield loopback blocks.

---

## 4. Related Documentation
* [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Master color and typography tokens.
* [UI_UX_DESIGN.md](UI_UX_DESIGN.md) — Design philosophy.
