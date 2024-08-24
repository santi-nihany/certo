

# The Architecture

```bash
app/
├── page.tsx              # Public home page
├── login/
│   └── page.tsx          # Login page with LoginComponent
├── researcher/
│   ├── layout.tsx        # Layout for all researcher pages (protected)
│   ├── dashboard/
│   │   └── page.tsx      # Researcher dashboard (protected)
│   └── create-survey/
│       └── page.tsx      # Create survey page (protected)
└── participant/
    ├── layout.tsx        # Layout for all participant pages (protected)
    ├── available-surveys/
    │   └── page.tsx      # Available surveys page (protected)
    └── take-survey/
        └── [id]/
            └── page.tsx  # Take survey page (protected)
```
