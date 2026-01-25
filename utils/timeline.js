
export const parseDate = (dateStr) => {
    if (!dateStr || dateStr.toLowerCase().includes("present")) return new Date();

    const parts = dateStr.split("/");
    if (parts.length === 2) {
        return new Date(parseInt(parts[1], 10), parseInt(parts[0], 10) - 1);
    }
    return new Date();
};

export const getYearFromDateStr = (dateRangeStr) => {
    if (!dateRangeStr) return new Date().getFullYear();
    const parts = dateRangeStr.split("-");
    const startStr = parts[0].trim();
    const date = parseDate(startStr);
    return date.getFullYear();
};

export const monthDiff = (d1, d2) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months; // Ensure positive or zero
};

// Colors for distinct bars - theme-aware gradients
const COLORS = [
    "from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600",
    "from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600",
    "from-pink-500 to-pink-700 dark:from-pink-400 dark:to-pink-600",
    "from-green-500 to-green-700 dark:from-green-400 dark:to-green-600",
    "from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600",
    "from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600",
    "from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-600",
    "from-red-500 to-red-700 dark:from-red-400 dark:to-red-600",
    "from-cyan-500 to-cyan-700 dark:from-cyan-400 dark:to-cyan-600",
    "from-yellow-500 to-yellow-700 dark:from-yellow-400 dark:to-yellow-600",
    "from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600",
    "from-violet-500 to-violet-700 dark:from-violet-400 dark:to-violet-600",
];

// Simple hash function to generate consistent color index from string
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
};

export const processTimelineData = (experiences, education) => {
    // 1. Merge & Normalize
    const workEvents = experiences.map((exp) => ({
        ...exp,
        type: "work",
        startDate: parseDate(exp.dates.split("-")[0].trim()),
        endDate: parseDate(exp.dates.split("-")[1]?.trim() || "Present"),
    }));

    const eduEvents = education.map((edu) => ({
        ...edu,
        id: edu.id,
        dates: edu.universityDate,
        org: edu.universityName,
        position: edu.universityPara,
        bullets: [edu.universityGPA !== "N/A" ? `GPA: ${edu.universityGPA}` : null].filter(Boolean),
        url: null,
        type: "education",
        startDate: parseDate(edu.universityDate.split("-")[0].trim()),
        endDate: parseDate(edu.universityDate.split("-")[1]?.trim() || "Present"),
    }));

    let allEvents = [...workEvents, ...eduEvents];

    // 2. Sort by Start Date Ascending for layout algorithm
    allEvents.sort((a, b) => a.startDate - b.startDate);

    // 3. Determine Global Bounds
    if (allEvents.length === 0) return { events: [], years: [], totalMonths: 0 };

    const minDate = new Date(Math.min(...allEvents.map(e => e.startDate)));
    const maxDate = new Date(Math.max(...allEvents.map(e => e.endDate)));

    // Pad the bounds slightly (e.g. 1 month before/after)
    minDate.setMonth(minDate.getMonth() - 2);

    // 4. Assign Rows (Greedy Algorithm)
    const rows = []; // Array of Arrays (Time Slots occupied)
    // Each row tracks: [{ start, end }, ...]

    allEvents = allEvents.map((event, index) => {
        let assignedRow = -1;

        // Check existing rows for space
        for (let r = 0; r < rows.length; r++) {
            // Check for overlap with ANY event in this row
            const hasOverlap = rows[r].some(slot => {
                return (event.startDate < slot.end && event.endDate > slot.start);
            });

            if (!hasOverlap) {
                assignedRow = r;
                rows[r].push({ start: event.startDate, end: event.endDate });
                break;
            }
        }

        // If no row found, create new one
        if (assignedRow === -1) {
            assignedRow = rows.length;
            rows.push([{ start: event.startDate, end: event.endDate }]);
        }

        return {
            ...event,
            row: assignedRow,
            color: COLORS[hashString(event.org) % COLORS.length], // Assign unique color based on org name
        };
    });

    const rowCount = rows.length;

    // 5. Generate Years for Grid
    const startYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();
    const years = [];
    for (let y = startYear; y <= endYear + 1; y++) {
        years.push(y);
    }

    // Calculate pixel offsets? No, we'll do percentage based on totalMonths in the Component
    // Just return the bounds
    const totalMonths = monthDiff(minDate, maxDate);

    return {
        events: allEvents,
        minDate,
        maxDate,
        totalMonths,
        rowCount,
        years
    };
};
