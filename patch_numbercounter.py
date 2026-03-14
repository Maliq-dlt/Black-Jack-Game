import re

with open("components/NumberCounter.tsx", "r") as f:
    content = f.read()

# Replace `const [displayValue, setDisplayValue] = useState(value);`
# with `const displayRef = useRef<HTMLSpanElement>(null);`

# In `animate` replace `setDisplayValue(currentValue);` with `if (displayRef.current) displayRef.current.textContent = formatNumber(currentValue);`

search = """
export const NumberCounter: React.FC<NumberCounterProps> = ({
  value,
  format = 'currency',
  prefix = '$',
  suffix = '',
  duration = 1,
  className = '',
  size = 'md',
  colorChange = true,
  showSign = false,
  decimals = 0
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const animationRef = useRef<number | null>(null);
"""

replace = """
export const NumberCounter: React.FC<NumberCounterProps> = ({
  value,
  format = 'currency',
  prefix = '$',
  suffix = '',
  duration = 1,
  className = '',
  size = 'md',
  colorChange = true,
  showSign = false,
  decimals = 0
}) => {
  const displayRef = useRef<HTMLSpanElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const animationRef = useRef<number | null>(null);
"""

content = content.replace(search, replace)

search2 = """
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
        prevValueRef.current = endValue;
      }
"""

replace2 = """
      if (displayRef.current) {
        displayRef.current.textContent = formatNumber(currentValue);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (displayRef.current) {
          displayRef.current.textContent = formatNumber(endValue);
        }
        setIsAnimating(false);
        prevValueRef.current = endValue;
      }
"""

content = content.replace(search2, replace2)

search3 = """
  return (
    <motion.span
      className={`inline-block font-mono font-bold ${sizeClasses[size]} ${getColor()} ${className}`}
      animate={isAnimating ? {
        scale: [1, 1.1, 1],
        textShadow: value > prevValueRef.current
          ? ['0 0 0px rgba(74, 222, 128, 0)', '0 0 20px rgba(74, 222, 128, 0.8)', '0 0 0px rgba(74, 222, 128, 0)']
          : value < prevValueRef.current
          ? ['0 0 0px rgba(248, 113, 113, 0)', '0 0 20px rgba(248, 113, 113, 0.8)', '0 0 0px rgba(248, 113, 113, 0)']
          : 'none'
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {formatNumber(displayValue)}
    </motion.span>
  );
"""

replace3 = """
  return (
    <motion.span
      ref={displayRef}
      className={`inline-block font-mono font-bold ${sizeClasses[size]} ${getColor()} ${className}`}
      animate={isAnimating ? {
        scale: [1, 1.1, 1],
        textShadow: value > prevValueRef.current
          ? ['0 0 0px rgba(74, 222, 128, 0)', '0 0 20px rgba(74, 222, 128, 0.8)', '0 0 0px rgba(74, 222, 128, 0)']
          : value < prevValueRef.current
          ? ['0 0 0px rgba(248, 113, 113, 0)', '0 0 20px rgba(248, 113, 113, 0.8)', '0 0 0px rgba(248, 113, 113, 0)']
          : 'none'
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {formatNumber(value)}
    </motion.span>
  );
"""

content = content.replace(search3, replace3)

with open("components/NumberCounter.tsx", "w") as f:
    f.write(content)

print("Patched NumberCounter.tsx")
