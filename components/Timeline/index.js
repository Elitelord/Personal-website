import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { processTimelineData, monthDiff } from "../../utils/timeline";
import data from "../../data/portfolio.json";

const HorizontalTimeline = ({ experiences, education }) => {
    const { theme } = useTheme();
    // We process data once
    const { events, minDate, maxDate, totalMonths, rowCount, years } = useMemo(
        () => processTimelineData(experiences, education),
        [experiences, education]
    );

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const scrollContainerRef = useRef(null);

    // Auto-scroll to end on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            // Scroll to end but give a little buffer (50px) to see the "end" clearly
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 100;
        }
    }, [events]);

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedItem(null), 300);
        document.body.style.overflow = "unset";
    };

    // Prevent scroll when modal is open
    useEffect(() => {
        return () => {
            document.body.style.overflow = "unset";
        }
    }, []);

    // Constants for layout
    const PIXELS_PER_MONTH = 60; // Wide enough for text?
    const TOTAL_WIDTH = totalMonths * PIXELS_PER_MONTH;
    const ROW_HEIGHT = 80;
    const HEADER_HEIGHT = 40;

    // Calculate Position Helper
    const getLeftPos = (date) => {
        const months = monthDiff(minDate, date);
        return months * PIXELS_PER_MONTH;
    };

    const getWidth = (start, end) => {
        let months = monthDiff(start, end);
        if (months < 1) months = 0.5; // Min width
        return months * PIXELS_PER_MONTH;
    }

    return (
        <div className="w-full relative">
            <div className="flex items-center justify-between mb-6">
                {/* <h1 className="text-2xl font-bold">Experiences</h1> */}
                {/* <span className="text-sm opacity-50 px-2">Scroll left to view past experiences</span> */}
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className={`w-full overflow-x-auto pb-4 custom-scrollbar select-none ${data.showCursor ? "cursor-none" : "cursor-grab"}`}
            >
                <div
                    className="relative"
                    style={{
                        width: `${TOTAL_WIDTH}px`,
                        height: `${(rowCount * ROW_HEIGHT) + HEADER_HEIGHT + 20}px`
                    }}
                >

                    {/* Grid & Years */}
                    {years.map(year => {
                        // Calculate position relative to minDate
                        const yearDate = new Date(year, 0, 1); // Jan 1st of that year
                        // Only draw if within bounds (or close)
                        if (yearDate < minDate) return null;

                        const left = getLeftPos(yearDate);

                        return (
                            <div
                                key={year}
                                className="absolute top-0 bottom-0 border-l border-gray-300 dark:border-zinc-700 dashed opacity-40 flex flex-col"
                                style={{ left: `${left}px` }}
                            >
                                <span className="ml-2 mt-0 text-xs font-bold opacity-50 sticky top-0 bg-white/90 dark:bg-zinc-800/90 text-gray-900 dark:text-gray-100 p-1 rounded backdrop-blur-sm border border-gray-200 dark:border-zinc-700 z-10">
                                    {year}
                                </span>
                            </div>
                        );
                    })}

                    {/* Month Tick Marks */}
                    {(() => {
                        const ticks = [];
                        const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
                        const end = new Date(years[years.length - 1], 0, 1);
                        while (current <= end) {
                            // Skip January — already has a year gridline
                            if (current.getMonth() !== 0 && current >= minDate) {
                                const left = getLeftPos(current);
                                ticks.push(
                                    <div
                                        key={`tick-${current.getFullYear()}-${current.getMonth()}`}
                                        className="absolute opacity-25"
                                        style={{
                                            left: `${left}px`,
                                            top: `${HEADER_HEIGHT - 18}px`,
                                            width: '1px',
                                            height: '8px',
                                            backgroundColor: 'currentColor',
                                        }}
                                    />
                                );
                            }
                            current.setMonth(current.getMonth() + 1);
                        }
                        return ticks;
                    })()}

                    {/* Events */}
                    {events.map((event) => {
                        const left = getLeftPos(event.startDate);
                        const width = getWidth(event.startDate, event.endDate);
                        const top = HEADER_HEIGHT + (event.row * ROW_HEIGHT);

                        return (
                            <div
                                key={event.id || event.org}
                                onClick={() => openModal(event)}
                                className={`absolute rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group bg-gradient-to-r ${event.color} flex items-center px-4 border-2 border-transparent hover:border-gray-200 dark:hover:border-zinc-400 z-20`}
                                style={{
                                    left: `${left}px`,
                                    width: `${Math.max(width, 100)}px`, // Min visually
                                    top: `${top}px`,
                                    height: "50px"
                                }}
                            >
                                <div className="flex flex-col truncate text-white drop-shadow-md">
                                    <span className="font-bold text-sm truncate">{event.org}</span>
                                    <span className="text-xs truncate opacity-90">{event.position}</span>
                                    <span className="text-[10px] uppercase tracking-wider opacity-90">{event.dates}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Detail Modal */}
            {isModalOpen && selectedItem && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${data.showCursor ? "cursor-none" : ""}`}>
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>
                    <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 laptop:p-10 border border-gray-100 dark:border-zinc-800 animate-fadeInUp max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4 text-white bg-gradient-to-r ${selectedItem.color}`}
                        >
                            {selectedItem.type === "work" ? "WORK" : "EDUCATION"}
                        </span>

                        <h2 className="text-3xl laptop:text-4xl font-bold mb-2 leading-tight text-gray-900 dark:text-white">
                            {selectedItem.org}
                        </h2>
                        <h3 className="text-xl laptop:text-2xl text-blue-600 dark:text-blue-400 font-medium mb-4">
                            {selectedItem.position}
                        </h3>

                        <div className="flex items-center gap-2 text-sm font-semibold opacity-70 mb-8 uppercase tracking-wide text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {selectedItem.dates}
                        </div>

                        <div className="max-w-none text-gray-700 dark:text-gray-300">
                            {selectedItem.bullets && selectedItem.bullets.length > 0 ? (
                                <ul className="list-disc ml-5 space-y-3">
                                    {selectedItem.bullets.map((point, i) => (
                                        <li key={i} className="text-lg leading-relaxed">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="opacity-50 italic">No detailed description available.</p>
                            )}
                        </div>

                        {selectedItem.url && (
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
                                <button
                                    onClick={() => window.open(selectedItem.url, "_blank")}
                                    className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity"
                                >
                                    Visit Website
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HorizontalTimeline;
