"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  HeartPulse,
  Users,
  BookOpen,
  Info,
  LogIn,
  Menu,
  Command,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";

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

const SPRING_Y = {
  type: "spring" as const,
  stiffness: 650,
  damping: 44,
  mass: 0.7,
};
const SPRING_CLIP = {
  type: "spring" as const,
  stiffness: 720,
  damping: 52,
  mass: 0.7,
};
const COLLAPSE_SPRING = {
  type: "spring" as const,
  stiffness: 460,
  damping: 42,
  mass: 0.9,
};

const ICON_PROPS = { className: "h-5 w-5", strokeWidth: 2 } as const;

function offsetTopWithin(
  el: HTMLElement | null,
  ancestor: HTMLElement | null,
): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

const HIDDEN_CLIP = "inset(100% 0px 0px 0px round 10px)";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const DEFAULT_ITEMS: ToolbarDockItem[] = [
  {
    id: "mental-health",
    label: "Mental Health",
    icon: <Brain {...ICON_PROPS} />,
    path: "/therapy"
  },
  {
    id: "sexual-health",
    label: "Sexual Health",
    icon: <HeartPulse {...ICON_PROPS} />,
    path: "/therapy"
  },
  {
    id: "community",
    label: "For Business",
    icon: <Users {...ICON_PROPS} />,
    path: "/community"
  },
  {
    id: "content-hub",
    label: "Content Hub",
    icon: <BookOpen {...ICON_PROPS} />,
    path: "/breathe",
    badge: true
  },
  {
    id: "about",
    label: "About Us",
    icon: <Info {...ICON_PROPS} />,
  },
  {
    id: "login",
    label: "Log In",
    icon: <LogIn {...ICON_PROPS} />,
  },
  {
    id: "menu",
    label: "Close Menu",
    icon: <Menu {...ICON_PROPS} />,
    toggle: true,
  },
];

export function ToolbarDock({
  items,
  className,
  defaultCollapsed = true,
}: ToolbarDockProps) {
  const navigate = useNavigate();
  const activeItems = items || DEFAULT_ITEMS;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const segRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const visibleRef = React.useRef(false);
  const appearingRef = React.useRef(true);
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ y: 0, clip: HIDDEN_CLIP });

  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [metrics, setMetrics] = React.useState<{
    strip: number;
    footprint: number;
  } | null>(null);

  useIsoLayoutEffect(() => {
    const strip = stripRef.current?.offsetHeight ?? 0;
    const footprint = wrapperRef.current?.offsetHeight ?? 0;
    setMetrics((prev) => {
      if (prev?.strip === strip && prev?.footprint === footprint) return prev;
      return { strip, footprint };
    });
  }, [activeItems]);

  const reveal = React.useCallback((index: number) => {
    const rail = railRef.current;
    const seg = segRefs.current[index];
    const btn = btnRefs.current[index];
    const wrapper = wrapperRef.current;
    if (!rail || !seg || !btn || !wrapper) return;

    const railHeight = rail.offsetHeight || 1;
    const top = seg.offsetTop;
    const bottom = railHeight - seg.offsetTop - seg.offsetHeight;
    const topPct = (top / railHeight) * 100;
    const bottomPct = (bottom / railHeight) * 100;

    const segCenter = offsetTopWithin(seg, wrapper) + seg.offsetHeight / 2;
    const btnCenter = offsetTopWithin(btn, wrapper) + btn.offsetHeight / 2;
    const dy = btnCenter - segCenter;

    appearingRef.current = !visibleRef.current;
    visibleRef.current = true;

    setVisible(true);
    setPos({
      y: dy,
      clip: `inset(${topPct}% 0px ${bottomPct}% 0px round 10px)`,
    });
  }, []);

  const hideTooltip = React.useCallback(() => {
    visibleRef.current = false;
    setVisible(false);
  }, []);

  const handleItem = React.useCallback(
    (item: ToolbarDockItem) => {
      if (item.toggle) {
        hideTooltip();
        setCollapsed((c) => !c);
      } else {
        if (item.path) {
          navigate(item.path);
        }
        if (item.onClick) {
          item.onClick();
        }
        // Auto collapse after navigation
        setCollapsed(true);
        hideTooltip();
      }
    },
    [hideTooltip, navigate],
  );

  const appearing = appearingRef.current;

  const indexed = activeItems.map((item, index) => ({ item, index }));
  const toggleEntries = indexed.filter((e) => e.item.toggle);
  const iconEntries = indexed.filter((e) => !e.item.toggle);

  const renderButton = (item: ToolbarDockItem, index: number) => {
    const isToggle = !!item.toggle;
    return (
      <button
        key={item.id}
        ref={(el) => {
          btnRefs.current[index] = el;
        }}
        type="button"
        aria-expanded={isToggle ? !collapsed : undefined}
        aria-label={
          isToggle
            ? collapsed
              ? "Expand menu"
              : "Collapse menu"
            : item.label
        }
        tabIndex={!isToggle && collapsed ? -1 : undefined}
        onClick={() => handleItem(item)}
        onMouseEnter={() => reveal(index)}
        onFocus={() => reveal(index)}
        className="flex items-center justify-center outline-none"
      >
        <div className="group relative flex w-10 h-10 items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100 text-gray-700 hover:text-black">
          <span className="flex items-center justify-center h-full w-full">
            {isToggle ? (collapsed ? <Menu {...ICON_PROPS} /> : <X {...ICON_PROPS} />) : item.icon}
          </span>
          {item.badge && (
            <span className="absolute right-2 top-2 w-2 h-2 rounded-full border-[1.5px] border-white bg-red-500 transition-colors group-hover:border-gray-100" />
          )}
        </div>
        <span className="sr-only">{item.label}</span>
      </button>
    );
  };

  return (
    <div
      ref={wrapperRef}
      style={metrics ? { height: metrics.footprint } : undefined}
      className={cn(
        "relative flex flex-col w-14 items-center justify-start text-black z-50",
        className,
      )}
    >
      {/* ── Tooltip rail — slides vertically + clips ── */}
      <div className="pointer-events-none absolute right-full top-0 z-20 mr-3">
        <motion.div
          ref={railRef}
          initial={false}
          animate={{ y: pos.y, clipPath: pos.clip, opacity: visible ? 1 : 0 }}
          transition={{
            opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
            y: appearing ? { duration: 0 } : SPRING_Y,
            clipPath: appearing ? { duration: 0 } : SPRING_CLIP,
          }}
          style={{ willChange: "transform, clip-path, opacity" }}
          className="relative flex flex-col w-max rounded-xl bg-black text-white shadow-xl py-1"
        >
          {activeItems.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                segRefs.current[i] = el;
              }}
              className="z-[1] inline-flex h-10 items-center justify-end px-3.5"
            >
              <div className="flex items-center justify-end gap-2 whitespace-nowrap text-[13px] font-semibold leading-tight tracking-wide text-white">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Pill (Vertical) ── */}
      <div
        onMouseLeave={hideTooltip}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) hideTooltip();
        }}
        className="relative z-10 flex flex-col w-14 items-center rounded-full border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur-md"
      >
        {/* Toggle button on top */}
        {toggleEntries.map(({ item, index }) => (
          <div key={item.id} className="shrink-0 bg-gray-50 rounded-full mb-1">
            {renderButton(item, index)}
          </div>
        ))}

        {/* Icons expanding downwards */}
        <motion.div
          className="relative w-10 overflow-hidden"
          initial={false}
          animate={
            metrics
              ? {
                  height: collapsed ? 0 : metrics.strip,
                  opacity: collapsed ? 0 : 1,
                }
              : undefined
          }
          style={metrics ? undefined : { height: "auto" }}
          transition={{
            height: COLLAPSE_SPRING,
            opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <div
            ref={stripRef}
            className="absolute top-0 left-0 flex flex-col w-10 items-center gap-1 pt-1"
          >
            {iconEntries.map(({ item, index }) => renderButton(item, index))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ToolbarDock;
