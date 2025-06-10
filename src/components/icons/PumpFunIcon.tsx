'use client';

import Image from 'next/image';
import { HTMLAttributes } from 'react';

/**
 * Pump.fun icon using a static PNG.
 * Place `public/logos/pumpfun.png` (ideally ≥ 64 px).
 */
const PumpFunIcon = ({
  size = 20,
  className = '',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { size?: number }) => (
  <span className={className} {...props}>
    <Image
      src="/images/icons/pumpfun.png"
      alt="Pump.fun"
      width={size}
      height={size}
      priority
      className="rounded-sm select-none"
    />
  </span>
);

export default PumpFunIcon;
