// This component has been disabled due to package compatibility issues
// If you need OTP input functionality, you'll need to implement a custom version

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  maxLength?: number;
}

const InputOTP = React.forwardRef<
  HTMLDivElement,
  InputOTPProps
>(({ className, containerClassName, maxLength = 6, ...props }, ref) => {
  // Simple implementation - can be enhanced as needed
  const [value, setValue] = React.useState<string>("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, maxLength);
    setValue(newValue);
    
    if (props.onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(syntheticEvent);
    }
  };
  
  return (
    <div 
      ref={ref}
      className={cn("flex items-center gap-2", containerClassName)}
    >
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        className={cn("sr-only", className)}
        {...props}
      />
      <div className="flex gap-2">
        {Array.from({ length: maxLength }).map((_, i) => (
          <InputOTPSlot 
            key={i} 
            index={i} 
            char={value[i] || ""} 
            isActive={value.length === i}
          />
        ))}
      </div>
    </div>
  )
});

InputOTP.displayName = "InputOTP";

interface InputOTPSlotProps {
  index: number;
  char: string;
  isActive: boolean;
  className?: string;
}

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & InputOTPSlotProps
>(({ index, char, isActive, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
});

InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));

InputOTPGroup.displayName = "InputOTPGroup";

export { InputOTP, InputOTPGroup, InputOTPSlot };
