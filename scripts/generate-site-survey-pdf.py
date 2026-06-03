"""Generate IntegrateXpress general field site survey checklist PDF."""
from fpdf import FPDF

SECTIONS = [
    ("Before the visit", [
        "Confirm site address, contacts, and access hours",
        "Identify facilities lead and on-site escort",
        "Notify security / building management of walkthrough",
        "Gather existing floor plans or as-built drawings (if available)",
        "List known project goals: cameras, alarms, cabling, closets, relocation, fix work",
    ]),
    ("Facility access & safety", [
        "Note entry points, loading areas, and roof / ladder access needs",
        "Confirm PPE requirements and lock-out areas",
        "Document ceiling types (drop ceiling, open deck, conduit paths)",
        "Note areas that require after-hours or escorted access",
    ]),
    ("Telecom rooms & closets", [
        "Locate MDF / IDF rooms and telecom closets",
        "Photo each room: racks, patch panels, power, cooling",
        "Measure available rack space and cable management",
        "Check dedicated power circuits and UPS / backup",
        "Note room temperature, ventilation, and clearance",
    ]),
    ("Structured cabling & pathways", [
        "Trace existing cable routes: ceiling, wall, floor, underground",
        "Identify pathway constraints (fire walls, beams, occupied spaces)",
        "Document distance from telecom room to key areas",
        "Note existing cable types, labels, and condition",
        "Flag areas needing new conduit, J-hooks, or cable tray",
    ]),
    ("Security cameras & CCTV", [
        "Mark priority coverage areas: entrances, parking, registers, perimeters",
        "Note mounting surfaces (wall, soffit, pole, rooftop)",
        "Check sight lines, lighting, and obstructions",
        "Document existing cameras, DVR / NVR location, and spare ports",
        "Plan cable paths from cameras to head-end equipment",
    ]),
    ("Alarm systems & access control", [
        "Locate existing alarm panel, keypads, and sensors",
        "Note doors, windows, and motion zones needing coverage",
        "Document monitoring provider and account info (if known)",
        "Check code / insurer requirements for the facility type",
        "Plan wiring paths for new sensors and keypads",
    ]),
    ("Power, cooling & environment", [
        "Verify power at equipment locations",
        "Note HVAC impact on telecom rooms and outdoor gear",
        "Document moisture, dust, or temperature concerns",
        "Identify outdoor / weather-rated equipment needs",
    ]),
    ("Relocation & rollout (if applicable)", [
        "List equipment to move: phones, cameras, racks, panels",
        "Note disconnect / reconnect windows and downtime limits",
        "Document vendor coordination and cutover sequence",
        "Plan staging area and material delivery access",
    ]),
    ("Photos & documentation", [
        "Photo every telecom room and closet (wide + detail shots)",
        "Photo cable pathways and proposed camera locations",
        "Photo existing alarm and camera equipment labels",
        "Sketch or mark up floor plan with notes",
        "Record measurements and counts on this checklist",
    ]),
    ("Sign-off", [
        "Review findings with facilities contact on site",
        "Confirm scope priorities and timeline expectations",
        "Schedule follow-up assessment if areas were inaccessible",
        "Send scope summary to IntegrateXpress for quote / plan",
    ]),
]


class ChecklistPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 14)
        self.cell(0, 8, "IntegrateXpress - General Site Survey Checklist", ln=True)
        self.set_font("Helvetica", "", 9)
        self.cell(0, 5, "Field infrastructure: cabling, closets, cameras, alarms, and telecom build-outs", ln=True)
        self.ln(4)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")


def main():
    pdf = ChecklistPDF()
    pdf.set_auto_page_break(auto=True, margin=14)
    pdf.add_page()
    pdf.set_font("Helvetica", "", 9)
    pdf.multi_cell(
        0,
        5,
        "Use this checklist during a walkthrough of any commercial facility. "
        "Check each item as you go. For a professional assessment, contact IntegrateXpress "
        "at (585) 957-4132 or Services@IntegrateXpress.com.",
    )
    pdf.ln(3)
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(0, 5, "Site / facility: _________________________________", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "Date: _______________    Surveyor: _____________", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "Contact: _______________________________________", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    for title, items in SECTIONS:
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 6, title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        for item in items:
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(pdf.epw, 5, "[ ] " + item)
        pdf.ln(2)

    pdf.output("assets/Site-Survey-Checklist.pdf")


if __name__ == "__main__":
    main()
