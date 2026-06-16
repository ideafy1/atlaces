"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  House,
  Brain,
  Users,
  BookOpen,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ────────────────────────────────────────────────────────── */
/*  Types                                                     */
/* ────────────────────────────────────────────────────────── */

export interface ToolbarDockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string[];
  badge?: boolean;
  toggle?: boolean;
  onClick?: () => void;
  path?: string;
}

interface ToolbarDockProps {
  items?: ToolbarDockItem[];
  className?: string;
  defaultCollapsed?: boolean;
}

/* ────────────────────────────────────────────────────────── */
/*  Constants                                                 */
/* ────────────────────────────────────────────────────────── */

const ICON_PROPS = { className: "h-5 w-5", strokeWidth: 1.8 } as const;

const DEFAULT_ITEMS: ToolbarDockItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <House {...ICON_PROPS} />,
    path: "/",
  },
  {
    id: "therapy",
    label: "Therapy",
    icon: <Brain {...ICON_PROPS} />,
    path: "/therapy",
  },
  {
    id: "community",
    label: "Community",
    icon: <Users {...ICON_PROPS} />,
    path: "/community",
  },
  {
    id: "breathe",
    label: "Breathe",
    icon: <BookOpen {...ICON_PROPS} />,
    path: "/breathe",
    badge: true,
  },
  {
    id: "contact",
    label: "Contact",
    icon: <Mail {...ICON_PROPS} />,
    path: "/contact",
  },
];

/* ────────────────────────────────────────────────────────── */
/*  Dropdown animation variants                               */
/* ────────────────────────────────────────────────────────── */

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -4,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

/* ────────────────────────────────────────────────────────── */
/*  Component                                                 */
/* ────────────────────────────────────────────────────────── */

export function ToolbarDock({
  items,
  className,
  defaultCollapsed = true,
}: ToolbarDockProps) {
  const navigate = useNavigate();
  const activeItems = (items ?? DEFAULT_ITEMS).filter((i) => !i.toggle);

  const [isOpen, setIsOpen] = React.useState(!defaultCollapsed);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  /* ── Click-outside handler ── */
  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  /* ── Escape key handler ── */
  React.useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  /* ── Navigation handler ── */
  const handleItemClick = React.useCallback(
    (item: ToolbarDockItem) => {
      if (item.path) navigate(item.path);
      if (item.onClick) item.onClick();
      setIsOpen(false);
    },
    [navigate],
  );

  return (
    <div
      ref={wrapperRef}
      className={cn("relative inline-flex items-center z-50", className)}
    >
      {/* ── Trigger button ── */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full",
          "text-gray-700 transition-colors duration-200",
          "hover:bg-gray-100 active:bg-gray-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── Dropdown menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            aria-orientation="vertical"
            style={{ transformOrigin: "top right" }}
            className={cn(
              "absolute right-0 top-full mt-2",
              "w-52 rounded-2xl bg-white p-1.5",
              "shadow-lg shadow-black/8 ring-1 ring-black/5",
            )}
          >
            {activeItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {/* Separator between items (skip before first) */}
                {index > 0 && (
                  <div className="mx-3 my-0.5 h-px bg-gray-100" />
                )}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-sm font-medium text-gray-800",
                    "transition-colors duration-150",
                    "hover:bg-gray-50 active:bg-gray-100",
                    "focus-visible:outline-none focus-visible:bg-gray-50",
                  )}
                >
                  {/* Icon */}
                  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-colors group-hover:bg-gray-100">
                    {item.icon}

                    {/* Red dot badge */}
                    {item.badge && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                    )}
                  </span>

                  {/* Label */}
                  <span className="truncate">{item.label}</span>
                </button>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ToolbarDock;
