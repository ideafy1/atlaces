"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  MessageCircle,
  Share2,
  Heart,
  Bookmark,
  Menu,
  Command
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
}

interface ToolbarDockProps {
  items?: ToolbarDockItem[];
  className?: string;
  defaultCollapsed?: boolean;
}

const SPRING_X = {
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

const DEFAULT_ITEMS: ToolbarDockItem[] = [
  {
    id: "like",
    label: "Like Story",
    icon: <Heart {...ICON_PROPS} />,
    shortcut: ["L"],
    onClick: () => console.log('Liked!')
  },
  {
    id: "comment",
    label: "Share Thoughts",
    icon: <MessageCircle {...ICON_PROPS} />,
    shortcut: ["C"],
  },
  {
    id: "save",
    label: "Save for Later",
    icon: <Bookmark {...ICON_PROPS} />,
  },
  {
    id: "share",
    label: "Share Story",
    icon: <Share2 {...ICON_PROPS} />,
  },
  {
    id: "menu",
    label: "Menu",
    icon: <Menu {...ICON_PROPS} />,
    badge: true,
    toggle: true,
  },
];

function offsetLeftWithin(
  el: HTMLElement | null,
  ancestor: HTMLElement | null,
): number {
  let x = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }
  return x;
}

const HIDDEN_CLIP = "inset(0px 100% 0px 0px round 10px)";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function ToolbarDock({
  items = DEFAULT_ITEMS,
  className,
  defaultCollapsed = false,
}: ToolbarDockProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const segRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const visibleRef = React.useRef(false);
  const appearingRef = React.useRef(true);
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, clip: HIDDEN_CLIP });

  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [metrics, setMetrics] = React.useState<{
    strip: number;
    footprint: number;
  } | null>(null);

  useIsoLayoutEffect(() => {
    const strip = stripRef.current?.offsetWidth ?? 0;
    const footprint = wrapperRef.current?.offsetWidth ?? 0;
    setMetrics({ strip, footprint });
  }, [items]);

  const reveal = React.useCallback((index: number) => {
    const rail = railRef.current;
    const seg = segRefs.current[index];
    const btn = btnRefs.current[index];
    const wrapper = wrapperRef.current;
    if (!rail || !seg || !btn || !wrapper) return;

    const railWidth = rail.offsetWidth || 1;
    const left = seg.offsetLeft;
    const right = railWidth - seg.offsetLeft - seg.offsetWidth;
    const leftPct = (left / railWidth) * 100;
    const rightPct = (right / railWidth) * 100;

    const segCenter = offsetLeftWithin(seg, wrapper) + seg.offsetWidth / 2;
    const btnCenter = offsetLeftWithin(btn, wrapper) + btn.offsetWidth / 2;
    const dx = btnCenter - segCenter;

    appearingRef.current = !visibleRef.current;
    visibleRef.current = true;

    setVisible(true);
    setPos({
      x: dx,
      clip: `inset(0px ${rightPct}% 0px ${leftPct}% round 10px)`,
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
        item.onClick?.();
      }
    },
    [hideTooltip],
  );

  const appearing = appearingRef.current;

  const indexed = items.map((item, index) => ({ item, index }));
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
              ? "Expand toolbar"
              : "Collapse toolbar"
            : undefined
        }
        tabIndex={!isToggle && collapsed ? -1 : undefined}
        onClick={() => handleItem(item)}
        onMouseEnter={() => reveal(index)}
        onFocus={() => reveal(index)}
        className="flex items-center justify-center outline-none"
      >
        <div className="group relative flex w-10 h-10 items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100 text-gray-700 hover:text-black">
          <span className="flex items-center justify-center h-full w-full">
            {item.icon}
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
      style={metrics ? { width: metrics.footprint } : undefined}
      className={cn(
        "relative inline-flex h-14 items-center justify-end text-black",
        className,
      )}
    >
      {/* ── Tooltip rail — one surface that slides + clips ── */}
      <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-3">
        <motion.div
          ref={railRef}
          initial={false}
          animate={{ x: pos.x, clipPath: pos.clip, opacity: visible ? 1 : 0 }}
          transition={{
            opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
            x: appearing ? { duration: 0 } : SPRING_X,
            clipPath: appearing ? { duration: 0 } : SPRING_CLIP,
          }}
          style={{ willChange: "transform, clip-path, opacity" }}
          className="relative flex w-max rounded-xl bg-black text-white shadow-xl"
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                segRefs.current[i] = el;
              }}
              className="z-[1] inline-flex h-9 items-center justify-center"
            >
              <div className="flex items-center justify-center gap-2 whitespace-nowrap px-3.5 text-[13px] font-semibold leading-tight tracking-wide text-white">
                {item.label}
                {item.shortcut && (
                  <span className="flex items-center justify-center gap-1 opacity-70 ml-1">
                    {item.shortcut.map((key, k) => (
                      <kbd
                        key={k}
                        className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-[4px] bg-white/20 px-1 text-[11px] font-bold text-white"
                      >
                        {key === "⌘" ? (
                          <Command size={10} strokeWidth={2.5} />
                        ) : (
                          key
                        )}
                      </kbd>
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Pill ── */}
      <div
        onMouseLeave={hideTooltip}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) hideTooltip();
        }}
        className="relative z-10 flex h-14 items-center rounded-full border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur-md"
      >
        <motion.div
          className="relative h-10 overflow-hidden"
          initial={false}
          animate={
            metrics
              ? {
                  width: collapsed ? 0 : metrics.strip,
                  opacity: collapsed ? 0 : 1,
                }
              : undefined
          }
          style={metrics ? undefined : { width: "auto" }}
          transition={{
            width: COLLAPSE_SPRING,
            opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <div
            ref={stripRef}
            className="absolute right-0 top-0 flex h-10 items-center gap-1 pr-1"
          >
            {iconEntries.map(({ item, index }) => renderButton(item, index))}
          </div>
        </motion.div>

        {toggleEntries.map(({ item, index }) => (
          <div key={item.id} className="shrink-0 bg-gray-50 rounded-full ml-1">
            {renderButton(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolbarDock;
