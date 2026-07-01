"use client";

import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useAccentColor } from "@/lib/context/AccentColorContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command } from "cmdk";

interface Option {
  value: string;
  label: string;
  group?: string;
}

interface ToolSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  accentColor?: string;
  searchable?: boolean;
  id?: string;
}

export default function ToolSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  accentColor,
  searchable = false,
  id,
}: ToolSelectProps) {
  const [open, setOpen] = useState(false);
  const contextAccent = useAccentColor();
  const activeAccent = accentColor || contextAccent || "#C5F135";

  const selectedOption = options.find((opt) => opt.value === value);

  // Group options if group property is present
  const hasGroups = options.some((opt) => opt.group);
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, Option[]> = {};
    const ungrouped: Option[] = [];

    options.forEach((opt) => {
      if (opt.group) {
        if (!groups[opt.group]) groups[opt.group] = [];
        groups[opt.group].push(opt);
      } else {
        ungrouped.push(opt);
      }
    });

    return { groups, ungrouped };
  }, [options]);

  const selectStyles: React.CSSProperties = {
    "--local-accent": activeAccent,
  } as React.CSSProperties;

  // Use Searchable Combobox mode if options > 20 and searchable is true
  const isSearchMode = searchable && options.length > 20;

  if (isSearchMode) {
    return (
      <div className="tool-input-group w-full font-sans" style={selectStyles}>
        {label && (
          <label className="tool-input-label" htmlFor={id}>
            {label}
          </label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              id={id}
              className={`w-full h-12 bg-bg-surface border-[length:var(--border-width)] rounded-[var(--radius-sm)] px-4 flex items-center justify-between text-left font-sans text-sm transition-all focus:outline-none select-none cursor-pointer ${
                open
                  ? "border-[color:var(--local-accent)] shadow-[var(--shadow-offset-sm)_var(--local-accent)] -translate-x-px -translate-y-px"
                  : "border-border shadow-[var(--shadow-offset-sm)_var(--shadow-color)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[var(--shadow-offset-md)_var(--shadow-color)]"
              }`}
            >
              <span className={selectedOption ? "text-text-primary" : "text-text-muted"}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-[280px] p-0 bg-bg-card border-[length:var(--border-width)] border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-offset-lg)_var(--shadow-color)] overflow-hidden"
            align="start"
          >
            {/* Raw cmdk structure styled customly */}
            <Command className="flex flex-col h-full max-h-[300px]">
              <Command.Input
                placeholder="Search..."
                className="w-full h-10 px-3 bg-bg-surface border-b border-border text-sm text-text-primary focus:outline-none placeholder-text-muted font-sans font-light"
              />
              <Command.List className="overflow-y-auto max-h-[260px] p-1 space-y-0.5">
                <Command.Empty className="p-3 text-center text-xs text-text-faint font-sans">
                  No results found.
                </Command.Empty>

                {/* Grouped option lists */}
                {hasGroups &&
                  Object.entries(groupedOptions.groups).map(([groupName, groupOpts]) => (
                    <Command.Group key={groupName} heading={groupName}>
                      <div className="text-[10px] font-sans font-medium uppercase tracking-wider text-text-muted px-3 py-1.5 select-none">
                        {groupName}
                      </div>
                      {groupOpts.map((opt) => (
                        <Command.Item
                          key={opt.value}
                          value={opt.label} // Used for filtering
                          onSelect={() => {
                            onChange(opt.value);
                            setOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-sans text-text-primary rounded-md cursor-pointer hover:bg-bg-card-hover focus:bg-bg-card-hover outline-none select-none ${
                            value === opt.value ? "bg-bg-card-hover/50 text-[color:var(--local-accent)]" : ""
                          }`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {value === opt.value && <Check className="w-3.5 h-3.5 stroke-[3px]" style={{ color: activeAccent }} />}
                        </Command.Item>
                      ))}
                      <div className="h-[1px] bg-border-subtle my-1" />
                    </Command.Group>
                  ))}

                {/* Ungrouped option lists */}
                {groupedOptions.ungrouped.map((opt) => (
                  <Command.Item
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-sans text-text-primary rounded-md cursor-pointer hover:bg-bg-card-hover focus:bg-bg-card-hover outline-none select-none ${
                      value === opt.value ? "bg-bg-card-hover/50 text-[color:var(--local-accent)] font-medium" : ""
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {value === opt.value && <Check className="w-3.5 h-3.5 stroke-[3px]" style={{ color: activeAccent }} />}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // Standard Radix UI Select
  return (
    <div className="tool-input-group w-full font-sans" style={selectStyles}>
      {label && (
        <label className="tool-input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="w-full h-12 bg-bg-surface border-[length:var(--border-width)] border-border rounded-[var(--radius-sm)] px-4 shadow-[var(--shadow-offset-sm)_var(--shadow-color)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[var(--shadow-offset-md)_var(--shadow-color)] focus-visible:border-[color:var(--local-accent)] focus-visible:shadow-[var(--shadow-offset-sm)_var(--local-accent)] cursor-pointer select-none transition-all"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          className="bg-bg-card border-[length:var(--border-width)] border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-offset-lg)_var(--shadow-color)]"
          style={{ "--accent-utility-a": activeAccent } as React.CSSProperties}
        >
          {hasGroups ? (
            <>
              {Object.entries(groupedOptions.groups).map(([groupName, groupOpts]) => (
                <SelectGroup key={groupName}>
                  <SelectLabel className="text-[10px] font-sans font-medium uppercase tracking-wider text-text-muted px-4 py-1.5">
                    {groupName}
                  </SelectLabel>
                  {groupOpts.map((opt) => (
                    <SelectItem 
                      key={opt.value} 
                      value={opt.value}
                      className="cursor-pointer font-sans"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                  <SelectSeparator className="bg-border-subtle my-1" />
                </SelectGroup>
              ))}
              {groupedOptions.ungrouped.length > 0 && (
                <SelectGroup>
                  {groupedOptions.ungrouped.map((opt) => (
                    <SelectItem 
                      key={opt.value} 
                      value={opt.value}
                      className="cursor-pointer font-sans"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </>
          ) : (
            <SelectGroup>
              {options.map((opt) => (
                <SelectItem 
                  key={opt.value} 
                  value={opt.value}
                  className="cursor-pointer font-sans"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
