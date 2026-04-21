// ============================================================================
// HOME PAGE COMPONENT
// ============================================================================
// This is the main landing page component for the workshop portal.
// It displays featured workshop information, public statistics, and navigation options.
// ============================================================================

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import StatusPill from "../components/StatusPill";
import { api } from "../lib/api";

/**
 * Hero Component
 * 
 * Displays the main hero section with:
 * - Welcome headline and description
 * - Call-to-action buttons (Sign In/Open Dashboard, Create Account/Propose Workshop)
 * - Feature highlights cards
 * 
 * @param {Object} user - The authenticated user object, null if not logged in
 * @returns {JSX.Element} The hero section component
 */
function Hero({ user }) {
  return (
    <section className="grid gap-6 pb-8 pt-4 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Main hero content panel */}
      <div className="glass-panel grain-overlay rounded-[2.25rem] border border-white/10 p-8 text-white shadow-[0_28px_80px_-42px_rgba(0,0,0,0.85)]">
        <p className="section-kicker text-amber-300">HOME PAGE</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] sm:text-6xl">
          A lighter, faster workshop portal for coordinators and instructors.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-stone-300 sm:text-lg">
          Booking workshops is always a hassle as you never know who's available and who isn't. We came up with a solution to this problem, a workshop portal that allows you to easily see the avai[...]
        </p>
        
        {/* Primary call-to-action buttons */}
        {/* Button behavior changes based on user authentication status */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={user ? "/dashboard" : "/login"}
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
          >
            {user ? "Open Dashboard" : "Sign In"}
          </Link>
          <Link
            to={user ? "/propose" : "/register"}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {user ? "Propose Workshop" : "Create Account"}
          </Link>
        </div>
      </div>
      
      {/* Feature highlights section - displays key selling points */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {[
          ["Mobile-first navigation", "The important actions are now visible without hunting through templates."],
          ["Cleaner role flows", "A smooth and hassle free experience for instructors and coordinators."],
          ["Connected throughout the country", "All core workshop actions use live data from across the nation."],
        ].map(([title, copy]) => (
          <div key={title} className="glass-panel rounded-[2rem] border border-white/10 p-6 text-stone-100 shadow-xl">
            <h2 className="text-3xl font-semibold leading-none">{title}</h2>
            <p className="mt-2 text-sm text-stone-300">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * HomePage Component
 * 
 * The main home page component that renders:
 * - Hero section with call-to-action buttons
 * - Workshop catalog showing available workshop types
 * - Public activity snapshot with statistics (by state and by type)
 * - Recent accepted workshops table
 * 
 * @param {Object} auth - Authentication object containing user info
 * @returns {JSX.Element} The complete home page component
 */
export default function HomePage({ auth }) {
  // State for storing workshop types fetched from API
  const [types, setTypes] = useState([]);
  
  // State for storing public statistics including items and charts
  // Structure: { items: [...], charts: { by_state: [...], by_type: [...] } }
  const [stats, setStats] = useState({ items: [], charts: { by_state: [], by_type: [] } });

  /**
   * useEffect Hook
   * Fetches workshop types and public statistics when component mounts
   * Makes two API calls:
   * 1. getWorkshopTypes() - Fetches available workshop types
   * 2. getPublicStats() - Fetches public statistics and recent workshops
   */
  useEffect(() => {
    api.getWorkshopTypes().then((data) => setTypes(data.items));
    api.getPublicStats().then((data) => setStats(data));
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section - Main landing area */}
      <Hero user={auth.user} />

      {/* ================================================================ */
      /* Workshop Catalog Section */
      /* Displays all available workshop types from the database */
      /* ================================================================ */
      <SectionCard
        title="Workshop Catalog"
        subtitle="This is the public workshop-type surface from our database, redesigned as a clear catalog."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* Map through workshop types and display each as a card */}
          {types.map((type) => (
            <article key={type.id} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
              {/* Workshop type header with name and duration badge */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-stone-900">{type.name}</h3>
                {/* Duration badge - displays number of days for the workshop */}
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                  {type.duration} day{type.duration > 1 ? "s" : ""}
                </span>
              </div>
              {/* Workshop description */}
              <p className="mt-3 text-sm leading-6 text-stone-600">{type.description}</p>
              {/* Terms and conditions preview section */}
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-stone-400">Terms preview</p>
              <p className="mt-2 max-h-24 overflow-hidden text-sm text-stone-500">{type.terms_and_conditions}</p>
            </article>
          ))}
          {/* Empty state message when no workshop types are configured */}
          {types.length === 0 ? <p className="text-sm text-stone-500">No workshop types are configured yet.</p> : null}
        </div>
      </SectionCard>

      {/* ================================================================ */
      /* Statistics and Recent Workshops Section */
      /* Two-column layout: Activity snapshot (left) and Recent workshops (right) */
      /* ================================================================ */
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left Column: Public Activity Snapshot */}
        <SectionCard
          title="Public Activity Snapshot"
          subtitle="Accepted workshops and how they're distributed across states and workshop types."
        >
          <div className="space-y-5">
            {/* Statistics by State - Bar chart showing workshop distribution */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">By State</p>
              <div className="mt-3 space-y-3">
                {/* Map through state statistics and display progress bars */}
                {stats.charts.by_state.map((entry) => (
                  <div key={entry.label}> 
                    {/* State name and workshop count */}
                    <div className="mb-1 flex items-center justify-between text-sm text-stone-600">
                      <span>{entry.label}</span>
                      <span>{entry.value}</span>
                    </div>
                    {/* Progress bar - width is calculated as min(value * 20, 100)% */}
                    {/* This ensures the bar doesn't exceed 100% width */}
                    <div className="h-2 rounded-full bg-stone-100">
                      <div className="h-2 rounded-full bg-amber-400" style={{ width: `${Math.min(entry.value * 20, 100)}%` }} />
                    </div>
                  </div>
                ))}
                {/* Empty state message when no workshops have been accepted */}
                {stats.charts.by_state.length === 0 ? <p className="text-sm text-stone-500">No accepted workshops yet.</p> : null}
              </div>
            </div>
            
            {/* Statistics by Workshop Type - Tag/chip display */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">By Workshop Type</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {/* Display each workshop type with count as a badge/chip */}
                {stats.charts.by_type.map((entry) => (
                  <span key={entry.label} className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700">
                    {entry.label} · {entry.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Right Column: Recent Accepted Workshops Table */}
        <SectionCard
          title="Recent Accepted Workshops"
          subtitle="A slimmed-down public snapshot of the backend statistics page."
        >
          <div className="overflow-x-auto">
            {/* Table displaying recent workshops - limited to 6 items */}
            <table className="min-w-full text-left text-sm">
              {/* Table header with column labels */}
              <thead className="text-stone-500">
                <tr className="border-b border-stone-200">
                  <th className="pb-3">Workshop</th>
                  <th className="pb-3">Coordinator</th>
                  <th className="pb-3">State</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              {/* Table body - displays workshop data */}
              <tbody>
                {/* Slice array to show only first 6 items */}
                {stats.items.slice(0, 6).map((workshop) => (
                  <tr key={workshop.id} className="border-b border-stone-100">
                    {/* Workshop type name */}
                    <td className="py-3 text-stone-900">{workshop.workshop_type.name}</td>
                    {/* Coordinator name */}
                    <td className="py-3 text-stone-600">{workshop.coordinator.name}</td>
                    {/* Coordinator state */}
                    <td className="py-3 text-stone-600">{workshop.coordinator.state_label}</td>
                    {/* Workshop date */}
                    <td className="py-3 text-stone-600">{workshop.date}</td>
                    {/* Workshop status with visual indicator component */}
                    <td className="py-3">
                      <StatusPill label={workshop.status_label} />
                    </td>
                  </tr>
                ))}
                {/* Empty state message when no workshops are available */}
                {stats.items.length === 0 ? (
                  <tr>
                    <td className="py-6 text-stone-500" colSpan="5">
                      No accepted workshops to show yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}