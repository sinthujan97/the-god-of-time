"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateInvoiceDueDate, InvoiceDueDateResult } from "@/lib/tools/calculations";

interface InvoiceDueDateCalculatorInputsProps {
  groupAccent: string;
}

export default function InvoiceDueDateCalculatorInputs({ groupAccent }: InvoiceDueDateCalculatorInputsProps) {
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(undefined);
  const [terms, setTerms] = useState<string>("net30");
  const [customDays, setCustomDays] = useState<number>(30);
  const [businessOnly, setBusinessOnly] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1250);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<InvoiceDueDateResult>({
    dueDate: new Date(),
    dueDateFormatted: "—",
    daysUntilDue: 0,
    isOverdue: false,
    overdueDays: 0,
    paymentTermsLabel: "Net 30",
    latePaymentDate: new Date(),
    latePaymentFormatted: "—",
  });

  useEffect(() => {
    setInvoiceDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isInvoiceInvalid = isDateInvalid(invoiceDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!invoiceDate) return;
    if (isInvoiceInvalid) return;

    const calc = calculateInvoiceDueDate(
      formatDateToYYYYMMDD(invoiceDate),
      terms as any,
      customDays,
      businessOnly
    );
    setResult(calc);
  }, [invoiceDate, terms, customDays, businessOnly, isInvoiceInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  const getCopyText = () => {
    if (!invoiceDate) return "";
    return `Invoice due date: ${result.dueDateFormatted}. Terms: ${result.paymentTermsLabel}. Status: ${result.isOverdue ? `Overdue by ${result.overdueDays} days` : `Due in ${result.daysUntilDue} days`}.`;
  };

  const termsOptions = [
    { value: "net7", label: "Net 7 Days" },
    { value: "net14", label: "Net 14 Days" },
    { value: "net30", label: "Net 30 Days" },
    { value: "net45", label: "Net 45 Days" },
    { value: "net60", label: "Net 60 Days" },
    { value: "net90", label: "Net 90 Days" },
    { value: "eom", label: "End of Month (EOM)" },
    { value: "custom", label: "Custom Terms (Days)" }
  ];

  // Determine aging bucket
  let agingBucket = "Current";
  if (result.isOverdue) {
    if (result.overdueDays <= 30) agingBucket = "1 - 30 Days Overdue";
    else if (result.overdueDays <= 60) agingBucket = "31 - 60 Days Overdue";
    else if (result.overdueDays <= 90) agingBucket = "61 - 90 Days Overdue";
    else agingBucket = "90+ Days Overdue (Critical)";
  }

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.dueDateFormatted !== "—" ? result.dueDateFormatted : "—"}
      resultUnit="INVOICE PAYMENT DEADLINE"
      resultBreakdown={[
        result.isOverdue 
          ? `Overdue by ${result.overdueDays} calendar days` 
          : `Payment due in ${result.daysUntilDue} days`,
        `Selected Terms: ${result.paymentTermsLabel} (${businessOnly ? "Business Days Only" : "Calendar Days"})`,
        `Outstanding Invoice Amount: ${formatCurrency(amount)}`,
        `Account Aging Status: ${agingBucket}`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isInvoiceInvalid ? "Invalid invoice issue date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Invoice Issue Date & Amount */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="invoice-issue-date"
              label="Invoice Issue Date"
              value={invoiceDate}
              onChange={setInvoiceDate}
              accentColor={groupAccent}
            />
            {isInvoiceInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="invoice-amount-input">
              Invoice Total Amount
            </label>
            <input
              id="invoice-amount-input"
              type="number"
              min="0"
              value={amount || ""}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Row 2: Terms Select & Business Days Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="tool-input-label block mb-1">
              Payment Terms
            </label>
            <ToolSelect
              value={terms}
              onChange={setTerms}
              options={termsOptions}
              placeholder="Select Net Terms"
            />
          </div>

          {terms !== "eom" && (
            <div className="flex flex-col justify-end">
              <span className="tool-input-label block mb-1">
                Net Workdays Mode
              </span>
              <PillToggle
                value={businessOnly ? "true" : "false"}
                onChange={(val) => setBusinessOnly(val === "true")}
                options={[
                  { value: "true", label: "Business Days" },
                  { value: "false", label: "Calendar Days" }
                ]}
                accentColor={groupAccent}
              />
            </div>
          )}
        </div>

        {/* Custom Days Input */}
        {terms === "custom" && (
          <div className="flex flex-col animate-in fade-in duration-200">
            <label className="tool-input-label" htmlFor="custom-terms-days">
              Custom Terms (Number of Days)
            </label>
            <input
              id="custom-terms-days"
              type="number"
              min="1"
              value={customDays}
              onChange={(e) => setCustomDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        )}

        {/* Premium visual aging dashboard status */}
        {invoiceDate && !isInvoiceInvalid && (
          <div className="border border-border rounded-lg p-4 bg-bg-card flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-sans text-xs text-text-muted font-medium">Payment Outlook</span>
              <span className="font-sans font-bold text-text-primary text-sm block">
                {result.isOverdue
                  ? `Overdue by ${result.overdueDays} days. Collections required.`
                  : `Invoice is current. Due in ${result.daysUntilDue} days.`}
              </span>
            </div>
            <span 
              className={`font-sans text-xs font-bold px-3 py-1 border rounded-md uppercase tracking-wider ${
                result.isOverdue
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}
            >
              {result.isOverdue ? "OVERDUE" : "CURRENT"}
            </span>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
